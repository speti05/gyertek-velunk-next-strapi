"use client";

import React, { useCallback, useEffect, useState } from "react";
import { StrapiImage } from "@/components/StrapiImage";
import { ImageProps } from "@/types";
import CustomIconButton from "@/components/custom-ui-components/custom-icon-button/custom-icon-button";
import CustomDotButton from "@/components/custom-ui-components/custom-dot-button/custom-dot-button";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import {
  GALLERY_PREV_IMAGE_ARIA,
  GALLERY_NEXT_IMAGE_ARIA,
  GALLERY_DOT_IMAGE_ARIA,
  GALLERY_PAUSE_ARIA,
  GALLERY_PLAY_ARIA,
} from "@/utils/texts";

const SLIDE_INTERVAL_MS = 5000;

interface CustomGalleryProps {
  images: ImageProps[];
  autoplay?: boolean;
  slideIntervalMs?: number;
}

const CustomGallery: React.FC<CustomGalleryProps> = ({
  images,
  autoplay = true,
  slideIntervalMs = SLIDE_INTERVAL_MS,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = images.length;

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % count);
  }, [count]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + count) % count);
  }, [count]);

  useEffect(() => {
    if (!autoplay || count <= 1 || paused) return;
    const timer = setInterval(goNext, slideIntervalMs);
    return () => clearInterval(timer);
  }, [goNext, count, paused, autoplay, slideIntervalMs]);

  return (
    <>
      <div className="gallery__background">
        {images.map((img, idx) => (
          <div
            key={img.id ?? idx}
            className={`gallery__slide${idx === currentIndex ? " gallery__slide--active" : ""}`}
          >
            <StrapiImage
              src={img.url}
              alt={img.alternativeText || ""}
              className="gallery__background-image"
              width={1920}
              height={1080}
            />
          </div>
        ))}
        <div className="gallery__background__overlay"></div>
      </div>

      {count > 1 && (
        <>
          <div className="gallery__nav gallery__nav--prev">
            <CustomIconButton type="stepper" onClick={goPrev} aria-label={GALLERY_PREV_IMAGE_ARIA}>
              <ArrowBackIosNewIcon />
            </CustomIconButton>
          </div>
          <div className="gallery__nav gallery__nav--next">
            <CustomIconButton type="stepper" onClick={goNext} aria-label={GALLERY_NEXT_IMAGE_ARIA}>
              <ArrowForwardIosIcon />
            </CustomIconButton>
          </div>
          <div className="gallery__dots">
            {images.map((_, idx) => (
              <CustomDotButton
                key={idx}
                active={idx === currentIndex}
                onClick={() => setCurrentIndex(idx)}
                ariaLabel={GALLERY_DOT_IMAGE_ARIA(idx)}
              />
            ))}
            {autoplay && (
              <CustomIconButton
                type="stepper"
                onClick={() => setPaused((p) => !p)}
                aria-label={paused ? GALLERY_PLAY_ARIA : GALLERY_PAUSE_ARIA}
              >
                {paused ? <PlayArrowIcon /> : <PauseIcon />}
              </CustomIconButton>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default CustomGallery;
