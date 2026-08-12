import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Allow local network IP for cross-origin resources in development
  // @ts-ignore
  allowedDevOrigins: ["192.168.1.14", "localhost", "127.0.0.1"],
};

export default nextConfig;
