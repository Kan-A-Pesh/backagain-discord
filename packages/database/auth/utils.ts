export function getBaseUrl() {
  if (process.env.VERCEL_ENV === "preview") {
    return `https://${process.env.VERCEL_BRANCH_URL}`;
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }

  return process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";
}
