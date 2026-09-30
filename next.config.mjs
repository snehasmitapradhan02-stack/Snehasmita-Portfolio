/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 390, 430, 640, 768, 1024, 1280, 1440, 1920, 2560],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'motion', '@react-three/drei'],
  },
};

export default nextConfig;
