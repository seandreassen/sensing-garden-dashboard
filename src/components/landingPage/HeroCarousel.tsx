import { useEffect, useRef, useState } from "react";

import img1 from "@/assets/blueSky.png";
import img2 from "@/assets/garden.png";
import img3 from "@/assets/rooftopGarden.png";
import img4 from "@/assets/rooftopSkyline.png";

const images = [img1, img2, img3, img4];
const INTERVAL_MS = 5000;
const PARALLAX_FACTOR = 0.3;

function findScrollParent(el: HTMLElement | null): HTMLElement | Window {
  let node = el?.parentElement ?? null;
  while (node) {
    const { overflowY } = window.getComputedStyle(node);
    if (overflowY === "scroll" || overflowY === "auto") {
      return node;
    }
    node = node.parentElement;
  }
  return window;
}

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const scrollEl = findScrollParent(containerRef.current);
    const handleScroll = () => {
      const scrollTop = scrollEl instanceof Window ? scrollEl.scrollY : scrollEl.scrollTop;
      setOffsetY(scrollTop * PARALLAX_FACTOR);
    };
    scrollEl.addEventListener("scroll", handleScroll, { passive: true });
    return () => scrollEl.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div ref={containerRef} className="relative h-72 w-full overflow-hidden sm:h-96">
      {images.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          className="absolute inset-x-0 w-full object-cover transition-opacity duration-1000"
          style={{
            opacity: i === current ? 1 : 0,
            top: "-5%",
            height: "110%",
            transform: `translateY(${offsetY}px)`,
          }}
          aria-hidden="true"
        />
      ))}
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute right-0 bottom-0 left-0 h-32 bg-linear-to-b from-transparent to-background" />
      <div className="absolute inset-0 flex flex-col justify-center px-8 sm:px-16">
        <h1 className="text-4xl font-black tracking-tight text-white uppercase sm:text-6xl">
          Sensing Garden
        </h1>
        <p className="mt-3 max-w-xl text-base text-white/80 sm:text-lg">
          Global monitoring network for biodiversity research and urban ecology. Select a deployment
          to explore temporal patterns and species composition.
        </p>
      </div>
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="h-2 w-2 rounded-full transition-colors"
            style={{
              background: i === current ? "white" : "rgba(255,255,255,0.4)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
