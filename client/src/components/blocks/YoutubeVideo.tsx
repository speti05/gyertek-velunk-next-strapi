import { YoutubeVideoProps } from "@/types";
import { YOUTUBE_VIDEO_FALLBACK_TITLE } from "@/utils/texts";

function getYoutubeVideoId(url: string): string | null {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }

  if (parsed.hostname === "youtu.be") {
    return parsed.pathname.slice(1) || null;
  }

  const shortsMatch = parsed.pathname.match(/^\/shorts\/([^/]+)/);
  if (shortsMatch) return shortsMatch[1];

  const embedMatch = parsed.pathname.match(/^\/embed\/([^/]+)/);
  if (embedMatch) return embedMatch[1];

  return parsed.searchParams.get("v");
}

export function YoutubeVideo({
  title,
  videoUrl,
  description,
  aspectRatio = "16:9",
  startTime,
  privacyMode = true,
}: Readonly<YoutubeVideoProps>) {
  const videoId = getYoutubeVideoId(videoUrl);
  if (!videoId) return null;

  const domain = privacyMode ? "www.youtube-nocookie.com" : "www.youtube.com";
  const params = new URLSearchParams();
  if (startTime) params.set("start", String(startTime));
  const query = params.toString();
  const embedUrl = `https://${domain}/embed/${videoId}${query ? `?${query}` : ""}`;

  return (
    <div
      className={`article-youtube-video article-youtube-video--${aspectRatio === "9:16" ? "portrait" : "landscape"}`}
    >
      {title && <h3 className="article-youtube-video__title">{title}</h3>}
      {description && <p className="article-youtube-video__description">{description}</p>}
      <div className="article-youtube-video__frame">
        <iframe
          src={embedUrl}
          title={title || YOUTUBE_VIDEO_FALLBACK_TITLE}
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    </div>
  );
}
