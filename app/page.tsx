import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@components/ui/button";
import { homeMetadata } from "@configs/metadata";
import { APP_TEXT } from "@configs/constants";
import { getCachedAllProducts, getCachedFormattedCategories } from "@data/products";
import { toSlug } from "@lib/utils/slug";

export { homeMetadata as metadata };

const categoryDetails: Record<
  string,
  { tagline: string; description: string }
> = {
  "Real Art Calendars": {
    tagline: "Artistic Elegance",
    description: "Premium high-definition prints that bring fine art and scenic photography to life on your walls.",
  },
  "Crystal Calendars": {
    tagline: "Modern Translucency",
    description: "Ultra-modern plastic X-ray sheet designs offering a high-gloss, translucent crystal finish.",
  },
  "Die Cutting": {
    tagline: "Custom Silhouettes",
    description: "Unique custom-shaped boards featuring elegant hangers that turn calendars into stunning home decor.",
  },
  "Table Calendar": {
    tagline: "Workspace Companions",
    description: "Compact desk calendars with executive UV-coatings and planners, structured to organize your workspace daily.",
  },
  "Foam Calendar": {
    tagline: "Matte Durability",
    description: "Durable, lightweight poly-sheet sheets offering a contemporary matte aesthetic with long-lasting build quality.",
  },
  "Golden Calendar": {
    tagline: "Royal Foil",
    description: "Opulent gold foil detailing on sleek plastic X-ray sheets for a majestic and luxurious presence.",
  },
  "Jumbo Calendar": {
    tagline: "Grand Visibility",
    description: "Massive 33\" x 56\" prints with pipe hangers, perfect for spacious offices and high-impact corporate branding.",
  },
  "Real Art Mount Calendar": {
    tagline: "Classic Mounts",
    description: "Classic mounted art papers with premium hot-stamping foil borders for a time-honored luxury aesthetic.",
  },
  "Sheeter Calendar": {
    tagline: "Daily Utilities",
    description: "Traditional multi-sheet calendars crafted with lightweight paper for utility, clarity, and daily reference.",
  },
};

export default async function HomePage() {
  const [allProducts, categories] = await Promise.all([
    getCachedAllProducts(),
    getCachedFormattedCategories(),
  ]);

  const carouselProducts = categories
    .map((cat) => allProducts.find((p) => p.main_category === cat.name))
    .filter((product): product is typeof allProducts[number] => Boolean(product))
    .slice(0, 6);

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
            {carouselProducts.map((product) => {
              const details = categoryDetails[product.main_category] || {
                tagline: "Specialty Print",
                description: product.description || "Browse our beautiful selection of calendars.",
              };
              const slug = toSlug(product.main_category);

              return (
                <Link
                  key={product.main_category}
                  href={`/products?category=${slug}`}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/60 dark:border-white/10 bg-white dark:bg-[#121215] p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:scale-[1.02]"
                >
                  <div>
                    {/* Image showcase */}
                    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-slate-50 dark:bg-[#1C1C21] border border-border/30 dark:border-white/10 p-2">
                      <Image
                        src={product.cover_image || product.full_image}
                        alt={`${product.main_category} — ${product.name}`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-contain select-none transition-transform duration-300 group-hover:scale-[1.04]"
                      />
                    </div>

                    <div className="mt-6 flex flex-col text-left">
                      <span className="text-[11px] font-bold uppercase tracking-widest text-[#115e59] dark:text-[#5eead4]">
                        {details.tagline}
                      </span>
                      <h3 className="mt-1.5 text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#06B6A4] dark:group-hover:text-[#2dd4bf] transition-colors leading-tight">
                        {product.main_category}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                        {details.description}
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
