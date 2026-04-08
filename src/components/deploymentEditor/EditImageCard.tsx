import { PencilIcon } from "lucide-react";
import { useRef, useState } from "react";

import { Card, CardTitle } from "@/components/ui/Card";

function EditImageCard({
  initialUrl = "",
  onChange,
}: {
  initialUrl?: string;
  onChange?: (value: string) => void;
}) {
  const [src, setSrc] = useState(initialUrl);
  const isDirty = src !== initialUrl;
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
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
    <Card>
      <CardTitle className={`px-4 text-center ${isDirty ? "text-primary" : ""}`}>Image</CardTitle>
      <div className="flex flex-col gap-3 px-4">
        <button
          type="button"
          className="relative flex aspect-video w-full cursor-pointer items-center justify-center overflow-hidden rounded border border-input bg-muted"
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
