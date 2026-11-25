import { readFile } from "node:fs/promises";
import { cacheLife } from "next/cache";
import { join } from "node:path";

// Shared helpers for images generated at build time (icons and link previews).
// Fonts are local copies of Space Grotesk and Space Mono (SIL OFL, see assets/fonts).

export const colors = {
  space: "#0a0f1c",
  space2: "#111829",
  line: "#26304a",
  paper: "#e8ecf2",
  haze: "#8a94a8",
  signal: "#3d7bff",
  flare: "#ff7a2f",
} as const;

const asset = (...path: string[]) => readFile(join(process.cwd(), "assets", ...path));

// Both loaders are cached so the images using them can be built once at build
// time. Under Cache Components, an uncached file read would make those routes
// render on every request, reading assets/ at runtime.

async function loadFontFiles() {
  "use cache";
  cacheLife("max");
  const [grotesk, mono] = await Promise.all([
    asset("fonts", "SpaceGrotesk-Bold.woff"),
    asset("fonts", "SpaceMono-Regular.woff"),
  ]);
  return { grotesk: new Uint8Array(grotesk), mono: new Uint8Array(mono) };
}

export async function loadFonts() {
  const { grotesk, mono } = await loadFontFiles();
  return [
    {
      name: "Space Grotesk",
      data: grotesk.slice().buffer,
      weight: 700 as const,
      style: "normal" as const,
    },
    {
      name: "Space Mono",
      data: mono.slice().buffer,
      weight: 400 as const,
      style: "normal" as const,
    },
  ];
}

export async function loadPortrait() {
  "use cache";
  cacheLife("max");
  const png = await asset("og-portrait.png");
  return `data:image/png;base64,${png.toString("base64")}`;
}
