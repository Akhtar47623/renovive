import { z } from "zod";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "../config/env.js";
import crypto from "node:crypto";
import { HttpError } from "../utils/httpError.js";

const conceptSchema = z.object({
  title: z.string().min(1),
  styleTag: z.string().min(1),
  summary: z.string().min(1),
  visualizationPrompt: z.string().min(1),
  keyUpgrades: z.array(z.string().min(1)).min(2).max(6),
});

const responseSchema = z.object({
  concepts: z.array(conceptSchema).min(3).max(6),
});

export type AiDesignConcept = z.infer<typeof conceptSchema>;

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

type CacheEntry = { expiresAt: number; value: AiDesignConcept[] };
const cache = new Map<string, CacheEntry>();
const TTL_MS = 5 * 60 * 1000;

export const aiDesignConceptsService = {
  async generate(input: {
    address?: string;
    squareFt?: number;
    bedroom?: number;
    bathroom?: number;
    roomType?: string;
    budgetLevel?: string;
    designStyle?: string;
    renovationScope?: string[];
    selectedTierTitle?: string;
  }): Promise<AiDesignConcept[]> {
    if (!env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not set on backend");
    }

    const normalized = {
      address: String(input.address ?? "").slice(0, 200),
      squareFt: Number.isFinite(input.squareFt) ? Number(input.squareFt) : 0,
      bedroom: Number.isFinite(input.bedroom) ? Number(input.bedroom) : 0,
      bathroom: Number.isFinite(input.bathroom) ? Number(input.bathroom) : 0,
      roomType: String(input.roomType ?? "").slice(0, 80),
      budgetLevel: String(input.budgetLevel ?? "").slice(0, 80),
      designStyle: String(input.designStyle ?? "").slice(0, 80),
      renovationScope: Array.isArray(input.renovationScope) ? input.renovationScope.slice(0, 15) : [],
      selectedTierTitle: String(input.selectedTierTitle ?? "").slice(0, 80),
    };

    const key = crypto.createHash("sha256").update(JSON.stringify(normalized)).digest("hex");
    const now = Date.now();
    const cached = cache.get(key);
    if (cached && cached.expiresAt > now) return cached.value;
    if (cached) cache.delete(key);

    const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
    const modelNames = ["gemini-1.5-flash-latest", "gemini-2.0-flash", "gemini-1.5-pro-latest"] as const;

    const prompt =
      "You are Renovive AI. Generate 3 renovation DESIGN CONCEPTS and VISUALIZATION prompts.\n\n" +
      "Return STRICT JSON only (no markdown) as:\n" +
      JSON.stringify(responseSchema.shape, null, 2) +
      "\n\nRules:\n" +
      "- Concepts should align with designStyle/budgetLevel/roomType/scope.\n" +
      "- visualizationPrompt: a single prompt suitable for an image generation model later (no brand names), describing 'after renovation' look.\n" +
      "- keyUpgrades: 3-5 bullet strings.\n" +
      "- Keep summary 1 sentence.\n\n" +
      "Property info:\n" +
      JSON.stringify(normalized, null, 2);

    let text = "";
    let lastErr: unknown = null;

    for (const name of modelNames) {
      try {
        const model = genAI.getGenerativeModel({ model: name });
        for (let attempt = 0; attempt < 3; attempt++) {
          try {
            const result = await model.generateContent({
              contents: [{ role: "user", parts: [{ text: prompt }] }],
              generationConfig: { temperature: 0.55, maxOutputTokens: 650 },
            });
            text = result.response.text().trim();
            break;
          } catch (err: any) {
            lastErr = err;
            const status =
              typeof err?.status === "number"
                ? err.status
                : typeof err?.response?.status === "number"
                  ? err.response.status
                  : undefined;
            if (status === 429 && attempt < 2) {
              await sleep(700 * 2 ** attempt);
              continue;
            }
            throw err;
          }
        }
        if (text) break;
      } catch (err: any) {
        lastErr = err;
        const msg = typeof err?.message === "string" ? err.message : "";
        if (msg.includes("not found") || msg.includes("not supported")) continue;
        break;
      }
    }

    if (!text) {
      const err: any = lastErr;
      const status =
        typeof err?.status === "number"
          ? err.status
          : typeof err?.response?.status === "number"
            ? err.response.status
            : undefined;
      if (status === 429) {
        const fallback: AiDesignConcept[] = [
          {
            title: "Warm Modern Refresh",
            styleTag: normalized.designStyle || "Modern",
            summary: "A warm, modern update with clean lines and soft natural textures.",
            visualizationPrompt:
              "After renovation, warm modern interior, natural oak accents, matte black fixtures, bright airy lighting, high-end realistic photo, wide angle",
            keyUpgrades: ["Paint & lighting refresh", "Updated flooring", "Modern fixtures", "Cohesive material palette"],
          },
          {
            title: "Minimal Luxe",
            styleTag: "Minimal",
            summary: "Minimal, premium finishes that feel calm and elevated.",
            visualizationPrompt:
              "After renovation, minimal luxe interior, neutral palette, stone surfaces, concealed lighting, premium finishes, realistic architectural photo",
            keyUpgrades: ["Stone/solid surfaces", "Upgraded cabinetry", "Concealed lighting", "Premium hardware"],
          },
          {
            title: "Classic Contemporary",
            styleTag: "Classic",
            summary: "Timeless layout with contemporary materials for durability and resale.",
            visualizationPrompt:
              "After renovation, classic contemporary interior, balanced proportions, soft whites, brushed metal fixtures, realistic photo, high detail",
            keyUpgrades: ["Layout optimization", "Durable finishes", "Updated trim/details", "New fixtures"],
          },
        ];
        cache.set(key, { expiresAt: Date.now() + TTL_MS, value: fallback });
        return fallback;
      }
      throw new HttpError(500, "Failed to generate design concepts");
    }

    let json: unknown;
    try {
      json = JSON.parse(text);
    } catch {
      const start = text.indexOf("{");
      const end = text.lastIndexOf("}");
      if (start >= 0 && end > start) json = JSON.parse(text.slice(start, end + 1));
      else throw new HttpError(500, "AI returned non-JSON output");
    }

    const parsed = responseSchema.safeParse(json);
    if (!parsed.success) {
      throw new HttpError(500, "AI returned invalid design concepts JSON");
    }

    const concepts = parsed.data.concepts.slice(0, 6);
    cache.set(key, { expiresAt: Date.now() + TTL_MS, value: concepts });
    return concepts;
  },
};

