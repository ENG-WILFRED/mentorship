/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com", // YouTube thumbnails if needed
      },
      {
        protocol: "https",
        hostname: "img.youtube.com", // YouTube alternative domain
      }
    ]
  }
};

module.exports = nextConfig;
