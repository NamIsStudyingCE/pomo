import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Cache-Control",
    value: "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
  },
];

const isDesktop = process.env.BUILD_TARGET === "desktop";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Desktop build dung thu muc rieng de khong vo .next cua ban web
  // (hai config khac nhau: trailingSlash/output-export; dung chung se tron manifest).
  distDir: isDesktop ? ".next-desktop" : ".next",
  // Desktop (Electron): export tinh de phuc vu qua custom protocol, khong can server.
  // headers() khong hoat dong voi output: export nen chi ap dung cho ban web.
  ...(isDesktop
    ? { output: "export", trailingSlash: true }
    : {
        async headers() {
          return [
            {
              source: "/:path*",
              headers: securityHeaders,
            },
          ];
        },
      }),
};

export default nextConfig;
