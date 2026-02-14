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
        <>
            <div className="fixed bottom-0 left-0 w-full z-50 bg-black/90 backdrop-blur-md p-4 border-t border-neutral-800 md:static md:bg-transparent md:p-0 md:border-0 md:z-auto">
                <div className="flex items-center gap-4 w-full md:max-w-none">
                    {/* Quantity Selector */}
                    {!isOutOfStock && (
                        <div className="flex items-center gap-3 bg-white/5 rounded-full p-1 border border-white/10 shrink-0">
                            <button
                                onClick={() => handleQuantityChange(-1)}
                                disabled={quantity <= 1 || isAdding}
                                className="p-3 md:p-2 rounded-full hover:bg-white/10 text-white disabled:opacity-50 transition-colors"
                            >
                                <Minus size={16} />
                            </button>
                            <span className="w-8 text-center font-mono text-lg font-bold text-cyber-cyan">{quantity}</span>
                            <button
                                onClick={() => handleQuantityChange(1)}
                                disabled={quantity >= maxStock || isAdding}
                                className="p-3 md:p-2 rounded-full hover:bg-white/10 text-white disabled:opacity-50 transition-colors"
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                    )}

                    {/* Add to Cart Button */}
                    <button
                        onClick={() => handleAddToCart(false)}
                        disabled={isOutOfStock || isAdding}
                        className={isOutOfStock
                            ? "w-full py-4 rounded-xl bg-gray-800 text-gray-500 font-bold border border-white/5 cursor-not-allowed"
                            : "flex-1 py-4 rounded-xl bg-gradient-to-r from-cyber-pink to-purple-600 text-white font-bold text-lg hover:shadow-[0_0_20px_rgba(255,0,255,0.4)] transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        }
                    >
                        {isAdding ? <Loader2 className="animate-spin" /> : (!isOutOfStock && <ShoppingBag size={20} />)}
                        {isOutOfStock ? "Sold Out" : "Add to Cart"}
                    </button>
                </div>
            </div>

            {/* Spacer for mobile to prevent content being hidden behind fixed bar */}
            <div className="h-24 md:hidden" />
        </>
    );
}
