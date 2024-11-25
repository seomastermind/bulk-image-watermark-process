import React from 'react';
import { X } from 'lucide-react';
import { ImageFile } from '../types';

interface Props {
  images: ImageFile[];
  onRemove: (index: number) => void;
}

export function ImagePreview({ images, onRemove }: Props) {
  if (images.length === 0) return null;

  return (
    <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {images.map((file, index) => (
        <div key={file.name} className="group relative aspect-square">
          <img
            src={file.preview}
            alt={file.name}
            className="h-full w-full rounded-lg object-cover"
          />
          <button
            onClick={() => onRemove(index)}
            className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}