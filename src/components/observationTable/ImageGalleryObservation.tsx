import { useRef } from "react";
import ImageGallery from "react-image-gallery";
import type { GalleryItem, ImageGalleryRef } from "react-image-gallery";

import "react-image-gallery/styles/image-gallery.css";
import { Card } from "@/components/ui/Card";

type ImageGalleryObservationProps = {
  image_url?: string;
};
const ImageGalleryObservation = ({ image_url }: ImageGalleryObservationProps) => {
  const galleryRef = useRef<ImageGalleryRef>(null);
  const images: GalleryItem[] = [
    {
      original: image_url ?? "",
      thumbnail: image_url ?? "",
    },
    {
      original: "https://picsum.photos/id/1015/1000/600/",
      thumbnail: "https://picsum.photos/id/1015/250/150/",
    },
    {
      original: "https://picsum.photos/id/1019/1000/600/",
      thumbnail: "https://picsum.photos/id/1019/250/150/",
    },
  ];
  return (
    <div className="mx-4 my-4">
      <Card className="h-full w-full">
        <ImageGallery
          ref={galleryRef}
          items={images}
          showPlayButton={false}
          showThumbnails={false}
          showBullets
        />
      </Card>
    </div>
  );
};

export { ImageGalleryObservation };
