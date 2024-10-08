/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["nrs.harvard.edu"]
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/home",
        permanent: true
      }
    ];
  },
  reactStrictMode: false
};

export default nextConfig;
