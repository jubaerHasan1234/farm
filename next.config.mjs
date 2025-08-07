/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "ix-marketing.imgix.net" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "http", hostname: "localhost" },
      { protocol: "https", hostname: "placehold.co" },
    ],
    domains: [
      "images.unsplash.com",
      "ix-marketing.imgix.net",
      "lh3.googleusercontent.com",
      "localhost",
      "placehold.co",
    ],
  },

  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push({
        "pdfkit/js/data": "commonjs pdfkit/js/data",
      });
    }
    return config;
  },

  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
