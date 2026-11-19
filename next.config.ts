import type { NextConfig } from "next";
const config: NextConfig = {
  poweredByHeader: false,
  // Opt-in for memory-constrained local builds; deployed defaults are unchanged.
  experimental:
    process.env.SKM_LOW_MEMORY_BUILD === "1"
      ? {
          cpus: 1,
          webpackMemoryOptimizations: true,
          parallelServerBuildTraces: false,
        }
      : undefined,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
        ],
      },
    ];
  },
};
export default config;
