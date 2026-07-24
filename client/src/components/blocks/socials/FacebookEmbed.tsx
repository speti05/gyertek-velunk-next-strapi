"use client";

import { useEffect } from "react";
import { SOCIALS_FACEBOOK_LABEL } from "@/utils/texts";
import { SocialBoxTitle } from "@/components/blocks/socials/SocialBoxTitle";
import { SocialEmbedLoader } from "@/components/blocks/socials/SocialEmbedLoader";

declare global {
  interface Window {
    FB?: { XFBML?: { parse?: (element?: HTMLElement) => void } };
  }
}

const FACEBOOK_SDK_SCRIPT_SRC = "https://connect.facebook.net/hu_HU/sdk.js#xfbml=1&version=v19.0";
const FACEBOOK_ROOT_ID = "fb-root";

export function FacebookEmbed({ url }: Readonly<{ url: string }>) {
  useEffect(() => {
    if (window.FB?.XFBML?.parse) {
      window.FB.XFBML.parse();
      return;
    }

    if (!document.getElementById(FACEBOOK_ROOT_ID)) {
      const root = document.createElement("div");
      root.id = FACEBOOK_ROOT_ID;
      document.body.prepend(root);
    }

    if (document.querySelector(`script[src="${FACEBOOK_SDK_SCRIPT_SRC}"]`)) return;

    const script = document.createElement("script");
    script.src = FACEBOOK_SDK_SCRIPT_SRC;
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div className="socials-block__item socials-block__item--facebook">
      <SocialBoxTitle url={url} iconName="facebook" label={SOCIALS_FACEBOOK_LABEL} />
      <div className="socials-block__item-content">
        <SocialEmbedLoader />
        <div
          className="fb-page"
          data-href={url}
          data-tabs="timeline"
          data-width="540"
          data-height="540"
          data-small-header="false"
          data-adapt-container-width="true"
          data-adapt-container-height="true"
          data-hide-cover="false"
          data-show-facepile="true"
        />
      </div>
    </div>
  );
}
