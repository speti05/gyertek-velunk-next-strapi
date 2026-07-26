"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { SOCIALS_EMBED_LOAD_ERROR } from "@/utils/texts";
import CustomLink from "@/components/custom-ui-components/custom-link/custom-link";
import { CustomAlertMessage } from "@/components/custom-ui-components/custom-alert/custom-alert-message";
import { SocialEmbedLoader } from "@/components/blocks/socials/SocialEmbedLoader";
import { useSocialEmbedTimeout } from "@/components/blocks/socials/useSocialEmbedTimeout";

export interface YoutubeVideoItem {
  id: string;
  title: string;
  thumbnailUrl: string;
}

export function YoutubeVideoGrid({ videos }: Readonly<{ videos: YoutubeVideoItem[] }>) {
  const { hasFailed, markLoaded } = useSocialEmbedTimeout();
  const [loadedCount, setLoadedCount] = useState(0);
  const allLoaded = loadedCount >= videos.length;

  const handleThumbnailSettled = useCallback(() => {
    setLoadedCount((count) => {
      const next = count + 1;
      if (next >= videos.length) markLoaded();
      return next;
    });
  }, [videos.length, markLoaded]);

  if (hasFailed) return <CustomAlertMessage warningMessage={SOCIALS_EMBED_LOAD_ERROR} />;

  return (
    <>
      {!allLoaded && <SocialEmbedLoader />}
      <div className="socials-block__videos" data-loaded={allLoaded}>
        {videos.map((video) => (
          <CustomLink
            key={video.id}
            href={`https://www.youtube.com/watch?v=${video.id}`}
            target="_blank"
            rel="noopener noreferrer"
            underline="none"
            className="socials-block__video"
          >
            <Image
              src={video.thumbnailUrl}
              alt={video.title}
              width={320}
              height={180}
              onLoad={handleThumbnailSettled}
              onError={handleThumbnailSettled}
            />
            <span className="socials-block__video-title">{video.title}</span>
          </CustomLink>
        ))}
      </div>
    </>
  );
}
