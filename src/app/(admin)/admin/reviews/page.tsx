"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { Review, Product } from "@/types";
import { Loader2, Check, X, Star } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";

interface ReviewWithProduct extends Review {
    products: Product; // Join relation name usually matches table name or is singular
}

export default function AdminReviewsPage() {
    const supabase = createClient();
    const [reviews, setReviews] = useState<ReviewWithProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const fetchReviews = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from("reviews")
                .select(`
                    *,
                    products (
                        id,
                        name,
                        images
                    )
                `)
                .order("created_at", { ascending: false });

            if (error) throw error;

            // Sort: Pending first, then by date
            const sorted = (data as unknown as ReviewWithProduct[]).sort((a, b) => {
                if (a.status === 'pending' && b.status !== 'pending') return -1;
                if (a.status !== 'pending' && b.status === 'pending') return 1;
                return 0;
            });

            setReviews(sorted);
        } catch (error) {
            console.error("Error fetching reviews:", error);
            toast.error("Failed to fetch reviews");
        } finally {
            setLoading(false);
        }
    }, [supabase]);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    const handleAction = async (id: string, newStatus: 'approved' | 'rejected') => {
        setActionLoading(id);
        try {
            const { error } = await supabase
                .from("reviews")
                .update({ status: newStatus })
                .eq("id", id);

            if (error) throw error;

            toast.success(`Review ${newStatus}!`);

            // Optimistic update
            setReviews(prev => prev.map(r =>
                r.id === id ? { ...r, status: newStatus } : r
            ));
        } catch (error) {
            console.error(`Error ${newStatus} review:`, error);
            toast.error("Action failed");
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 size={32} className="text-cyber-pink animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-white mb-6">Product Reviews</h1>

            <div className="grid gap-4">
                {reviews.map((review) => (
                    <div
                        key={review.id}
                        className={`bg-navy border rounded-xl p-6 transition-all ${review.status === 'pending'
                                ? 'border-cyber-pink/50 shadow-[0_0_15px_rgba(255,42,109,0.1)]'
                                : 'border-white/10 opacity-75 hover:opacity-100'
                            }`}
                    >
                        <div className="flex flex-col md:flex-row gap-6">
                            {/* Product Info */}
                            <div className="flex items-center gap-4 min-w-[250px]">
                                <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-white/10 bg-black/20 shrink-0">
                                    {review.products?.images?.[0] && (
                                        <Image
                                            src={review.products.images[0]}
                                            alt={review.products.name}
                                            fill
                                            className="object-cover"
                                        />
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-bold text-white line-clamp-1">{review.products?.name || "Unknown Product"}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${review.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
                                                review.status === 'approved' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                                                    'bg-red-500/10 text-red-500 border border-red-500/20'
                                            }`}>
                                            {review.status}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Review Content */}
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="font-bold text-white">{review.user_name}</div>
                                        <div className="flex text-cyber-pink">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "" : "text-gray-700"} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <p className="text-gray-300 text-sm leading-relaxed">
                                    {review.comment}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-row md:flex-col gap-2 justify-center shrink-0">
                                {review.status !== 'approved' && (
                                    <button
                                        onClick={() => handleAction(review.id, 'approved')}
                                        disabled={actionLoading === review.id}
                                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 text-green-500 border border-green-500/20 hover:bg-green-500/20 transition-colors disabled:opacity-50"
                                    >
                                        {actionLoading === review.id ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                                        <span className="text-sm font-bold">Approve</span>
                                    </button>
                                )}

                                {review.status !== 'rejected' && (
                                    <button
                                        onClick={() => handleAction(review.id, 'rejected')}
                                        disabled={actionLoading === review.id}
                                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                                    >
                                        {actionLoading === review.id ? <Loader2 size={16} className="animate-spin" /> : <X size={16} />}
                                        <span className="text-sm font-bold">Reject</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {reviews.length === 0 && (
                    <div className="text-center py-20 text-gray-500 border border-dashed border-white/10 rounded-xl">
                        No reviews found.
                    </div>
                )}
            </div>
        </div>
    );
}
