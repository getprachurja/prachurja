import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import "./raas.css";

const geist = Geist({ variable: "--font-sans", subsets: ["latin"] });
const mono = Geist_Mono({ variable: "--font-mono", subsets: ["latin"] });
const display = Playfair_Display({ variable: "--font-display", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://prachurja-six.vercel.app"),
  title: {
    default: "Prachurja — Ecological Restoration",
    template: "%s · Prachurja",
  },
  description:
    "Native ecological restoration, Miyawaki forests, living-soil care and long-term landscape stewardship in India.",
  icons: {
    icon: "/prachurja-logo-final.jpeg",
    shortcut: "/prachurja-logo-final.jpeg",
  },
  openGraph: {
    type: "website",
    title: "Prachurja — Ecological Restoration",
    description: "Native forests and living landscapes, restored with care.",
    images: [
      {
        url: "/prachurja-logo-final.jpeg",
        width: 1254,
        height: 1254,
        alt: "Prachurja",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Prachurja — Ecological Restoration",
    description: "Native forests and living landscapes, restored with care.",
    images: ["/prachurja-logo-final.jpeg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} ${mono.variable} ${display.variable}`}>
      <body>{children}</body>
    </html>
  );
}
