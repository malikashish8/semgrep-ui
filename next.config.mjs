/** @type {import('next').NextConfig} */
const nextConfig = {
    compress: true,
    experimental: {
        serverActions: {
            bodySizeLimit: '1000mb',
        },
    },
};

export default nextConfig;
