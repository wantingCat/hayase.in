import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductCard from "./ProductCard";
import { Product } from "@/types";

interface FeaturedProductsProps {
    products: Product[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
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
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </section>
    );
}
