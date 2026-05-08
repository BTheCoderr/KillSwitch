import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /** Browsers often request `/favicon.ico` by legacy default; actual mark lives at `app/icon.svg`. */
  async redirects() {
    return [{ source: "/favicon.ico", destination: "/icon.svg", permanent: false }];
  },
};

export default nextConfig;
