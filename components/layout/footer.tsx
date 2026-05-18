"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Separator } from "@components/ui/separator";

const Footer = () => {
  const pathname = usePathname();

  if (pathname === "/") {
    return null;
  }

  return (
    <footer
      className="w-full border-t bg-[#F7FBF9] mt-auto"
      style={{ borderColor: "rgba(0,0,0,0.08)" }}
      aria-label="Site footer"
    >
      <div className="mx-auto max-w-300 px-8 py-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h2 className="text-sm font-semibold text-foreground mb-3">
              Calenders Arun
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Premium quality calendar printing for every occasion.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Catalog
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/products"
                  className="hover:text-foreground transition-colors"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/products/monthly-calendar"
                  className="hover:text-foreground transition-colors"
                >
                  Monthly Calendars
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Company
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="#"
                  className="hover:text-foreground transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="#contact"
                  className="hover:text-foreground transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Support
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="#"
                  className="hover:text-foreground transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-foreground transition-colors"
                >
                  Shipping
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <p className="text-xs text-center text-muted-foreground">
          &copy; {new Date().getFullYear()} Calenders Arun. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
