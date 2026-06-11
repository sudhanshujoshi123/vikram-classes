// D:\wst\vkr\next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // ❌ Yahan 'content', 'theme', 'plugins' jaise Tailwind options NAHIN aayenge
  // ❌ 'experimental.turbo' bhi mat rakho (Next 16 me invalid hai)
};

export default nextConfig;