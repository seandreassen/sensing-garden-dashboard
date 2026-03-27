import { useEffect, useRef, useState } from "react";

type ScrollDirection = "up" | "down" | null;

const LOCK_MS = 400;
const SCROLL_THRESHOLD = 10;
const WHEEL_THRESHOLD = 5;

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
            const next = y > SCROLL_THRESHOLD;
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

    const onWheel = (event: WheelEvent) => {
      const canScroll = el.scrollHeight - el.clientHeight > 0;
      const scrollingUp = event.deltaY < -WHEEL_THRESHOLD;

      if (!scrollingUp || canScroll) {
        return;
      }

      setDirection("up");
      setScrolled((prev) => {
        if (!prev) {
          return prev;
        }

        lockedUntil.current = performance.now() + LOCK_MS;
        return false;
      });
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("wheel", onWheel, { passive: true });

    return () => {
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("wheel", onWheel);
    };
  }, []);

  return { direction, scrolled };
}

export { useScrollDirection };
