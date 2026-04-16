import { useState } from "react";

function useDirtyValueTracker(initialValue: string) {
  const [value, setValue] = useState(initialValue);
  const isDirty = value !== initialValue;
  return { value, setValue, isDirty };
}

export { useDirtyValueTracker };
