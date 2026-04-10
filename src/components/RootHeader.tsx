import { Logo } from "@/components/landingPage/Logo";
import { Separator } from "@/components/ui/Separator";

function Header() {
  return (
    <div className="sticky top-0 z-50 border-b bg-card backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center gap-5 px-6 py-4">
        <Logo />
        <Separator orientation="vertical" />
        <p className="text-xs font-bold tracking-widest uppercase">Sensing Garden</p>
      </div>
    </div>
  );
}

export { Header };
