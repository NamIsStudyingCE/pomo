import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Pomo - Deep Work Tracker",
    short_name: "Pomo",
    description: "Theo dõi tập trung trung thực. Honest deep-work tracking.",
    start_url: "/today",
    display: "standalone",
    background_color: "#faf7f1",
    theme_color: "#c74a16",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
