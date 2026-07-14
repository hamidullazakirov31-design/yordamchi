/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Build vaqtida lint xatolari deploy'ni to'xtatmasin (auth asosi uchun)
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
