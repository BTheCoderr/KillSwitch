import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "KILLSWITCH — Admin",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div id="overlay-root">{children}</div>;
}
