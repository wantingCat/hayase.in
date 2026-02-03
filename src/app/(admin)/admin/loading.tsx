export default function Loading() {
    return (
        <div className="space-y-8 animate-pulse">
            <div>
                <div className="h-8 w-48 bg-white/10 rounded-lg mb-2"></div>
                <div className="h-4 w-64 bg-white/5 rounded-lg"></div>
            </div>

            <div className="w-full rounded-xl border border-white/10 overflow-hidden">
                <div className="h-12 bg-white/5 border-b border-white/10"></div>
                <div className="divide-y divide-white/5">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-20 bg-black/20 flex items-center px-4 gap-4">
                            <div className="w-12 h-12 rounded bg-white/10"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-4 w-1/3 bg-white/10 rounded"></div>
                                <div className="h-3 w-1/4 bg-white/5 rounded"></div>
                            </div>
                            <div className="w-20 h-8 bg-white/5 rounded"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
