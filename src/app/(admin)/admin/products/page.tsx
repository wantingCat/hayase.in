import { supabase } from "@/lib/supabaseClient";
import ProductsClient from "@/components/admin/ProductsClient";

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
    const { data: products, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching products:", error);
    }

    return <ProductsClient initialProducts={products || []} />;
}
