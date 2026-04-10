import { cn } from "@/lib/utils";

interface BadgeProps {
  className?: string;
  children: React.ReactNode;
}

function Badge({ className, children }: BadgeProps) {
  return (
    <div className={cn("rounded border px-2 py-1 text-xs tracking-wide", className)}>
      {children}
    </div>
  );
}

export { Badge };
