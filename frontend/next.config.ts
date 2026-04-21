import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    domains: ["images.unsplash.com", "res.cloudinary.com"],
  }
};

export default nextConfig;
