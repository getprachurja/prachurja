import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";

const geist = Geist({ variable: "--font-sans", subsets: ["latin"] });
const mono = Geist_Mono({ variable: "--font-mono", subsets: ["latin"] });
const display = Playfair_Display({ variable: "--font-display", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://aranya-works-restoration.getportale.chatgpt.site"),
  title: { default: "Prachurja", template: "%s · Prachurja" },
  description: "A connected ecological restoration platform for native nurseries, local livelihoods, field operations and measurable recovery.",
  icons: { icon: "/prachurja-logo-final.jpeg", shortcut: "/prachurja-logo-final.jpeg" },
  openGraph: {
    title: "Prachurja",
    description: "Ecological restoration, measured over time.",
    images: [{ url: "/og.png", width: 1672, height: 941, alt: "Prachurja restoration platform" }],
  },
  twitter: { card: "summary_large_image", title: "Prachurja", description: "Ecological restoration, measured over time.", images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${geist.variable} ${mono.variable} ${display.variable}`}>{children}</body></html>;
}
