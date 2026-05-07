/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["i.ibb.co", 'cdn.prod.website-files.com'],
    remotePatterns: [new URL("https://www.dailysattakings.com/**")],
  },
};

export default nextConfig;
