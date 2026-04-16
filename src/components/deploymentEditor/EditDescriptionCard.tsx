import { PencilIcon, CheckIcon } from "lucide-react";
import { useState, useRef, useEffect } from "react";

import { Button } from "@/components/ui/Button";
import { Card, CardTitle } from "@/components/ui/Card";
import { Textarea } from "@/components/ui/Textarea";
import { useDirtyValueTracker } from "@/lib/hooks/useDirtyValueTracker";

function EditDescriptionCard({
  initialValue = "",
  onChange,
}: {
  initialValue?: string;
  onChange?: (value: string) => void;
}) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { value, setValue, isDirty } = useDirtyValueTracker(initialValue);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing) {
      textareaRef.current?.focus();
    }
  }, [isEditing]);

  const inputField = isEditing ? (
    <Textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
        onChange?.(e.target.value);
      }}
      onBlur={() => setIsEditing(false)}
      className="h-32 w-full resize-none overflow-y-auto border-none bg-accent px-2 py-2 text-center outline-none"
    />
  ) : (
    <Button
      className={`h-32 w-full justify-center ${isDirty ? "text-primary" : ""}`}
      variant="outline"
      onClick={() => setIsEditing(true)}
    >
      <span className="line-clamp-12 overflow-hidden text-center whitespace-pre-wrap">
        {value || "Click to edit"}
      </span>
      <PencilIcon className="shrink-0" />
    </Button>
  );

  return (
    <Card className="flex-1">
      <div className="relative flex items-center justify-center">
        <CardTitle className="text-center">Description</CardTitle>
        {isEditing && (
          <Button
            className="absolute right-0 mx-2 text-primary"
            variant="outline"
            onMouseDown={(e) => {
              e.preventDefault();
              setIsEditing(false);
            }}
          >
            <CheckIcon size={18} />
          </Button>
        )}
      </div>
      <div className="flex flex-1 items-center px-3">{inputField}</div>
    </Card>
  );
}

export { EditDescriptionCard };
