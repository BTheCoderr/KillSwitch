const ALLOWED_EMBED_HOSTS = [
  "playcode.io",
  "stackblitz.com",
  "replit.com",
  "codesandbox.io",
];

export function normalizeEmbedUrl(value: string | null | undefined) {
  if (!value) return null;

  try {
    const url = new URL(value.trim());
    if (url.protocol !== "https:") return null;

    const host = url.hostname.toLowerCase();
    const allowed = ALLOWED_EMBED_HOSTS.some(
      (root) => host === root || host.endsWith(`.${root}`),
    );

    return allowed ? url.toString() : null;
  } catch {
    return null;
  }
}

export function allowedEmbedHosts() {
  return [...ALLOWED_EMBED_HOSTS];
}
