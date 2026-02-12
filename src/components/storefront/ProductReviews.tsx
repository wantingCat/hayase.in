"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { Review } from "@/types";
import { Star, Send, Loader2, User } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

interface ProductReviewsProps {
    productId: string;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
    const supabase = createClient();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Form State
    const [name, setName] = useState("");
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [hoverRating, setHoverRating] = useState(0);

    const fetchReviews = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from("reviews")
                .select("*")
                .eq("product_id", productId)
                .eq("status", "approved")
                .order("created_at", { ascending: false });

            if (error) throw error;
            setReviews(data || []);
        } catch (error) {
            console.error("Error fetching reviews:", error);
        } finally {
            setLoading(false);
        }
    }, [productId, supabase]);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !comment.trim()) {
            toast.error("Please fill in all fields");
            return;
        }

        setSubmitting(true);
        try {
            const { error } = await supabase
                .from("reviews")
                .insert({
                    product_id: productId,
                    user_name: name,
                    rating,
                    comment,
                    status: "pending"
                });

            if (error) throw error;

            toast.success("Review submitted! It will appear after moderation.");
            setName("");
            setComment("");
            setRating(5);
        } catch (error) {
            console.error("Error submitting review:", error);
            toast.error("Failed to submit review");
        } finally {
            setSubmitting(false);
        }
    };

    // Calculate Stats
    const averageRating = reviews.length > 0
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
        : "0.0";

    // Group ratings
    const ratingCounts = [5, 4, 3, 2, 1].map(stars => ({
        stars,
        count: reviews.filter(r => r.rating === stars).length,
        percentage: reviews.length > 0 ? (reviews.filter(r => r.rating === stars).length / reviews.length) * 100 : 0
    }));

    return (
        <section className="py-16 border-t border-white/10" id="reviews">
            <h2 className="text-3xl font-bold text-white mb-10">Customer Reviews</h2>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Stats & Form (Left Column) */}
                <div className="lg:col-span-4 space-y-10">

                    {/* Rating Stats Card */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <div className="text-center mb-6">
                            <div className="text-5xl font-bold text-white mb-2">{averageRating}</div>
                            <div className="flex justify-center gap-1 text-cyber-pink mb-2">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <Star key={i} size={20} fill={i <= Math.round(Number(averageRating)) ? "currentColor" : "none"} />
                                ))}
                            </div>
                            <p className="text-gray-400 text-sm">{reviews.length} Review{reviews.length !== 1 && 's'}</p>
                        </div>

                        <div className="space-y-2">
                            {ratingCounts.map(stat => (
                                <div key={stat.stars} className="flex items-center gap-3 text-sm">
                                    <span className="w-3 flex-none text-gray-400 font-mono">{stat.stars}</span>
                                    <Star size={12} className="text-gray-500" />
                                    <div className="flex-1 h-2 bg-black/40 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-cyber-pink rounded-full transition-all duration-500"
                                            style={{ width: `${stat.percentage}%` }}
                                        />
                                    </div>
                                    <span className="w-8 text-right text-gray-500">{stat.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Write Review Form */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4">Write a Review</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Rating</label>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            className="text-cyber-pink transition-transform hover:scale-110 focus:outline-none"
                                        >
                                            <Star
                                                size={24}
                                                fill={(hoverRating || rating) >= star ? "currentColor" : "none"}
                                                className={(hoverRating || rating) >= star ? "text-cyber-pink" : "text-gray-600"}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Name</label>
                                <input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyber-pink/50 transition-colors"
                                    placeholder="Your name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Review</label>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    rows={4}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyber-pink/50 transition-colors resize-none"
                                    placeholder="Share your thoughts..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full flex items-center justify-center gap-2 bg-cyber-pink text-black font-bold py-3 rounded-lg hover:bg-cyber-pink/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                                Submit Review
                            </button>
                        </form>
                    </div>
                </div>

                {/* Reviews List (Right Column) */}
                <div className="lg:col-span-8">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 size={40} className="text-cyber-pink animate-spin" />
                        </div>
                    ) : reviews.length === 0 ? (
                        <div className="text-center py-20 bg-white/5 border border-white/10 rounded-2xl border-dashed">
                            <p className="text-gray-400 text-lg">No reviews yet.</p>
                            <p className="text-gray-500 text-sm">Be the first to share your thoughts!</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {reviews.map((review) => (
                                <motion.div
                                    key={review.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white/5 border border-white/10 rounded-2xl p-6"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyber-pink to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                                                {review.user_name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white">{review.user_name}</h4>
                                                <div className="text-xs text-gray-500">
                                                    {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex text-cyber-pink">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={16} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "" : "text-gray-700"} />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-gray-300 leading-relaxed">
                                        {review.comment}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
