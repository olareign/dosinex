import { Fraunces, Inter } from "next/font/google";

export const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-inter" });

/**
 * The serif for the Editorial page design. Not applied to the root: only that design's wrapper carries
 * `fraunces.variable`, so no other page downloads it.
 */
export const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});
