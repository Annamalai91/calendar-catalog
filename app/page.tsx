import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@components/ui/button";
import { homeMetadata } from "@configs/metadata";
import { APP_TEXT } from "@configs/constants";
import { getCachedAllProducts, getCachedFormattedCategories } from "@data/products";
import { toSlug } from "@lib/utils/slug";

export { homeMetadata as metadata };

interface FeaturedCategoryItem {
  title: string;
  tagline: string;
  description: string;
  categoryQuery: string;
}

const FEATURED_ITEMS: FeaturedCategoryItem[] = [
  {
    title: "Monthly Calendar",
    tagline: "Month-at-a-Glance",
    description:
      "A month-at-a-glance calendar with complete English and Tamil calendar dates, Pachanga details, and festival listings. Available in sizes ranging from 9 x 11 to 23 x 36, suited for homes, offices, and retail spaces alike.",
    categoryQuery: "Monthly Calendar",
  },
  {
    title: "Desktop Calendar",
    tagline: "Workspace Companions",
    description:
      "A compact, flip-style calendar that fits neatly on any desk or table. Easy-to-read dates on a sturdy build board, handy for daily planner at work or home.",
    categoryQuery: "Desktop Calendar",
  },
  {
    title: "Real Art Mount Calendar",
    tagline: "Classic Mounts",
    description:
      "Premium look Gods Picture printed in 120 GSM Imported Art Paper suitable for 10 x 15 and 12 x 18 Size Tamil Daily Calendar.",
    categoryQuery: "Real Art Mount Calendar",
  },
  {
    title: "Die Cutting Tamil Calendar",
    tagline: "Custom Silhouettes",
    description:
      "Premium look Tamil calendar with a custom die-cut shape for a distinctive look. Combines traditional Tamil dates with a fresh, eye-catching design.",
    categoryQuery: "Die Cutting Tamil Calendar",
  },
  {
    title: "Golden Wall Calendar",
    tagline: "Royal Foil",
    description:
      "A wall calendar with an elegant golden finish for a festive touch with Frame. Adds a bit of shine and style to any home or office wall.",
    categoryQuery: "Golden Wall Calendar",
  },
  {
    title: "Diary",
    tagline: "Daily Essentials",
    description:
      "A simple daily diary to jot down notes, plans, and reminders. Compact and handy for everyday writing.",
    categoryQuery: "Diary",
  },
];

export default async function HomePage() {
  const [allProducts, categories] = await Promise.all([
    getCachedAllProducts(),
    getCachedFormattedCategories(),
  ]);

  const showcaseCards = FEATURED_ITEMS.map((item) => {
    // Strictly match category by name or slug
    const matchedCategory = categories.find(
      (cat) =>
        cat.name.toLowerCase() === item.categoryQuery.toLowerCase() ||
        cat.slug.toLowerCase() === toSlug(item.categoryQuery)
    );

    // Strictly match product directly against main_category in products table
    const product =
      allProducts.find(
        (p) =>
          p.main_category.toLowerCase() === item.categoryQuery.toLowerCase() ||
          toSlug(p.main_category) === toSlug(item.categoryQuery)
      ) ||
      (matchedCategory ? allProducts.find((p) => p.main_category === matchedCategory.name) : undefined);

    const targetSlug = matchedCategory?.slug || toSlug(item.categoryQuery);
    const imageUrl = product?.cover_image || product?.full_image || "";

    return {
      ...item,
      targetSlug,
      productName: product?.name || item.title,
      imageUrl,
    };
  });

  return (
    <>
      <section
        aria-labelledby="hero-heading"
        className="bg-[#F7FBF9] dark:bg-[#0A0A0C] transition-colors"
      >
        <div className="mx-auto max-w-6xl px-8 pb-12 pt-12 lg:pb-14 lg:pt-16">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 lg:gap-14">
            {/* Logo */}
            <div className="flex items-center justify-center shrink-0">
              <Image
                src="/assets/logo-v2.svg"
                alt={APP_TEXT.brand.name}
                width={400}
                height={360}
                className="h-40 sm:h-48 md:h-56 lg:h-64 w-auto object-contain drop-shadow-sm dark:brightness-110 transition-transform duration-300 hover:scale-105"
                priority
              />
            </div>

            {/* Title & Description */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-2xl">
              <h1
                id="hero-heading"
                className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 sm:text-3xl md:text-4xl lg:text-5xl leading-tight"
              >
                {APP_TEXT.homePage.heroTitle}
              </h1>
              <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg lg:text-xl">
                {APP_TEXT.homePage.heroDescription}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="expertise-heading"
        className="bg-[#F7FBF9] dark:bg-[#0A0A0C] transition-colors"
      >
        <div className="mx-auto max-w-360 px-8 pt-8 pb-20 lg:pt-4 lg:pb-24">
          <div className="mx-auto max-w-3xl text-center">
            <h2
              id="expertise-heading"
              className="text-4xl font-extrabold tracking-[-0.02em] text-slate-900 dark:text-slate-100 sm:text-5xl"
            >
              {APP_TEXT.homePage.expertiseTitle}
            </h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 sm:text-xl">
              {APP_TEXT.homePage.expertiseDescription}
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {showcaseCards.map((card) => {
              const href = card.targetSlug ? `/products?category=${card.targetSlug}` : "/products";

              return (
                <Link
                  key={card.title}
                  href={href}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/60 dark:border-white/10 bg-white dark:bg-[#121215] p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:scale-[1.02]"
                >
                  <div>
                    {/* Image showcase */}
                    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-slate-50 dark:bg-[#1C1C21] border border-border/30 dark:border-white/10 p-2 flex items-center justify-center">
                      {card.imageUrl ? (
                        <Image
                          src={card.imageUrl}
                          alt={`${card.title} — ${card.productName}`}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-contain select-none transition-transform duration-300 group-hover:scale-[1.04]"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 gap-2 p-4 text-center">
                          <Image
                            src="/assets/logo-v2.svg"
                            alt={APP_TEXT.brand.name}
                            width={100}
                            height={100}
                            className="h-16 w-auto object-contain opacity-40"
                          />
                          <span className="text-xs font-semibold tracking-wide uppercase">Coming Soon</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-6 flex flex-col text-left">
                      <span className="text-[11px] font-bold uppercase tracking-widest text-[#115e59] dark:text-[#5eead4]">
                        {card.tagline}
                      </span>
                      <h3 className="mt-1.5 text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#06B6A4] dark:group-hover:text-[#2dd4bf] transition-colors leading-tight">
                        {card.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                        {card.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-start gap-1.5 text-sm font-bold text-[#06B6A4] dark:text-[#2dd4bf] transition-colors group-hover:text-[#08998B] dark:group-hover:text-[#5eead4]">
                    <span>Explore Collection</span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-16 flex justify-center">
            <Button
              asChild
              className="h-14 rounded-xl px-10 text-base sm:text-lg font-semibold shadow-md transition-all hover:scale-[1.02]"
            >
              <Link href="/products">
                {APP_TEXT.homePage.expertiseSecondaryCta}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
