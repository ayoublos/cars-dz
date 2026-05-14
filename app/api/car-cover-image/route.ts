import { createGoogleGenerativeAI } from "@ai-sdk/google";
import type { GoogleLanguageModelOptions } from "@ai-sdk/google";
import { generateText } from "ai";

export const runtime = "nodejs";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY ?? "",
});

const DEFAULT_GEMMA = "gemma-4-26b-a4b-it";
const DEFAULT_IMAGE_MODEL = "gemini-2.5-flash-image";

type Body = {
  name?: string;
  color?: string;
  year?: number;
  fuel?: string;
  transmission?: string;
  engine?: string;
  status?: string;
  extra?: string;
};

export async function POST(req: Request) {
  if (!process.env.GOOGLE_API_KEY) {
    return Response.json(
      { error: "Missing GOOGLE_API_KEY in environment." },
      { status: 500 },
    );
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const gemmaId = process.env.GOOGLE_GEMMA_MODEL ?? DEFAULT_GEMMA;
  const imageModelId =
    process.env.GOOGLE_COVER_IMAGE_MODEL ?? DEFAULT_IMAGE_MODEL;

  const listingBits = [
    body.name && `Vehicle: ${body.name}`,
    body.color && `Color: ${body.color}`,
    body.year != null && Number.isFinite(body.year) && `Year: ${body.year}`,
    body.fuel && `Fuel: ${body.fuel}`,
    body.transmission && `Transmission: ${body.transmission}`,
    body.engine && `Engine: ${body.engine}`,
    body.status && `Condition: ${body.status}`,
    body.extra?.trim() && `Notes: ${body.extra.trim()}`,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const { text: rawPrompt } = await generateText({
      model: google(gemmaId),
      temperature: 0.65,
      maxOutputTokens: 512,
      prompt:
        "You write a single English paragraph (80–140 words) that will be sent to an image-generation model.\n" +
        "Task: describe ONE photorealistic hero photograph for an online used-car classified listing.\n" +
        "Requirements:\n" +
        "- Exterior 3/4 view, daylight, clean neutral background (parking lot or studio), no people.\n" +
        "- No readable license plates, VIN stickers, phone numbers, watermarks, or brand logos as text.\n" +
        "- Generic plausible car matching the hints below (if hints are empty, pick a common compact sedan).\n" +
        "- Output ONLY the descriptive paragraph. No markdown, no title line, no quotes.\n\n" +
        (listingBits ? `Listing hints:\n${listingBits}\n` : "No listing hints — choose a generic modern car.\n"),
    });

    const imagePrompt = rawPrompt.trim();
    if (!imagePrompt) {
      return Response.json(
        { error: "Gemma did not return an image prompt." },
        { status: 502 },
      );
    }

    const { files } = await generateText({
      model: google(imageModelId),
      maxOutputTokens: 8192,
      prompt: imagePrompt,
      providerOptions: {
        google: {
          responseModalities: ["IMAGE"],
          imageConfig: { aspectRatio: "16:9" },
        } satisfies GoogleLanguageModelOptions,
      },
    });

    const img = files?.find((f) => f.mediaType.startsWith("image/"));
    if (!img) {
      return Response.json(
        {
          error:
            "Image model returned no image. Set GOOGLE_COVER_IMAGE_MODEL (e.g. gemini-2.5-flash-image) and retry.",
        },
        { status: 502 },
      );
    }

    return Response.json({
      base64: img.base64,
      mediaType: img.mediaType,
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Cover image request failed.";
    return Response.json({ error: msg }, { status: 500 });
  }
}
