import ProductCard from "@/components/storefront/ProductCard";
import { supabase } from "@/lib/supabaseClient";
import { Ghost, Search } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function ShopPage() {
    const { data: products } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

    const isEmpty = !products || products.length === 0;

    return (
        <div className="flex flex-col md:flex-row gap-8 min-h-[60vh] pt-32 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Sidebar - Desktop Only for now */}
            <aside className="hidden md:block w-64 shrink-0 space-y-8">
                <div>
                    <h3 className="text-lg font-bold text-white mb-4">Search</h3>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search figures..."
                            className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-cyber-pink/50 transition-colors"
                        />
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-bold text-white mb-4">Categories</h3>
                    <div className="space-y-2">
                        {['Scale Figures', 'Nendoroid', 'Figma', 'Prize Figures'].map((cat) => (
                            <label key={cat} className="flex items-center gap-2 text-gray-400 hover:text-white cursor-pointer transition-colors">
                                <div className="w-4 h-4 rounded border border-white/20" />
                                {cat}
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-bold text-white mb-4">Price Range</h3>
                    <div className="h-1 bg-white/10 rounded-full relative">
                        <div className="absolute left-0 w-1/2 h-full bg-cyber-pink rounded-full" />
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 mt-2">
                        <span>₹0</span>
                        <span>₹50,000+</span>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-white">All Products</h1>
                    <span className="text-gray-400 text-sm">
                        Showing {products?.length || 0} results
                    </span>
                </div>

                {isEmpty ? (
                    <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/10 rounded-2xl bg-white/5">
                        <Ghost className="w-16 h-16 text-gray-600 mb-4" />
                        <h2 className="text-xl font-bold text-white mb-2">No products found</h2>
                        <p className="text-gray-400 text-center max-w-md">
                            Our curators are hunting for figures... Check back soon!
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
