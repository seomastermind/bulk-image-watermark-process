import React, { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Image as KonvaImage, Text as KonvaText } from 'react-konva';
import { Position, ContentType, TextOptions } from '../types';

interface Props {
  mainImage: HTMLImageElement | null;
  overlayImage: HTMLImageElement | null;
  position: Position;
  opacity: number;
  scale: number;
  contentType: ContentType;
  textOptions: TextOptions;
  previewName: string;
}

export function LivePreview({
  mainImage,
  overlayImage,
  position,
  opacity,
  scale,
  contentType,
  textOptions,
  previewName,
}: Props) {
  const stageRef = useRef<any>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mainImage || !containerRef.current) return;

    const container = containerRef.current;
    const containerWidth = container.clientWidth;
    const aspectRatio = mainImage.height / mainImage.width;
    const height = containerWidth * aspectRatio;

    setDimensions({
      width: containerWidth,
      height: Math.min(height, containerWidth),
    });
  }, [mainImage]);

  const getOverlayPosition = (
    containerWidth: number,
    containerHeight: number,
    overlayWidth: number,
    overlayHeight: number
  ) => {
    const padding = 20;
    switch (position) {
      case 'top-left':
        return { x: padding, y: padding };
      case 'top-right':
        return { x: containerWidth - overlayWidth - padding, y: padding };
      case 'bottom-left':
        return { x: padding, y: containerHeight - overlayHeight - padding };
      case 'bottom-right':
        return {
          x: containerWidth - overlayWidth - padding,
          y: containerHeight - overlayHeight - padding,
        };
      case 'center':
        return {
          x: (containerWidth - overlayWidth) / 2,
          y: (containerHeight - overlayHeight) / 2,
        };
    }
  };

  if (!mainImage || !dimensions.width || !dimensions.height) {
    return (
      <div
        ref={containerRef}
        className="flex h-96 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50"
      >
        <p className="text-sm text-gray-500">First you need to Upload an image to see live preview</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="rounded-lg bg-gray-50">
      <Stage width={dimensions.width} height={dimensions.height} ref={stageRef}>
        <Layer>
          <KonvaImage
            image={mainImage}
            width={dimensions.width}
            height={dimensions.height}
          />

          {contentType === 'image' && overlayImage && (
            <KonvaImage
              image={overlayImage}
              {...getOverlayPosition(
                dimensions.width,
                dimensions.height,
                dimensions.width * scale,
                (overlayImage.height * dimensions.width * scale) / overlayImage.width
              )}
              width={dimensions.width * scale}
              height={(overlayImage.height * dimensions.width * scale) / overlayImage.width}
              opacity={opacity}
            />
          )}

          {contentType === 'text' && textOptions.text && (
            <KonvaText
              text={textOptions.text}
              fontSize={(textOptions.fontSize * dimensions.width) / 1000}
              fontStyle={`${textOptions.isItalic ? 'italic' : ''} ${
                textOptions.isBold ? 'bold' : ''
              }`.trim()}
              fill={textOptions.color}
              opacity={opacity}
              {...getOverlayPosition(
                dimensions.width,
                dimensions.height,
                textOptions.text.length * ((textOptions.fontSize * dimensions.width) / 1000),
                (textOptions.fontSize * dimensions.width) / 1000
              )}
            />
          )}

          {previewName && (
            <KonvaText
              text={previewName}
              fontSize={16}
              fill="#000000"
              x={10}
              y={dimensions.height - 30}
              opacity={0.7}
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
}