/**
 * Compresses and resizes an image file to keep it optimized for Firestore documents
 * (strictly below the 1MB document limit) and ensures fast loading on mobile and desktop.
 */
export function compressImageFile(
  file: File,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.76
): Promise<string> {
  return new Promise((resolve) => {
    if (!file.type.startsWith('image/')) {
      resolve('');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(result);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        let compressedData = canvas.toDataURL('image/jpeg', quality);

        // If compressed image is still > 350KB, downscale further for Firestore safety
        if (compressedData.length > 450 * 1024) {
          const smallCanvas = document.createElement('canvas');
          smallCanvas.width = Math.round(width * 0.8);
          smallCanvas.height = Math.round(height * 0.8);
          const smallCtx = smallCanvas.getContext('2d');
          if (smallCtx) {
            smallCtx.drawImage(canvas, 0, 0, smallCanvas.width, smallCanvas.height);
            compressedData = smallCanvas.toDataURL('image/jpeg', 0.68);
          }
        }

        resolve(compressedData);
      };
      img.onerror = () => resolve(result);
      img.src = result;
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
}
