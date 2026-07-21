import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@components/ui/button";
import { homeMetadata } from "@configs/metadata";
import { APP_TEXT } from "@configs/constants";
import { getCachedAllProducts } from "@data/products";
import HeroCarousel from "@components/product/hero-carousel";
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
  const allProducts = await getCachedAllProducts();
  const categoriesSeen = new Set<string>();
  const carouselProducts = allProducts.filter((product) => {
    if (!categoriesSeen.has(product.main_category)) {
      categoriesSeen.add(product.main_category);
      return true;
    }
    return false;
  });

  return (
    <>
      <section
        aria-labelledby="hero-heading"
        className="bg-[#F7FBF9]"
        style={{ borderColor: "rgba(0,0,0,0.08)" }}
      >
        <div className="mx-auto max-w-5xl px-8 pb-24 pt-16 lg:pb-32 lg:pt-20">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex rounded-xl bg-[#EDEFF4] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.5px] text-slate-600">
              {APP_TEXT.homePage.heroTag}
            </div>
            <h1
              id="hero-heading"
              className="mt-6 max-w-3xl text-5xl font-extrabold tracking-[-0.03em] text-[#0f172a] sm:text-6xl md:text-7xl leading-tight"
            >
              {APP_TEXT.homePage.heroTitle}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
              {APP_TEXT.homePage.heroDescription}
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Button
                size="lg"
                asChild
                className="rounded-xl px-8 py-6 text-base"
              >
                <Link href="/products">
                  {APP_TEXT.homePage.heroPrimaryCta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="mt-16 w-full max-w-4xl">
              <HeroCarousel products={carouselProducts} />
            </div>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="expertise-heading"
        className="border-t border-border/60 bg-[#F7FBF9]"
      >
        <div className="mx-auto max-w-7xl px-8 py-20 lg:px-12 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h2
              id="expertise-heading"
              className="text-4xl font-extrabold tracking-[-0.02em] text-slate-900 sm:text-5xl"
            >
              {APP_TEXT.homePage.expertiseTitle}
            </h2>
            <p className="mt-4 text-lg text-slate-600 sm:text-xl">
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
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/60 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:scale-[1.02]"
                >
                  <div>
                    {/* Image showcase */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-slate-50 flex items-center justify-center p-4 border border-border/30">
                      <div className="relative w-full h-[85%]">
                        <Image
                          src={product.cover_image || product.full_image}
                          alt={`${product.main_category} — ${product.name}`}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-contain select-none transition-transform duration-300 group-hover:scale-[1.04]"
                        />
                      </div>
                    </div>

                    <div className="mt-6 flex flex-col text-left">
                      <span className="text-[11px] font-bold uppercase tracking-widest text-[#115e59]">
                        {details.tagline}
                      </span>
                      <h3 className="mt-1.5 text-xl font-bold text-slate-900 group-hover:text-[#06B6A4] transition-colors leading-tight">
                        {product.main_category}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-slate-600">
                        {details.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-start gap-1.5 text-sm font-bold text-[#06B6A4] transition-colors group-hover:text-[#08998B]">
                    <span>Explore Collection</span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-16 flex justify-center">
            <Button
              variant="outline"
              size="lg"
              asChild
              className="rounded-xl px-8 py-6 text-base"
            >
              <Link href="/products">
                {APP_TEXT.homePage.expertiseSecondaryCta}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
