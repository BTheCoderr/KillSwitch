import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "KILLSWITCH — Live Arena",
  robots: { index: false, follow: false },
};

export default function LiveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div id="overlay-root">{children}</div>;
}
