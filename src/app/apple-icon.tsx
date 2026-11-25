import { ImageResponse } from "next/og";
import { colors, loadFonts } from "@/lib/og";

// Home-screen icon for iPhones and iPads. iOS rounds the corners itself.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `radial-gradient(circle at 50% 100%, rgba(61,123,255,0.45), ${colors.space} 70%)`,
        color: colors.paper,
        fontFamily: "Space Grotesk",
        fontSize: 84,
        letterSpacing: -3,
      }}
    >
      J<span style={{ color: colors.signal }}>T</span>
    </div>,
    { ...size, fonts: await loadFonts() },
  );
}
