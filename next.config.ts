import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  /* config options here */
    async redirects() {
        return [
            {
                source: '/',
                destination: '/chats',
                permanent: true,
            },
        ]
    }
};

export default nextConfig;
