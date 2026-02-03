"use client";

import { Order } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { X, BadgeCheck, Check, Loader2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

interface PaymentModalProps {
    order: Order | null;
    isOpen: boolean;
    onClose: () => void;
    onVerify: (orderId: string) => void;
}

export default function PaymentModal({ order, isOpen, onClose, onVerify }: PaymentModalProps) {
    const [signedUrl, setSignedUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        if (isOpen && order?.payment_screenshot_url) {
            const fetchSignedUrl = async () => {
                setLoading(true);
                try {
                    // Extract path from URL
                    // Assumption: URL is strictly from the order-proofs bucket and we need the path relative to the bucket.
                    // If the URL stored is the full public URL, we need to extract the path.
                    // If it's just the path, use it directly.
                    // Let's handle generic full URL case by splitting.

                    let path = order.payment_screenshot_url;

                    // Simple heuristic: if it contains the supabase storage url, try to split.
                    // Ideally, we should store just the path or handle this more robustly.
                    // For now, let's assume if it starts with 'http', we try to extract the last part.
                    // A safer bet for private buckets is that we might be storing the path directly?
                    // But previous code uploaded and got publicUrl. 
                    // If we made the bucket private, we MUST rely on signed URLs.
                    // Let's assume the stored value MIGHT be a full URL, so we extract the filename.

                    const urlParts = path.split('/');
                    const fileName = urlParts[urlParts.length - 1];
                    // This is a bit risky if folders are used, but for now we uploaded strictly files to root or similar.

                    // However, if the user uploaded it using the same logic as products (ProductForm), 
                    // they might have used `publicUrl`. 
                    // If the bucket is `order-proofs` and it is private, `getPublicUrl` would return a URL that 403s.
                    // So we must generate a signed URL for that `fileName`.

                    const { data, error } = await supabase
                        .storage
                        .from('order-proofs')
                        .createSignedUrl(fileName, 60); // 60 seconds validity

                    if (error) {
                        console.error("Error creating signed URL:", error);
                        // Fallback: try using the original URL if signing fails (maybe it IS public?)
                        setSignedUrl(order.payment_screenshot_url);
                    } else {
                        setSignedUrl(data.signedUrl);
                    }
                } catch (err) {
                    console.error("Error in signed URL fetch:", err);
                    setSignedUrl(order.payment_screenshot_url);
                } finally {
                    setLoading(false);
                }
            };

            fetchSignedUrl();
        } else {
            setSignedUrl(null);
        }
    }, [isOpen, order]);

    return (
        <AnimatePresence>
            {isOpen && order && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-navy border border-white/10 rounded-xl max-w-2xl w-full overflow-hidden shadow-2xl"
                    >
                        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-navy/95">
                            <h3 className="font-bold text-white flex items-center gap-2">
                                <BadgeCheck className="text-cyber-pink" size={20} />
                                Verify Payment
                            </h3>
                            <button onClick={onClose} className="text-gray-400 hover:text-white">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                                <div>
                                    <p className="text-gray-400">Customer</p>
                                    <p className="text-white font-medium">{order.customer_name}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400">Total Amount</p>
                                    <p className="text-soft-cyan font-mono">₹{order.total_amount}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400">UPI Ref ID</p>
                                    <p className="text-white font-mono bg-white/5 px-2 py-1 rounded inline-block">
                                        {order.upi_transaction_id}
                                    </p>
                                </div>
                            </div>

                            <div className="relative w-full aspect-[9/16] max-h-[60vh] rounded-lg overflow-hidden border border-white/20 bg-black flex items-center justify-center">
                                {loading ? (
                                    <div className="flex flex-col items-center gap-2 text-cyber-pink">
                                        <Loader2 size={32} className="animate-spin" />
                                        <span className="text-sm">Fetching secure proof...</span>
                                    </div>
                                ) : signedUrl ? (
                                    <Image
                                        src={signedUrl}
                                        alt="Payment Screenshot"
                                        fill
                                        className="object-contain"
                                        unoptimized // Important for signed URLs sometimes
                                    />
                                ) : (
                                    <div className="text-gray-500">No screenshot available</div>
                                )}
                            </div>

                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    onClick={() => onVerify(order.id)}
                                    className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/20 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium"
                                >
                                    <Check size={18} />
                                    Verify & Confirm
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
