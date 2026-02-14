"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/utils/cn"; // Assuming utility exists or use clsx
import { motion, AnimatePresence } from "framer-motion";

interface ProductGalleryProps {
    images: string[];
    productName: string;
}

const getImageUrl = (url: string) => {
    if (!url) return '/placeholder.png';
    if (url.startsWith('http')) return url;
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/${url}`;
};

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const validImages = images?.length > 0 ? images : [];

    if (validImages.length === 0) {
        return (
            <div className="w-full aspect-square bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                <span className="text-gray-500">No Image Available</span>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            {/* Main Image */}
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-neutral-900 border border-white/10 group">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={selectedIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="relative w-full h-full"
                    >
                        <Image
                            src={getImageUrl(validImages[selectedIndex])}
                            alt={`${productName} - View ${selectedIndex + 1}`}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                            priority
                            unoptimized
                        />
                    </motion.div>
                </AnimatePresence>

                {/* Zoom Hint */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500 pointer-events-none" />
            </div>

            {/* Thumbnails */}
            {validImages.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar snap-x">
                    {validImages.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setSelectedIndex(idx)}
                            className={cn(
                                "relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-300 snap-start",
                                selectedIndex === idx
                                    ? "border-cyber-pink shadow-[0_0_10px_rgba(255,0,255,0.3)]"
                                    : "border-transparent opacity-60 hover:opacity-100"
                            )}
                        >
                            <Image
                                src={getImageUrl(img)}
                                alt={`Thumbnail ${idx + 1}`}
                                fill
                                className="object-cover"
                                unoptimized
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
