import React from 'react';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export function PreviewNameInput({ value, onChange }: Props) {
  return (
    <div>
      <label htmlFor="previewName" className="block text-sm font-medium text-gray-700">
        
      </label>
      <input
        type="text"
        id="previewName"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter preview name"
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
      />
    </div>
  );
}