/** Returns a same-origin path safe for post-login redirects, or undefined. */
export function safeInternalNextPath(
  raw: string | null | undefined,
): string | undefined {
  if (typeof raw !== "string") return undefined;
  const trimmed = raw.trim();
  if (!trimmed.startsWith("/")) return undefined;
  if (trimmed.startsWith("//")) return undefined;
  if (trimmed.includes("://")) return undefined;
  if (trimmed.includes("\\")) return undefined;
  return trimmed;
}
