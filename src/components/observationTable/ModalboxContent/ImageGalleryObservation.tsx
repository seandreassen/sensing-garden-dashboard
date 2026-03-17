import { useRef } from "react";
import ImageGallery from "react-image-gallery";
import type { GalleryItem, ImageGalleryRef } from "react-image-gallery";

import "react-image-gallery/styles/image-gallery.css";

/**
 * Image gallery for displaying photos tied to an observation.
 * Built with `react-image-gallery`.
 *
 * @status Incomplete — currently hardcoded with two placeholder images from picsum.photos.
 * Only the first image slot uses `image_url` from the observation.
 *
 * @todo Replace placeholder images with actual observation images when multiple image
 * URLs are available in the {@link Observation} object.
 * @todo Pass `image_url` array instead of a single string once API supports it.
 *
 * @param image_url - URL of the observation image. Falls back to an empty string if undefined.
 */
type ImageGalleryObservationProps = {
  image_url?: string;
};
const ImageGalleryObservation = ({ image_url }: ImageGalleryObservationProps) => {
  const galleryRef = useRef<ImageGalleryRef>(null);
  const images: GalleryItem[] = [
    {
      original: image_url ?? "",
      thumbnail: image_url ?? "",
      originalAlt: "Empty image",
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
    <div className="mx-auto my-auto sm:w-6/7">
      <ImageGallery ref={galleryRef} items={images} showPlayButton={false} showBullets />
    </div>
  );
};

export { ImageGalleryObservation };
