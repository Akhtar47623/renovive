import { z } from "zod";
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import { env } from "../config/env.js";
import { HttpError } from "../utils/httpError.js";
import crypto from "node:crypto";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

type CacheEntry = { expiresAt: number; value: AiProposal };
const proposalCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 2 * 60 * 1000; // 2 minutes (avoids repeated submits hitting rate limits)
const inFlight = new Map<string, Promise<AiProposal>>();

function isoDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

function fallbackProposal(input: AiProposalInput): AiProposal {
  const scope = Array.isArray(input.renovationScope) ? input.renovationScope : [];
  const sqft = Number.isFinite(input.squareFt) ? Number(input.squareFt) : 0;

  const rules: Record<string, { unit: "sqft" | "each"; unitCost: number; qty: (sqft: number) => number }> = {
    Flooring: { unit: "sqft", unitCost: 5.25, qty: (s) => Math.max(120, Math.round(s * 0.35)) },
    Painting: { unit: "sqft", unitCost: 2.85, qty: (s) => Math.max(180, Math.round(s * 0.9)) },
    Drywall: { unit: "sqft", unitCost: 3.4, qty: (s) => Math.max(100, Math.round(s * 0.25)) },
    Cabinets: { unit: "each", unitCost: 420, qty: () => 12 },
    Countertops: { unit: "sqft", unitCost: 78, qty: () => 40 },
    Plumbing: { unit: "each", unitCost: 250, qty: () => 6 },
    Electrical: { unit: "each", unitCost: 145, qty: () => 10 },
    Fixtures: { unit: "each", unitCost: 120, qty: () => 10 },
    Demolition: { unit: "sqft", unitCost: 1.35, qty: (s) => Math.max(120, Math.round(s * 0.3)) },
    Cleaning: { unit: "sqft", unitCost: 0.55, qty: (s) => Math.max(100, Math.round(s * 0.6)) },
  };

  const selected = scope.length ? scope.filter((s) => rules[s]) : ["Flooring", "Painting", "Cleaning", "Demolition"];
  const lines = selected
    .map((s) => {
      const r = rules[s];
      const q = r.qty(sqft);
      const total = round2(q * r.unitCost);
      return {
        item: s,
        quantityLabel: r.unit === "sqft" ? `${q} sqft` : `${q}`,
        unitCost: round2(r.unitCost),
        total,
      };
    })
    .sort((a, b) => b.total - a.total)
    .slice(0, 8);

  const materialSubtotal = round2(lines.reduce((sum, l) => sum + l.total, 0));
  const labor = round2(materialSubtotal * 0.4);
  const contingency = round2((materialSubtotal + labor) * 0.1);
  const totalInvestment = round2(materialSubtotal + labor + contingency);

  const complexity = Math.max(1, Math.min(10, Math.round((selected.length || 1) + sqft / 800)));
  const workingDays = Math.max(25, Math.round(25 + complexity * 6));
  const totalWeeks = Number((workingDays / 5).toFixed(1));
  const now = new Date();
  const completion = new Date(now.getTime() + workingDays * 24 * 60 * 60 * 1000);

  const mkRange = (startOffsetDays: number, durationDays: number) => {
    const start = new Date(now.getTime() + startOffsetDays * 24 * 60 * 60 * 1000);
    const end = new Date(start.getTime() + durationDays * 24 * 60 * 60 * 1000);
    return { startISO: isoDate(start), endISO: isoDate(end) };
  };

  const s1 = mkRange(0, 10);
  const s2 = mkRange(11, 17);
  const s3 = mkRange(18, 7);
  const s4 = mkRange(26, 5);
  const s5 = mkRange(32, 3);

  const schedule = [
    { title: "Contractor Selection & Bidding", ...s1, days: 10 },
    { title: "Permits & Design Planning", ...s2, days: 17, dependsOn: "Contractor Selection & Bidding" },
    { title: "Demolition & Prep", ...s3, days: 7 },
    { title: "Core Renovation Work", ...s4, days: 5 },
    { title: "Final Cleaning & Handover", ...s5, days: 3 },
  ];

  return {
    lines,
    materialSubtotal,
    labor,
    contingency,
    totalInvestment,
    totalWeeks,
    workingDays,
    completionDateISO: isoDate(completion),
    schedule,
  };
}

