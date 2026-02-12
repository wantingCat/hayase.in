import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import ProductCard from "@/components/storefront/ProductCard";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  const supabase = await createClient();
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

        {/* New Arrivals Section */}
        {!isEmpty && (
          <section className="py-20 px-4 max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">New Arrivals</h2>
                <p className="text-gray-400">Fresh from Japan, just for you.</p>
              </div>
              <Link href="/shop" className="text-cyber-cyan hover:text-white transition-colors flex items-center gap-1 text-sm font-bold">
                View All <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* Newsletter */}
        <section className="py-24 bg-gradient-to-t from-black to-transparent border-t border-white/5 relative overflow-hidden">
          <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-t from-cyber-pink/5 to-transparent opacity-50 pointer-events-none" />
          <div className="relative z-10 max-w-xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Join the Hunter Association</h2>
            <p className="text-gray-400 mb-8">Get exclusive access to new drops, pre-orders, and secret sales.</p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyber-pink/50"
              />
              <button className="bg-cyber-pink text-black font-bold px-6 py-3 rounded-lg hover:bg-cyber-pink/90 transition-colors">
                Subscribe
              </button>
            </form>
          </div>
        </section>

      </div>
    </main>
  );
}
