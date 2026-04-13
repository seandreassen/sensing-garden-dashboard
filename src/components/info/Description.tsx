import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const COLLAPSED_MAX_HEIGHT = 96; // px

interface DescriptionProps {
  description?: string;
}

function Description({ description }: DescriptionProps) {
  const [expanded, setExpanded] = useState<boolean>(false);
  const [isTruncated, setIsTruncated] = useState<boolean>(false);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textRef.current) {
      setIsTruncated(textRef.current.scrollHeight > COLLAPSED_MAX_HEIGHT);
    }
  }, [description]);

  if (!description) {
    return <p className="text-sm text-muted-foreground">This deployment has no description</p>;
  }

  return (
    <>
      <div
        ref={textRef}
        className={cn(
          !expanded && isTruncated && "overflow-hidden",
          expanded && "max-h-64 overflow-y-auto",
        )}
        style={!expanded && isTruncated ? { maxHeight: COLLAPSED_MAX_HEIGHT } : undefined}
      >
        <p>{description}</p>
      </div>
      {isTruncated && (
        <Button
          variant="nav"
          size="none"
          className="ml-1"
          onClick={() => {
            if (expanded && textRef.current) {
              textRef.current.scrollTop = 0;
            }
            setExpanded((prev) => !prev);
          }}
        >
          {expanded ? "Show less" : "...Show more"}
        </Button>
      )}
    </>
  );
}

export { Description };
