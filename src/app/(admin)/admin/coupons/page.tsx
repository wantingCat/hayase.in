import { createClient } from "@/utils/supabase/server";
import CouponTable from "@/components/admin/CouponTable";
import CouponForm from "@/components/admin/CouponForm";
import { Coupon } from "@/types";

export const dynamic = 'force-dynamic';

export default async function CouponsPage() {
    const supabase = await createClient();
    const { data: coupons, error } = await supabase
        .from("coupons")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching coupons:", error);
    }

    // Cast data to Coupon[] explicitly as Supabase types might not match our interface exactly without generation
    const typedCoupons = (coupons as unknown as Coupon[]) || [];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Coupons</h1>
                    <p className="text-gray-400 mt-2">Manage discount codes and promotions</p>
                </div>
                <CouponForm />
            </div>

            <CouponTable coupons={typedCoupons} />
        </div>
    );
}
