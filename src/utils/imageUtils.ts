/**
 * Utility functions for image compression and fallbacks.
 */

export function getCategoryFallbackEmoji(category?: string, name?: string): string {
  const c = (category || '').toLowerCase();
  const n = (name || '').toLowerCase();

  if (n.includes('car') || n.includes('creta') || n.includes('hyundai')) return '🚗';
  if (n.includes('bike') || n.includes('motorcycle') || n.includes('tvs') || n.includes('ronin') || n.includes('scooter') || n.includes('activa')) return '🏍️';
  if (n.includes('ac') || n.includes('air conditioner') || n.includes('daikin')) return '❄️';
  if (n.includes('ro') || n.includes('water') || n.includes('purifier') || n.includes('kent')) return '💧';
  if (n.includes('tv') || n.includes('television') || n.includes('display') || n.includes('samsung')) return '📺';
  if (n.includes('phone') || n.includes('iphone') || n.includes('mobile') || n.includes('nothing') || n.includes('gadget')) return '📱';
  if (n.includes('macbook') || n.includes('laptop') || n.includes('computer')) return '💻';

  switch (category) {
    case 'Vehicles':
      return '🚗';
    case 'Electronics':
      return '📺';
    case 'Gadgets':
      return '📱';
    case 'Appliances':
      return '🌀';
    case 'Home':
      return '🏠';
    default:
      return '📦';
  }
}

/**
 * Compresses an image file or data URL using HTML5 Canvas to prevent LocalStorage quota limits and UI lag.
 */
export async function compressImage(
  input: File | string,
  maxWidth = 800,
  maxHeight = 800,
  quality = 0.7
): Promise<string> {
  return new Promise((resolve) => {
    const getDataUrl = (): Promise<string> => {
      if (typeof input === 'string') {
        return Promise.resolve(input);
      }
      return new Promise((res, rej) => {
        const reader = new FileReader();
        reader.onload = () => res(reader.result as string);
        reader.onerror = (err) => rej(err);
        reader.readAsDataURL(input);
      });
    };

    getDataUrl()
      .then((dataUrl) => {
        // If dataUrl is tiny or SVG/not compressible image, return as is
        if (!dataUrl || !dataUrl.startsWith('data:image')) {
          resolve(dataUrl);
          return;
        }

        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          try {
            let width = img.width;
            let height = img.height;

            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
              resolve(dataUrl);
              return;
            }

            // Draw with white background in case of transparent PNG converted to JPEG
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, width, height);
            ctx.drawImage(img, 0, 0, width, height);

            const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
            resolve(compressedDataUrl);
          } catch (err) {
            console.warn('Canvas compression failed, using original image:', err);
            resolve(dataUrl);
          }
        };
        img.onerror = () => {
          resolve(dataUrl);
        };
        img.src = dataUrl;
      })
      .catch(() => {
        if (typeof input === 'string') {
          resolve(input);
        } else {
          resolve('');
        }
      });
  });
}
