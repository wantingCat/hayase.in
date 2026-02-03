import { supabase } from "@/lib/supabaseClient";
import ProductTable from "@/components/admin/ProductTable";
import ProductForm from "@/components/admin/ProductForm";

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
    const { data: products, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching products:", error);
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Products</h1>
                    <p className="text-gray-400 mt-2">Manage your inventory and stock levels</p>
                </div>
                <ProductForm />
            </div>

            <ProductTable products={products || []} />
        </div>
    );
}
