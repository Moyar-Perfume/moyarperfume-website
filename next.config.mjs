/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "pos.nvncdn.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
