import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Enables "use cache" directive, PPR and dynamicIO — Next.js 16+
  cacheComponents: true,
};

export default nextConfig;
