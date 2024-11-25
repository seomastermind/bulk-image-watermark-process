import { Position, ProcessedImage } from '../types';

export async function processImages(
  images: File[],
  overlay: File,
  position: Position,
  opacity: number
): Promise<ProcessedImage[]> {
  const overlayImage = await createImage(overlay);
  const processedImages: ProcessedImage[] = [];

  for (const image of images) {
    const processed = await processImage(image, overlayImage, position, opacity);
    processedImages.push(processed);
  }

  return processedImages;
}

async function processImage(
  image: File,
  overlay: HTMLImageElement,
  position: Position,
  opacity: number
): Promise<ProcessedImage> {
  const img = await createImage(image);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;

  canvas.width = img.width;
  canvas.height = img.height;

  // Draw main image
  ctx.drawImage(img, 0, 0);

  // Calculate overlay dimensions (20% of the main image width)
  const overlayWidth = img.width * 0.2;
  const overlayHeight = (overlay.height * overlayWidth) / overlay.width;

  // Calculate position
  const coords = getOverlayPosition(position, img.width, img.height, overlayWidth, overlayHeight);

  // Set opacity
  ctx.globalAlpha = opacity;

  // Draw overlay
  ctx.drawImage(overlay, coords.x, coords.y, overlayWidth, overlayHeight);

  // Reset opacity
  ctx.globalAlpha = 1;

  return {
    url: canvas.toDataURL('image/png'),
    name: image.name.replace(/\.[^/.]+$/, '') + '_processed.png',
  };
}

function createImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

function getOverlayPosition(
  position: Position,
  width: number,
  height: number,
  overlayWidth: number,
  overlayHeight: number
) {
  const padding = 20; // Padding from edges

  switch (position) {
    case 'top-left':
      return { x: padding, y: padding };
    case 'top-right':
      return { x: width - overlayWidth - padding, y: padding };
    case 'bottom-left':
      return { x: padding, y: height - overlayHeight - padding };
    case 'bottom-right':
      return { x: width - overlayWidth - padding, y: height - overlayHeight - padding };
    case 'center':
      return {
        x: (width - overlayWidth) / 2,
        y: (height - overlayHeight) / 2,
      };
  }
}