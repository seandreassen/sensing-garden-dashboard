import { PencilIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Card, CardTitle } from "@/components/ui/Card";
function EditImageCard({
  initialUrl = "",
  onChange,
}: {
  initialUrl?: string;
  onChange?: (value: string) => void;
}) {
  const MAX_IMAGE_SIZE = 100 * 1024 * 1024; // 100MB
  const ACCEPTED_IMAGE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/svg+xml",
    "image/bmp",
    "image/tiff",
  ];
  const [src, setSrc] = useState<string>(initialUrl);
  const isDirty: boolean = src !== initialUrl;
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSrc(initialUrl);
  }, [initialUrl]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast.warning("Invalid file type", {
        description: `Accepted: ${ACCEPTED_IMAGE_TYPES.map((t) => t.split("/")[1]).join(", ")}`,
        position: "top-center",
      });
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      toast.warning("File too large", {
        description: "Image must be under 100MB",
        position: "top-center",
      });
      return;
    }
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const result = reader.result as string;
      setSrc(result);
      onChange?.(result);
    });
    reader.readAsDataURL(file);
  }

  return (
    <Card className="flex-1">
      <CardTitle className={`px-4 text-center ${isDirty ? "text-primary" : ""}`}>Image</CardTitle>
      <div className="flex flex-1 flex-col gap-3 px-4">
        <button
          type="button"
          className="relative flex w-full flex-1 cursor-pointer items-center justify-center overflow-hidden rounded border border-input bg-muted"
          onClick={() => fileInputRef.current?.click()}
        >
          {src ? (
            <img src={src} alt="Preview" className="h-full w-full object-cover" />
          ) : (
            <span className="text-sm text-muted-foreground">No image</span>
          )}
          <div className="absolute top-2 right-2 rounded-full bg-background/80 p-1">
            <PencilIcon className="h-3 w-3" />
          </div>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </Card>
  );
}

export { EditImageCard };
