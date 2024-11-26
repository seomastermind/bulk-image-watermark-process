import React from 'react';
import { Position, ContentType, TextOptions } from '../types';
import { clsx } from 'clsx';
import { Type, Image as ImageIcon, RefreshCw } from 'lucide-react';
import * as Select from '@radix-ui/react-select';
import * as Slider from '@radix-ui/react-slider';
import * as Toggle from '@radix-ui/react-toggle';

interface Props {
  position: Position;
  opacity: number;
  scale: number;
  contentType: ContentType;
  textOptions: TextOptions;
  onPositionChange: (position: Position) => void;
  onOpacityChange: (opacity: number) => void;
  onScaleChange: (scale: number) => void;
  onContentTypeChange: (type: ContentType) => void;
  onTextOptionsChange: (options: TextOptions) => void;
  onReset: () => void;
  disabled?: boolean;
}

export function Controls({
  position,
  opacity,
  scale,
  contentType,
  textOptions,
  onPositionChange,
  onOpacityChange,
  onScaleChange,
  onContentTypeChange,
  onTextOptionsChange,
  onReset,
  disabled = false,
}: Props) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Content Settings</h3>
          <button
            onClick={onReset}
            className="flex items-center gap-2 rounded-md bg-gray-100 px-3 py-1.5 text-sm text-gray-700 transition-colors hover:bg-gray-200"
          >
            <RefreshCw className="h-4 w-4" />
            Reset
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Watermark Type</label>
            <Select.Root value={contentType} onValueChange={onContentTypeChange}>
              <Select.Trigger
                className="mt-1 flex w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                aria-label="Content Type"
              >
                <Select.Value />
                <Select.Icon />
              </Select.Trigger>

              <Select.Portal>
                <Select.Content className="overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg">
                  <Select.Viewport>
                    <Select.Item
                      value="text"
                      className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm text-gray-700 outline-none hover:bg-gray-100 data-[highlighted]:bg-gray-100"
                    >
                      <Type className="h-4 w-4" />
                      <Select.ItemText>Text</Select.ItemText>
                    </Select.Item>
                    <Select.Item
                      value="image"
                      className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm text-gray-700 outline-none hover:bg-gray-100 data-[highlighted]:bg-gray-100"
                    >
                      <ImageIcon className="h-4 w-4" />
                      <Select.ItemText>Image</Select.ItemText>
                    </Select.Item>
                  </Select.Viewport>
                </Select.Content>
              </Select.Portal>
            </Select.Root>
          </div>

          {contentType === 'text' && (
            <div className="space-y-4">
              <div>
                <label htmlFor="text" className="block text-sm font-medium text-gray-700">
                  Text Content
                </label>
                <input
                  type="text"
                  id="text"
                  value={textOptions.text}
                  onChange={(e) =>
                    onTextOptionsChange({ ...textOptions, text: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Enter your text here"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Font Size: {textOptions.fontSize}px
                </label>
                <Slider.Root
                  className="relative mt-2 flex h-5 w-full touch-none items-center"
                  value={[textOptions.fontSize]}
                  max={1000}
                  min={1}
                  step={1}
                  onValueChange={([value]) =>
                    onTextOptionsChange({ ...textOptions, fontSize: value })
                  }
                >
                  <Slider.Track className="relative h-1 w-full grow rounded-full bg-gray-200">
                    <Slider.Range className="absolute h-full rounded-full bg-blue-500" />
                  </Slider.Track>
                  <Slider.Thumb className="block h-4 w-4 rounded-full bg-blue-500 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" />
                </Slider.Root>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Text Color</label>
                <div className="mt-1 flex items-center gap-2">
                  <input
                    type="color"
                    value={textOptions.color}
                    onChange={(e) =>
                      onTextOptionsChange({ ...textOptions, color: e.target.value })
                    }
                    className="h-8 w-16 cursor-pointer rounded border border-gray-300"
                  />
                  <span className="text-sm text-gray-500">{textOptions.color}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <Toggle.Root
                  pressed={textOptions.isBold}
                  onPressedChange={(pressed) =>
                    onTextOptionsChange({ ...textOptions, isBold: pressed })
                  }
                  className={clsx(
                    'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                    textOptions.isBold
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  )}
                >
                  Bold
                </Toggle.Root>
                <Toggle.Root
                  pressed={textOptions.isItalic}
                  onPressedChange={(pressed) =>
                    onTextOptionsChange({ ...textOptions, isItalic: pressed })
                  }
                  className={clsx(
                    'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                    textOptions.isItalic
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  )}
                >
                  Italic
                </Toggle.Root>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Position & Appearance</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Position</label>
            <Select.Root value={position} onValueChange={onPositionChange}>
              <Select.Trigger
                className="mt-1 flex w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                aria-label="Position"
              >
                <Select.Value />
                <Select.Icon />
              </Select.Trigger>

              <Select.Portal>
                <Select.Content className="overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg">
                  <Select.Viewport>
                    {['top-left', 'top-right', 'bottom-left', 'bottom-right', 'center'].map(
                      (pos) => (
                        <Select.Item
                          key={pos}
                          value={pos}
                          className="cursor-pointer px-3 py-2 text-sm text-gray-700 outline-none hover:bg-gray-100 data-[highlighted]:bg-gray-100"
                        >
                          <Select.ItemText>
                            {pos
                              .split('-')
                              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                              .join(' ')}
                          </Select.ItemText>
                        </Select.Item>
                      )
                    )}
                  </Select.Viewport>
                </Select.Content>
              </Select.Portal>
            </Select.Root>
          </div>

          {contentType === 'image' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Overlay Size: {Math.round(scale * 100)}%
              </label>
              <Slider.Root
                className="relative mt-2 flex h-5 w-full touch-none items-center"
                value={[scale]}
                max={2}
                min={0.1}
                step={0.05}
                onValueChange={([value]) => onScaleChange(value)}
              >
                <Slider.Track className="relative h-1 w-full grow rounded-full bg-gray-200">
                  <Slider.Range className="absolute h-full rounded-full bg-blue-500" />
                </Slider.Track>
                <Slider.Thumb className="block h-4 w-4 rounded-full bg-blue-500 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" />
              </Slider.Root>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Opacity: {Math.round(opacity * 100)}%
            </label>
            <Slider.Root
              className="relative mt-2 flex h-5 w-full touch-none items-center"
              value={[opacity]}
              max={1}
              min={0}
              step={0.01}
              onValueChange={([value]) => onOpacityChange(value)}
            >
              <Slider.Track className="relative h-1 w-full grow rounded-full bg-gray-200">
                <Slider.Range className="absolute h-full rounded-full bg-blue-500" />
              </Slider.Track>
              <Slider.Thumb className="block h-4 w-4 rounded-full bg-blue-500 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" />
            </Slider.Root>
          </div>
        </div>
      </div>
    </div>
  );
}