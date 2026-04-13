import { PencilIcon } from "lucide-react";
import { useState, useRef, useEffect } from "react";

import { Button } from "@/components/ui/Button";
import { Card, CardTitle } from "@/components/ui/Card";

function useTrackedValue(initialValue: string) {
  const [value, setValue] = useState(initialValue);
  const isDirty = value !== initialValue;
  return { value, setValue, isDirty };
}

function EditDescriptionCard({
  initialValue = "",
  onChange,
}: {
  initialValue?: string;
  onChange?: (value: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const { value, setValue, isDirty } = useTrackedValue(initialValue);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing) {
      textareaRef.current?.focus();
    }
  }, [isEditing]);

  const inputField = isEditing ? (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
        onChange?.(e.target.value);
      }}
      onBlur={() => setIsEditing(false)}
      className="h-full w-full resize-none overflow-y-auto border-none bg-accent px-2 py-2 text-center outline-none"
    />
  ) : (
    <Button
      className={`h-full w-full justify-center ${isDirty ? "text-primary" : ""}`}
      variant="ghost"
      onClick={() => setIsEditing(true)}
    >
      <span className="line-clamp-4 overflow-hidden text-center whitespace-pre-wrap">
        {value || "Click to edit"}
      </span>
      <PencilIcon className="shrink-0" />
    </Button>
  );

  return (
    <Card className="flex-1">
      <CardTitle className="text-center">Description</CardTitle>
      <div className="flex flex-1 items-center">{inputField}</div>
    </Card>
  );
}

export { EditDescriptionCard };
