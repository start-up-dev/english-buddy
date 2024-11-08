/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Permissions-Policy",
            value: "microphone=self", // Allow microphone access
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
