import { supabase } from "@/lib/supabaseClient";
import OrderTable from "@/components/admin/OrderTable";

export const dynamic = 'force-dynamic';

export default async function OrdersPage() {
    const { data: orders, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching orders:", error);
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Orders</h1>
                <p className="text-gray-400 mt-2">View and manage customer orders</p>
            </div>

            <OrderTable orders={orders || []} />
        </div>
    );
}
