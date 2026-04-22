import { PencilIcon } from "lucide-react";
import { useRef, useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useDirtyValueTracker } from "@/lib/hooks/useDirtyValueTracker";

function EditNameCard({
  initialValue = "",
  onChange,
}: {
  initialValue?: string;
  onChange?: (value: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const { value, setValue, isDirty } = useDirtyValueTracker(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const inputField = isEditing ? (
    <Input
      ref={inputRef}
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
        onChange?.(e.target.value);
      }}
      onBlur={() => {
        setIsEditing(false);
        setValue(value);
      }}
      onKeyDown={(e) => e.key === "Enter" && setIsEditing(false)}
      className="w-full border-none bg-accent px-2 py-0 text-center outline-none"
    />
  ) : (
    <Button
      className={`w-full justify-center ${isDirty ? "text-primary" : ""}`}
      variant="outline"
      onClick={() => setIsEditing(true)}
    >
      {value || initialValue}
      <PencilIcon />
    </Button>
  );

  return (
    <Card>
      <CardTitle className={`text-center ${isDirty ? "text-primary" : ""}`}>Name</CardTitle>
      <div className="flex h-10 items-center px-3">{inputField}</div>
    </Card>
  );
}

export { EditNameCard };
