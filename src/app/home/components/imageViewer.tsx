import { useState } from "react";
import { X, ZoomIn, ZoomOut } from "lucide-react";
import PropTypes from "prop-types";

interface Image {
  url: string;
  description?: string;
}

interface ImageViewerProps {
  image: Image;
  onClose: () => void;
}

export default function ImageViewer({ image, onClose }: ImageViewerProps) {
  const [zoomLevel, setZoomLevel] = useState(1); // Estado para controlar o nível de zoom

  const handleZoomIn = () => {
    setZoomLevel((prevZoom) => Math.min(prevZoom + 0.1, 3)); // Limite de zoom in até 3x
  };

  const handleZoomOut = () => {
    setZoomLevel((prevZoom) => Math.max(prevZoom - 0.1, 0.5)); // Limite de zoom out até 0.5x
  };

  return (
    <div
      className="fixed inset-0 bg-gray-800 bg-opacity-60 backdrop-blur-sm flex flex-row items-center justify-center z-[100] p-6"
      onClick={onClose}
    >
      <button
        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors duration-200 p-0 bg-transparent w-fit"
        onClick={onClose}
      >
        <X size={32} />
      </button>

      <div className="absolute bottom-10 right-10 flex gap-4">
        <button
          className="text-white hover:text-gray-300 transition-colors duration-200 bg-transparent p-2"
          onClick={(e) => {
            e.stopPropagation(); // Impede o clique de fechar o modal
            handleZoomIn();
          }}
        >
          <ZoomIn size={32} />
        </button>
        <button
          className="text-white hover:text-gray-300 transition-colors duration-200 bg-transparent p-2"
          onClick={(e) => {
            e.stopPropagation(); // Impede o clique de fechar o modal
            handleZoomOut();
          }}
        >
          <ZoomOut size={32} />
        </button>
      </div>

      <div className="flex items-center justify-center w-full h-full gap-8">
        <img
          src={image.url}
          alt={image.description || "Image"}
          className="object-scale-down"
          style={{
            transform: `scale(${zoomLevel})`, // Aplica o nível de zoom
            maxHeight: "100%",
            maxWidth: "1024px",
            transition: "transform 0.3s ease-in-out"
          }}
        />
      </div>
    </div>
  );
}

ImageViewer.propTypes = {
  image: PropTypes.shape({
    url: PropTypes.string.isRequired,
    description: PropTypes.string
  }).isRequired,
  onClose: PropTypes.func.isRequired
};
