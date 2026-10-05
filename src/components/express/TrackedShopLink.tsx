"use client";

import { MouseEvent, ReactNode } from "react";
import { getAttribution, trackMarketingEvent } from "@/features/marketing/MarketingScripts";

export default function TrackedShopLink({ href, placement, className, children }: {
  href: string;
  placement: string;
  className?: string;
  children: ReactNode;
}) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    trackMarketingEvent("express_checkout", { product: "KX-001", placement });

    event.preventDefault();
    const attribution = getAttribution();
    const url = new URL(href);

    url.searchParams.set("utm_source", attribution?.utm_source || "kyruma_web");
    url.searchParams.set("utm_medium", attribution?.utm_medium || "website");
    url.searchParams.set("utm_campaign", attribution?.utm_campaign || "instagram_reset");
    url.searchParams.set("utm_content", placement);

    window.location.assign(url.toString());
  }

  return <a href={href} onClick={handleClick} className={className}>{children}</a>;
}
