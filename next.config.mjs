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
    // Silencing the warning about webpack config under Turbopack
    // as our webpack config is minor (logging only).
    experimental: {
        // turbo: {} // Invalid in Next.js 16
    },
    // Next.js 16+ Turbopack config needs to exist if webpack config exists
    // to confirm migration/intentional use.
    // Based on error message: "turbopack: {}"
    // However, typings might not reflect this yet if @types/next is old, but let's try runtime.
    // Actually, let's try experimental first? No, experimental.turbo failed.
    // Let's try adding it to experimental object with correct key if it changed?
    // Or maybe just invoke the flag?

    // Let's try to remove existing webpack config if it's not needed.
    // But let's try `turbopack: {}` at top level first as per error message hint.
    // Wait, the error message literally said `turbopack: {}`.

    // Let's try adding it at top level.
    // But I need to be careful with JSON structure.

    turbopack: {
        // ...
    },
    webpack: (config) => {
        config.infrastructureLogging = {
            level: 'error',
        };
        return config;
    },
};

export default nextConfig;
