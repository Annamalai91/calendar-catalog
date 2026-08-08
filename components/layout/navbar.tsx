"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@components/ui/sheet";
import { CONTACT_INFO, CONTACT_LINKS } from "@/configs/contact";
import { APP_TEXT } from "@configs/constants";
import {
  WhatsAppIcon,
  InstagramIcon,
  GmailIcon,
  PhoneCallIcon,
} from "@/components/icons/brand-icons";

const contactLinks = [
  {
    label: APP_TEXT.navbar.contactLinkLabels.call,
    href: CONTACT_LINKS.call,
    icon: PhoneCallIcon,
  },
  {
    label: APP_TEXT.navbar.contactLinkLabels.whatsapp,
    href: CONTACT_LINKS.whatsapp,
    icon: WhatsAppIcon,
  },
  {
    label: APP_TEXT.navbar.contactLinkLabels.instagram,
    href: CONTACT_LINKS.instagram,
    icon: InstagramIcon,
  },
  {
    label: APP_TEXT.navbar.contactLinkLabels.email,
    href: CONTACT_LINKS.email,
    icon: GmailIcon,
  },
] as const;

const quickContactItems = [
  {
    label: CONTACT_INFO.phoneDisplay,
    href: CONTACT_LINKS.call,
    shortLabel: APP_TEXT.navbar.quickContactLabels.call,
    icon: PhoneCallIcon,
  },
  {
    label: CONTACT_INFO.email,
    href: CONTACT_LINKS.email,
    shortLabel: APP_TEXT.navbar.quickContactLabels.email,
    icon: GmailIcon,
  },
] as const;

/**
 * Mobile menu sheet — shared between both header variants.
 */
const MobileMenu = ({ showStoreLink }: { showStoreLink: boolean }) => (
  <Sheet>
    <SheetTrigger asChild>
      <button
        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-black/10 bg-white/70 text-muted-foreground transition-colors hover:bg-white hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
        aria-label={APP_TEXT.navbar.menuOpenAriaLabel}
      >
        <Menu className="h-5 w-5" />
      </button>
    </SheetTrigger>
    <SheetContent side="right" className="flex flex-col gap-6 pt-12">
      <div className="flex flex-col gap-1">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          {APP_TEXT.navbar.contactSectionTitle}
        </p>
        {quickContactItems.map(({ label, href, shortLabel, icon: Icon }) => (
          <SheetClose asChild key={shortLabel}>
            <a
              href={href}
              className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200/60 bg-white px-3 py-2.5 text-base font-bold text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span>{label}</span>
            </a>
          </SheetClose>
        ))}
      </div>

      <div className="flex flex-col gap-1">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          {APP_TEXT.navbar.socialSectionTitle}
        </p>
        {contactLinks.map(({ label, href, icon: Icon }) => (
          <SheetClose asChild key={label}>
            <a
              href={href}
              className="flex items-center gap-3 rounded-md px-2 py-2 text-sm text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noreferrer" : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {label}
            </a>
          </SheetClose>
        ))}
      </div>

      {showStoreLink && (
        <div className="mt-auto">
          <SheetClose asChild>
            <Button asChild className="w-full rounded-lg">
              <Link href="/products">{APP_TEXT.navbar.storeCta}</Link>
            </Button>
          </SheetClose>
        </div>
      )}
    </SheetContent>
  </Sheet>
);

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
            aria-label={APP_TEXT.brand.homeAriaLabel}
          >
            <Image
              src="/assets/logo-v2.svg"
              alt={APP_TEXT.brand.name}
              width={50}
              height={48}
              className="h-16 w-auto object-contain"
              style={{ width: "auto" }}
              priority
            />
            {/* <span>{APP_TEXT.brand.name}</span> */}
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden items-center gap-3.5 lg:flex">
              {quickContactItems.map(({ label, href, shortLabel, icon: Icon }) => (
                <a
                  key={shortLabel}
                  href={href}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200/80 bg-white/90 px-3.5 py-1.5 text-sm font-bold text-slate-800 shadow-2xs hover:bg-slate-50 transition-all hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Icon className="h-4.5 w-4.5 shrink-0" />
                  <span>{label}</span>
                </a>
              ))}
            </div>

            <nav
              className="hidden items-center gap-2 lg:flex"
              aria-label={APP_TEXT.navbar.contactAndSocialAriaLabel}
            >
              {contactLinks.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  className="inline-flex p-1.5 items-center justify-center transition-transform hover:scale-115 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
                  aria-label={label}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noreferrer" : undefined}
                >
                  <Icon className="h-6 w-6 shrink-0" />
                </a>
              ))}
            </nav>

            <Button
              asChild
              className="hidden rounded-lg px-4 py-2 text-sm sm:px-6 sm:py-3 lg:inline-flex"
            >
              <Link href="/products">{APP_TEXT.navbar.storeCta}</Link>
            </Button>

            <MobileMenu showStoreLink={true} />
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
          aria-label={APP_TEXT.brand.homeAriaLabel}
        >
          <Image
            src="/assets/logo-v2.svg"
            alt={APP_TEXT.brand.name}
            width={40}
            height={38}
            className="h-11 w-auto rounded-md object-contain"
            style={{ width: "auto" }}
            priority
          />
          <span>{APP_TEXT.brand.name}</span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden items-center gap-3.5 lg:flex">
            {quickContactItems.map(({ label, href, shortLabel, icon: Icon }) => (
              <a
                key={shortLabel}
                href={href}
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200/80 bg-white/90 px-3.5 py-1.5 text-sm font-bold text-slate-800 shadow-2xs hover:bg-slate-50 transition-all hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Icon className="h-4.5 w-4.5 shrink-0" />
                <span>{label}</span>
              </a>
            ))}
          </div>

          <nav
            className="hidden items-center gap-2 lg:flex"
            aria-label={APP_TEXT.navbar.contactAndSocialAriaLabel}
          >
            {contactLinks.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                className="inline-flex p-1.5 items-center justify-center transition-transform hover:scale-115 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
                aria-label={label}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noreferrer" : undefined}
              >
                <Icon className="h-6 w-6 shrink-0" />
              </a>
            ))}
          </nav>

          <MobileMenu showStoreLink={false} />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
