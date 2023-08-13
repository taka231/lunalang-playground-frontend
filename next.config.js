/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/playground",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://localhost:8080"
            : "http://133.167.40.90:8080",
      },
    ];
  },
};

module.exports = nextConfig;
