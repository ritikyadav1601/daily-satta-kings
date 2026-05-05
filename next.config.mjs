/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["i.ibb.co", 'cdn.prod.website-files.com'],
    remotePatterns: [new URL("https://goodlucksatta.in/**")],
  },
};

export default nextConfig;
