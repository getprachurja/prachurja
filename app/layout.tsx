import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import "./raas.css";

const geist = Geist({ variable: "--font-sans", subsets: ["latin"] });
const mono = Geist_Mono({ variable: "--font-mono", subsets: ["latin"] });
const display = Playfair_Display({ variable: "--font-display", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://prachurja-six.vercel.app"),
  title: { default: "Prachurja — Restoration-as-a-Service", template: "%s · Prachurja" },
  description: "A ₹100 Crore business model for large-scale forest restoration and conservation infrastructure.",
  icons: { icon: "/prachurja-logo-final.jpeg", shortcut: "/prachurja-logo-final.jpeg" },
  openGraph: {
    type: "website",
    title: "Prachurja — Restoration-as-a-Service",
    description: "Natural liabilities engineered into high-integrity living ESG assets.",
    images: [{ url: "/og.png", width: 1729, height: 910, alt: "Prachurja Restoration-as-a-Service" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Prachurja — Restoration-as-a-Service",
    description: "Natural liabilities engineered into high-integrity living ESG assets.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`${geist.variable} ${mono.variable} ${display.variable}`}><body>{children}</body></html>;
}
