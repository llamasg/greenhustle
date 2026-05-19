import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // The lineup used to live at /lineup; it's now at /. Preserve any
      // existing inbound links shared during the /lineup era.
      {
        source: "/lineup",
        destination: "/",
        permanent: true,
      },
      {
        source: "/lineup/:path*",
        destination: "/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
