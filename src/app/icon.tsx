import { ImageResponse } from "next/og";
import { colors, loadFonts } from "@/lib/og";

// Browser tab icon: the "JT" mark from the site header.
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default async function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: colors.space,
        border: `4px solid ${colors.signal}`,
        borderRadius: 14,
        color: colors.paper,
        fontFamily: "Space Grotesk",
        fontSize: 30,
        letterSpacing: -1,
      }}
    >
      JT
    </div>,
    { ...size, fonts: await loadFonts() },
  );
}
