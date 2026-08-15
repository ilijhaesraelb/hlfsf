import { createContext, useContext, type ReactNode } from "react";

export type PublicSettings = Record<string, string>;

/** Fallbacks used before an administrator sets a value. */
export const SETTING_FALLBACKS: PublicSettings = {
  brand_name: "High Light Source Film Studios",
  legal_name: "High Light Source Film Studios",
  short_name: "HLS",
  tagline: "Illuminating Stories. Inspiring the World.",
  copyright_statement: "High Light Source Film Studios. All Rights Reserved.",
  email_main: "info@highlightsourcefilmstudios.com",
  website_url: "https://highlightsourcefilmstudios.com",
  color_black: "#050505",
  color_gold: "#D4AF37",
  color_gold_highlight: "#FFD76A",
  color_warm_white: "#F5F2EA",
  color_graphite: "#161616",
  color_silver: "#B8B8B8",
};

const SettingsContext = createContext<PublicSettings>({});

export function SiteSettingsProvider({
  value,
  children,
}: {
  value: PublicSettings;
  children: ReactNode;
}) {
  return (
    <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
  );
}

/**
 * Reads centrally managed studio values. Never hard-code company details in a
 * page — read them through this hook so one admin change updates every screen.
 */
export function useSiteSettings() {
  const settings = useContext(SettingsContext);
  const setting = (key: string, fallback = "") =>
    settings[key]?.trim() || SETTING_FALLBACKS[key] || fallback;
  return { settings, setting };
}

export const SOCIAL_KEYS = [
  { key: "social_instagram", label: "Instagram" },
  { key: "social_facebook", label: "Facebook" },
  { key: "social_youtube", label: "YouTube" },
  { key: "social_linkedin", label: "LinkedIn" },
  { key: "social_tiktok", label: "TikTok" },
  { key: "social_x", label: "X" },
  { key: "social_imdb", label: "IMDb" },
  { key: "social_other", label: "Website" },
] as const;

/** Brand colours as CSS custom properties for the document root. */
export function brandCss(settings: PublicSettings) {
  const pick = (key: string) =>
    settings[key]?.trim() || SETTING_FALLBACKS[key] || "";
  return `:root{--background:${pick("color_black")};--gold:${pick(
    "color_gold",
  )};--gold-bright:${pick("color_gold_highlight")};--foreground:${pick(
    "color_warm_white",
  )};--graphite:${pick("color_graphite")};--card:${pick(
    "color_graphite",
  )};--silver:${pick("color_silver")};}body{background-color:${pick(
    "color_black",
  )};}`;
}
