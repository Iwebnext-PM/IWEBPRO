/**
 * Image URL normalization and fallback utilities.
 * Ensures images resolve correctly both in local Vite development
 * and in production environments (such as Vercel, Netlify, Cloud Run).
 */

export const DEFAULT_FALLBACK_IMAGES = {
  hero: '/assets/images/hero_hvac_technician.jpg',
  cooling: '/assets/images/ac_cooling_interior.jpg',
  heating: '/assets/images/furnace_installation.jpg',
  commercial: '/assets/images/commercial_rooftop_hvac.jpg',
  // High-availability CDN fallbacks for zero-downtime reliability
  cdnHero: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1600&q=80',
  cdnCooling: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=1200&q=80',
  cdnHeating: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
  cdnCommercial: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80',
};

/**
 * Normalizes an image URL so it works in production on Vercel.
 * Strips development-only `/src/` paths that cause 404s on Vercel.
 */
export function normalizeImageUrl(url?: string | null, fallback: string = DEFAULT_FALLBACK_IMAGES.hero): string {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return fallback;
  }

  const trimmed = url.trim();

  // Convert Vite dev-only /src/assets/images/... to production /assets/images/...
  if (trimmed.startsWith('/src/assets/images/')) {
    return trimmed.replace('/src/assets/images/', '/assets/images/');
  }

  if (trimmed.startsWith('src/assets/images/')) {
    return trimmed.replace('src/assets/images/', '/assets/images/');
  }

  if (trimmed.startsWith('/src/')) {
    return trimmed.replace('/src/', '/');
  }

  return trimmed;
}

/**
 * Error handler for HTML <img> elements.
 * Prevents broken image icons if an asset fails to load on Vercel.
 */
export function handleImageError(
  event: React.SyntheticEvent<HTMLImageElement, Event>,
  category: 'hero' | 'cooling' | 'heating' | 'commercial' = 'hero'
) {
  const target = event.currentTarget;
  // Prevent infinite error loop if fallback also fails
  if (target.dataset.fallbackApplied === 'true') {
    target.style.display = 'none';
    return;
  }

  target.dataset.fallbackApplied = 'true';
  switch (category) {
    case 'cooling':
      target.src = DEFAULT_FALLBACK_IMAGES.cdnCooling;
      break;
    case 'heating':
      target.src = DEFAULT_FALLBACK_IMAGES.cdnHeating;
      break;
    case 'commercial':
      target.src = DEFAULT_FALLBACK_IMAGES.cdnCommercial;
      break;
    case 'hero':
    default:
      target.src = DEFAULT_FALLBACK_IMAGES.cdnHero;
      break;
  }
}
