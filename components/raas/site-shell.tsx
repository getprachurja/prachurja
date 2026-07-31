"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, ShoppingBag, X } from "lucide-react";
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
          <Link className="raas-brand" href="/" aria-label="Prachurja home">
            <Image
              src="/prachurja-logo-final.jpeg"
              alt=""
              width={52}
              height={52}
              priority
              unoptimized
            />
            <span>
              <b>PRACHURJA</b>
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
          <div className="raas-footer-grid">
            <div className="raas-footer-about">
              <div className="raas-footer-brand">
                <Image
                  src="/prachurja-logo-final.jpeg"
                  alt="Prachurja emblem"
                  width={82}
                  height={82}
                  unoptimized
                />
                <div>
                  <b>prachurja</b>
                  <span>Ecological restoration, rooted in place.</span>
                </div>
              </div>
              <p>
                We plan, establish and steward native ecosystems for organisations,
                communities and landholders in India.
              </p>
            </div>
            <div>
              <b>Explore</b>
              <Link href="/approach">Our approach</Link>
              <Link href="/nursery">Native nursery</Link>
              <Link href="/cart">Your cart</Link>
              <Link href="/solutions">Restoration work</Link>
              <Link href="/miyawaki">Miyawaki forests</Link>
            </div>
            <div>
              <b>Restoration topics</b>
              <Link href="/solutions#invasive-management">Invasive management</Link>
              <Link href="/solutions#native-plant-supply">Native plant supply</Link>
              <Link href="/approach#soil">Living soil</Link>
              <Link href="/approach#monitoring">Monitoring</Link>
              <Link href="/assessment">Site assessment</Link>
            </div>
            <div>
              <b>Workspaces</b>
              <Link href="/login">Team sign in</Link>
              <Link href="/portal">Client and field portal</Link>
              <a href="mailto:hello@prachurja.com">hello@prachurja.com</a>
            </div>
          </div>
          <div className="raas-footer-base">
            <span>© {new Date().getFullYear()} Prachurja</span>
            <span>Native plants · healthy soil · living landscapes</span>
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
