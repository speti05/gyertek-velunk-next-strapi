import Image from "next/image";
import { FOOTER_YOUTUBE_ARIA, SOCIALS_YOUTUBE_LABEL } from "@/utils/texts";
import CustomLink from "@/components/custom-ui-components/custom-link/custom-link";
import CustomIcon from "@/components/custom-ui-components/custom-icon/custom-icon";
import { SocialBoxTitle } from "@/components/blocks/socials/SocialBoxTitle";

const YOUTUBE_CHANNELS_URL = "https://www.googleapis.com/youtube/v3/channels";
const YOUTUBE_PLAYLIST_ITEMS_URL = "https://www.googleapis.com/youtube/v3/playlistItems";
const CHANNEL_ID_CACHE_SECONDS = 60 * 60 * 24;
const LATEST_VIDEOS_CACHE_SECONDS = 60 * 60;
const LATEST_VIDEOS_COUNT = 6;

interface YoutubeVideoItem {
  id: string;
  title: string;
  thumbnailUrl: string;
}

interface YoutubeChannelsResponse {
  items?: { id?: string }[];
}

interface YoutubePlaylistItemsResponse {
  items?: {
    snippet?: {
      title?: string;
      resourceId?: { videoId?: string };
      thumbnails?: { medium?: { url?: string }; default?: { url?: string } };
    };
  }[];
}

function toUploadsPlaylistId(channelId: string): string {
  return `UU${channelId.slice(2)}`;
}

function getChannelIdFromUrl(url: string): string | null {
  const match = new URL(url).pathname.match(/\/channel\/(UC[\w-]+)/);
  return match ? match[1] : null;
}

function getLookupParamFromUrl(url: string): Record<string, string> | null {
  const { pathname } = new URL(url);
  const segment = pathname.split("/").filter(Boolean)[0];
  if (!segment) return null;
  if (segment.startsWith("@")) return { forHandle: segment };
  const legacyMatch = pathname.match(/\/(?:c|user)\/([^/]+)/);
  return legacyMatch ? { forUsername: legacyMatch[1] } : null;
}

async function resolveChannelId(url: string, apiKey: string): Promise<string | null> {
  const directChannelId = getChannelIdFromUrl(url);
  if (directChannelId) return directChannelId;

  const lookupParam = getLookupParamFromUrl(url);
  if (!lookupParam) return null;

  const params = new URLSearchParams({ part: "id", key: apiKey, ...lookupParam });

  try {
    const res = await fetch(`${YOUTUBE_CHANNELS_URL}?${params.toString()}`, {
      next: { revalidate: CHANNEL_ID_CACHE_SECONDS },
    });
    if (!res.ok) return null;
    const data: YoutubeChannelsResponse = await res.json();
    return data.items?.[0]?.id ?? null;
  } catch {
    return null;
  }
}

async function fetchLatestVideos(playlistId: string, apiKey: string): Promise<YoutubeVideoItem[]> {
  const params = new URLSearchParams({
    part: "snippet",
    playlistId,
    maxResults: String(LATEST_VIDEOS_COUNT),
    key: apiKey,
  });

  try {
    const res = await fetch(`${YOUTUBE_PLAYLIST_ITEMS_URL}?${params.toString()}`, {
      next: { revalidate: LATEST_VIDEOS_CACHE_SECONDS },
    });
    if (!res.ok) return [];
    const data: YoutubePlaylistItemsResponse = await res.json();

    return (data.items ?? []).flatMap((item) => {
      const videoId = item.snippet?.resourceId?.videoId;
      const thumbnailUrl =
        item.snippet?.thumbnails?.medium?.url ?? item.snippet?.thumbnails?.default?.url;
      if (!videoId || !thumbnailUrl) return [];
      return [{ id: videoId, title: item.snippet?.title ?? "", thumbnailUrl }];
    });
  } catch {
    return [];
  }
}

function YoutubeChannelLinkFallback({ url }: Readonly<{ url: string }>) {
  return (
    <div className="socials-block__item socials-block__item--youtube socials-block__item--link">
      <SocialBoxTitle url={url} iconName="youtube" label={SOCIALS_YOUTUBE_LABEL} />
      <div className="socials-block__item-content">
        <CustomLink
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={FOOTER_YOUTUBE_ARIA}
          underline="none"
        >
          <CustomIcon name="youtube" size="3x" />
        </CustomLink>
      </div>
    </div>
  );
}

export async function YoutubeChannelEmbed({ url }: Readonly<{ url: string }>) {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) return <YoutubeChannelLinkFallback url={url} />;

  const channelId = await resolveChannelId(url, apiKey);
  if (!channelId) return <YoutubeChannelLinkFallback url={url} />;

  const videos = await fetchLatestVideos(toUploadsPlaylistId(channelId), apiKey);
  if (!videos.length) return <YoutubeChannelLinkFallback url={url} />;

  return (
    <div className="socials-block__item socials-block__item--youtube">
      <SocialBoxTitle url={url} iconName="youtube" label={SOCIALS_YOUTUBE_LABEL} />
      <div className="socials-block__item-content">
        <div className="socials-block__videos">
          {videos.map((video) => (
            <CustomLink
              key={video.id}
              href={`https://www.youtube.com/watch?v=${video.id}`}
              target="_blank"
              rel="noopener noreferrer"
              underline="none"
              className="socials-block__video"
            >
              <Image src={video.thumbnailUrl} alt={video.title} width={320} height={180} />
              <span className="socials-block__video-title">{video.title}</span>
            </CustomLink>
          ))}
        </div>
      </div>
    </div>
  );
}
