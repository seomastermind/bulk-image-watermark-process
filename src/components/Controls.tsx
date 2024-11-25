import React from 'react';
import { Position } from '../types';

interface Props {
  position: Position;
  opacity: number;
  onPositionChange: (position: Position) => void;
  onOpacityChange: (opacity: number) => void;
  disabled?: boolean;
}

export function Controls({
  position,
  opacity,
  onPositionChange,
  onOpacityChange,
  disabled = false,
}: Props) {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="position" className="block text-sm font-medium text-gray-700">
          Overlay Position
        </label>
        <select
          id="position"
          value={position}
          onChange={(e) => onPositionChange(e.target.value as Position)}
          disabled={disabled}
          className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:bg-gray-100 sm:text-sm"
        >
          <option value="top-left">Top Left</option>
          <option value="top-right">Top Right</option>
          <option value="bottom-left">Bottom Left</option>
          <option value="bottom-right">Bottom Right</option>
          <option value="center">Center</option>
        </select>
      </div>

      <div>
        <label htmlFor="opacity" className="block text-sm font-medium text-gray-700">
          Overlay Opacity: {Math.round(opacity * 100)}%
        </label>
        <input
          type="range"
          id="opacity"
          min="0"
          max="1"
          step="0.01"
          value={opacity}
          onChange={(e) => onOpacityChange(parseFloat(e.target.value))}
          disabled={disabled}
          className="mt-1 block w-full"
        />
      </div>
    </div>
  );
}