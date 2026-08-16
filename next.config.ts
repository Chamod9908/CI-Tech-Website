import type { NextConfig } from "next";

// Dynamically generate subnet IPs so any PC or device on the local network can access dev server
const localSubnetIps = [
  ...Array.from({ length: 254 }, (_, i) => `192.168.1.${i + 1}`),
  ...Array.from({ length: 254 }, (_, i) => `192.168.0.${i + 1}`),
  ...Array.from({ length: 254 }, (_, i) => `10.0.0.${i + 1}`),
  "192.168.1.*",
  "192.168.0.*",
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
];

const nextConfig: NextConfig = {
  // Allow local network IP for cross-origin resources in development
  // @ts-ignore
  allowedDevOrigins: localSubnetIps,
};

export default nextConfig;
