import { useEffect, useRef, useState } from "react";

type ScrollDirection = "up" | "down" | null;

const SCROLL_THRESHOLD = 10;
const REOPEN_THRESHOLD = 40;
const SCROLL_DELTA_THRESHOLD = 5;
const WHEEL_THRESHOLD = 5;
const HEADER_TRANSITION_MS = 300;

function useScrollDirection() {
  const [direction, setDirection] = useState<ScrollDirection>(null);
  const [scrolled, setScrolled] = useState(false);
  const lastY = useRef(0);
  const accumulatedUp = useRef(0);
  const scrolledRef = useRef(scrolled);
  const isAnimating = useRef(false);

  useEffect(() => {
    scrolledRef.current = scrolled;
  }, [scrolled]);

  useEffect(() => {
    const el = document.querySelector("main")?.parentElement;
    if (!el) {
      return;
    }

    let animationTimeout: ReturnType<typeof setTimeout> | null = null;
    lastY.current = el.scrollTop;

    let ticking = false;

    const updateScrolled = (next: boolean) => {
      if (scrolledRef.current === next) {
        return;
      }

      scrolledRef.current = next;
      setScrolled(next);
      isAnimating.current = true;

      if (animationTimeout) {
        clearTimeout(animationTimeout);
      }

      animationTimeout = setTimeout(() => {
        isAnimating.current = false;
        accumulatedUp.current = 0;
        lastY.current = el.scrollTop;
      }, HEADER_TRANSITION_MS);
    };

    const onScroll = () => {
      if (ticking) {
        return;
      }
      ticking = true;

      requestAnimationFrame(() => {
        if (isAnimating.current) {
          ticking = false;
          return;
        }

        const y = el.scrollTop;
        const diff = y - lastY.current;

        if (Math.abs(diff) > SCROLL_DELTA_THRESHOLD) {
          setDirection(diff > 0 ? "down" : "up");
        }

        if (diff > 0) {
          accumulatedUp.current = 0;
          if (y > SCROLL_THRESHOLD) {
            updateScrolled(true);
          }
        } else if (diff < 0) {
          accumulatedUp.current += Math.abs(diff);

          if (y <= SCROLL_THRESHOLD || accumulatedUp.current >= REOPEN_THRESHOLD) {
            accumulatedUp.current = 0;
            updateScrolled(false);
          }
        }

        lastY.current = y;
        ticking = false;
      });
    };

    const onWheel = (event: WheelEvent) => {
      if (isAnimating.current) {
        return;
      }

      const scrollingUp = event.deltaY < -WHEEL_THRESHOLD;
      const scrollingDown = event.deltaY > WHEEL_THRESHOLD;

      if (scrollingDown) {
        accumulatedUp.current = 0;
        return;
      }

      if (!scrollingUp) {
        return;
      }

      const canScroll = el.scrollHeight > el.clientHeight;
      const nearTop = el.scrollTop <= SCROLL_THRESHOLD;
      if (canScroll && !nearTop) {
        return;
      }

      setDirection("up");
      if (!scrolledRef.current) {
        return;
      }

      accumulatedUp.current += Math.abs(event.deltaY);
      if (accumulatedUp.current >= REOPEN_THRESHOLD) {
        accumulatedUp.current = 0;
        updateScrolled(false);
      }
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("wheel", onWheel, { passive: true });

    return () => {
      if (animationTimeout) {
        clearTimeout(animationTimeout);
      }
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("wheel", onWheel);
    };
  }, []);

  return { direction, scrolled };
}

export { useScrollDirection };
