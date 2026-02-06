"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Calendar, Wand2, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { addDays, endOfMonth, format } from "date-fns";

interface CouponFormData {
    code: string;
    discount_type: "percent" | "fixed";
    discount_value: number;
    min_order_value: number;
    max_uses: number | null;
    expires_at: string | null;
}

const ANIME_PREFIXES = ['SENPAI', 'SUGOI', 'KAWAII', 'BANKAI', 'PLUSULTRA', 'YAMERO', 'DATTEBAYO', 'NANI', 'OMAEWA', 'KAMEHAME'];

export default function CouponForm() {
    const supabase = createClient();
    const [isOpen, setIsOpen] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    const router = useRouter();
    const { register, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitting } } = useForm<CouponFormData>({
        defaultValues: {
            discount_type: "percent",
            min_order_value: 0,
            discount_value: 0,
            expires_at: null
        }
    });

    const discountType = watch("discount_type");
    const discountValue = watch("discount_value");

    const generateCode = () => {
        setIsGenerating(true);
        // Simulate a "thinking" delay for effect
        setTimeout(() => {
            const prefix = ANIME_PREFIXES[Math.floor(Math.random() * ANIME_PREFIXES.length)];
            const suffix = discountValue > 0 ? Math.floor(discountValue) : "X";
            setValue("code", `${prefix}${suffix}`);
            setIsGenerating(false);
        }, 300);
    };

    const setExpiry = (days: number | "eom" | "lifetime") => {
        if (days === "lifetime") {
            setValue("expires_at", null);
            return;
        }

        const date = days === "eom"
            ? endOfMonth(new Date())
            : addDays(new Date(), days);

        // Format for input type="datetime-local": YYYY-MM-DDTHH:mm
        const formatted = format(date, "yyyy-MM-dd'T'HH:mm");
        setValue("expires_at", formatted);
    };

    const onSubmit = async (data: CouponFormData) => {
        try {
            // Validation
            if (data.discount_type === 'percent' && data.discount_value > 100) {
                toast.error("Percentage discount cannot exceed 100%");
                return;
            }

            // Convert empty strings to null for nullable fields if any (hook form handles numbers usually but worth checking)
            // Handle max_uses being possibly empty if user clears it (might come as NaN or 0 if type=number)
            // But let's rely on standard handling:
            const payload = {
                ...data,
                // Ensure correct types
                discount_value: Number(data.discount_value),
                min_order_value: Number(data.min_order_value),
                max_uses: data.max_uses ? Number(data.max_uses) : null,
                expires_at: data.expires_at || null
            };

            const { error } = await supabase
                .from('coupons')
                .insert(payload);

            if (error) {
                if (error.code === '23505') throw new Error("Coupon code already exists");
                throw error;
            }

            toast.success("Coupon created successfully!");
            setIsOpen(false);
            reset();
            router.refresh();

        } catch (error) {
            console.error(error);
            const message = error instanceof Error ? error.message : "Failed to create coupon";
            toast.error(message);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 bg-cyber-pink hover:bg-cyber-pink/80 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-[0_0_15px_rgba(255,0,255,0.4)]"
            >
                <Plus size={18} />
                Create Coupon
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                        />

                        {/* Slide-over Panel */}
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            className="fixed inset-y-0 right-0 w-full max-w-lg bg-navy border-l border-white/10 shadow-2xl z-[101] overflow-y-auto flex flex-col"
                        >
                            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-navy/95 backdrop-blur sticky top-0 z-10">
                                <h2 className="text-xl font-bold text-white">New Coupon</h2>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6 flex-1">

                                {/* Code Generator */}
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-300">Coupon Code</label>
                                    <div className="flex gap-2">
                                        <input
                                            {...register("code", { required: "Code is required", pattern: { value: /^[A-Z0-9]+$/, message: "Uppercase alphanumeric only" } })}
                                            className="flex-1 bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyber-pink/50 transition-colors uppercase font-mono tracking-wider"
                                            placeholder="e.g. SUMMER20"
                                        />
                                        <button
                                            type="button"
                                            onClick={generateCode}
                                            disabled={isGenerating}
                                            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg border border-white/10 transition-colors flex items-center gap-2"
                                            title="Auto-generate Anime Code"
                                        >
                                            <Wand2 size={18} className={isGenerating ? "animate-spin" : "text-cyber-pink"} />
                                        </button>
                                    </div>
                                    {errors.code && <p className="text-red-400 text-xs">{errors.code.message}</p>}
                                </div>

                                {/* Discount Logic */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm text-gray-300">Discount Type</label>
                                        <select
                                            {...register("discount_type")}
                                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyber-pink/50 transition-colors appearance-none"
                                        >
                                            <option value="percent">Percentage (%)</option>
                                            <option value="fixed">Fixed Amount (₹)</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm text-gray-300">Value</label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                step="0.01"
                                                {...register("discount_value", { required: "Value is required", min: 0 })}
                                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyber-pink/50 transition-colors"
                                                placeholder="0"
                                            />
                                            <span className="absolute right-3 top-2.5 text-gray-500 font-mono">
                                                {discountType === 'percent' ? '%' : '₹'}
                                            </span>
                                        </div>
                                        {errors.discount_value && <p className="text-red-400 text-xs">{errors.discount_value.message}</p>}
                                    </div>
                                </div>

                                {/* Limits */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm text-gray-300">Min Order Value (₹)</label>
                                        <input
                                            type="number"
                                            {...register("min_order_value", { min: 0 })}
                                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyber-pink/50 transition-colors"
                                            placeholder="0"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm text-gray-300">Max Uses</label>
                                        <input
                                            type="number"
                                            {...register("max_uses", { min: 1 })}
                                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyber-pink/50 transition-colors"
                                            placeholder="Unlimited"
                                        />
                                        <p className="text-[10px] text-gray-500">Leave empty for unlimited</p>
                                    </div>
                                </div>

                                {/* Expiry */}
                                <div className="space-y-3">
                                    <label className="text-sm text-gray-300 flex items-center gap-2">
                                        <Calendar size={16} />
                                        Expiry Date
                                    </label>
                                    <input
                                        type="datetime-local"
                                        {...register("expires_at")}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyber-pink/50 transition-colors [color-scheme:dark]"
                                    />

                                    <div className="flex flex-wrap gap-2">
                                        <button type="button" onClick={() => setExpiry(7)} className="px-3 py-1 text-xs bg-white/5 hover:bg-white/10 rounded-full text-gray-300 border border-white/5 transition-colors">
                                            7 Days
                                        </button>
                                        <button type="button" onClick={() => setExpiry(30)} className="px-3 py-1 text-xs bg-white/5 hover:bg-white/10 rounded-full text-gray-300 border border-white/5 transition-colors">
                                            30 Days
                                        </button>
                                        <button type="button" onClick={() => setExpiry('eom')} className="px-3 py-1 text-xs bg-white/5 hover:bg-white/10 rounded-full text-gray-300 border border-white/5 transition-colors">
                                            End of Month
                                        </button>
                                        <button type="button" onClick={() => setExpiry('lifetime')} className="px-3 py-1 text-xs bg-white/5 hover:bg-white/10 rounded-full text-gray-300 border border-white/5 transition-colors">
                                            Lifetime
                                        </button>
                                    </div>
                                </div>

                            </form>

                            <div className="p-6 border-t border-white/10 bg-navy sticky bottom-0 z-10 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="px-6 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmit(onSubmit)}
                                    disabled={isSubmitting}
                                    className="flex items-center gap-2 bg-gradient-to-r from-cyber-pink to-electric-purple text-white px-8 py-2.5 rounded-lg font-bold shadow-lg shadow-cyber-pink/20 hover:shadow-cyber-pink/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting && <Loader2 size={18} className="animate-spin" />}
                                    Create Coupon
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
