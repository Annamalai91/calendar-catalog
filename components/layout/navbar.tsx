"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, MessageCircle, Camera, Users, Mail } from "lucide-react";
import { Button } from "@components/ui/button";
import { CONTACT_INFO, CONTACT_LINKS } from "@/configs/contact";

const contactLinks = [
  {
    label: "Call",
    href: CONTACT_LINKS.call,
    icon: Phone,
  },
  {
    label: "WhatsApp",
    href: CONTACT_LINKS.whatsapp,
    icon: MessageCircle,
  },
  {
    label: "Instagram",
    href: CONTACT_LINKS.instagram,
    icon: Camera,
  },
  {
    label: "Facebook",
    href: CONTACT_LINKS.facebook,
    icon: Users,
  },
  {
    label: "Email",
    href: CONTACT_LINKS.email,
    icon: Mail,
  },
] as const;

const quickContactItems = [
  {
    label: CONTACT_INFO.phoneDisplay,
    href: CONTACT_LINKS.call,
    shortLabel: "Call",
  },
  {
    label: CONTACT_INFO.email,
    href: CONTACT_LINKS.email,
    shortLabel: "Email",
  },
] as const;

/**
 * Site-wide navigation bar.
 *
 * Landing route uses the Figma header.
 * Interior routes use the simplified catalog header from the design.
 */
const Navbar = () => {
  const pathname = usePathname();
  const isLandingPage = pathname === "/";

  if (isLandingPage) {
    return (
      <header
        className="sticky top-0 z-50 w-full border-b bg-[#F7FBF9]"
        style={{ borderColor: "rgba(0,0,0,0.08)" }}
      >
        <div className="mx-auto flex h-18 max-w-300 items-center justify-between px-8 lg:px-12">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-lg tracking-[-0.02em] text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
            aria-label="Sivakasi Calendars — Home"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-[#2AA8BE] text-xs font-bold text-white select-none">
              SC
            </span>
            <span>Sivakasi Calendars</span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden items-center gap-2 lg:flex">
              {quickContactItems.map(({ label, href, shortLabel }) => (
                <a
                  key={shortLabel}
                  href={href}
                  className="rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {label}
                </a>
              ))}
            </div>

            <nav
              className="flex items-center gap-1 sm:gap-2"
              aria-label="Contact and social links"
            >
              {contactLinks.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-black/10 bg-white/70 text-muted-foreground transition-colors hover:bg-white hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label={label}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noreferrer" : undefined}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </nav>

            <Button
              asChild
              className="rounded-lg px-4 py-2 text-sm sm:px-6 sm:py-3"
            >
              <Link href="/products">Go to Store</Link>
            </Button>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header
      className="sticky top-0 z-50 w-full border-b bg-[#F7FBF9]"
      style={{ borderColor: "rgba(0,0,0,0.08)" }}
    >
      <div className="mx-auto flex h-16 max-w-360 items-center justify-between px-8">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-sm text-lg font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Sivakasi Calendars — Home"
        >
          <span className="inline-flex h-7 w-7 select-none items-center justify-center rounded-md bg-[#2AA8BE] text-xs font-bold text-white">
            SC
          </span>
          <span>Sivakasi Calendars</span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden items-center gap-2 lg:flex">
            {quickContactItems.map(({ label, href, shortLabel }) => (
              <a
                key={shortLabel}
                href={href}
                className="rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {label}
              </a>
            ))}
          </div>

          <nav
            className="flex items-center gap-1 sm:gap-2"
            aria-label="Contact and social links"
          >
            {contactLinks.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-black/10 bg-white/70 text-muted-foreground transition-colors hover:bg-white hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label={label}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noreferrer" : undefined}
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
