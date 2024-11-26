export type Position = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
export type ContentType = 'image' | 'text';

export interface ImageFile extends File {
  preview: string;
}

export interface ProcessedImage {
  url: string;
  name: string;
}

export interface TextOptions {
  text: string;
  fontSize: number;
  color: string;
  isBold: boolean;
  isItalic: boolean;
}

export interface OverlayOptions {
  type: ContentType;
  position: Position;
  opacity: number;
  scale: number;
  textOptions?: TextOptions;
}