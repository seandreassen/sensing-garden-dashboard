export const getConfidenceClass = (confidence?: number): string => {
  if (confidence === undefined) {
    return "";
  }

  if (confidence > 0.8) {
    return "text-primary/80 border border-l-2 border-transparent bg-primary/20";
  }

  if (confidence > 0.6) {
    return "text-caution/80 border border-l-2 border-transparent bg-caution/20";
  }

  if (confidence > 0.4) {
    return "text-warn/70 border border-l-2 border-transparent bg-warn/10";
  }

  return "text-destructive/70 border border-l-2 border-transparent bg-destructive/10";
};
