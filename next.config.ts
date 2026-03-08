import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },

  // Enable gzip/brotli compression for all assets
  compress: true,

  // Optimize production builds
  productionBrowserSourceMaps: false,

  // Headers for aggressive caching of 3D model assets
  async headers() {
    return [
      {
        // Cache GLB/GLTF/VRM model files aggressively
        source: "/models/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        // Cache avatar images
        source: "/avatars/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },

  // Webpack optimizations for Three.js
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Tree-shake Three.js — only bundle used modules
      config.resolve.alias = {
        ...config.resolve.alias,
        "three/examples/jsm": "three/examples/jsm",
      };

      // Increase chunk size limit for 3D libraries
      config.performance = {
        ...config.performance,
        maxAssetSize: 512000,
        maxEntrypointSize: 512000,
      };

      // Split Three.js into its own chunk for better caching
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...config.optimization?.splitChunks,
          cacheGroups: {
            ...(typeof config.optimization?.splitChunks === "object"
              ? config.optimization.splitChunks.cacheGroups
              : {}),
            three: {
              test: /[\\/]node_modules[\\/](three|@react-three)[\\/]/,
              name: "three-vendor",
              chunks: "all" as const,
              priority: 20,
            },
          },
        },
      };
    }
    return config;
  },
};

export default nextConfig;
