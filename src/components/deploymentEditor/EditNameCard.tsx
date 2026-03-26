import { PencilIcon } from "lucide-react";
import { useState, useRef, useEffect } from "react";

import { Button } from "@/components/ui/Button";
import { Card, CardTitle } from "@/components/ui/Card";

function useTrackedValue(initialValue: string) {
  const [value, setValue] = useState(initialValue);
  const isDirty = value !== initialValue;
  return { value, setValue, isDirty };
}

function EditNameCard({
  initialValue = "",
  onChange,
}: {
  initialValue?: string;
  onChange?: (value: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const { value, setValue, isDirty } = useTrackedValue(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const inputField = isEditing ? (
    <input
      ref={inputRef}
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
        onChange?.(e.target.value);
      }}
      onBlur={() => setIsEditing(false)}
      onKeyDown={(e) => e.key === "Enter" && setIsEditing(false)}
      className="h-10 w-full border-none bg-accent px-2 py-0 text-center outline-none"
    />
  ) : (
    <Button
      className={`w-full justify-center ${isDirty ? "text-primary" : ""}`}
      variant="ghost"
      onClick={() => setIsEditing(true)}
    >
      {value || "Click to edit"}
      <PencilIcon />
    </Button>
  );

  return (
    <Card>
      <CardTitle className="text-center">Name</CardTitle>
      <div className="flex h-10 items-center">{inputField}</div>
    </Card>
  );
}

export { EditNameCard };
