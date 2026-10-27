/**
 * Resolves static asset paths so they work seamlessly on root domains, local dev,
 * and GitHub Pages subpaths (e.g. https://username.github.io/repo-name/).
 */
export const resolveAsset = (url?: string): string => {
  if (!url) return '';
  // If already base64 data URL, blob, or absolute http(s) URL, return directly
  if (
    url.startsWith('data:') ||
    url.startsWith('blob:') ||
    url.startsWith('http://') ||
    url.startsWith('https://')
  ) {
    return url;
  }

  // Strip leading slash
  const cleanPath = url.startsWith('/') ? url.slice(1) : url;
  const baseUrl = import.meta.env.BASE_URL || './';

  if (baseUrl.endsWith('/')) {
    return `${baseUrl}${cleanPath}`;
  }
  return `${baseUrl}/${cleanPath}`;
};
