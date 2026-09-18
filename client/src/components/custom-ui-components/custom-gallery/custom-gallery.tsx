"use client";

import { useTexts } from "@/context/locale-context";

import React, { useCallback, useEffect, useState } from "react";
import { StrapiImage } from "@/components/StrapiImage";
import { ImageProps } from "@/types";
import CustomIconButton from "@/components/custom-ui-components/custom-icon-button/custom-icon-button";
import CustomDotButton from "@/components/custom-ui-components/custom-dot-button/custom-dot-button";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

const SLIDE_INTERVAL_MS = 5000;

// Above this many images the dots stop working as a control: the row is wider than the
// frame on a phone, and the tap targets around the dots start overlapping. A gallery
// that large shows its position as a counter instead.
const MAX_DOTS = 10;

interface CustomGalleryProps {
  images: ImageProps[];
  autoplay?: boolean;
  slideIntervalMs?: number;
  /** The dots (or the counter that replaces them above MAX_DOTS images). */
  showPager?: boolean;
}

const CustomGallery: React.FC<CustomGalleryProps> = ({
  images,
  autoplay = true,
  slideIntervalMs = SLIDE_INTERVAL_MS,
  showPager = true,
}) => {
  const { GALLERY_PREV_IMAGE_ARIA, GALLERY_NEXT_IMAGE_ARIA, GALLERY_DOT_IMAGE_ARIA, GALLERY_PAUSE_ARIA, GALLERY_PLAY_ARIA, GALLERY_POSITION_LABEL, GALLERY_POSITION_ARIA } = useTexts();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  // Which slides may load their image. Every slide sits in the viewport at once - only
  // opacity hides the inactive ones - so the browser's own lazy loading would still pull
  // all of them the moment the gallery scrolls into view.
  const [loadedSlides, setLoadedSlides] = useState<Set<number>>(() => new Set([0]));
  const count = images?.length ?? 0;

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

  // The current slide and its two neighbours, so the crossfade always has its target
  // ready. Slides stay loaded once reached - stepping back through the gallery should
  // not re-download what was already shown.
  useEffect(() => {
    if (count === 0) return;
    const neighbours = [currentIndex, (currentIndex + 1) % count, (currentIndex - 1 + count) % count];
    setLoadedSlides((prev) => {
      if (neighbours.every((idx) => prev.has(idx))) return prev;
      const next = new Set(prev);
      neighbours.forEach((idx) => next.add(idx));
      return next;
    });
  }, [currentIndex, count]);

  if (count === 0) return null;

  return (
    <>
      <div className="gallery__background">
        {images.map((img, idx) => (
          <div
            key={img.id ?? idx}
            className={`gallery__slide${idx === currentIndex ? " gallery__slide--active" : ""}`}
          >
            {loadedSlides.has(idx) && (
              <StrapiImage
                src={img.url}
                alt={img.alternativeText || ""}
                className="gallery__background-image"
                width={1920}
                height={1080}
                loading={idx === 0 ? "eager" : "lazy"}
              />
            )}
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
          {(showPager || autoplay) && (
            <div className="gallery__dots">
              {showPager &&
                (count <= MAX_DOTS ? (
                  images.map((_, idx) => (
                    <CustomDotButton
                      key={idx}
                      active={idx === currentIndex}
                      onClick={() => setCurrentIndex(idx)}
                      ariaLabel={GALLERY_DOT_IMAGE_ARIA(idx)}
                    />
                  ))
                ) : (
                  <span
                    className="gallery__counter"
                    role="status"
                    aria-live="polite"
                    aria-label={GALLERY_POSITION_ARIA(currentIndex + 1, count)}
                  >
                    {GALLERY_POSITION_LABEL(currentIndex + 1, count)}
                  </span>
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
          )}
        </>
      )}
    </>
  );
};

export default CustomGallery;
