import { Input } from "@base-ui/react";
import { PencilIcon } from "lucide-react";
import { useRef, useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";

function DeviceField({
  value,
  onChange,
  placeholder,
  isDirty,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  isDirty?: boolean;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  if (isEditing) {
    return (
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => setIsEditing(false)}
        onKeyDown={(e) => e.key === "Enter" && setIsEditing(false)}
        placeholder={placeholder}
        className="h-8 w-full border-none bg-accent px-2 text-sm outline-none"
      />
    );
  }

  return (
    <Button
      variant="ghost"
      className={`h-8 w-full justify-start text-sm ${isDirty ? "text-primary" : ""}`}
      onClick={() => setIsEditing(true)}
    >
      <span className="truncate">{value || placeholder}</span>
      <PencilIcon className="ml-auto h-3 w-3 shrink-0" />
    </Button>
  );
}

export { DeviceField };
