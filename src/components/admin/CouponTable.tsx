"use client";

import { Coupon } from "@/types";
import { motion } from "framer-motion";
import { Trash2, Tag, Calendar, ShieldCheck, ShieldAlert } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

interface CouponTableProps {
    coupons: Coupon[];
}

export default function CouponTable({ coupons }: CouponTableProps) {
    const supabase = createClient();
    const router = useRouter();
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [togglingId, setTogglingId] = useState<string | null>(null);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this coupon?")) return;

        setDeletingId(id);
        try {
            const { error } = await supabase
                .from('coupons')
                .delete()
                .eq('id', id);

            if (error) throw error;

            toast.success("Coupon deleted successfully");
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete coupon");
        } finally {
            setDeletingId(null);
        }
    };

    const toggleStatus = async (id: string, currentStatus: boolean) => {
        setTogglingId(id);
        try {
            const { error } = await supabase
                .from('coupons')
                .update({ is_active: !currentStatus })
                .eq('id', id);

            if (error) throw error;
            router.refresh();
            toast.success(`Coupon ${!currentStatus ? 'activated' : 'deactivated'}`);
        } catch (error) {
            console.error(error);
            toast.error("Failed to update status");
        } finally {
            setTogglingId(null);
        }
    };

    return (
        <div className="w-full">
            {/* Desktop Table */}
            <div className="hidden md:block overflow-hidden rounded-xl border border-white/10 glassmorphism">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-white/5 text-gray-400 uppercase text-xs tracking-wider">
                        <tr>
                            <th className="p-4">Code</th>
                            <th className="p-4">Discount</th>
                            <th className="p-4">Limits</th>
                            <th className="p-4">Usage</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {coupons.map((coupon, index) => (
                            <motion.tr
                                key={coupon.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                                className="text-gray-300"
                            >
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <Tag size={16} className="text-cyber-pink" />
                                        <span className="font-mono font-bold text-white tracking-wider">{coupon.code}</span>
                                    </div>
                                    {coupon.expires_at && (
                                        <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                            <Calendar size={12} />
                                            Exp: {format(new Date(coupon.expires_at), 'dd MMM yyyy')}
                                        </div>
                                    )}
                                </td>
                                <td className="p-4">
                                    <span className="text-soft-cyan font-bold">
                                        {coupon.discount_type === 'percent' ? `${coupon.discount_value}% OFF` : `₹${coupon.discount_value} OFF`}
                                    </span>
                                    {coupon.min_order_value > 0 && (
                                        <div className="text-xs text-gray-500 mt-1">
                                            Min: ₹{coupon.min_order_value}
                                        </div>
                                    )}
                                </td>
                                <td className="p-4 text-sm">
                                    {coupon.max_uses ? (
                                        <span>Max {coupon.max_uses} uses</span>
                                    ) : (
                                        <span className="text-gray-500 italic">Unlimited</span>
                                    )}
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-white font-medium">{coupon.current_uses}</span>
                                        <span className="text-gray-600 text-xs">times used</span>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <button
                                        onClick={() => toggleStatus(coupon.id, coupon.is_active)}
                                        disabled={togglingId === coupon.id}
                                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${coupon.is_active
                                            ? 'bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20'
                                            : 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20'
                                            }`}
                                    >
                                        {togglingId === coupon.id ? (
                                            <Loader2 size={12} className="animate-spin" />
                                        ) : coupon.is_active ? (
                                            <ShieldCheck size={12} />
                                        ) : (
                                            <ShieldAlert size={12} />
                                        )}
                                        {coupon.is_active ? 'Active' : 'Inactive'}
                                    </button>
                                </td>
                                <td className="p-4 text-right">
                                    <button
                                        onClick={() => handleDelete(coupon.id)}
                                        disabled={deletingId === coupon.id}
                                        className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-red-400 transition-colors disabled:opacity-50"
                                    >
                                        {deletingId === coupon.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                                    </button>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {coupons.map((coupon) => (
                    <div key={coupon.id} className="bg-navy/50 border border-white/10 rounded-lg p-4 space-y-3 relative overflow-hidden">
                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${coupon.is_active ? 'bg-green-500' : 'bg-red-500'}`} />

                        <div className="flex justify-between items-start pl-2">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-mono font-bold text-lg text-white tracking-wider">{coupon.code}</h3>
                                    <span className="text-soft-cyan font-bold text-sm bg-cyan-950/30 px-2 py-0.5 rounded">
                                        {coupon.discount_type === 'percent' ? `${coupon.discount_value}%` : `₹${coupon.discount_value}`}
                                    </span>
                                </div>
                                <div className="text-sm text-gray-400">
                                    {coupon.min_order_value > 0 ? `Min order: ₹${coupon.min_order_value}` : 'No min order'}
                                </div>
                            </div>
                            <button
                                onClick={() => toggleStatus(coupon.id, coupon.is_active)}
                                disabled={togglingId === coupon.id}
                                className={`p-1.5 rounded-lg transition-colors ${coupon.is_active ? 'text-green-400 bg-green-500/10' : 'text-red-400 bg-red-500/10'
                                    }`}
                            >
                                {togglingId === coupon.id ? <Loader2 size={16} className="animate-spin" /> : (coupon.is_active ? <ShieldCheck size={16} /> : <ShieldAlert size={16} />)}
                            </button>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-gray-500 pl-2 border-t border-white/5 pt-3">
                            <div className="flex items-center gap-1">
                                <Tag size={12} />
                                {coupon.current_uses} / {coupon.max_uses || '∞'} uses
                            </div>
                            {coupon.expires_at && (
                                <div className="flex items-center gap-1 ml-auto">
                                    <Calendar size={12} />
                                    {format(new Date(coupon.expires_at), 'dd MMM')}
                                </div>
                            )}
                        </div>

                        <div className="absolute right-4 bottom-4">
                            <button
                                onClick={() => handleDelete(coupon.id)}
                                disabled={deletingId === coupon.id}
                                className="text-gray-500 hover:text-red-400 transition-colors p-1"
                            >
                                {deletingId === coupon.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                            </button>
                        </div>
                    </div>
                ))}
                {coupons.length === 0 && (
                    <div className="text-center p-8 text-gray-500">No coupons found. Create one!</div>
                )}
            </div>
        </div>
    );
}
