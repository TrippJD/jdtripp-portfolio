# jdtripp.com

The personal site of **Josh Tripp**, a senior software engineer and team lead in Provo, Utah.

My professional work lives in private codebases, so this repo is one you can read. The site is a single scroll-driven page with a "flight log" theme: a star field that streaks as you scroll, pinned sections, a sideways-scrolling career timeline and a working contact form.

**Live:** [jdtripp.com](https://jdtripp.com)

## Stack

| Area         | Choice                                                                                                                                                  |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework    | [Next.js 16](https://nextjs.org) (App Router, Cache Components) and React 19                                                                            |
| Language     | TypeScript (strict)                                                                                                                                     |
| Styling      | Tailwind CSS 4 with a small set of design tokens                                                                                                        |
| Motion       | [GSAP](https://gsap.com) (ScrollTrigger, SplitText) and [Lenis](https://lenis.darkroom.engineering) smooth scrolling                                    |
| Contact form | Server Action, [Zod](https://zod.dev) validation, [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/) and [Resend](https://resend.com) |
| Hosting      | [Vercel](https://vercel.com), deployed on every push to `main`                                                                                          |

## Decisions worth a look

- **One frame loop.** Lenis runs on GSAP's ticker instead of its own `requestAnimationFrame`, so scrolling and animation never fight over frames ([`smooth-scroll.tsx`](src/components/providers/smooth-scroll.tsx)).
- **Effects clean up after themselves.** Animations are scoped to their component with `useGSAP` and torn down on unmount. The canvas star field pauses when it's off screen ([`starfield.tsx`](src/components/hero/starfield.tsx)).
- **Reduced motion is a real mode.** With `prefers-reduced-motion`, nothing pins or streaks, smooth scrolling is off, the timeline stacks vertically and all content is still there.
- **Layouts adapt, not just shrink.** The career timeline scrolls sideways on large screens and becomes a vertical route on phones ([`experience.tsx`](src/components/sections/experience.tsx)).
- **Content kept out of the code.** Every word on the page lives in one typed file, [`src/content/site.ts`](src/content/site.ts), so copy changes never touch a component.
- **A contact form that's safe to leave public.** A honeypot, server-side validation and a Turnstile check run before anything is sent. Email goes out as plain text, and the recipient address lives in an environment variable, not in this public repo ([`contact.ts`](src/app/actions/contact.ts)).
- **Generated assets.** The favicon and link-preview card are rendered at build time with `next/og` in the site's own fonts.

A few hard-won notes are left as comments in the code, for example why scroll triggers use `PLAY_ONCE` instead of `once: true` ([`gsap.ts`](src/lib/gsap.ts)), and why the copyright year is read only in the browser ([`current-year.tsx`](src/components/current-year.tsx)).

## Project structure

```
src/
  app/            page, layout, contact Server Action, icons, link preview, 404
  components/
    hero/         hero section, star field, live clock
    sections/     statement, stats, timeline, skills, build notes, about, contact
    providers/    smooth scrolling
  content/        all site copy (site.ts)
  lib/            GSAP setup, image helpers, site URL
assets/           fonts and portrait used to render the preview card
public/images/    portrait shown on the page
```

## Running locally

Requires Node.js 20.9 or later and pnpm.

```bash
pnpm install
pnpm dev
```

Then open [http://localhost:3000](http://localhost:3000).

The contact form works locally without any keys: messages are logged to the terminal instead of being sent. To test the full flow, copy `.env.example` to `.env.local` and fill in the values. Cloudflare's always-pass Turnstile test keys are listed there.

| Command       | What it does                                   |
| ------------- | ---------------------------------------------- |
| `pnpm dev`    | Start the development server                   |
| `pnpm build`  | Build for production                           |
| `pnpm start`  | Serve the production build                     |
| `pnpm lint`   | Run ESLint                                     |
| `pnpm format` | Format with Prettier and sort Tailwind classes |

## Credits

Fonts: [Space Grotesk](https://github.com/floriankarsten/space-grotesk) and [Space Mono](https://github.com/googlefonts/spacemono), both under the SIL Open Font License (see `assets/fonts`).

© Josh Tripp. The code is here to read and learn from; please don't republish the site as your own.
