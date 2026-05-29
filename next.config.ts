import type {NextConfig} from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Pin the tracing root to THIS directory so Next.js doesn't crawl
  // up to the parent Costix/ folder and pick up the wrong lockfile.
  outputFileTracingRoot: path.join(__dirname),
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Only transpile framer-motion — the calculator uses it directly.
  // (motion v12 is not directly imported anywhere so we skip it to
  //  reduce webpack's compilation surface and first-load time.)
  transpilePackages: ['framer-motion'],
};

export default nextConfig;
