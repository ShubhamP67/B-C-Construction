import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // Pin the Turbopack workspace root to this project to avoid incorrect inference
  // when multiple lockfiles exist on the machine.
  turbopack: {
    // Using a relative path is accepted; Next will resolve it to absolute.
    root: ".",
  },
};

export default nextConfig;
