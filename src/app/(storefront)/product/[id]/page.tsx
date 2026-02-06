// import { createClient } from "@/utils/supabase/server";
export const dynamic = 'force-dynamic';
// import { notFound } from "next/navigation";
// import Image from "next/image";
// import { ArrowLeft, Shield, Truck } from "lucide-react";
// import Link from "next/link";
// import { Product } from "@/types";
// import AddToCartButton from "../../../../components/storefront/AddToCartButton";

export default async function ProductPage({ /* params */ }: { params: { id: string } }) {
    /* 
    try {
        const supabase = createClient();
        const { data: product, error } = await supabase
            .from("products")
            .select("*")
            .eq("id", params.id)
            .single();

        if (error || !product) {
            console.error("Supabase Error:", error);
            if (error?.code === '22P02') notFound();
            if (error?.code === 'PGRST116') notFound();
            throw new Error(`Supabase error: ${error?.message || 'Unknown error'}`);
        }

        const typedProduct = product as Product;
        
        return (
            // ... original JSX ...
            <div className="p-10 text-white">Loaded</div>
        );
    } catch (e: any) {
        return <div className="text-red-500">{e.message}</div>
    }
    */

    // Simple debug return to verify Layouts are working
    return <div className="p-20 pt-32 text-white text-3xl font-bold">Debug Mode: Product Page Loaded Successfully</div>;
}
