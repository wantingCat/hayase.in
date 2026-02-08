import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen pt-32 flex flex-col items-center justify-center text-center px-4 bg-navy text-foreground">
            <h1 className="text-6xl font-bold text-cyber-pink mb-4 animate-pulse">404</h1>
            <h2 className="text-2xl font-bold text-white mb-6">Page Not Found</h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
                The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>
            <Link
                href="/"
                className="px-8 py-3 rounded-full bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/20 hover:bg-cyber-cyan/20 transition-colors font-mono"
            >
                Return Home
            </Link>
        </div>
    );
}
