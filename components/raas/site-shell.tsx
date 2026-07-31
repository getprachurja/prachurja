"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Mail, Menu, MessageCircle, ShoppingBag, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { PrachCompanion } from "@/components/raas/prach-companion";
import { CartProvider, useCart } from "@/components/raas/cart-context";

const navigation = [
  ["/", "Home"],
  ["/approach", "Our approach"],
  ["/nursery", "Native nursery"],
  ["/solutions", "What we restore"],
  ["/miyawaki", "Miyawaki forests"],
  ["/blog", "Field journal"],
] as const;

export function RaasSiteShell({ children }: { children: React.ReactNode }) {
  return <CartProvider><RaasSiteFrame>{children}</RaasSiteFrame></CartProvider>;
}

function RaasSiteFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { count } = useCart();

  function isActive(href: string) {
    if (href === "/nursery") return pathname === href || pathname.startsWith("/plants/");
    return pathname === href;
  }

  return (
    <div className="raas-site">
      <a className="raas-skip-link" href="#raas-main-content">
        Skip to main content
      </a>
      <header className="raas-header">
        <div className="raas-shell raas-header-inner">
          <Link className="raas-brand" href="/" aria-label="Prachurja trademark home">
            <Image
              src="/prachurja-logo-final.jpeg"
              alt=""
              width={52}
              height={52}
              priority
              unoptimized
            />
            <span>
              <b>PRACHURJA<sup>™</sup></b>
              <small>Ecological restoration</small>
            </span>
          </Link>
          <nav className="raas-desktop-nav" aria-label="Primary navigation">
            {navigation.map(([href, label]) => (
              <Link className={isActive(href) ? "active" : ""} href={href} key={href}>
                {label}
              </Link>
            ))}
          </nav>
          <Link className="raas-cart-link" href="/cart" aria-label={`${count} ${count === 1 ? "item" : "items"} in cart`}>
            <ShoppingBag aria-hidden="true" />
            <span>{count}</span>
          </Link>
          <Link className="raas-header-cta" href="/assessment">
            Discuss your site
          </Link>
          <button
            className="raas-menu-button"
            aria-label="Open navigation"
            aria-expanded={open}
            onClick={() => setOpen(true)}
          >
            <Menu aria-hidden="true" />
          </button>
        </div>
      </header>

      <div className={`raas-mobile-nav${open ? " open" : ""}`} aria-hidden={!open}>
        <button aria-label="Close navigation" onClick={() => setOpen(false)}>
          <X aria-hidden="true" />
        </button>
        <nav aria-label="Mobile navigation">
          {navigation.map(([href, label]) => (
            <Link href={href} key={href} onClick={() => setOpen(false)}>
              {label}
            </Link>
          ))}
          <Link href="/cart" onClick={() => setOpen(false)}>
            Your cart <span className="raas-mobile-cart-count">{count}</span>
          </Link>
          <Link className="raas-mobile-cta" href="/assessment" onClick={() => setOpen(false)}>
            Discuss your site
          </Link>
        </nav>
      </div>

      <div id="raas-main-content">{children}</div>

      <footer className="raas-footer">
        <div className="raas-shell">
          <div className="raas-footer-help">
            <div><p className="raas-eyebrow"><span />Not sure where to begin?</p><h2>Start with the land. We’ll help you find the next useful step.</h2></div>
            <div>
              <button className="raas-button raas-button-light" type="button" onClick={() => window.dispatchEvent(new CustomEvent("prach:open"))}><MessageCircle aria-hidden="true" />Ask Prach</button>
              <Link className="raas-button raas-button-footer-outline" href="/assessment">Discuss your site <ArrowRight aria-hidden="true" /></Link>
            </div>
          </div>
          <div className="raas-footer-grid">
            <div className="raas-footer-about">
              <div className="raas-footer-brand">
                <Image
                  src="/prachurja-logo-final.jpeg"
                  alt="Prachurja trademark emblem"
                  width={82}
                  height={82}
                  unoptimized
                />
                <div>
                  <b>prachurja<sup>™</sup></b>
                  <span>Ecological restoration, rooted in place.</span>
                </div>
              </div>
              <p>
                We plan, establish and steward native ecosystems for organisations,
                communities and landholders in India.
              </p>
              <a className="raas-footer-email" href="mailto:hello@prachurja.com"><Mail aria-hidden="true" />hello@prachurja.com</a>
            </div>
            <div>
              <b>Explore</b>
              <Link href="/approach">Our approach</Link>
              <Link href="/nursery">Native nursery</Link>
              <Link href="/cart">Your cart</Link>
              <Link href="/solutions">Restoration work</Link>
              <Link href="/miyawaki">Miyawaki forests</Link>
              <Link href="/blog">Field journal</Link>
            </div>
            <div>
              <b>Learn</b>
              <Link href="/blog/why-native-species-matter">Why native species matter</Link>
              <Link href="/blog/plantation-versus-restoration">Plantation vs restoration</Link>
              <Link href="/blog/pioneer-species-and-soil">Pioneer species and soil</Link>
              <Link href="/blog/long-term-maintenance">Long-term maintenance</Link>
            </div>
            <div>
              <b>Get started</b>
              <Link href="/solutions#invasive-management">Invasive management</Link>
              <Link href="/solutions#native-plant-supply">Native plant supply</Link>
              <Link href="/assessment">Site assessment</Link>
              <Link href="/cart">Nursery cart</Link>
            </div>
            <div>
              <b>Secure workspaces</b>
              <Link href="/login">Admin sign in</Link>
              <Link href="/portal">Client portal</Link>
              <Link href="/portal">Partner portal</Link>
              <Link href="/portal">Field workspace</Link>
            </div>
          </div>
          <div className="raas-footer-base">
            <span>© {new Date().getFullYear()} Prachurja™. All rights reserved.</span>
            <span>Ecology before claims · evidence over time.</span>
          </div>
          <a className="raas-image-credit" href="https://commons.wikimedia.org/" target="_blank" rel="noreferrer">
            Plant reference photographs: Wikimedia Commons
          </a>
        </div>
      </footer>
      <PrachCompanion />
    </div>
  );
}
