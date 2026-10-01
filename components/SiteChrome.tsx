"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/Footer";
import { MobileCtaBar } from "@/components/MobileCtaBar";
import { Navbar } from "@/components/Navbar";

const BARE_PREFIXES = ["/live", "/overlay", "/grid"];

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const bare = BARE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  if (bare) {
    return <main className="flex min-h-screen flex-1 flex-col">{children}</main>;
  }

  return (
    <>
      <Navbar />
      <main className="flex flex-1 flex-col pb-24 pt-16 md:pb-0 md:pt-[4.25rem]">
        {children}
      </main>
      <Footer />
      <MobileCtaBar />
    </>
  );
}
