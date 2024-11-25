import React, { useState, useCallback } from 'react';
import { Download, Image as ImageIcon, Loader2 } from 'lucide-react';
import JSZip from 'jszip';
import { ImageUploader } from './components/ImageUploader';
import { ImagePreview } from './components/ImagePreview';
import { Controls } from './components/Controls';
import { processImages } from './utils/imageProcessor';
import { Position, ImageFile, ProcessedImage } from './types';

function App() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [overlay, setOverlay] = useState<ImageFile | null>(null);
  const [position, setPosition] = useState<Position>('bottom-right');
  const [opacity, setOpacity] = useState(0.8);
  const [processing, setProcessing] = useState(false);
  const [processedImages, setProcessedImages] = useState<ProcessedImage[]>([]);

  const handleImageUpload = useCallback((files: ImageFile[]) => {
    setImages((prev) => [...prev, ...files]);
  }, []);

  const handleOverlayUpload = useCallback((files: ImageFile[]) => {
    setOverlay(files[0]);
  }, []);

  const handleRemoveImage = useCallback((index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleProcess = async () => {
    if (!overlay || images.length === 0) return;

    setProcessing(true);
    try {
      const processed = await processImages(images, overlay, position, opacity);
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
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">Image Processor</h1>
          <p className="mt-2 text-lg text-gray-600">
            Add watermarks and overlays to your images in bulk
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-6">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold">Upload Images</h2>
              <ImageUploader
                onUpload={handleImageUpload}
                accept={{
                  'image/*': ['.png', '.jpg', '.jpeg'],
                }}
              />
              <ImagePreview images={images} onRemove={handleRemoveImage} />
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold">Upload Overlay</h2>
              <ImageUploader
                onUpload={handleOverlayUpload}
                multiple={false}
                accept={{
                  'image/*': ['.png'],
                }}
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
          </div>

          <div className="space-y-6">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold">Settings</h2>
              <Controls
                position={position}
                opacity={opacity}
                onPositionChange={setPosition}
                onOpacityChange={setOpacity}
                disabled={!overlay || images.length === 0}
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleProcess}
                disabled={!overlay || images.length === 0 || processing}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:bg-gray-400"
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
                  className="flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700"
                >
                  <Download className="h-5 w-5" />
                  Download All
                </button>
              )}
            </div>

            {processedImages.length > 0 && !processing && (
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-semibold">Processed Images</h2>
                <div className="grid grid-cols-2 gap-4">
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