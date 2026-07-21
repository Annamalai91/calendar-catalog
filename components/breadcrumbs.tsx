import React from "react";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@components/ui/breadcrumb";
import type { BreadcrumbItem as BreadcrumbItemType } from "@shared/types/common";

interface BreadcrumbsProps {
  items: BreadcrumbItemType[];
}

/**
 * Breadcrumbs — semantic navigation trail.
 * Server Component.
 */
const Breadcrumbs = ({ items }: BreadcrumbsProps) => (
  <Breadcrumb>
    <BreadcrumbList>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={`${item.label}-${index}`}>
            <BreadcrumbItem>
              {isLast ? (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={item.href ?? "#"}>{item.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {!isLast && <BreadcrumbSeparator />}
          </React.Fragment>
        );
      })}
    </BreadcrumbList>
  </Breadcrumb>
);

export default Breadcrumbs;
