"use client";

import { Order } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, ChevronDown, Check, Package, BadgeCheck, X } from "lucide-react";
import clsx from "clsx";
import { useState } from "react";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface OrderTableProps {
    orders: Order[];
}

import PaymentModal from "./PaymentModal";

export default function OrderTable({ orders }: OrderTableProps) {
    const [selectedOrderForVerification, setSelectedOrderForVerification] = useState<Order | null>(null);
    const supabase = createClient();
    const router = useRouter();

    const updateStatus = async (orderId: string, newStatus: string) => {
        try {
            // If status is being set to 'confirmed' (Paid), delete the proof from storage
            let updateData: any = { status: newStatus };

            if (newStatus === 'confirmed') {
                // 1. Fetch order to get the screenshot URL
                const { data: order, error: fetchError } = await supabase
                    .from('orders')
                    .select('payment_screenshot_url')
                    .eq('id', orderId)
                    .single();

                if (fetchError) {
                    console.error("Error fetching order for verification:", fetchError);
                    // Continue, but maybe warn? For now, risk orphaned file rather than blocking business.
                } else if (order?.payment_screenshot_url) {
                    const url = order.payment_screenshot_url;
                    const parts = url.split('/');
                    const fileName = parts[parts.length - 1];

                    // 2. Remove from storage
                    const { error: storageError } = await supabase.storage
                        .from('order-proofs')
                        .remove([fileName]);

                    if (storageError) {
                        console.error("Error removing proof:", storageError);
                        toast.warning("Failed to delete proof from storage");
                    } else {
                        // 3. Set DB field to null
                        updateData.payment_screenshot_url = null;
                        toast.info("Payment proof deleted from storage to save space.");
                    }
                }
            }

            const { error } = await supabase
                .from('orders')
                .update(updateData)
                .eq('id', orderId);

            if (error) throw error;
            toast.success(`Order updated to ${newStatus}`);
            router.refresh();
        } catch (error: any) {
            console.error("Error updating order:", error);
            toast.error("Failed to update status");
        }
    };

    const StatusBadge = ({ status }: { status: string }) => {
        const styles = {
            pending_verification: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
            confirmed: "bg-green-500/10 text-green-400 border-green-500/20",
            shipped: "bg-blue-500/10 text-blue-400 border-blue-500/20",
            cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
        };
        const activeStyle = styles[status as keyof typeof styles] || styles.pending_verification;

        return (
            <span className={clsx("px-2 py-1 rounded text-xs font-bold border uppercase tracking-wider", activeStyle)}>
                {status.replace('_', ' ')}
            </span>
        );
    };

    return (
        <>
            <div className="w-full overflow-hidden rounded-xl border border-white/10 glassmorphism">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-white/5 text-gray-400 uppercase text-xs tracking-wider">
                        <tr>
                            <th className="p-4">Order ID</th>
                            <th className="p-4">Customer</th>
                            <th className="p-4">Amount</th>
                            <th className="p-4">Payment</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {orders.map((order, index) => (
                            <motion.tr
                                key={order.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                                className="text-gray-300"
                            >
                                <td className="p-4 font-mono text-xs text-gray-500">#{order.id.slice(0, 8)}</td>
                                <td className="p-4">
                                    <div className="font-medium text-white">{order.customer_name}</div>
                                    <div className="text-xs text-gray-500">{order.customer_email}</div>
                                </td>
                                <td className="p-4 font-mono text-soft-cyan">₹{order.total_amount}</td>
                                <td className="p-4 text-xs">
                                    <div className="flex flex-col">
                                        <span className="text-gray-400">UPI: {order.upi_transaction_id || 'N/A'}</span>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <StatusBadge status={order.status} />
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        {order.payment_screenshot_url && (
                                            <button
                                                onClick={() => setSelectedOrderForVerification(order)}
                                                className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-cyber-pink transition-colors"
                                                title="Verify Payment"
                                            >
                                                <Eye size={16} />
                                            </button>
                                        )}

                                        <div className="relative group">
                                            <select
                                                value={order.status}
                                                onChange={(e) => updateStatus(order.id, e.target.value)}
                                                className="appearance-none bg-black/30 border border-white/10 text-white text-xs rounded px-2 py-1 pr-6 focus:outline-none focus:border-cyber-pink/50 cursor-pointer hover:bg-white/5"
                                            >
                                                <option value="pending_verification">Pending</option>
                                                <option value="confirmed">Confirmed</option>
                                                <option value="shipped">Shipped</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                        </div>
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                        {orders.length === 0 && (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-gray-500">
                                    No orders found yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <PaymentModal
                order={selectedOrderForVerification}
                isOpen={!!selectedOrderForVerification}
                onClose={() => setSelectedOrderForVerification(null)}
                onVerify={(orderId) => {
                    updateStatus(orderId, 'confirmed');
                    setSelectedOrderForVerification(null);
                }}
            />
        </>
    );
}
