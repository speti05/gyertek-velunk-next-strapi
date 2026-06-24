"use client";

import { useState, useEffect, useCallback } from "react";
import { StrapiImage } from "../StrapiImage";
import { HeroWithTextProps } from "@/types";
import { HeroTextAndButtons } from "../HeroTextAndButtons";
import CustomIconButton from "@/components/custom-ui-components/custom-icon-button/custom-icon-button";
import CustomDotButton from "@/components/custom-ui-components/custom-dot-button/custom-dot-button";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import {
  HERO_PREV_IMAGE_ARIA,
  HERO_NEXT_IMAGE_ARIA,
  HERO_DOT_IMAGE_ARIA,
  HERO_PAUSE_ARIA,
  HERO_PLAY_ARIA,
} from "@/utils/texts";

const SLIDE_INTERVAL_MS = 5000;

export function HeroWithTextBlock({
  headline,
  images,
  link,
  welcomeText,
}: Readonly<HeroWithTextProps>) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = images?.length ?? 0;

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % count);
  }, [count]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + count) % count);
  }, [count]);

  useEffect(() => {
    if (count <= 1 || paused) return;
    const timer = setInterval(goNext, SLIDE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [goNext, count, paused]);

  const imageList = images ?? [];

  return (
    <section className="hero hero__with-text">
      <div className="hero__background">
        {imageList.map((img, idx) => (
          <div
            key={img.id ?? idx}
            className={`hero__slide${idx === currentIndex ? " hero__slide--active" : ""}`}
          >
            <StrapiImage
              src={img.url}
              alt={img.alternativeText || ""}
              className="hero__background-image"
              width={1920}
              height={1080}
            />
          </div>
        ))}
        <div className="hero__background__overlay"></div>
      </div>

      <div className="hero__container">
        <div className="hero__text_and_button_container">
          <HeroTextAndButtons
            headline={headline}
            linkButtons={link}
            welcomeText={welcomeText}
          />
        </div>
      </div>

      {count > 1 && (
        <>
          <div className="hero__nav hero__nav--prev">
            <CustomIconButton type="stepper" onClick={goPrev} aria-label={HERO_PREV_IMAGE_ARIA}>
              <ArrowBackIosNewIcon />
            </CustomIconButton>
          </div>
          <div className="hero__nav hero__nav--next">
            <CustomIconButton type="stepper" onClick={goNext} aria-label={HERO_NEXT_IMAGE_ARIA}>
              <ArrowForwardIosIcon />
            </CustomIconButton>
          </div>
          <div className="hero__dots">
            {imageList.map((_, idx) => (
              <CustomDotButton
                key={idx}
                active={idx === currentIndex}
                onClick={() => setCurrentIndex(idx)}
                ariaLabel={HERO_DOT_IMAGE_ARIA(idx)}
              />
            ))}
            <CustomIconButton
              type="stepper"
              onClick={() => setPaused((p) => !p)}
              aria-label={paused ? HERO_PLAY_ARIA : HERO_PAUSE_ARIA}
            >
              {paused ? <PlayArrowIcon /> : <PauseIcon />}
            </CustomIconButton>
          </div>
        </>
      )}
    </section>
  );
}
