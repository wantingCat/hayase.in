"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Copy, Check, ShieldCheck, Truck, ShoppingBag } from "lucide-react";
import Image from "next/image";

interface PaymentSettings {
    upi_id: string;
    qr_code_url: string | null;
    account_name: string;
}

export default function CheckoutPage() {
    const { items, total, clearCart } = useCart();
    const router = useRouter();
    const supabase = createClient();

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [paymentSettings, setPaymentSettings] = useState<PaymentSettings | null>(null);
    const [copied, setCopied] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        utr: "", // Transaction ID
    });

    useEffect(() => {
        if (items.length === 0) {
            router.push('/shop');
            return;
        }

        const fetchPaymentSettings = async () => {
            try {
                const { data, error } = await supabase
                    .from("payment_settings")
                    .select("*")
                    .eq("is_active", true)
                    .single();

                if (error) {
                    console.error("Error fetching payment settings:", error);
                }

                if (data) {
                    setPaymentSettings(data);
                }
            } catch (err) {
                console.error("Error fetching payment settings:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPaymentSettings();
    }, [items, router, supabase]); // supabase is stable ref

    const getImageUrl = (url: string) => {
        if (!url) return null;
        if (url.startsWith('http')) return url;
        return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/${url}`;
    };

    const handleCopy = () => {
        if (paymentSettings?.upi_id) {
            navigator.clipboard.writeText(paymentSettings.upi_id);
            setCopied(true);
            toast.success("UPI ID copied to clipboard");
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            // 1. Create Order
            const { data: order, error: orderError } = await supabase
                .from("orders")
                .insert({
                    customer_name: formData.name,
                    customer_email: formData.email,
                    customer_phone: formData.phone,
                    shipping_address: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.zip}`,
                    city: formData.city,
                    state: formData.state,
                    zip_code: formData.zip,
                    total_amount: total,
                    status: "pending_verification",
                    upi_transaction_id: formData.utr,
                    items: items, // Store structured Items JSON
                })
                .select()
                .single();

            if (orderError) throw orderError;

            // 2. Clear Cart & Redirect
            clearCart();
            toast.success("Order placed successfully!");
            router.push(`/order-confirmed/${order.id}`);

        } catch (error: unknown) {
            console.error("Order submission error:", error);
            const message = error instanceof Error ? error.message : "Unknown error";
            toast.error(`Failed to place order: ${message}`);
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-navy flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-cyber-pink" />
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-navy text-foreground pt-32 pb-20 px-4">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-8">Secure Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Left Column: Input Forms (7/12) */}
                    <div className="lg:col-span-7 space-y-8">
                        {/* Shipping Info */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                                <Truck className="text-cyber-cyan" size={24} />
                                <h2 className="text-xl font-bold text-white">Shipping Information</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400">Full Name *</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-cyber-cyan outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400">Phone Number *</label>
                                    <input
                                        required
                                        type="tel"
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-cyber-cyan outline-none"
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm text-gray-400">Email Address *</label>
                                    <input
                                        required
                                        type="email"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-cyber-cyan outline-none"
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm text-gray-400">Address *</label>
                                    <textarea
                                        required
                                        rows={2}
                                        value={formData.address}
                                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-cyber-cyan outline-none resize-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400">City *</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.city}
                                        onChange={e => setFormData({ ...formData, city: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-cyber-cyan outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400">State *</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.state}
                                        onChange={e => setFormData({ ...formData, state: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-cyber-cyan outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400">Zip Code *</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.zip}
                                        onChange={e => setFormData({ ...formData, zip: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-cyber-cyan outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Order Summary (Mobile Only - Usually separate, but putting here for simplicity or maybe below payment) */}
                    </div>

                    {/* Right Column: Order Summary & Payment (5/12) */}
                    <div className="lg:col-span-5 space-y-8">
                        {/* Order Summary */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                                <ShoppingBag className="text-cyber-pink" size={24} />
                                <h2 className="text-xl font-bold text-white">Order Summary</h2>
                            </div>

                            <div className="max-h-60 overflow-y-auto pr-2 space-y-4 mb-6 custom-scrollbar">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-white/10 bg-white/5 flex-shrink-0">
                                            {item.images?.[0] && (
                                                <Image
                                                    src={getImageUrl(item.images[0]) || '/placeholder.png'}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-white font-medium line-clamp-1">{item.name}</h4>
                                            <p className="text-sm text-gray-400">{item.quantity} x ₹{item.price.toLocaleString('en-IN')}</p>
                                        </div>
                                        <div className="text-white font-medium">
                                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-white/10 pt-4 space-y-2">
                                <div className="flex justify-between text-gray-400">
                                    <span>Subtotal</span>
                                    <span>₹{total.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between text-gray-400">
                                    <span>Shipping</span>
                                    <span className="text-cyber-cyan">Free</span>
                                </div>
                                <div className="flex justify-between text-xl font-bold text-white pt-2 border-t border-white/10 mt-2">
                                    <span>Total</span>
                                    <span>₹{total.toLocaleString('en-IN')}</span>
                                </div>
                            </div>
                        </div>

                        {/* Payment Section */}
                        <div className="bg-gradient-to-b from-white/5 to-black/40 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
                            <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4 relative z-10">
                                <ShieldCheck className="text-green-400" size={24} />
                                <h2 className="text-xl font-bold text-white">Payment</h2>
                            </div>

                            {paymentSettings ? (
                                <div className="space-y-6 relative z-10">
                                    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl">
                                        {paymentSettings.qr_code_url ? (
                                            <div className="relative w-48 h-48">
                                                <Image
                                                    src={getImageUrl(paymentSettings.qr_code_url) || ''}
                                                    alt="UPI QR Code"
                                                    fill
                                                    className="object-contain"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-48 h-48 flex items-center justify-center text-black font-bold">
                                                QR Code Not Found
                                            </div>
                                        )}
                                        <div className="mt-4 flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full w-full justify-between">
                                            <span className="text-black font-mono font-medium truncate">{paymentSettings.upi_id}</span>
                                            <button
                                                onClick={handleCopy}
                                                className="text-gray-500 hover:text-black transition-colors"
                                            >
                                                {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm font-bold text-cyber-cyan mb-2 block uppercase tracking-wide">Enter Verification Code</label>
                                        <p className="text-xs text-gray-400 mb-2">Please enter the UPI Transaction ID / UTR Number after making payment.</p>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Example: 405812345678"
                                            value={formData.utr}
                                            onChange={e => setFormData({ ...formData, utr: e.target.value })}
                                            className="w-full bg-black/40 border border-cyber-pink/30 focus:border-cyber-pink rounded-xl px-4 py-4 text-white text-lg font-mono outline-none transition-all placeholder:text-gray-600"
                                        />
                                    </div>

                                    <button
                                        onClick={handleSubmit} // Using explicit onClick for better control outside form tag if needed, but layout suggests form wrap? 
                                        // Wait, the inputs are above. Let's wrap entire page in form? 
                                        // Or just trigger validation manually. 
                                        // Better to wrap the button in the form logic. 
                                        // Actually, let's keep it simple: Make the button trigger form submission if inside form, or manual if not.
                                        // I'll wrap the inputs in a form logically or just validate on click.
                                        // "onClick={handleSubmit}" works if inputs are controlled.
                                        disabled={submitting || !formData.utr || items.length === 0}
                                        className="w-full py-4 rounded-xl bg-gradient-to-r from-cyber-pink to-purple-600 text-white font-bold text-lg hover:shadow-[0_0_20px_rgba(255,0,255,0.4)] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {submitting ? <Loader2 className="animate-spin" /> : <ShoppingBag size={20} />}
                                        Place Order
                                    </button>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-400">
                                    Payment details unavailable. Please contact support.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
