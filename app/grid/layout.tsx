import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "KILLSWITCH — Grid",
  robots: { index: false, follow: false },
};

export default function GridLayout({ children }: { children: React.ReactNode }) {
  return <div id="overlay-root">{children}</div>;
}
