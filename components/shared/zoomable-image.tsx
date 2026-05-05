import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { User } from "lucide-react";

interface ZoomableImageProps {
  src?: string | null;
  alt?: string | null;
  className?: string;
  fallbackClassName?: string;
}

export function ZoomableImage({
  src,
  alt,
  className,
  fallbackClassName,
}: ZoomableImageProps) {
  if (!src) {
    return (
      <div
        className={`flex items-center justify-center bg-muted text-muted-foreground ${className} ${fallbackClassName}`}
      >
        <User className="w-1/2 h-1/2" />
      </div>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          className={`cursor-zoom-in transition-opacity hover:opacity-80 overflow-hidden ${className}`}
        >
          <img
            src={src}
            alt={alt || "Image"}
            className="w-full h-full object-cover"
          />
        </div>
      </DialogTrigger>

      <DialogContent className="max-w-4xl w-full p-0 overflow-hidden bg-transparent border-none shadow-none flex justify-center items-center">
        <VisuallyHidden>
          <DialogTitle>Phóng to hình ảnh</DialogTitle>
        </VisuallyHidden>
        <img
          src={src}
          alt={alt || "Zoomed Image"}
          className="w-auto h-auto max-h-[85vh] max-w-[90vw] object-contain rounded-md shadow-2xl animate-in zoom-in-95 duration-300"
        />
      </DialogContent>
    </Dialog>
  );
}
