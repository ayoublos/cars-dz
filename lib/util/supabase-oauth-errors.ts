/** User-facing text when Supabase rejects OAuth (e.g. provider disabled in dashboard). */
export function formatSupabaseOAuthStartError(message: string): string {
  const m = message.toLowerCase();
  if (
    m.includes("provider is not enabled") ||
    m.includes("unsupported provider")
  ) {
    return [
      "Google sign-in is disabled for this Supabase project.",
      "Enable it: Supabase Dashboard → Authentication → Providers → Google → turn it on, then paste your Google OAuth Web client ID and client secret.",
      "In Google Cloud Console, set the authorized redirect URI to the URL Supabase shows for Google (usually https://<project-ref>.supabase.co/auth/v1/callback).",
      "Under Authentication → URL Configuration, add this app’s callback: http://localhost:3000/auth/callback (and your production URL).",
    ].join(" ");
  }
  return message;
}