const estimateLineSchema = z.object({
  item: z.string().min(1),
  quantityLabel: z.string().min(1),
  unitCost: z.number().nonnegative(),
  total: z.number().nonnegative(),
});

const proposalSchema = z.object({
  lines: z.array(estimateLineSchema).min(1).max(20),
  materialSubtotal: z.number().nonnegative(),
  labor: z.number().nonnegative(),
  contingency: z.number().nonnegative(),
  totalInvestment: z.number().nonnegative(),
  totalWeeks: z.number().positive(),
  workingDays: z.number().int().positive(),
  completionDateISO: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  schedule: z
    .array(
      z.object({
        title: z.string().min(1),
        startISO: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        endISO: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        days: z.number().int().positive(),
        dependsOn: z.string().min(1).optional(),
      })
    )
    .min(2)
    .max(20),
});

export type AiProposal = z.infer<typeof proposalSchema>;

export type AiProposalInput = {
  address: string;
  purchasePrice?: number;
  squareFt?: number;
  bedroom?: number;
  bathroom?: number;
  yearBuilt?: string;
  zipCode?: string;
  roomType?: string;
  budgetLevel?: string;
  designStyle?: string;
  renovationScope?: string[];
};

function clampStr(s: unknown, max = 2000) {
  return typeof s === "string" ? s.slice(0, max) : "";
}

