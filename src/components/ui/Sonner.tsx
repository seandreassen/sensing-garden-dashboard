"use client";

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4 text-success" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4 text-warn" />,
        error: <OctagonXIcon color="red" className="size-4 text-destructive" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--color-popover)",
          "--normal-text": "var(--foreground)",
          "--normal-border": "var(--color-muted-foreground)",
          "--error-bg": "var(--color-popover)",
          "--error-text": "var(--foreground)",
          "--error-border": "var(--destructive)",
          "--warning-bg": "var(--color-popover)",
          "--warning-text": "var(--foreground)",
          "--warning-border": "var(--caution)",
          "--success-bg": "var(--color-popover)",
          "--success-text": "var(--foreground)",
          "--success-border": "green",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast",
          error: "!border-red-500",
          warning: "!border-orange-500",
          success: "!border-green-500",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
