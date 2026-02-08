import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types";

interface ProductCardProps {
    product: Product;
}

const getImageUrl = (url: string) => {
    if (!url) return '/placeholder.png'; // Handled by fallback UI, but good for safety
    if (url.startsWith('http')) return url;
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/${url}`;
};

export default function ProductCard({ product }: ProductCardProps) {
    return (
        <Link
            href={`/shop/${product.id}`}
            className="group relative block"
        >
            <div className="aspect-[3/4] overflow-hidden rounded-xl bg-gray-900 border border-white/10 relative">
                {product.images && product.images[0] ? (
                    <Image
                        src={getImageUrl(product.images[0])}
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
    );
}
