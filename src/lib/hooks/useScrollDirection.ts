import { useEffect, useRef, useState } from "react";

type ScrollDirection = "up" | "down" | null;

const LOCK_MS = 400;

function useScrollDirection() {
  const [direction, setDirection] = useState<ScrollDirection>(null);
  const [scrolled, setScrolled] = useState(false);
  const lastY = useRef(0);
  const lockedUntil = useRef(0);

  useEffect(() => {
    const el = document.querySelector("main")?.parentElement;
    if (!el) {
      return;
    }

    let ticking = false;

    const onScroll = () => {
      if (ticking) {
        return;
      }
      ticking = true;

      requestAnimationFrame(() => {
        const y = el.scrollTop;
        const now = performance.now();

        if (now > lockedUntil.current) {
          setScrolled((prev) => {
            const next = y > 10;
            if (next !== prev) {
              lockedUntil.current = now + LOCK_MS;
            }
            return next;
          });
        }

        const diff = y - lastY.current;
        if (Math.abs(diff) > 5) {
          setDirection(diff > 0 ? "down" : "up");
          lastY.current = y;
        }

        ticking = false;
      });
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return { direction, scrolled };
}

export { useScrollDirection };
