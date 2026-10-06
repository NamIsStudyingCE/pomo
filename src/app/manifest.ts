import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Pomo - Deep Work Tracker",
    short_name: "Pomo",
    description: "Theo dõi tập trung trung thực. Honest deep-work tracking.",
    start_url: "/today",
    scope: "/",
    display: "standalone",
    background_color: "#faf7f1",
    theme_color: "#faf7f1",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
