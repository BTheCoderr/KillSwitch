import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "KILLSWITCH — Vote Simulator",
  robots: { index: false, follow: false },
};

export default function SimLayout({ children }: { children: React.ReactNode }) {
  return children;
}
