import { X } from "lucide-react";

export default function TrailerModal({ trailerUrl, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[1000] px-4">
      <div className="relative w-full max-w-4xl aspect-video">
        <button
          className="absolute -top-4 -right-4 bg-white text-black rounded-full p-2 hover:bg-primary transition z-10"
          onClick={onClose}
        >
          <X />
        </button>

        <iframe
          className="w-full h-full rounded-xl shadow-2xl"
          src={trailerUrl}
          title="Trailer Preview"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}
