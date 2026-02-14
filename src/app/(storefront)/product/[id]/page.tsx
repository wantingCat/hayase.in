import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";

import Link from "next/link";
import { Product } from "@/types";
import ProductGallery from "@/components/storefront/ProductGallery";
import AddToCartSection from "@/components/storefront/AddToCartSection";
import ProductCard from "@/components/storefront/ProductCard";
import ProductReviews from "@/components/storefront/ProductReviews";
import { Shield, Truck, Package, ChevronRight } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function ProductPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const supabase = await createClient();

    // 1. Fetch current product
    console.log("Fetching product with ID:", params.id);
    const { data: product, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", params.id)
        .single();

    if (error) {
        console.error("Supabase Error:", error);
    }

    if (!product) {
        return notFound();
    }

    // 2. Fetch related products (random 4 excluding current)
    // Note: 'random' in SQL usually requires a function or specific query. 
    // For simplicity, we'll fetch latest 5 and filter current, or just take 4 other items.
    const { data: relatedData } = await supabase
        .from("products")
        .select("*")
        .neq("id", params.id)
        .limit(4);

    const relatedProducts = (relatedData as Product[]) || [];
    const currentProduct = product as Product;

    return (
        <main className="min-h-screen bg-navy text-foreground overflow-x-hidden relative pb-20">
            {/* Background Elements */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyber-pink/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyber-cyan/5 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32">

                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8 overflow-x-auto whitespace-nowrap pb-2">
                    <Link href="/" className="hover:text-cyber-cyan transition-colors">Home</Link>
                    <ChevronRight size={14} />
                    <Link href="/shop" className="hover:text-cyber-cyan transition-colors">Shop</Link>
                    <ChevronRight size={14} />
                    <span className="text-white font-medium truncate max-w-[200px] sm:max-w-md">{currentProduct.name}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">

                    {/* Left Column: Gallery (60% ~ col-span-7) */}
                    <div className="lg:col-span-7 space-y-4">
                        <ProductGallery
                            images={currentProduct.images || []}
                            productName={currentProduct.name}
                        />

                        {/* Trust Badges (Desktop) */}

                    </div>

                    {/* Right Column: Product Details (40% ~ col-span-5) */}
                    <div className="lg:col-span-5 flex flex-col lg:sticky lg:top-32 h-fit">
                        <div className="flex flex-col gap-4 mb-6">
                            <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                                {currentProduct.name}
                            </h1>

                            <div className={`self-start flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold border ${currentProduct.stock > 0
                                ? 'bg-green-500/10 border-green-500/20 text-green-400'
                                : 'bg-red-500/10 border-red-500/20 text-red-400'
                                }`}>
                                <div className={`w-2 h-2 rounded-full ${currentProduct.stock > 0 ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                                {currentProduct.stock > 0 ? 'In Stock' : 'Out of Stock'}
                            </div>

                            <span className="text-4xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan to-blue-500 text-shadow-glow">
                                ₹{currentProduct.price.toLocaleString('en-IN')}
                            </span>
                        </div>

                        <div className="custom-scrollbar prose prose-invert max-w-none text-gray-300 mb-6 leading-relaxed max-h-[400px] overflow-y-auto pr-2">
                            {currentProduct.description ? (
                                <p>{currentProduct.description}</p>
                            ) : (
                                <p className="text-gray-500 italic">No description available for this figure yet. Trust us, it's cute.</p>
                            )}
                        </div>



                        {/* Add To Cart Section */}
                        <div className="mb-8">
                            <AddToCartSection product={currentProduct} />
                        </div>

                        {/* Shipping Info */}
                        <div className="flex items-start gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                            <Truck className="text-gray-400 mt-1" size={20} />
                            <div className="text-sm text-gray-400">
                                <p className="mb-1">Flat Rate Shipping: <span className="text-white font-medium">₹60</span></p>
                                <p><strong className="text-white">Free Shipping</strong> on orders over ₹999.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <ProductReviews productId={currentProduct.id} />

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="mt-32 border-t border-white/10 pt-16">
                        <h2 className="text-3xl font-bold text-white mb-8">You Might Also Like</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map((p) => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
