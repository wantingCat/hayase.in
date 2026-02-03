/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**.supabase.co',
            },
            {
                protocol: 'https',
                hostname: '**.supabase.in', // covering potential region variations
            }
        ],
    },
    webpack: (config) => {
        config.infrastructureLogging = {
            level: 'error',
        };
        return config;
    },
};

export default nextConfig;
