import { Position, ProcessedImage, OverlayOptions, TextOptions } from '../types';

export async function processImages(
  images: File[],
  overlay: File | null,
  options: OverlayOptions
): Promise<ProcessedImage[]> {
  const overlayImage = overlay ? await createImage(overlay) : null;
  const processedImages: ProcessedImage[] = [];

  for (const image of images) {
    const processed = await processImage(image, overlayImage, options);
    processedImages.push(processed);
  }

  return processedImages;
}

async function processImage(
  image: File,
  overlay: HTMLImageElement | null,
  options: OverlayOptions
): Promise<ProcessedImage> {
  const img = await createImage(image);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;

  canvas.width = img.width;
  canvas.height = img.height;

  // Draw main image
  ctx.drawImage(img, 0, 0);

  if (options.type === 'image' && overlay) {
    // Calculate overlay dimensions
    const overlayWidth = img.width * options.scale;
    const overlayHeight = (overlay.height * overlayWidth) / overlay.width;

    // Calculate position
    const coords = getOverlayPosition(
      options.position,
      img.width,
      img.height,
      overlayWidth,
      overlayHeight
    );

    // Set opacity
    ctx.globalAlpha = options.opacity;

    // Draw overlay
    ctx.drawImage(overlay, coords.x, coords.y, overlayWidth, overlayHeight);

    // Reset opacity
    ctx.globalAlpha = 1;
  } else if (options.type === 'text' && options.textOptions) {
    const { text, fontSize, color, isBold, isItalic } = options.textOptions;

    // Set text properties
    ctx.globalAlpha = options.opacity;
    ctx.fillStyle = color;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    // Set font style
    const fontStyle = [
      isItalic ? 'italic' : '',
      isBold ? 'bold' : '',
      `${fontSize}px`,
      'Arial, sans-serif',
    ]
      .filter(Boolean)
      .join(' ');
    ctx.font = fontStyle;

    // Calculate text dimensions
    const metrics = ctx.measureText(text);
    const textWidth = metrics.width;
    const textHeight = fontSize;

    // Calculate position
    const coords = getOverlayPosition(
      options.position,
      img.width,
      img.height,
      textWidth,
      textHeight
    );

    // Draw text
    ctx.fillText(text, coords.x, coords.y);

    // Reset opacity
    ctx.globalAlpha = 1;
  }

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