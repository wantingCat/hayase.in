"use client";

import { Product } from "@/types";
import { motion } from "framer-motion";
import Image from "next/image";
import { Edit, Trash2 } from "lucide-react";

interface ProductTableProps {
    products: Product[];
}

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function ProductTable({ products }: ProductTableProps) {
    const supabase = createClient();
    const router = useRouter();
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleDelete = async (id: string, _unusedImages: string[] | null) => {
        if (!confirm("Are you sure you want to delete this product? This action cannot be undone.")) return;

        setDeletingId(id);
        try {
            // 1. Fetch latest product data to get images
            const { data: product, error: fetchError } = await supabase
                .from('products')
                .select('images')
                .eq('id', id)
                .single();

            if (fetchError) {
                console.error("Error fetching product details for deletion:", fetchError);
                // Proceed to delete row anyway if we can't fetch (might be corrupted or already gone)
            }

            const imageUrls = product?.images;

            // 2. Delete images from storage
            if (imageUrls && imageUrls.length > 0) {
                const filesToRemove = imageUrls.map((url: string) => {
                    const parts = url.split('/');
                    return parts[parts.length - 1]; // Extract filename
                });

                const { error: storageError } = await supabase.storage
                    .from('product-images')
                    .remove(filesToRemove);

                if (storageError) {
                    console.error("Error deleting images:", storageError);
                    toast.warning("Failed to delete images from storage, but deleting product row.");
                }
            }

            // 3. Delete product from DB
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', id);

            if (error) throw error;

            toast.success("Product deleted successfully");
            router.refresh();
        } catch (error: any) {
            console.error("Error deleting product:", error);
            toast.error(error.message || "Failed to delete product");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="w-full overflow-hidden rounded-xl border border-white/10 glassmorphism">
            <table className="w-full text-left border-collapse">
                <thead className="bg-white/5 text-gray-400 uppercase text-xs tracking-wider">
                    <tr>
                        <th className="p-4">Image</th>
                        <th className="p-4">Name</th>
                        <th className="p-4">Price</th>
                        <th className="p-4">Stock</th>
                        <th className="p-4">Details</th>
                        <th className="p-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                    {products.map((product, index) => (
                        <motion.tr
                            key={product.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                            className="text-gray-300"
                        >
                            <td className="p-4">
                                <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-white/10 bg-black/50">
                                    {product.images && product.images[0] ? (
                                        <Image
                                            src={product.images[0]}
                                            alt={product.name}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-600">
                                            No Img
                                        </div>
                                    )}
                                </div>
                            </td>
                            <td className="p-4 font-medium text-white">{product.name}</td>
                            <td className="p-4 font-mono text-soft-cyan">₹{product.price}</td>
                            <td className="p-4">
                                <span className={`px-2 py-1 rounded text-xs font-bold ${product.stock > 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
                                </span>
                            </td>
                            <td className="p-4 text-sm text-gray-500">
                                <div className="flex flex-col gap-1">
                                    <span>{product.manufacturer}</span>
                                    <span className="text-xs text-gray-600">{product.scale} • {product.condition}</span>
                                </div>
                            </td>
                            <td className="p-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-cyan-400 transition-colors">
                                        <Edit size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product.id, product.images)}
                                        disabled={deletingId === product.id}
                                        className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-red-400 transition-colors disabled:opacity-50"
                                    >
                                        {deletingId === product.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                                    </button>
                                </div>
                            </td>
                        </motion.tr>
                    ))}
                    {products.length === 0 && (
                        <tr>
                            <td colSpan={6} className="p-8 text-center text-gray-500">
                                No products found. Add some using the button above.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
