import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";

import Link from "next/link";
import { Product } from "@/types";
import ProductGallery from "@/components/storefront/ProductGallery";
import AddToCartSection from "@/components/storefront/AddToCartSection";
import ProductCard from "@/components/storefront/ProductCard";
import { Shield, Truck, Package, ChevronRight } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function ProductPage({ params }: { params: { id: string } }) {
    const supabase = createClient();

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
                        <div className="hidden lg:grid grid-cols-3 gap-4 pt-8">
                            {[
                                { icon: Shield, label: "Authentic", sub: "100% Verified" },
                                { icon: Truck, label: "Fast Shipping", sub: "Global Delivery" },
                                { icon: Package, label: "Secure Pack", sub: "Mint Condition" }
                            ].map((badge, idx) => (
                                <div key={idx} className="flex flex-col items-center text-center p-4 rounded-xl bg-white/5 border border-white/5">
                                    <badge.icon className="text-cyber-cyan mb-2" size={24} />
                                    <span className="text-sm font-bold text-white">{badge.label}</span>
                                    <span className="text-xs text-gray-500">{badge.sub}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Product Details (40% ~ col-span-5) */}
                    <div className="lg:col-span-5 flex flex-col lg:sticky lg:top-32 h-fit">
                        <div className="mb-2">
                            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-cyber-pink/10 text-cyber-pink border border-cyber-pink/20 uppercase tracking-wider">
                                {currentProduct.manufacturer}
                            </span>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-4">
                            {currentProduct.name}
                        </h1>

                        <div className="flex items-center gap-6 mb-8">
                            <span className="text-4xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan to-blue-500 text-shadow-glow">
                                ₹{currentProduct.price.toLocaleString('en-IN')}
                            </span>
                            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold border ${currentProduct.stock > 0
                                ? 'bg-green-500/10 border-green-500/20 text-green-400'
                                : 'bg-red-500/10 border-red-500/20 text-red-400'
                                }`}>
                                <div className={`w-2 h-2 rounded-full ${currentProduct.stock > 0 ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                                {currentProduct.stock > 0 ? 'In Stock' : 'Out of Stock'}
                            </div>
                        </div>

                        <div className="prose prose-invert max-w-none text-gray-300 mb-10 leading-relaxed">
                            <p>{currentProduct.description}</p>
                        </div>

                        {/* Specifications Table */}
                        <div className="bg-white/5 rounded-2xl p-6 border border-white/5 space-y-4 mb-10">
                            <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2">Specs</h3>
                            <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
                                <div>
                                    <span className="block text-gray-500 text-xs uppercase tracking-wider mb-1">Manufacturer</span>
                                    <span className="text-white font-medium">{currentProduct.manufacturer}</span>
                                </div>
                                <div>
                                    <span className="block text-gray-500 text-xs uppercase tracking-wider mb-1">Scale</span>
                                    <span className="text-white font-medium">{currentProduct.scale}</span>
                                </div>
                                <div>
                                    <span className="block text-gray-500 text-xs uppercase tracking-wider mb-1">Condition</span>
                                    <span className="text-white font-medium capitalize flex items-center gap-2">
                                        {currentProduct.condition === 'new' && <span className="w-1.5 h-1.5 bg-cyber-pink rounded-full" />}
                                        {currentProduct.condition}
                                    </span>
                                </div>
                                {/* Placeholder for Source if needed later */}
                            </div>
                        </div>

                        {/* Add To Cart Section */}
                        <div className="mb-12">
                            <AddToCartSection product={currentProduct} />
                        </div>
                    </div>
                </div>

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
