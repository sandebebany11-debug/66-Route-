import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/layout/SmoothScroll";
import CustomCursor from "@/components/layout/CustomCursor";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const title = "Art of Hair by Simyan — Friseurmeister in Leverkusen";
const description =
  "Art of Hair by Simyan: Friseurmeister Simyan Chicho und sein Team in Leverkusen-Lützenkirchen. Präzisionsschnitte, Balayage, Coloration und Kevin Murphy Haarpflege. Jetzt Termin vereinbaren.";

export const metadata: Metadata = {
  metadataBase: new URL("https://art-of-hair-by-simyan.de"),
  title: {
    default: title,
    template: "%s — Art of Hair by Simyan",
  },
  description,
  keywords: [
    "Friseur Leverkusen",
    "Friseur Lützenkirchen",
    "Friseurmeister Leverkusen",
    "Damenfriseur Leverkusen",
    "Herrenfriseur Leverkusen",
    "Balayage Leverkusen",
    "Art of Hair by Simyan",
  ],
  openGraph: {
    title,
    description,
    url: "https://art-of-hair-by-simyan.de",
    siteName: "Art of Hair by Simyan",
    locale: "de_DE",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de" className={`${fraunces.variable} ${inter.variable} h-full`}>
      <body className="min-h-full bg-ink text-paper antialiased selection:bg-champagne selection:text-ink">
        <SmoothScroll>
          <CustomCursor />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
