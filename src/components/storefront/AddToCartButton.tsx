"use client";

import { useCart } from "@/context/CartContext";
import { Product } from "@/types";
import { ShoppingCart } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";

export default function AddToCartButton({ product }: { product: Product }) {
    const { addItem } = useCart();
    const [isClicked, setIsClicked] = useState(false);

    const handleAdd = () => {
        addItem(product);
        setIsClicked(true);
        setTimeout(() => setIsClicked(false), 200);
    };

    const isOutOfStock = product.stock <= 0;

    return (
        <button
            onClick={handleAdd}
            disabled={isOutOfStock}
            className={clsx(
                "w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-3 text-lg",
                isOutOfStock
                    ? "bg-gray-600 cursor-not-allowed opacity-50"
                    : "bg-gradient-to-r from-cyber-pink to-electric-purple shadow-cyber-pink/20 hover:shadow-cyber-pink/40 hover:scale-[1.02] active:scale-[0.98]",
                isClicked && "scale-95"
            )}
        >
            <ShoppingCart size={24} />
            {isOutOfStock ? "Sold Out" : "Add to Cart"}
        </button>
    );
}
