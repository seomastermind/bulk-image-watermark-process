import React, { useState, useCallback, useEffect } from 'react';
import { Download, Image as ImageIcon, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import JSZip from 'jszip';
import { ImageUploader } from './components/ImageUploader';
import { ImagePreview } from './components/ImagePreview';
import { Controls } from './components/Controls';
import { LivePreview } from './components/LivePreview';
import { ThemeToggle } from './components/ThemeToggle';
import { PreviewNameInput } from './components/PreviewNameInput';
import { processImages } from './utils/imageProcessor';
import { Position, ImageFile, ProcessedImage, ContentType, TextOptions } from './types';

const defaultTextOptions: TextOptions = {
  text: '',
  fontSize: 24,
  color: '#000000',
  isBold: false,
  isItalic: false,
};

function App() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [overlay, setOverlay] = useState<ImageFile | null>(null);
  const [position, setPosition] = useState<Position>('bottom-right');
  const [opacity, setOpacity] = useState(0.8);
  const [scale, setScale] = useState(0.2);
  const [contentType, setContentType] = useState<ContentType>('text');
  const [textOptions, setTextOptions] = useState<TextOptions>(defaultTextOptions);
  const [processing, setProcessing] = useState(false);
  const [processedImages, setProcessedImages] = useState<ProcessedImage[]>([]);
  const [isDark, setIsDark] = useState(false);
  const [previewName, setPreviewName] = useState('');
  const [previewImage, setPreviewImage] = useState<HTMLImageElement | null>(null);
  const [overlayPreviewImage, setOverlayPreviewImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (images[0]) {
      const img = new Image();
      img.onload = () => setPreviewImage(img);
      img.src = images[0].preview;
    } else {
      setPreviewImage(null);
    }
  }, [images]);

  useEffect(() => {
    if (overlay) {
      const img = new Image();
      img.onload = () => setOverlayPreviewImage(img);
      img.src = overlay.preview;
    } else {
      setOverlayPreviewImage(null);
    }
  }, [overlay]);

  const handleImageUpload = useCallback((files: ImageFile[]) => {
    setImages((prev) => [...prev, ...files]);
  }, []);

  const handleOverlayUpload = useCallback((files: ImageFile[]) => {
    setOverlay(files[0]);
  }, []);

  const handleRemoveImage = useCallback((index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setProcessedImages([]);
  }, []);

  const handleReset = useCallback(() => {
    setImages([]);
    setOverlay(null);
    setPosition('bottom-right');
    setOpacity(0.8);
    setScale(0.2);
    setContentType('text');
    setTextOptions(defaultTextOptions);
    setProcessedImages([]);
    setPreviewName('');
  }, []);

  const handleProcess = async () => {
    if (images.length === 0 || (contentType === 'image' && !overlay) || (contentType === 'text' && !textOptions.text)) {
      return;
    }

    setProcessing(true);
    try {
      const options = {
        type: contentType,
        position,
        opacity,
        scale,
        textOptions: contentType === 'text' ? textOptions : undefined,
      };

      const processed = await processImages(images, overlay, options);
      setProcessedImages(processed);
    } catch (error) {
      console.error('Error processing images:', error);
      alert('An error occurred while processing the images.');
    }
    setProcessing(false);
  };

  const handleDownload = async () => {
    const zip = new JSZip();

    processedImages.forEach((image) => {
      const data = image.url.split(',')[1];
      zip.file(image.name, data, { base64: true });
    });

    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'processed-images.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={clsx('min-h-screen transition-colors', isDark ? 'bg-gray-900' : 'bg-gray-50')}>
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8">
        <div className="flex items-center justify-between">
          <h1 className={clsx('text-2xl font-bold', isDark ? 'text-white' : 'text-gray-900')}>
            Add Your Watermark - Nafis Iqbal
          </h1>
          <ThemeToggle isDark={isDark} onToggle={setIsDark} />
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr,1fr]">
          <div className="space-y-6">
            <Controls
              position={position}
              opacity={opacity}
              scale={scale}
              contentType={contentType}
              textOptions={textOptions}
              onPositionChange={setPosition}
              onOpacityChange={setOpacity}
              onScaleChange={setScale}
              onContentTypeChange={setContentType}
              onTextOptionsChange={setTextOptions}
              onReset={handleReset}
              disabled={images.length === 0}
              isDark={isDark}
            />

            <div className={clsx('rounded-lg p-6 shadow-sm', isDark ? 'bg-gray-800' : 'bg-white')}>
              <h2 className={clsx('mb-4 text-xl font-semibold', isDark ? 'text-white' : 'text-gray-900')}>
                Upload Images
              </h2>
              <ImageUploader
                onUpload={handleImageUpload}
                accept={{
                  'image/*': ['.png', '.jpg', '.jpeg'],
                }}
                compact
                isDark={isDark}
              />
              <ImagePreview images={images} onRemove={handleRemoveImage} />
            </div>

            {contentType === 'image' && (
              <div className={clsx('rounded-lg p-6 shadow-sm', isDark ? 'bg-gray-800' : 'bg-white')}>
                <h2 className={clsx('mb-4 text-xl font-semibold', isDark ? 'text-white' : 'text-gray-900')}>
                  Upload Watermark Image
                </h2>
                <ImageUploader
                  onUpload={handleOverlayUpload}
                  multiple={false}
                  accept={{
                    'image/*': ['.png'],
                  }}
                  compact
                  isDark={isDark}
                />
                {overlay && (
                  <div className="mt-4">
                    <img
                      src={overlay.preview}
                      alt="Overlay preview"
                      className="mx-auto h-32 object-contain"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className={clsx('rounded-lg p-6 shadow-sm border', isDark ? 'bg-gray-800' : 'bg-white')}>
              <div className="mb-4 space-y-4">
                <h2 className={clsx('text-xl font-semibold', isDark ? 'text-white' : 'text-gray-900')}>
                  Live Preview
                </h2>
                {/* <PreviewNameInput value={previewName} onChange={setPreviewName} /> */}
              </div>
              <LivePreview
                mainImage={previewImage}
                overlayImage={overlayPreviewImage}
                position={position}
                opacity={opacity}
                scale={scale}
                contentType={contentType}
                textOptions={textOptions}
                previewName={previewName}
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleProcess}
                disabled={
                  images.length === 0 ||
                  (contentType === 'image' && !overlay) ||
                  (contentType === 'text' && !textOptions.text) ||
                  processing
                }
                className={clsx(
                  'flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-white transition-colors',
                  processing
                    ? 'bg-gray-400'
                    : isDark
                    ? 'bg-blue-500 hover:bg-blue-600'
                    : 'bg-blue-600 hover:bg-blue-700',
                  'disabled:bg-gray-400'
                )}
              >
                {processing ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <ImageIcon className="h-5 w-5" />
                )}
                {processing ? 'Processing...' : 'Process Images'}
              </button>

              {processedImages.length > 0 && !processing && (
                <button
                  onClick={handleDownload}
                  className={clsx(
                    'flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-white transition-colors',
                    isDark
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-green-600 hover:bg-green-700'
                  )}
                >
                  <Download className="h-5 w-5" />
                  Download All
                </button>
              )}
            </div>

            {processedImages.length > 0 && !processing && (
              <div className={clsx('rounded-lg p-6 shadow-sm', isDark ? 'bg-gray-800' : 'bg-white')}>
                <h2 className={clsx('mb-4 text-xl font-semibold', isDark ? 'text-white' : 'text-gray-900')}>
                  Processed Images
                </h2>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {processedImages.map((image, index) => (
                    <img
                      key={index}
                      src={image.url}
                      alt={`Processed ${index + 1}`}
                      className="rounded-lg"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default App;