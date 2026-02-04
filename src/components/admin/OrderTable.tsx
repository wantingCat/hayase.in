"use client";

import { Order } from "@/types";
import { motion } from "framer-motion";
import { Copy, Check, Truck } from "lucide-react";
import clsx from "clsx";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface OrderTableProps {
    orders: Order[];
}

export default function OrderTable({ orders }: OrderTableProps) {
    const supabase = createClient();
    const router = useRouter();

    const updateStatus = async (orderId: string, newStatus: string) => {
        try {
            const { error } = await supabase
                .from('orders')
                .update({ status: newStatus })
                .eq('id', orderId);

            if (error) throw error;
            toast.success(`Order updated to ${newStatus}`);
            router.refresh();
        } catch (error) {
            console.error("Error updating order:", error);
            toast.error("Failed to update status");
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Transaction ID copied!");
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
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-hidden rounded-xl border border-white/10 glassmorphism">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-white/5 text-gray-400 uppercase text-xs tracking-wider">
                        <tr>
                            <th className="p-4">Order ID</th>
                            <th className="p-4">Customer</th>
                            <th className="p-4">Total (₹)</th>
                            <th className="p-4">Transaction ID (UTR)</th>
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
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <div className="font-mono text-white/80">{order.upi_transaction_id || 'N/A'}</div>
                                        {order.upi_transaction_id && (
                                            <button
                                                onClick={() => copyToClipboard(order.upi_transaction_id!)}
                                                className="p-1.5 hover:bg-white/10 rounded-lg text-gray-500 hover:text-white transition-colors"
                                                title="Copy UTR matches"
                                            >
                                                <Copy size={12} />
                                            </button>
                                        )}
                                    </div>
                                </td>
                                <td className="p-4">
                                    <StatusBadge status={order.status} />
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        {order.status !== 'confirmed' && order.status !== 'shipped' && order.status !== 'cancelled' && (
                                            <button
                                                onClick={() => updateStatus(order.id, 'confirmed')}
                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-lg text-xs font-medium hover:bg-green-500/20 transition-colors"
                                            >
                                                <Check size={12} />
                                                Mark Paid
                                            </button>
                                        )}
                                        {order.status === 'confirmed' && (
                                            <button
                                                onClick={() => updateStatus(order.id, 'shipped')}
                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg text-xs font-medium hover:bg-blue-500/20 transition-colors"
                                            >
                                                <Truck size={12} />
                                                Mark Shipped
                                            </button>
                                        )}
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

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {orders.map((order) => (
                    <div key={order.id} className="bg-navy/50 border border-white/10 rounded-lg p-4 space-y-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <span className="font-mono text-xs text-gray-500">#{order.id.slice(0, 8)}</span>
                                <h3 className="font-bold text-white mt-1">{order.customer_name}</h3>
                                <p className="text-xs text-gray-400">{order.customer_email}</p>
                            </div>
                            <StatusBadge status={order.status} />
                        </div>

                        <div className="grid grid-cols-2 gap-4 border-t border-b border-white/5 py-3">
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Amount</p>
                                <p className="font-mono text-soft-cyan">₹{order.total_amount}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Transaction ID</p>
                                <div className="flex items-center gap-2">
                                    <span className="font-mono text-sm text-white/80">{order.upi_transaction_id || 'N/A'}</span>
                                    {order.upi_transaction_id && (
                                        <button
                                            onClick={() => copyToClipboard(order.upi_transaction_id!)}
                                            className="p-1 hover:bg-white/10 rounded text-gray-500 hover:text-white"
                                        >
                                            <Copy size={12} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-1">
                            {order.status !== 'confirmed' && order.status !== 'shipped' && order.status !== 'cancelled' && (
                                <button
                                    onClick={() => updateStatus(order.id, 'confirmed')}
                                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-green-500/10 text-green-400 border border-green-500/20 rounded-lg text-sm font-medium hover:bg-green-500/20 transition-colors"
                                >
                                    <Check size={14} />
                                    Mark Paid
                                </button>
                            )}
                            {order.status === 'confirmed' && (
                                <button
                                    onClick={() => updateStatus(order.id, 'shipped')}
                                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg text-sm font-medium hover:bg-blue-500/20 transition-colors"
                                >
                                    <Truck size={14} />
                                    Mark Shipped
                                </button>
                            )}
                        </div>
                    </div>
                ))}
                {orders.length === 0 && (
                    <div className="text-center p-8 text-gray-500">No orders found.</div>
                )}
            </div>
        </>
    );
}
