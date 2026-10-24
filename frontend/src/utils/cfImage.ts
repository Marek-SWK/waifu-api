
/**
 * Use pre-generated WebP thumbnails stored in SeaweedFS.
 * Original image URLs remain unchanged in the API.
 */

import { getEnv } from './env';

function thumbnail(url: string, width: 640 | 1280): string {
    try {
        const u = new URL(url);
        const cdnBaseUrl = getEnv('VITE_CDN_URL');

        if (!cdnBaseUrl) return url;

        const cdn = new URL(cdnBaseUrl);

        // Only use thumbnails for images from our CDN
        if (u.origin !== cdn.origin) {
            return url;
        }

        // Do not transform already-generated thumbnails.
        if (u.pathname.startsWith('/thumbs/')) {
            return url;
        }

        // For example:
        // /7540.png -> /thumbs/640/7540.png.webp
        return `${u.origin}/thumbs/${width}${u.pathname}.webp`;

    } catch {
        return url;
    }
}

// Small thumbnails for gallery and image cards
export const imgCard = (url: string): string =>
    thumbnail(url, 640);

// Larger thumbnails for previews and home page
export const imgPreview = (url: string): string =>
    thumbnail(url, 1280);

