export type Position = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';

export interface ImageFile extends File {
  preview: string;
}

export interface ProcessedImage {
  url: string;
  name: string;
}