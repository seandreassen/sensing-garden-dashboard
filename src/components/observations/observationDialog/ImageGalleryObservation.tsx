import { MaximizeIcon, MinimizeIcon } from "lucide-react";
import { useRef, useEffect, useState, useCallback } from "react";

import { Button } from "@/components/ui/Button";
import { buttonVariants } from "@/components/ui/button-variants";
import { Card, CardContent } from "@/components/ui/Card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/Carousel";
import type { Observation } from "@/lib/types/api";
import { cn } from "@/lib/utils";
/**
 * Image gallery for displaying photos tied to an observation.
 * Built with shadcn `Carousel`.
 *
 * @todo Replace placeholder images with actual observation images when multiple image
 * URLs are available in the {@link Observation} object.
 * @todo Pass `image_url` array instead of a single string when track_id support is added..
 */
function ImageGalleryObservation({ observationData }: { observationData?: Observation }) {
  const [mainApi, setMainApi] = useState<CarouselApi>();
  const [thumbApi, setThumbApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState<number>(0);
  const [count, setCount] = useState<number>(0);

  const onSelect = useCallback(() => {
    if (!mainApi || !thumbApi) {
      return;
    }
    const index = mainApi.selectedScrollSnap();
    setCurrent(index);
    thumbApi.scrollTo(index);
  }, [mainApi, thumbApi]);

  useEffect(() => {
    if (!mainApi) {
      return;
    }
    setCount(mainApi.scrollSnapList().length);

    mainApi.on("select", onSelect).on("reInit", onSelect);
    return () => {
      mainApi.off("select", onSelect).off("reInit", onSelect);
    };
  }, [mainApi, onSelect]);
  const goTo = useCallback(
    (index: number) => {
      if (!mainApi || !thumbApi) {
        return;
      }
      mainApi.scrollTo(index);
    },
    [mainApi, thumbApi],
  );

  //mock data for 6 last pictures.
  const images = [
    {
      src: observationData?.image_url ?? "",
      alt: "Observation image",
    },
    {
      src: "https://picsum.photos/id/1015/1000/600/",
      alt: "Placeholder image 1",
    },
    {
      src: "https://picsum.photos/id/1019/1000/600/",
      alt: "Placeholder image 2",
    },

    {
      src: "https://picsum.photos/id/1019/1000/600/",
      alt: "Placeholder image 2",
    },
    {
      src: "https://picsum.photos/id/1019/1000/600/",
      alt: "Placeholder image 2",
    },
    {
      src: "https://picsum.photos/id/1019/1000/600/",
      alt: "Placeholder image 2",
    },
    {
      src: "https://picsum.photos/id/1019/1000/600/",
      alt: "Placeholder image 2",
    },
  ];
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      carouselRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);
  return (
    <div ref={carouselRef} className="mx-auto max-w-sm overflow-hidden sm:max-w-md">
      <Card className="relative flex">
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-4 right-4 z-10 cursor-pointer"
          onClick={toggleFullscreen}
        >
          {isFullscreen ? (
            <MinimizeIcon className={cn("size-8")} />
          ) : (
            <MaximizeIcon className="size-6" />
          )}
        </Button>

        <CardContent className="flex flex-col items-center justify-center">
          <Carousel
            opts={{ watchDrag: false, duration: 25 }}
            setApi={setMainApi}
            className={cn(isFullscreen ? "sm:max-w-[60vw]" : "max-w-xs")}
          >
            <CarouselContent>
              {images.map((image, index) => (
                <CarouselItem
                  key={index}
                  className={cn(
                    "flex items-center justify-center pb-3",
                    isFullscreen ? "max-h-[50vh] sm:max-h-[70vh]" : "",
                  )}
                >
                  {/* oxlint-disable jsx-max-depth */}
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="max-h-full w-full object-contain"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious
              className={cn(
                buttonVariants({ variant: "outline", size: isFullscreen ? "icon-xl" : "icon-lg" }),
                isFullscreen
                  ? "max-md:top-auto max-sm:left-0 max-sm:-translate-y-1 md:-left-24"
                  : "max-md:top-auto max-md:left-0 max-md:-translate-y-1",
              )}
            />
            <CarouselNext
              className={cn(
                buttonVariants({ variant: "outline", size: isFullscreen ? "icon-xl" : "icon-lg" }),

                isFullscreen
                  ? "-right-24 max-sm:top-auto max-sm:right-0 max-sm:-translate-y-1"
                  : "max-md:top-auto max-md:right-0 max-md:-translate-y-1",
              )}
            />
          </Carousel>
          <div
            className={cn(
              "top-auto text-sm text-nowrap text-muted-foreground",
              isFullscreen ? "flex text-center sm:text-lg" : "flex",
            )}
          >
            Image {current + 1} of {count}
          </div>
        </CardContent>
      </Card>

      {/* Thumbnail carousel */}
      <Carousel
        setApi={setThumbApi}
        opts={{ watchDrag: false, duration: 20 }}
        className={cn(isFullscreen ? "flex-none py-6" : "flex-none py-2")}
      >
        <CarouselContent className="ml-0 gap-2">
          {images.map((image, index) => (
            <CarouselItem
              key={index}
              className={cn(
                buttonVariants({ variant: "ghost", size: "none" }),
                "mx-auto cursor-pointer p-1",
                isFullscreen ? "basis-1/5 sm:basis-1/8" : "basis-1/4",
              )}
              onClick={() => goTo(index)}
            >
              <div
                className={cn(
                  "aspect-video h-full overflow-hidden rounded-sm transition-opacity",
                  index === current ? "opacity-100 ring-2 ring-primary" : "opacity-50",
                )}
              >
                <img
                  src={image.src}
                  alt={`Thumbnail ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}

export { ImageGalleryObservation };
