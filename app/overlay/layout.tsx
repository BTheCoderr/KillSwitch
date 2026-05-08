import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "KILLSWITCH — Overlay",
};

export default function OverlayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div id="overlay-root">{children}</div>;
}
