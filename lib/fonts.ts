import localFont from "next/font/local";

export const clashDisplay = localFont({
  src: [
    { path: "../public/fonts/clash-display-500.woff2", weight: "500", style: "normal" },
    { path: "../public/fonts/clash-display-600.woff2", weight: "600", style: "normal" },
    { path: "../public/fonts/clash-display-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-clash",
  display: "swap",
  fallback: ["Georgia", "serif"],
});

export const zodiak = localFont({
  src: [
    { path: "../public/fonts/zodiak-400.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/zodiak-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-zodiak",
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"],
});

export const satoshi = localFont({
  src: [
    { path: "../public/fonts/satoshi-400.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/satoshi-500.woff2", weight: "500", style: "normal" },
    { path: "../public/fonts/satoshi-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-satoshi",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});
