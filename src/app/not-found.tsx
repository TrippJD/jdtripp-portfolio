import type { Metadata } from "next";
import Link from "next/link";
import { Starfield } from "@/components/hero/starfield";

export const metadata: Metadata = {
  title: "Page not found",
};

/** 404: an off-course page in the same style as the hero. */
export default function NotFound() {
  return (
    <main className="relative isolate flex min-h-svh flex-col overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <Starfield className="size-full" />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-[radial-gradient(ellipse_at_bottom,rgba(61,123,255,0.18),transparent_70%)]"
      />

      <header className="mx-auto w-full max-w-7xl px-6 py-5">
        <Link
          href="/"
          className="group inline-flex items-center gap-3"
          aria-label="Josh Tripp, home"
        >
          <span className="grid size-9 place-items-center rounded-md border border-line bg-space/60 font-mono text-xs font-bold backdrop-blur transition-colors group-hover:border-signal group-hover:text-signal">
            JT
          </span>
        </Link>
      </header>

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-6 pb-24">
        <p className="eyebrow">[ Error 404 · Off course ]</p>
        <h1 className="mt-6 text-6xl leading-[0.9] font-bold tracking-tighter md:text-8xl">
          Lost in <span className="text-signal">space.</span>
        </h1>
        <p className="mt-8 max-w-md text-lg leading-relaxed text-haze">
          This page drifted out of orbit. It doesn&apos;t exist, or it moved somewhere else.
        </p>
        <Link
          href="/"
          className="mt-10 self-start rounded-full bg-signal px-6 py-3 font-medium text-space transition-colors hover:bg-paper"
        >
          Return to base
        </Link>
      </div>
    </main>
  );
}
