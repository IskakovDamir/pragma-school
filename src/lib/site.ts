/**
 * Origin the site is served from, with a trailing slash. Every absolute URL the
 * app emits is derived from this one value — canonical tags, og:image, anything
 * a crawler or link previewer has to resolve without a page context.
 */
export const SITE_URL = "https://edu.pragma.com.kz/";

/**
 * Absolute URL for a site-relative path.
 *
 * SITE_URL carries a trailing slash, so `${SITE_URL}/stories/${slug}` would emit
 * edu.pragma.com.kz//stories/aisulu — a different URL to a crawler, and exactly
 * the sort of duplicate a canonical tag exists to collapse. new URL() resolves
 * the reference against the base instead of gluing strings, so it stays correct
 * whether or not SITE_URL keeps its trailing slash.
 *
 * Pass paths WITHOUT a leading slash ("stories/aisulu"). A leading slash resolves
 * against the origin rather than the base, which is the same thing today but
 * stops being so the moment the site moves under a subpath.
 *
 * Called with no argument it returns SITE_URL itself, which is the homepage.
 */
export function absoluteUrl(path = "") {
  return new URL(path, SITE_URL).href;
}
