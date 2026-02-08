"use client";

import { useState } from "react";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { Minus, Plus, ShoppingBag, Heart, Share2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface AddToCartSectionProps {
    product: Product;
}

export default function AddToCartSection({ product }: AddToCartSectionProps) {
    const [quantity, setQuantity] = useState(1);
    const [isAdding, setIsAdding] = useState(false);
    const { addItem } = useCart();
    const router = useRouter();

    const maxStock = product.stock;
    const isOutOfStock = maxStock <= 0;

    const handleQuantityChange = (delta: number) => {
        setQuantity(prev => {
            const next = prev + delta;
            if (next < 1) return 1;
            if (next > maxStock) {
                toast.warning(`Only ${maxStock} items available in stock`);
                return maxStock;
            }
            return next;
        });
    };

    const handleAddToCart = async (buyNow = false) => {
        if (isOutOfStock) return;

        setIsAdding(true);
        // Simulate a small delay for better UX feel or await async actions if any
        await new Promise(resolve => setTimeout(resolve, 300));

        addItem(product, quantity);

        if (buyNow) {
            router.push('/checkout');
        }

        setIsAdding(false);
    };

    return (
        <div className="space-y-6">
            {/* Stock Status & Quantity Row */}
            {!isOutOfStock && (
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3 bg-white/5 rounded-full p-1 border border-white/10">
                        <button
                            onClick={() => handleQuantityChange(-1)}
                            disabled={quantity <= 1 || isAdding}
                            className="p-2 rounded-full hover:bg-white/10 text-white disabled:opacity-50 transition-colors"
                        >
                            <Minus size={16} />
                        </button>
                        <span className="w-8 text-center font-mono text-lg font-bold text-cyber-cyan">{quantity}</span>
                        <button
                            onClick={() => handleQuantityChange(1)}
                            disabled={quantity >= maxStock || isAdding}
                            className="p-2 rounded-full hover:bg-white/10 text-white disabled:opacity-50 transition-colors"
                        >
                            <Plus size={16} />
                        </button>
                    </div>
                    <span className="text-sm text-gray-400">
                        Total: <span className="font-mono text-white">₹{(product.price * quantity).toLocaleString('en-IN')}</span>
                    </span>
                </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
                {isOutOfStock ? (
                    <button
                        disabled
                        className="w-full py-4 rounded-xl bg-gray-800 text-gray-500 font-bold border border-white/5 cursor-not-allowed"
                    >
                        Sold Out
                    </button>
                ) : (
                    <>
                        <button
                            onClick={() => handleAddToCart(false)}
                            disabled={isAdding}
                            className="flex-1 py-4 rounded-xl bg-gradient-to-r from-cyber-pink to-purple-600 text-white font-bold text-lg hover:shadow-[0_0_20px_rgba(255,0,255,0.4)] transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isAdding ? <Loader2 className="animate-spin" /> : <ShoppingBag size={20} />}
                            Add to Cart
                        </button>
                        <button
                            onClick={() => handleAddToCart(true)}
                            disabled={isAdding}
                            className="flex-1 py-4 rounded-xl border border-white/20 text-white font-bold text-lg hover:bg-white/5 transition-colors active:scale-95 disabled:opacity-70"
                        >
                            Buy Now
                        </button>
                    </>
                )}
            </div>

            {/* Wishlist / Share */}
            <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                <button className="flex items-center gap-2 text-gray-400 hover:text-cyber-pink transition-colors">
                    <Heart size={18} />
                    <span className="text-sm">Add to Wishlist</span>
                </button>
                <button className="flex items-center gap-2 text-gray-400 hover:text-cyber-cyan transition-colors">
                    <Share2 size={18} />
                    <span className="text-sm">Share</span>
                </button>
            </div>

            {/* Mobile Fixed Bottom Bar (Visible only on small screens) */}
            <div className={`md:hidden fixed bottom-0 left-0 right-0 p-4 bg-navy/90 backdrop-blur-lg border-t border-white/10 z-50 transform transition-transform duration-300 ${isOutOfStock ? 'translate-y-full' : 'translate-y-0'}`}>
                <div className="flex gap-3">
                    <button
                        onClick={() => handleAddToCart(false)}
                        disabled={isAdding}
                        className="flex-1 py-3 rounded-lg bg-cyber-pink text-black font-bold flex items-center justify-center gap-2"
                    >
                        {isAdding ? <Loader2 className="animate-spin" size={18} /> : <ShoppingBag size={18} />}
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
}
