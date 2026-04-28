export const getConfidenceClass = (confidence?: number): string => {
  if (confidence === undefined) {
    return "";
  }

  if (confidence > 0.8) {
    return "text-primary/80 border border-l-2 border-transparent bg-primary/20 *:data-[slot=progress-indicator]:bg-success";
  }

  if (confidence > 0.6) {
    return "text-caution/80 border border-l-2 border-transparent bg-caution/20 *:data-[slot=progress-indicator]:bg-caution";
  }

  if (confidence > 0.4) {
    return "text-warn/70 border border-l-2 border-transparent bg-warn/10 *:data-[slot=progress-indicator]:bg-warn";
  }

  return "text-destructive/70 border border-l-2 border-transparent bg-destructive/10 *:data-[slot=progress-indicator]:bg-destructive";
};
