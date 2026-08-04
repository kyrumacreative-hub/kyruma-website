"use client";

import { GoogleTagManager } from "@next/third-parties/google";
import Script from "next/script";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export const MARKETING_CONSENT_KEY = "kyruma-analytics-consent";

export type MarketingEvent =
  | "hero_cta" | "contact" | "lead" | "contact_submitted" | "meeting_scheduled"
  | "start_discovery" | "conversation_started" | "conversation_completed"
  | "complete_discovery" | "discovery_opened" | "resume_discovery" | "exit_before_finish"
  | "scroll_50" | "scroll_90" | "view_content";

type Attribution = Record<"utm_source" | "utm_medium" | "utm_campaign" | "referrer" | "landing_page", string>;

declare global {
  interface Window { fbq?: (...args: unknown[]) => void; _fbq?: (...args: unknown[]) => void; }
}

export function hasMarketingConsent() {
  return typeof window !== "undefined" && window.localStorage.getItem(MARKETING_CONSENT_KEY) === "accepted";
}

export function getAttribution(): Attribution | undefined {
  if (typeof window === "undefined" || !hasMarketingConsent()) return undefined;
  const raw = window.localStorage.getItem("kyruma-attribution");
  try { return raw ? JSON.parse(raw) as Attribution : undefined; } catch { return undefined; }
}

export function trackMarketingEvent(event: MarketingEvent, payload: Record<string, unknown> = {}) {
  if (!hasMarketingConsent()) return;
  const attribution = getAttribution();
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event: `kyruma_${event}`, ...payload, ...attribution });

  const metaEvents: Partial<Record<MarketingEvent, { name: string; custom?: boolean }>> = {
    contact: { name: "Contact" },
    lead: { name: "Lead" },
    meeting_scheduled: { name: "ScheduleMeeting", custom: true },
    start_discovery: { name: "StartDiscovery", custom: true },
    complete_discovery: { name: "CompleteDiscovery", custom: true },
    view_content: { name: "ViewContent" },
  };
  const metaEvent = metaEvents[event];
  if (metaEvent && window.fbq) window.fbq(metaEvent.custom ? "trackCustom" : "track", metaEvent.name, payload);
}

function persistAttribution() {
  const params = new URLSearchParams(window.location.search);
  const source = params.get("utm_source") ?? (document.referrer ? "referral" : "direct");
  const medium = params.get("utm_medium") ?? (document.referrer ? "referral" : "none");
  const attribution: Attribution = {
    utm_source: source,
    utm_medium: medium,
    utm_campaign: params.get("utm_campaign") ?? "",
    referrer: document.referrer,
    landing_page: `${window.location.pathname}${window.location.search}`,
  };
  window.localStorage.setItem("kyruma-attribution", JSON.stringify(attribution));
}

export default function MarketingScripts() {
  const pathname = usePathname();
  const sentScroll = useRef(new Set<number>());
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

  useEffect(() => {
    persistAttribution();
    trackMarketingEvent("view_content", { page_path: pathname });
    if (pathname === "/workspace") trackMarketingEvent("discovery_opened", { page_path: pathname });
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => {
      const progress = ((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight) * 100;
      [50, 90].forEach((threshold) => {
        if (progress >= threshold && !sentScroll.current.has(threshold)) {
          sentScroll.current.add(threshold);
          trackMarketingEvent(threshold === 50 ? "scroll_50" : "scroll_90", { page_path: pathname });
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  return <>
    {gtmId && <GoogleTagManager gtmId={gtmId} />}
    {pixelId && <Script id="kyruma-meta-pixel" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${pixelId}');fbq('track','PageView');` }} />}
    {clarityId && <Script id="kyruma-clarity" strategy="lazyOnload" dangerouslySetInnerHTML={{ __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)})(window,document,"clarity","script","${clarityId}");` }} />}
  </>;
}
