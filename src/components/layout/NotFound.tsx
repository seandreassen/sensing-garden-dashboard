import { Link } from "@tanstack/react-router";
import { ChevronLeftIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button-variants";

function NotFound() {
  return (
    <main className="flex h-screen w-screen flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold">404 - Page Not Found</h1>
      <Link to="/" className={buttonVariants({ variant: "link" })}>
        <ChevronLeftIcon />
        Back to home page
      </Link>
    </main>
  );
}

export { NotFound };