export const aiProposalService = {
  async generateProposal(input: AiProposalInput, images: Buffer[]) {
    if (!env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not set on backend");
    }

    const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
    // Vision-capable Gemini model.
    // Model availability depends on API version / region; try a small fallback set.
    const modelNames = ["gemini-1.5-flash-latest", "gemini-2.0-flash", "gemini-1.5-pro-latest"] as const;

    const scope = Array.isArray(input.renovationScope) ? input.renovationScope : [];
    const sqft = Number.isFinite(input.squareFt) ? input.squareFt : 0;

    const userText = {
      address: clampStr(input.address, 500),
      purchasePrice: input.purchasePrice ?? 0,
      squareFt: sqft,
      bedroom: input.bedroom ?? 0,
      bathroom: input.bathroom ?? 0,
      yearBuilt: clampStr(input.yearBuilt, 40),
      zipCode: clampStr(input.zipCode, 32),
      roomType: clampStr(input.roomType, 80),
      budgetLevel: clampStr(input.budgetLevel, 80),
      designStyle: clampStr(input.designStyle, 80),
      renovationScope: scope.slice(0, 20).map((s) => clampStr(s, 50)),
      photoCount: images.length,
    };

    // Cache: same inputs + same photos should return the same proposal for a short window.
    // This prevents users from re-submitting and immediately tripping provider rate limits.
    const cacheKey = crypto
      .createHash("sha256")
      .update(JSON.stringify(userText))
      .update("|")
      .update(
        images
          .slice(0, 3) // keep key size small; enough to differentiate typical submissions
          .map((b) => crypto.createHash("sha256").update(b).digest("hex"))
          .join(",")
      )
      .digest("hex");

    const now = Date.now();
    const cached = proposalCache.get(cacheKey);
    if (cached && cached.expiresAt > now) {
      return cached.value;
    } else if (cached) {
      proposalCache.delete(cacheKey);
    }

    const existing = inFlight.get(cacheKey);
    if (existing) return await existing;

    const task = (async (): Promise<AiProposal> => {
    const prompt =
      "You are Renovive AI. Based on the property info and photos, produce realistic renovation cost estimates and a project timeline.\n\n" +
      "Return STRICT JSON only (no markdown) matching this schema:\n" +
      JSON.stringify(proposalSchema.shape, null, 2) +
      "\n\nRules:\n" +
      "- lines: 4-8 line items; each has item, quantityLabel, unitCost, total. Use USD amounts.\n" +
      "- materialSubtotal must equal sum(lines.total) within rounding.\n" +
      "- labor = 40% of materialSubtotal (rounded to cents).\n" +
      "- contingency = 10% of (materialSubtotal + labor) (rounded to cents).\n" +
      "- totalInvestment = materialSubtotal + labor + contingency.\n" +
      "- timeline should be plausible given scope + size; workingDays integer; totalWeeks = workingDays/5 (1 decimal).\n" +
      "- completionDateISO should be today + workingDays (calendar days is acceptable).\n" +
      "- schedule: 4-7 tasks, with start/end ISO dates and day counts.\n\n" +
      "Property info JSON:\n" +
      JSON.stringify(userText, null, 2);

    const parts: Array<{ text: string } | { inlineData: { data: string; mimeType: string } }> = [{ text: prompt }];
    // Fewer images = fewer tokens = lower latency + fewer rate-limit issues on free tiers.
    for (const img of images.slice(0, 4)) {
      parts.push({
        inlineData: {
          data: img.toString("base64"),
          mimeType: "image/jpeg",
        },
      });
    }

    const request = {
      contents: [{ role: "user", parts }],
      generationConfig: { temperature: 0.4, maxOutputTokens: 700 },
      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
      ],
    };

    let text = "";
    let lastErr: unknown = null;
    for (const name of modelNames) {
      try {
        const model = genAI.getGenerativeModel({ model: name });
        // Retry on 429 with exponential backoff + jitter.
        for (let attempt = 0; attempt < 5; attempt++) {
          try {
            const result = await model.generateContent(request);
            text = result.response.text().trim();
            break;
          } catch (err: any) {
            const status =
              typeof err?.status === "number"
                ? err.status
                : typeof err?.response?.status === "number"
                  ? err.response.status
                  : undefined;
            const msg = typeof err?.message === "string" ? err.message : "";
            const is429 = status === 429 || msg.includes("429") || msg.toLowerCase().includes("rate limit");
            if (is429 && attempt < 4) {
              const backoffMs = 900 * 2 ** attempt + Math.floor(Math.random() * 400);
              await sleep(backoffMs);
              continue;
            }
            throw err;
          }
        }

        lastErr = null;
        if (text) break;
      } catch (err: any) {
        lastErr = err;
        const msg = typeof err?.message === "string" ? err.message : "";
        // If the model is missing/unsupported, try the next fallback.
        if (msg.includes("not found") || msg.includes("is not supported")) {
          continue;
        }
        break;
      }
    }

    if (!text) {
      const err: any = lastErr;
      const message = typeof err?.message === "string" ? err.message : "Failed to generate AI proposal";
      const status =
        typeof err?.status === "number"
          ? err.status
          : typeof err?.response?.status === "number"
            ? err.response.status
            : undefined;

      if (status === 401 || status === 403) {
        throw new HttpError(401, "Gemini authentication failed. Check GEMINI_API_KEY.");
      }
      if (status === 429) {
        // If Gemini is rate limited, gracefully degrade instead of blocking the user.
        const value = fallbackProposal(input);
        proposalCache.set(cacheKey, { expiresAt: Date.now() + CACHE_TTL_MS, value });
        return value;
      }
      if (status && status >= 400 && status < 500) {
        throw new HttpError(status, message);
      }
      throw err ?? new Error(message);
    }

    let json: unknown;
    try {
      json = JSON.parse(text);
    } catch {
      // Sometimes models wrap JSON; attempt to extract the first {...} block.
      const start = text.indexOf("{");
      const end = text.lastIndexOf("}");
      if (start >= 0 && end > start) {
        json = JSON.parse(text.slice(start, end + 1));
      } else {
        throw new Error("AI returned non-JSON output");
      }
    }

    const parsed = proposalSchema.safeParse(json);
    if (!parsed.success) {
      throw new Error("AI returned invalid proposal JSON");
    }

    const value = parsed.data;
    proposalCache.set(cacheKey, { expiresAt: Date.now() + CACHE_TTL_MS, value });
    return value;
    })().finally(() => {
      inFlight.delete(cacheKey);
    });

    inFlight.set(cacheKey, task);
    return await task;
  },
};

