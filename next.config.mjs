// next.config.js (should already be like this from previous steps)

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "ix-marketing.imgix.net" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "http", hostname: "localhost" },
      { protocol: "https", hostname: "placehold.co" },
    ],
    domains: ["placehold.co"],
    dangerouslyAllowSVG: true,
  },

  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push({
        "pdfkit/js/data": "commonjs pdfkit/js/data",
      });
    }
    return config;
  },
};

export default nextConfig;
