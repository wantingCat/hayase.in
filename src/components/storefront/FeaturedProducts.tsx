import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default async function FeaturedProducts() {
    const { data: products } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(4);

    return (
        <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-12">
                <h2 className="text-3xl font-bold text-white tracking-tight">
                    Featured <span className="text-cyber-pink">Drops</span>
                </h2>
                <Link href="/shop" className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors text-sm">
                    View All <ArrowRight size={16} />
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {(products || []).map((product) => (
                    <Link
                        key={product.id}
                        href={`/shop/${product.id}`}
                        className="group relative block"
                    >
                        <div className="aspect-[3/4] overflow-hidden rounded-xl bg-gray-900 border border-white/10 relative">
                            {product.images && product.images[0] ? (
                                <Image
                                    src={product.images[0]}
                                    alt={product.name}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-700">
                                    No Image
                                </div>
                            )}

                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                            {/* Content */}
                            <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                                <p className="text-xs text-cyber-cyan font-bold uppercase tracking-wider mb-1">{product.manufacturer}</p>
                                <h3 className="text-white font-bold leading-tight mb-2 line-clamp-2">{product.name}</h3>
                                <div className="flex items-center justify-between">
                                    <span className="text-white font-mono bg-white/10 px-2 py-1 rounded text-sm backdrop-blur-sm">
                                        ₹{product.price.toLocaleString('en-IN')}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Hover Border Glow */}
                        <div className="absolute inset-0 rounded-xl border border-white/10 group-hover:border-cyber-pink/50 transition-colors pointer-events-none" />
                    </Link>
                ))}
            </div>

            {(products || []).length === 0 && (
                <div className="text-center py-20 text-gray-500">
                    No products found. Add some from the admin panel!
                </div>
            )}
        </section>
    );
}
