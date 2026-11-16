export function siteUrl(path: string): string {
  const base = import.meta.env.BASE_URL;
  if (!path.startsWith("/") || path.startsWith("//") || path.startsWith(base))
    return path;
  return `${base}${path.slice(1)}`;
}
