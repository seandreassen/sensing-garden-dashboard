import { useState } from "react";

function useTrackedValue(initialValue: string) {
  const [value, setValue] = useState(initialValue);
  const isDirty = value !== initialValue;
  return { value, setValue, isDirty };
}

export { useTrackedValue };
