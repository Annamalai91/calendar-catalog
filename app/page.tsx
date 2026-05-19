import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  CalendarRange,
  ChevronLeft,
  ChevronRight,
  Gift,
  NotebookPen,
} from "lucide-react";
import { Button } from "@components/ui/button";
import { homeMetadata } from "@configs/metadata";
import { APP_TEXT } from "@configs/constants";
export { homeMetadata as metadata };

const expertiseCards = [
  {
    icon: CalendarRange,
    title: APP_TEXT.homePage.expertiseCards[0].title,
    body: APP_TEXT.homePage.expertiseCards[0].body,
  },
  {
    icon: NotebookPen,
    title: APP_TEXT.homePage.expertiseCards[1].title,
    body: APP_TEXT.homePage.expertiseCards[1].body,
  },
  {
    icon: Gift,
    title: APP_TEXT.homePage.expertiseCards[2].title,
    body: APP_TEXT.homePage.expertiseCards[2].body,
  },
] as const;

export default function HomePage() {
  return (
    <>
      <section
        aria-labelledby="hero-heading"
        className="bg-[#F7FBF9]"
        style={{ borderColor: "rgba(0,0,0,0.08)" }}
      >
        <div className="mx-auto max-w-300 px-8 pb-20 pt-16 lg:px-30 lg:pb-24 lg:pt-20">
          <div className="grid gap-16 lg:grid-cols-[minmax(0,1fr)_536px] lg:items-center">
            <div className="max-w-xl">
              <div className="inline-flex rounded-xl bg-[#EDEFF4] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.5px] text-slate-600">
                {APP_TEXT.homePage.heroTag}
              </div>
              <h1
                id="hero-heading"
                className="mt-6 max-w-lg text-5xl font-extrabold tracking-[-0.03em] text-slate-950 sm:text-6xl"
              >
                {APP_TEXT.homePage.heroTitle}
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
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
            </div>

            <div className="relative mx-auto w-full max-w-134">
              <div className="overflow-hidden rounded-3xl border border-border/60 bg-[#EDEFF4] shadow-[0_24px_48px_rgba(15,23,42,0.08)]">
                <div className="relative aspect-536/392">
                  <Image
                    src="/assets/design1.svg"
                    alt={APP_TEXT.homePage.heroImageAlt}
                    fill
                    priority
                    className="object-cover"
                  />
                </div>
              </div>

              <button
                type="button"
                aria-label={APP_TEXT.homePage.heroPreviousSlideAria}
                className="absolute -left-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-border/60 bg-[#F7FBF9] text-slate-950 shadow-lg"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                aria-label={APP_TEXT.homePage.heroNextSlideAria}
                className="absolute -right-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-border/60 bg-[#F7FBF9] text-slate-950 shadow-lg"
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              <div className="absolute bottom-5 left-5 inline-flex items-center gap-2 rounded-xl bg-black/30 px-3 py-2 text-xs font-medium text-white backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-white" />
                {APP_TEXT.homePage.heroImageCaption}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="expertise-heading"
        className="border-t border-border/60 bg-[#F7FBF9]"
      >
        <div className="mx-auto max-w-300 px-8 py-16 lg:px-30 lg:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2
              id="expertise-heading"
              className="text-3xl font-bold tracking-[-0.02em] text-slate-950 sm:text-4xl"
            >
              {APP_TEXT.homePage.expertiseTitle}
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
              {APP_TEXT.homePage.expertiseDescription}
            </p>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            {expertiseCards.map(({ icon: Icon, title, body }) => (
              <article
                key={title}
                className="rounded-2xl border border-border/60 bg-white p-8 shadow-sm"
              >
                <div className="inline-flex rounded-xl bg-[#EDEFF4] p-3 text-[#2D6A47]">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-6 text-xl font-semibold tracking-[-0.01em] text-slate-950">
                  {title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-slate-600">{body}</p>
              </article>
            ))}
          </div>

          <div className="mt-12 flex justify-center">
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
