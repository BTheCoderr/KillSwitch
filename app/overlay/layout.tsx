import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "KILLSWITCH — Overlay",
  robots: { index: false, follow: false },
};

export default function OverlayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div id="overlay-root">{children}</div>;
}
