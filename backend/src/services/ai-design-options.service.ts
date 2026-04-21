import { z } from "zod";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "../config/env.js";
import crypto from "node:crypto";
import { HttpError } from "../utils/httpError.js";

const designOptionSchema = z.object({
  title: z.string().min(1),
  styleTag: z.string().min(1),
  marketRange: z.string().min(1),
  aiEstimate: z.string().min(1),
  notes: z.string().min(1),
});

const responseSchema = z.object({
  options: z.array(designOptionSchema).min(3).max(6),
});

export type AiDesignOption = z.infer<typeof designOptionSchema>;

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

type CacheEntry = { expiresAt: number; value: AiDesignOption[] };
const cache = new Map<string, CacheEntry>();
const TTL_MS = 5 * 60 * 1000;

export const aiDesignOptionsService = {
  async generate(input: {
    address?: string;
    squareFt?: number;
    bedroom?: number;
    bathroom?: number;
    roomType?: string;
    budgetLevel?: string;
    designStyle?: string;
    renovationScope?: string[];
  }): Promise<AiDesignOption[]> {
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
    };

    const key = crypto.createHash("sha256").update(JSON.stringify(normalized)).digest("hex");
    const now = Date.now();
    const cached = cache.get(key);
    if (cached && cached.expiresAt > now) return cached.value;
    if (cached) cache.delete(key);

    const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
    const modelNames = ["gemini-1.5-flash-latest", "gemini-2.0-flash", "gemini-1.5-pro-latest"] as const;

    const prompt =
      "You are Renovive AI. Generate 3-4 renovation DESIGN OPTIONS (not a full proposal).\n\n" +
      "Return STRICT JSON only (no markdown) as:\n" +
      JSON.stringify(responseSchema.shape, null, 2) +
      "\n\nRules:\n" +
      "- Options should be distinct (e.g. Budget / Balanced / Premium) and aligned with budgetLevel/designStyle/roomType.\n" +
      "- marketRange and aiEstimate must be human-readable USD ranges like \"$67,000 – 80,000\".\n" +
      "- styleTag should be a short label like \"Modern\", \"Minimal\", \"Classic\", \"Industrial\".\n" +
      "- notes should be 1 sentence.\n\n" +
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
              generationConfig: { temperature: 0.5, maxOutputTokens: 450 },
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
        // Deterministic fallback
        const fallback: AiDesignOption[] = [
          {
            title: "Budget Refresh",
            styleTag: normalized.designStyle || "Modern",
            marketRange: "$55,000 – 70,000",
            aiEstimate: "$39,000 – 52,000",
            notes: "Prioritize high-impact updates and cost-efficient finishes.",
          },
          {
            title: "Balanced Renovation",
            styleTag: normalized.designStyle || "Modern",
            marketRange: "$67,000 – 80,000",
            aiEstimate: "$48,000 – 60,000",
            notes: "Mix durable mid-tier materials with a cohesive design plan.",
          },
          {
            title: "Premium Upgrade",
            styleTag: normalized.designStyle || "Modern",
            marketRange: "$92,000 – 110,000",
            aiEstimate: "$63,000 – 78,000",
            notes: "Elevated fixtures, custom details, and higher-end finishes.",
          },
        ];
        cache.set(key, { expiresAt: Date.now() + TTL_MS, value: fallback });
        return fallback;
      }
      throw new HttpError(500, "Failed to generate design options");
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
      throw new HttpError(500, "AI returned invalid design options JSON");
    }

    const options = parsed.data.options.slice(0, 4);
    cache.set(key, { expiresAt: Date.now() + TTL_MS, value: options });
    return options;
  },
};

