import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "KYRUMA — Creative Partner",
    short_name: "KYRUMA",
    description:
      "Estrategia, identidad y experiencia digital para empresas que han evolucionado.",
    start_url: "/",
    display: "standalone",
    background_color: "#f4f1ea",
    theme_color: "#161616",
    icons: [
      {
        src: "/icon.png",
        sizes: "1254x1254",
        type: "image/png",
      },
    ],
  };
}
