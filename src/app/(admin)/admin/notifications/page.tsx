"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Mail, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface RestockRequest {
    id: string;
    product_id: string;
    email: string;
    is_notified: boolean;
    created_at: string;
    products: {
        name: string;
    };
}

export default function NotificationsPage() {
    const supabase = createClient();
    const [requests, setRequests] = useState<RestockRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [sendingId, setSendingId] = useState<string | null>(null);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const { data, error } = await supabase
                .from("restock_requests")
                .select("*, products(name)")
                .order("created_at", { ascending: false });

            if (error) throw error;
            setRequests(data || []);
        } catch (error) {
            console.error("Error fetching requests:", error);
            toast.error("Failed to load notifications");
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsNotified = async (id: string) => {
        setSendingId(id);
        try {
            // In a real scenario, this would trigger a server action to send the email
            // For now, we just update the status
            const { error } = await supabase
                .from("restock_requests")
                .update({ is_notified: true })
                .eq("id", id);

            if (error) throw error;

            setRequests(prev => prev.map(req =>
                req.id === id ? { ...req, is_notified: true } : req
            ));
            toast.success("Marked as notified");
        } catch (error) {
            console.error("Error updating request:", error);
            toast.error("Failed to update status");
        } finally {
            setSendingId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="w-8 h-8 animate-spin text-cyber-pink" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Restock Requests</h1>
                <p className="text-gray-400 mt-2">Manage customers waiting for products</p>
            </div>

            <div className="overflow-hidden rounded-xl border border-white/10 glassmorphism">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-white/5 text-gray-400 uppercase text-xs tracking-wider">
                        <tr>
                            <th className="p-4">Product</th>
                            <th className="p-4">Customer Email</th>
                            <th className="p-4">Date Requested</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10 text-gray-300">
                        {requests.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-gray-500">
                                    No pending notifications.
                                </td>
                            </tr>
                        ) : (
                            requests.map((req) => (
                                <tr key={req.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4 font-medium text-white">
                                        {req.products?.name || "Unknown Product"}
                                    </td>
                                    <td className="p-4">{req.email}</td>
                                    <td className="p-4 font-mono text-sm text-gray-500">
                                        {format(new Date(req.created_at), 'MMM d, yyyy')}
                                    </td>
                                    <td className="p-4">
                                        {req.is_notified ? (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-400 border border-green-500/20">
                                                <CheckCircle size={12} />
                                                Notified
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                                                <Mail size={12} />
                                                Pending
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4 text-right">
                                        {!req.is_notified && (
                                            <button
                                                onClick={() => handleMarkAsNotified(req.id)}
                                                disabled={sendingId === req.id}
                                                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyber-pink/10 text-cyber-pink hover:bg-cyber-pink/20 transition-colors text-sm font-medium border border-cyber-pink/20 disabled:opacity-50"
                                            >
                                                {sendingId === req.id ? <Loader2 size={14} className="animate-spin" /> : <Mail size={14} />}
                                                Send Email
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
