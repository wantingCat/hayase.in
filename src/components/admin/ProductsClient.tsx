"use client";

import { useState } from "react";
import { Product } from "@/types";
import ProductTable from "@/components/admin/ProductTable";
import ProductForm from "@/components/admin/ProductForm";
import { Plus } from "lucide-react";

interface ProductsClientProps {
    initialProducts: Product[];
}

export default function ProductsClient({ initialProducts }: ProductsClientProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const handleAddProduct = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    };

    const handleEditProduct = (product: Product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Products</h1>
                    <p className="text-gray-400 mt-2">Manage your inventory and stock levels</p>
                </div>
                <button
                    onClick={handleAddProduct}
                    className="flex items-center gap-2 bg-cyber-pink hover:bg-cyber-pink/80 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-[0_0_15px_rgba(255,0,255,0.4)]"
                >
                    <Plus size={18} />
                    Add Product
                </button>
            </div>

            <ProductTable products={initialProducts} onEdit={handleEditProduct} />

            <ProductForm
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                product={editingProduct}
            />
        </div>
    );
}
