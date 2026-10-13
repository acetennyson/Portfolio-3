import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ado Daniel Nji — Full-Stack Developer & Designer",
    short_name: "Ado Daniel Nji",
    description: "Portfolio of Ado Daniel Nji (IAmSupreme) — full-stack developer, designer and founder based in Douala, Cameroon.",
    start_url: "/",
    display: "standalone",
    background_color: "#0c0c0d",
    theme_color: "#0c0c0d",
    icons: [
      { src: "/icon", sizes: "64x64", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
