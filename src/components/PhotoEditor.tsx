import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { X, ZoomIn, ZoomOut } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface PhotoEditorProps {
  image: string;
  onSave: (croppedImage: Blob) => void;
  onCancel: () => void;
}

// Using simplified centered crop - external types removed

export function PhotoEditor({ image, onSave, onCancel }: PhotoEditorProps) {
  const { darkMode } = useTheme();
  const [zoom, setZoom] = useState(1);

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.src = url;
    });

const getCenteredCroppedBlob = async (imageSrc: string, zoom: number): Promise<Blob> => {
  const img = await createImage(imageSrc);
  const size = 384; // 384px square output
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No 2d context");

  canvas.width = size;
  canvas.height = size;

  const baseScale = Math.max(size / img.width, size / img.height);
  const scale = baseScale * zoom;
  const drawW = img.width * scale;
  const drawH = img.height * scale;
  const dx = (size - drawW) / 2;
  const dy = (size - drawH) / 2;

  ctx.drawImage(img, 0, 0, img.width, img.height, dx, dy, drawW, drawH);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Failed to create blob"));
    }, "image/png");
  });
};

const handleSave = async () => {
  try {
    const cropped = await getCenteredCroppedBlob(image, zoom);
    onSave(cropped);
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

{/* Preview with round mask */}
        <div className="relative h-96 flex items-center justify-center bg-gray-900">
          <div className="rounded-full overflow-hidden w-80 h-80 shadow-inner">
            <img
              src={image}
              alt="Pré-visualização"
              className="w-full h-full object-cover"
              style={{ transform: `scale(${zoom})`, transformOrigin: "center center" }}
            />
          </div>
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
            Use o controle de zoom para ajustar o enquadramento
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
