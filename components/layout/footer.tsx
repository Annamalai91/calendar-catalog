"use client";

import Link from "next/link";
import { Separator } from "@components/ui/separator";
import { APP_TEXT } from "@configs/constants";
import { GmailIcon } from "@/components/icons/brand-icons";

const Footer = () => {
  return (
    <footer
      className="w-full border-t border-black/10 dark:border-white/10 bg-[#F7FBF9] dark:bg-[#050507] mt-auto transition-colors"
      aria-label={APP_TEXT.footer.ariaLabel}
    >
      <div className="mx-auto max-w-300 px-8 py-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">
              {APP_TEXT.footer.catalogTitle}
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/products"
                  className="hover:text-foreground transition-colors"
                >
                  {APP_TEXT.common.catalog}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">
              {APP_TEXT.footer.registeredOfficeTitle}
            </h3>
            <div className="space-y-1 text-sm text-muted-foreground leading-relaxed">
              {APP_TEXT.footer.registeredOfficeAddress.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">
              {APP_TEXT.footer.factoryAddressTitle}
            </h3>
            <div className="space-y-1 text-sm text-muted-foreground leading-relaxed">
              {APP_TEXT.footer.factoryAddress.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-foreground mb-3">
              {APP_TEXT.footer.aboutTitle}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {APP_TEXT.footer.aboutDescription}
            </p>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-center gap-2 text-xs text-muted-foreground text-center">
          <p>&copy; {new Date().getFullYear()} {APP_TEXT.footer.copyrightSuffix}</p>

          <p className="inline-flex items-center gap-1.5 flex-wrap justify-center">
            <span>This site is designed & maintained by Annamalai Vignesh</span>
            <a
              href="mailto:annamalaivignesh.k@gmail.com"
              className="inline-flex items-center gap-1 hover:text-foreground transition-colors text-slate-700 dark:text-slate-300"
              aria-label="Email Annamalai Vignesh"
            >
              <GmailIcon className="h-4 w-4 shrink-0" />
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
