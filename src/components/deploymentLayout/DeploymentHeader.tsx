import { Link } from "@tanstack/react-router";
import { ArrowLeftIcon } from "lucide-react";

import { Logo } from "@/components/landingPage/Logo";
import { buttonVariants } from "@/components/ui/button-variants";
import { Separator } from "@/components/ui/Separator";
import { cn } from "@/lib/utils";

function Header() {
  return (
    <div className="sticky top-0 z-50 border-b bg-card backdrop-blur-lg">
      <div className="flex items-center gap-8 px-6 py-4">
        <div className="flex items-center gap-5">
          <Link to="/">
            <Logo />
          </Link>
          <Separator orientation="vertical" />
          <div className="flex flex-col items-start leading-tight font-bold uppercase">
            <p className="text-[10px] tracking-widest text-primary">Sensing Garden</p>
            <p className="text-[8px] text-muted-foreground">Deployment Monitor</p>
          </div>
        </div>
        <Separator orientation="vertical" />
        <Link to="/" className={cn(buttonVariants({ variant: "nav", size: "none" }), "gap-1.5")}>
          <ArrowLeftIcon className="size-4" />
          Select Deployment
        </Link>
      </div>
    </div>
  );
}

export { Header };
