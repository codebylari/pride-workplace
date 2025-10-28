import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { X, ZoomIn, ZoomOut } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface PhotoEditorProps {
  image: string;
  onSave: (croppedImage: Blob) => void;
  onCancel: () => void;
}

interface CroppedArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function PhotoEditor({ image, onSave, onCancel }: PhotoEditorProps) {
  const { darkMode } = useTheme();
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CroppedArea | null>(null);

  const onCropComplete = useCallback((_: any, croppedAreaPixels: CroppedArea) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.src = url;
    });

  const getCroppedImg = async (imageSrc: string, pixelCrop: CroppedArea): Promise<Blob> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("No 2d context");
    }

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Canvas is empty"));
        }
      }, "image/jpeg");
    });
  };

  const handleSave = async () => {
    if (!croppedAreaPixels) return;

    try {
      const croppedImage = await getCroppedImg(image, croppedAreaPixels);
      onSave(croppedImage);
    } catch (e) {
      console.error("Error cropping image:", e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className={`w-full max-w-2xl rounded-2xl overflow-hidden ${darkMode ? "bg-gray-700" : "bg-white"}`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
            Ajustar Foto
          </h3>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X size={24} className={darkMode ? "text-white" : "text-gray-800"} />
          </button>
        </div>

        {/* Cropper */}
        <div className="relative h-96 bg-gray-900">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
          />
        </div>

        {/* Controls */}
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className={`text-sm font-medium ${darkMode ? "text-white" : "text-gray-800"}`}>
                Zoom
              </label>
              <div className="flex items-center gap-2">
                <ZoomOut size={18} className={darkMode ? "text-gray-300" : "text-gray-600"} />
                <ZoomIn size={18} className={darkMode ? "text-gray-300" : "text-gray-600"} />
              </div>
            </div>
            <Slider
              value={[zoom]}
              onValueChange={(values) => setZoom(values[0])}
              min={1}
              max={3}
              step={0.1}
              className="w-full"
            />
          </div>

          <p className={`text-sm text-center ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
            Arraste para posicionar a foto e use o controle de zoom para ajustar
          </p>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              onClick={onCancel}
              variant="outline"
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 bg-green-300 hover:bg-green-400 text-green-900"
            >
              Confirmar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
