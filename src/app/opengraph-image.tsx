import { ImageResponse } from "next/og";
import { site } from "@/content/site";
import { colors, loadFonts, loadPortrait } from "@/lib/og";

// The preview card shown when the site is shared on LinkedIn, Slack, iMessage, etc.
export const alt = `${site.name.first} ${site.name.last}, ${site.role.toLowerCase()} in ${site.location.city}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const [fonts, portrait] = await Promise.all([loadFonts(), loadPortrait()]);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        background: colors.space,
        fontFamily: "Space Grotesk",
        color: colors.paper,
      }}
    >
      {/* Instrument grid and blue glow, like the hero. */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundImage: `linear-gradient(to right, ${colors.line} 1px, transparent 1px), linear-gradient(to bottom, ${colors.line} 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          opacity: 0.45,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          background: "radial-gradient(circle at 78% 100%, rgba(61,123,255,0.55), transparent 55%)",
        }}
      />

      {/* Portrait on the right, rising from the bottom edge. */}
      {/* eslint-disable-next-line @next/next/no-img-element -- rendered to PNG, not HTML */}
      <img
        src={portrait}
        width={440}
        height={550}
        alt=""
        style={{ position: "absolute", right: 60, bottom: 0 }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          width: 720,
          height: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            fontFamily: "Space Mono",
            fontSize: 22,
            letterSpacing: 4,
            color: colors.signal,
            textTransform: "uppercase",
          }}
        >
          <span style={{ color: colors.flare }}>[</span>
          <span style={{ margin: "0 14px" }}>Flight log 001 · {site.location.city}</span>
          <span style={{ color: colors.flare }}>]</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 150, lineHeight: 0.9, letterSpacing: -6 }}>
            {site.name.first}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 150,
              lineHeight: 0.9,
              letterSpacing: -6,
              color: colors.signal,
            }}
          >
            {site.name.last}
          </div>
          <div
            style={{ display: "flex", marginTop: 36, maxWidth: 500, fontSize: 34, lineHeight: 1.2 }}
          >
            {site.role}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontFamily: "Space Mono",
            fontSize: 22,
            letterSpacing: 3,
            color: colors.haze,
            textTransform: "uppercase",
          }}
        >
          jdtripp.com
        </div>
      </div>
    </div>,
    { ...size, fonts },
  );
}
