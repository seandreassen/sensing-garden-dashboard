import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";

import { HubDropdown } from "@/components/landingPage/HubDropdown";
import { Logo } from "@/components/landingPage/Logo";
import { Button } from "@/components/ui/Button";

function Header() {
  return (
    <nav className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur-lg">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link className="flex items-center gap-2" to="/">
              <Logo />
            </Link>
          </div>
          <div>
            <span>Welcome to the Sensing City Lab</span>
          </div>
          <div className="hidden items-center gap-4 md:flex">
            <HubDropdown />
            <Button variant="outline" size="sm">
              Sign In
            </Button>
          </div>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6 text-zinc-400" />
          </Button>
        </div>
      </div>
    </nav>
  );
}

export { Header };
