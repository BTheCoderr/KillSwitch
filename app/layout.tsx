import type { Metadata } from "next";
import { Inter, Rajdhani, Space_Grotesk, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

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

export const metadata: Metadata = {
  title: "KILLSWITCH — Code Under Pressure",
  description:
    "The premier live competitive coding platform. Developers go head-to-head in real time. Live stream. Crowd power. AI insight.",
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
        <Navbar />
        <main className="flex flex-1 flex-col pt-16 md:pt-[4.25rem]">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
