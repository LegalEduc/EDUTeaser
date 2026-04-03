const PRIMARY_BASE_URL = "https://master.legalcrew.co.kr";
const LEGACY_BASE_URLS = new Set([
  "https://legalcamp.netlify.app",
  "http://legalcamp.netlify.app",
  "legalcamp.netlify.app",
]);

export function getBaseUrl() {
  const raw = process.env.NEXT_PUBLIC_BASE_URL?.trim();
  if (!raw) return PRIMARY_BASE_URL;
  if (LEGACY_BASE_URLS.has(raw)) return PRIMARY_BASE_URL;
  return raw;
}

