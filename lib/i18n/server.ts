import { cookies } from "next/headers";
import type { Lang } from "./shared";

export async function getLang(): Promise<Lang> {
  const c = await cookies();
  const raw = c.get("lang")?.value;
  return raw === "ar" || raw === "fr" || raw === "en" ? raw : "en";
}

