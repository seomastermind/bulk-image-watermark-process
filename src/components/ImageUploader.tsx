import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { ImageFile } from '../types';
import { clsx } from 'clsx';

interface Props {
  onUpload: (files: ImageFile[]) => void;
  multiple?: boolean;
  accept?: Record<string, string[]>;
  className?: string;
  compact?: boolean;
}

export function ImageUploader({
  onUpload,
  multiple = true,
  accept,
  className = '',
  compact = false,
}: Props) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept,
    multiple,
    onDrop: (acceptedFiles) => {
      const files = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      ) as ImageFile[];
      onUpload(files);
    },
  });

  return (
    <div
      {...getRootProps()}
      className={clsx(
        'relative cursor-pointer rounded-lg border-2 border-dashed border-gray-300 text-center transition-colors hover:border-gray-400',
        isDragActive ? 'border-blue-500 bg-blue-50' : '',
        compact ? 'p-6' : 'p-12',
        className
      )}
    >
      <input {...getInputProps()} />
      <Upload className={clsx('mx-auto text-gray-400', compact ? 'h-8 w-8' : 'h-12 w-12')} />
      <p className={clsx('text-sm text-gray-600', compact ? 'mt-1' : 'mt-2')}>
        {isDragActive ? (
          'Drop the files here...'
        ) : (
          <>
            Drag & drop {multiple ? 'images' : 'an image'} here, or click to select{' '}
            {multiple ? 'files' : 'a file'}
          </>
        )}
      </p>
      <p className="mt-1 text-xs text-gray-500">PNG, JPG, JPEG up to 10MB</p>
    </div>
  );
}