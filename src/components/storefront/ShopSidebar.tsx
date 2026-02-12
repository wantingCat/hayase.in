"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

const PRICE_MIN = 0;
const PRICE_MAX = 50000;

interface ShopSidebarProps {
    categories: string[];
}

export default function ShopSidebar({ categories }: ShopSidebarProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // State
    const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
    const [selectedCategories, setSelectedCategories] = useState<string[]>(
        searchParams.get("category")?.split(",") || []
    );
    const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({
        min: Number(searchParams.get("min")) || PRICE_MIN,
        max: Number(searchParams.get("max")) || PRICE_MAX,
    });

    // Debounce search term
    const [debouncedSearch] = useDebounce(searchTerm, 300);
    const [debouncedPrice] = useDebounce(priceRange, 300);

    // Update URL on change
    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());

        // Search
        if (debouncedSearch) {
            params.set("search", debouncedSearch);
        } else {
            params.delete("search");
        }

        // Categories
        if (selectedCategories.length > 0) {
            params.set("category", selectedCategories.join(","));
        } else {
            params.delete("category");
        }

        // Price
        if (debouncedPrice.min > PRICE_MIN) {
            params.set("min", debouncedPrice.min.toString());
        } else {
            params.delete("min");
        }
        if (debouncedPrice.max < PRICE_MAX) {
            params.set("max", debouncedPrice.max.toString());
        } else {
            params.delete("max");
        }

        router.push(`?${params.toString()}`, { scroll: false });
    }, [debouncedSearch, selectedCategories, debouncedPrice, router, searchParams]);

    const toggleCategory = (category: string) => {
        setSelectedCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };

    return (
        <aside className="w-full md:w-64 shrink-0 space-y-8">
            {/* Search */}
            <div>
                <h3 className="text-lg font-bold text-white mb-4">Search</h3>
                <div className="relative">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search figures..."
                        className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-cyber-pink/50 transition-colors"
                    />
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
            </div>

            {/* Categories */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">Categories</h3>
                    {selectedCategories.length > 0 && (
                        <button
                            onClick={() => setSelectedCategories([])}
                            className="text-xs text-cyber-pink hover:underline"
                        >
                            Clear
                        </button>
                    )}
                </div>
                <div className="space-y-2">
                    {categories.length === 0 ? (
                        <p className="text-sm text-gray-500 italic">No categories available</p>
                    ) : (
                        categories.map((cat) => (
                            <label key={cat} className="flex items-center gap-2 text-gray-400 hover:text-white cursor-pointer transition-colors group">
                                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedCategories.includes(cat)
                                    ? "bg-cyber-pink border-cyber-pink"
                                    : "border-white/20 group-hover:border-white/40"
                                    }`}>
                                    {selectedCategories.includes(cat) && (
                                        <div className="w-2 h-2 bg-black rounded-sm" />
                                    )}
                                </div>
                                <input
                                    type="checkbox"
                                    className="hidden"
                                    checked={selectedCategories.includes(cat)}
                                    onChange={() => toggleCategory(cat)}
                                />
                                {cat}
                            </label>
                        ))
                    )}
                </div>
            </div>

            {/* Price Range */}
            <div>
                <h3 className="text-lg font-bold text-white mb-4">Price Range</h3>
                <div className="space-y-4">
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="text-xs text-gray-500 mb-1 block">Min</label>
                            <input
                                type="number"
                                value={priceRange.min}
                                onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                                className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-cyber-pink/50"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="text-xs text-gray-500 mb-1 block">Max</label>
                            <input
                                type="number"
                                value={priceRange.max}
                                onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                                className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-cyber-pink/50"
                            />
                        </div>
                    </div>
                    <input
                        type="range"
                        min={PRICE_MIN}
                        max={PRICE_MAX}
                        value={priceRange.max}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                        className="w-full accent-cyber-pink bg-white/10 h-1 rounded-full appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-400">
                        <span>₹{PRICE_MIN}</span>
                        <span>₹{PRICE_MAX}+</span>
                    </div>
                </div>
            </div>
        </aside>
    );
}
