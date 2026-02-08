import Navbar from "@/components/storefront/Navbar";
import FeaturedProducts from "@/components/storefront/FeaturedProducts";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const supabase = createClient();
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  const featuredProducts = products?.slice(0, 4) || [];
  const isEmpty = !products || products.length === 0;

  return (
    <main className="min-h-screen bg-navy text-foreground overflow-x-hidden relative">
      {/* Global Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-navy" />
        <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-cyber-pink/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-cyber-cyan/20 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
      </div>


      <div className="relative z-10">


        {/* Hero Section */}
        <section className={`relative w-full flex items-center justify-center overflow-hidden pt-32 ${isEmpty ? 'min-h-[60vh]' : 'h-[85vh]'}`}>

          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            {isEmpty ? (
              <div className="py-10">
                <Sparkles className="w-20 h-20 text-cyber-pink mx-auto mb-6 animate-pulse" />
                <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tighter mb-6 leading-tight">
                  Grand Opening <br /><span className="text-cyber-cyan">Coming Soon</span>
                </h1>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                  Our curators are currently hunting for the rarest figures in Akihabara.
                  <br />
                  Check back soon for our first drop!
                </p>
              </div>
            ) : (
              <>
                <div className="inline-block mb-4 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-xs font-mono text-cyber-cyan tracking-widest animate-in fade-in slide-in-from-bottom-4 duration-700">
                  PREMIUM ANIME COLLECTIBLES
                </div>
                <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tighter mb-8 leading-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
                  The Best <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-pink to-purple-500">Anime Figures</span> <br />
                  in India.
                </h1>
                <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                  Authentic, high-quality figures delivered straight to your doorstep.
                  Curated for the true collector.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
                  <Link
                    href="/shop"
                    className="group relative px-8 py-4 bg-cyber-pink text-black font-bold text-lg rounded-full overflow-hidden transition-transform hover:scale-105"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Shop Now <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  </Link>
                  <Link
                    href="/shop"
                    className="px-8 py-4 rounded-full border border-white/20 text-white font-medium hover:bg-white/5 transition-colors"
                  >
                    View Collection
                  </Link>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Featured Section */}
        {!isEmpty && <FeaturedProducts products={featuredProducts} />}

      </div>
    </main>
  );
}
