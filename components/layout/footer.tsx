"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Separator } from "@components/ui/separator";
import { APP_TEXT } from "@configs/constants";

const Footer = () => {
  const pathname = usePathname();

  if (pathname === "/") {
    return null;
  }

  return (
    <footer
      className="w-full border-t bg-[#F7FBF9] mt-auto"
      style={{ borderColor: "rgba(0,0,0,0.08)" }}
      aria-label={APP_TEXT.footer.ariaLabel}
    >
      <div className="mx-auto max-w-300 px-8 py-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div>
            <h2 className="text-sm font-semibold text-foreground mb-3">
              {APP_TEXT.footer.aboutTitle}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {APP_TEXT.footer.aboutDescription}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">
              {APP_TEXT.footer.addressTitle}
            </h3>
            <div className="space-y-1 text-sm text-muted-foreground leading-relaxed">
              {APP_TEXT.footer.address.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>

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
        </div>

        <Separator className="my-8" />

        <p className="text-xs text-center text-muted-foreground">
          &copy; {new Date().getFullYear()} {APP_TEXT.footer.copyrightSuffix}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
