import type { Metadata } from "next";
import { Inter, Rajdhani, Space_Grotesk, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteChrome } from "@/components/SiteChrome";

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const description =
  "Live competitive coding battles with OBS-first arenas, audience modifiers, synchronized producer controls, match-aware live explanation, tournaments, and replays.";

const ogTitle = "Killswitch — Live coding battle broadcast";

function siteOrigin(): URL {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (typeof explicit === "string" && explicit.length > 0) {
    return new URL(explicit.startsWith("http") ? explicit : `https://${explicit}`);
  }
  return new URL("https://kill-switch-beta.vercel.app");
}

export const metadata: Metadata = {
  metadataBase: siteOrigin(),
  title: {
    default: "Killswitch",
    template: "%s · Killswitch",
  },
  description,
  applicationName: "Killswitch",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    /** Legacy clients probe `/favicon.ico`; redirected in next.config.ts to the same SVG. */
    shortcut: "/icon.svg",
  },
  keywords: [
    "live coding",
    "competitive programming",
    "esports",
    "developers",
    "Killswitch",
    "streaming",
  ],
  openGraph: {
    title: ogTitle,
    description,
    siteName: "Killswitch",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: ogTitle,
    description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${rajdhani.variable} ${spaceGrotesk.variable} ${inter.variable} ${geistMono.variable} flex min-h-screen flex-col font-sans`}
      >
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
