import Link from "next/link";
import { ArrowRight, Sparkles, Zap, Crosshair, ChevronRight } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import ProductCard from "@/components/storefront/ProductCard";
import { Marquee } from "@/components/ui/marquee";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
    const supabase = createClient();
    const { data: products } = await (await supabase)
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(4);

    const featuredProducts = products || [];
    const isEmpty = !products || products.length === 0;

    return (
        <main className="min-h-screen bg-neutral-950 text-foreground overflow-x-hidden selection:bg-purple-600 selection:text-white">

            {/* 
        ------------------------------------------------------------------
        SECTION 1: HERO (SPLIT LAYOUT)
        "Level Up Your Collection"
        ------------------------------------------------------------------
      */}
            <section className="relative w-full min-h-[80vh] flex flex-col pt-24 lg:pt-0 lg:flex-row items-center justify-between gap-12 px-6 sm:px-12 lg:px-24 border-b border-white/5">

                {/* Left: Text Content */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center relative z-10 py-12 lg:py-0">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-none text-gray-300 text-xs font-mono tracking-widest w-fit mb-6">
                        <span className="w-2 h-2 bg-purple-600 animate-pulse" />
                        PREMIUM & BUDGET
                    </div>

                    <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[0.9] mb-6 uppercase">
                        LEVEL UP <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
                            YOUR COLLECTION.
                        </span>
                    </h1>

                    <p className="text-xl text-neutral-400 max-w-lg leading-relaxed mb-10 font-medium">
                        Premium & Budget-Friendly Figures. Shipped safely from UP to your shelf.
                    </p>

                    <Link
                        href="/shop"
                        className="group w-full sm:w-fit relative px-8 py-5 bg-purple-600 text-white font-black text-xl tracking-wide uppercase italic hover:bg-purple-500 transition-colors duration-300 text-center clip-path-slant"
                        style={{ clipPath: "polygon(0 0, 100% 0, 95% 100%, 5% 100%)" }}
                    >
                        Start Hunting
                    </Link>
                </div>

                {/* Right: Visual Placeholder */}
                <div className="w-full lg:w-1/2 h-[400px] lg:h-[600px] bg-neutral-800 rounded-2xl flex items-center justify-center border-2 border-dashed border-neutral-700 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                    <span className="text-neutral-500 font-mono text-lg uppercase tracking-widest group-hover:text-purple-400 transition-colors duration-300">
                // HERO IMAGE PLACEHOLDER //
                    </span>
                </div>
            </section>


            {/* 
        ------------------------------------------------------------------
        SECTION 2: INFINITE MARQUEE
        "India's Otaku HQ..."
        ------------------------------------------------------------------
      */}
            <div className="bg-yellow-400 py-6 border-y-4 border-black relative z-20 overflow-hidden">
                <Marquee className="[--duration:25s]" repeat={8}>
                    <span className="mx-8 font-black text-3xl md:text-5xl text-black italic tracking-tighter uppercase whitespace-nowrap">
                        INDIA'S OTAKU HQ • TANK BUILD PACKAGING • NO CUSTOMS DUTY • SECURE SHIPPING •
                    </span>
                </Marquee>
            </div>


            {/* 
        ------------------------------------------------------------------
        SECTION 3: NEW DROPS (MINIMALIST GRID)
        "Fresh Arrivals"
        ------------------------------------------------------------------
      */}
            {!isEmpty && (
                <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-[1800px] mx-auto">
                    <div className="flex items-end justify-between mb-12 border-b border-white/10 pb-6">
                        <h2 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter">
                            FRESH ARRIVALS
                        </h2>
                        <Link
                            href="/shop"
                            className="text-white hover:text-yellow-400 transition-colors font-bold text-lg flex items-center gap-2 uppercase tracking-wide"
                        >
                            View All <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {featuredProducts.map((product) => (
                            <div key={product.id} className="group">
                                {/* Minimalist Card approach - we let ProductCard handle rendering but try to influence container */}
                                <div className="relative">
                                    <ProductCard product={product} />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}


            {/* 
        ------------------------------------------------------------------
        SECTION 4: BUDGET HUNTER BANNER
        "Under 999"
        ------------------------------------------------------------------
      */}
            <section className="relative w-full py-32 bg-neutral-900 border-y border-white/5 overflow-hidden group">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5 mix-blend-overlay" />

                <div className="relative z-10 max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left">
                    <div>
                        <h2 className="text-5xl md:text-8xl font-black text-white italic tracking-tighter mb-2 uppercase">
                            UNDER ₹999?
                        </h2>
                        <p className="text-2xl md:text-3xl text-gray-400 font-bold uppercase tracking-wide">
                            We got you covering the bill.
                        </p>
                    </div>

                    <Link
                        href="/shop?max=1000"
                        className="group relative px-10 py-6 border-2 border-white text-white font-black text-xl italic uppercase hover:bg-white hover:text-black transition-all duration-300"
                    >
                        Shop Budget Figures
                    </Link>
                </div>
            </section>


            {/* 
        ------------------------------------------------------------------
        SECTION 5: NEWSLETTER (MISSION BRIEFING)
        ------------------------------------------------------------------
      */}
            <section className="py-32 px-4 bg-black relative border-t border-white/10">
                <div className="max-w-4xl mx-auto border border-white/20 bg-neutral-950 p-8 md:p-12 relative overflow-hidden">

                    {/* Decorative Corner Markers */}
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-yellow-400" />
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-yellow-400" />
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-yellow-400" />
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-yellow-400" />

                    <div className="text-center font-mono space-y-6 relative z-10">
                        <div className="uppercase text-xs tracking-[0.3em] text-yellow-400">
              // CLASSIFIED INTEL //
                        </div>

                        <h2 className="text-3xl md:text-5xl font-bold text-white uppercase tracking-tighter">
                            HUNTER ASSOCIATION
                        </h2>

                        <p className="text-gray-400 max-w-lg mx-auto leading-relaxed">
                            Accept the mission. Get access to secret drops, pre-order intel, and member-only loot crates.
                        </p>

                        <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-0 mt-8 border border-white/20">
                            <input
                                type="email"
                                placeholder="CODENAME: EMAIL"
                                className="flex-1 bg-black px-6 py-4 text-white placeholder:text-gray-700 focus:outline-none font-mono text-sm uppercase"
                            />
                            <button
                                type="button"
                                className="bg-white text-black font-bold px-8 py-4 hover:bg-yellow-400 transition-colors uppercase tracking-wider text-sm border-l border-black"
                            >
                                JOIN
                            </button>
                        </form>

                        <div className="text-[10px] text-gray-700 mt-4 uppercase tracking-widest">
                            SECURE CHANNEL ESTABLISHED • NO SPAM ALGORITHM DETECTED
                        </div>
                    </div>

                    {/* Background Subtle Elements */}
                    <Crosshair className="absolute top-4 right-4 text-white/5 w-24 h-24 rotate-45 pointer-events-none" />
                    <Crosshair className="absolute bottom-4 left-4 text-white/5 w-24 h-24 -rotate-45 pointer-events-none" />
                </div>
            </section>

        </main>
    );
}
