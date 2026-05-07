import { createGoogleGenerativeAI } from "@ai-sdk/google";
import {
  extractJsonMiddleware,
  generateObject,
  wrapLanguageModel,
} from "ai";
import type { GoogleLanguageModelOptions } from "@ai-sdk/google";
import { z } from "zod";

export const runtime = "nodejs";

/** Caps Gemini usage for add-a-car photo analysis (override via env). */
function clampInt(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, Math.floor(value)));
}

const MAX_OUTPUT_TOKENS = clampInt(
  Number(process.env.ADD_A_CAR_MAX_OUTPUT_TOKENS ?? "1536"),
  256,
  8192,
);

const MAX_IMAGE_BYTES = clampInt(
  Number(process.env.ADD_A_CAR_MAX_IMAGE_BYTES ?? String(2 * 1024 * 1024)),
  256 * 1024,
  16 * 1024 * 1024,
);

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY ?? "",
});

/** Gemini 3 may wrap JSON or spend tokens on thinking — stabilize structured output. */
const geminiPhotoModel = wrapLanguageModel({
  model: google("gemini-3-flash-preview"),
  middleware: extractJsonMiddleware(),
});

async function repairStructuredJson({
  text,
}: {
  text: string;
}): Promise<string | null> {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const body = (fenced?.[1] ?? trimmed).trim();
  const start = body.indexOf("{");
  const end = body.lastIndexOf("}");
  if (start >= 0 && end > start) return body.slice(start, end + 1);
  return null;
}

const schema = z.object({
  location: z.string().optional(),
  notes: z.string().optional(),
  name: z.string().optional(),
  status: z.string().optional(),
  color: z.string().optional(),
  year: z.number().optional(),
  fuel: z.string().optional(),
  transmission: z.string().optional(),
  engine: z.string().optional(),
  doors: z.number().optional(),
  seats: z.number().optional(),
  price_dzd: z.number().optional(),
  mileage_km: z.number().optional(),
});

export async function POST(req: Request) {
  if (!process.env.GOOGLE_API_KEY) {
    return Response.json(
      { error: "Missing GOOGLE_API_KEY in environment." },
      { status: 500 },
    );
  }

  const form = await req.formData();
  const file = form.get("image");
  if (!(file instanceof File)) {
    return Response.json({ error: "Missing image." }, { status: 400 });
  }

  if (file.size > MAX_IMAGE_BYTES) {
    return Response.json(
      {
        error: `Image too large (max ${Math.round(MAX_IMAGE_BYTES / 1024)} KB).`,
      },
      { status: 413 },
    );
  }

  const mime = file.type || "image/jpeg";
  const b64 = Buffer.from(await file.arrayBuffer()).toString("base64");
  const dataUrl = `data:${mime};base64,${b64}`;

  try {
    const { object, usage } = await generateObject({
      model: geminiPhotoModel,
      maxOutputTokens: MAX_OUTPUT_TOKENS,
      maxRetries: 0,
      schema,
      experimental_repairText: repairStructuredJson,
      providerOptions: {
        google: {
          thinkingConfig: { thinkingBudget: 0 },
          structuredOutputs: true,
        } satisfies GoogleLanguageModelOptions,
      },
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text:
                "Reply with a single JSON object only (no markdown, no commentary). " +
                "Extract listing fields only if reasonably inferable from the image; omit uncertain keys.",
            },
            { type: "image", image: dataUrl },
          ],
        },
      ],
    });

    console.log("[car-photo] tokens:", {
      input: usage.inputTokens,
      output: usage.outputTokens,
      total: usage.totalTokens,
      reasoning: usage.outputTokenDetails.reasoningTokens,
    });

    return Response.json(object);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Gemini request failed.";
    return Response.json({ error: msg }, { status: 500 });
  }
}
