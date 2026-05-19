/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Netlify خودش .next را مدیریت می‌کند؛ API routes به صورت Netlify Functions
  // اجرا می‌شوند (با @netlify/plugin-nextjs). نیازی به output:'export' نیست
  // چون API route /api/prices سمت سرور لازم داریم.
  images: {
    remotePatterns: [],
  },
}

module.exports = nextConfig
