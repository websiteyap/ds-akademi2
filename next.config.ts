import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    // Images are now served locally, but keeping Next.js image optimization
    // You can add remotePatterns here if you ever load images from an external domain
  },
  // Required for NextAuth v5 when running behind a reverse proxy (Dokploy/Nginx/Traefik)
  // This allows NextAuth to trust the host header from the proxy
  experimental: {
    // No special experimental flags needed
  },
};

export default nextConfig;
