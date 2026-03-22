"use client";

import { useState } from "react";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { Minus, Plus, ShoppingBag, Heart, Share2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

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

    const [email, setEmail] = useState("");
    const [notifying, setNotifying] = useState(false);
    const [notified, setNotified] = useState(false);
    // Suppress console error if define in previous replace_file_content (state var usage)

    const handleNotifyMe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setNotifying(true);
        try {
            const { error } = await createClient() // Instantiate here since we can't easily add to props without larger refactor, or use import
                .from("restock_requests")
                .insert([{ product_id: product.id, email }]);

            if (error) throw error;

            toast.success("You're on the list!");
            setNotified(true);
        } catch (error) {
            console.error(error);
            toast.error("Failed to sign up.");
        } finally {
            setNotifying(false);
        }
    };

    // If Out of Stock, show Notify Me form
    if (isOutOfStock) {
        return (
            <div className="fixed bottom-0 left-0 w-full z-50 bg-black/90 backdrop-blur-md p-4 border-t border-neutral-800 md:static md:bg-transparent md:p-0 md:border-0 md:z-auto">
                {notified ? (
                    <div className="w-full py-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 font-bold text-center flex items-center justify-center gap-2">
                        <ShoppingBag size={20} />
                        You&apos;ll be notified when back in stock!
                    </div>
                ) : (
                    <form onSubmit={handleNotifyMe} className="flex gap-2 w-full md:max-w-none">
                        <input
                            type="email"
                            required
                            placeholder="Enter your email to get notified"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyber-pink outline-none placeholder:text-gray-600 w-full"
                        />
                        <button
                            type="submit"
                            disabled={notifying}
                            className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold whitespace-nowrap transition-colors disabled:opacity-50"
                        >
                            {notifying ? <Loader2 className="animate-spin" /> : "Notify Me"}
                        </button>
                    </form>
                )}
                {/* Spacer for mobile */}
                <div className="h-6 md:hidden" />
            </div>
        );
    }

    return (
        <>
            <div className="fixed bottom-0 left-0 w-full z-50 bg-black/90 backdrop-blur-md p-4 border-t border-neutral-800 md:static md:bg-transparent md:p-0 md:border-0 md:z-auto">
                <div className="flex items-center gap-4 w-full md:max-w-none">
                    {/* Quantity Selector */}
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

                    {/* Add to Cart Button */}
                    <button
                        onClick={() => handleAddToCart(false)}
                        disabled={isAdding}
                        className="flex-1 py-4 rounded-xl bg-gradient-to-r from-cyber-pink to-purple-600 text-white font-bold text-lg hover:shadow-[0_0_20px_rgba(255,0,255,0.4)] transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isAdding ? <Loader2 className="animate-spin" /> : <ShoppingBag size={20} />}
                        Add to Cart
                    </button>
                </div>
            </div>

            {/* Spacer for mobile to prevent content being hidden behind fixed bar */}
            <div className="h-24 md:hidden" />
        </>
    );
}
