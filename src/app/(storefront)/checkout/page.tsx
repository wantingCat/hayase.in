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
    const { items, total: subtotal, clearCart } = useCart(); // Rename original total to subtotal for clarity
    const router = useRouter();
    const supabase = createClient();

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [paymentSettings, setPaymentSettings] = useState<PaymentSettings | null>(null);
    const [copied, setCopied] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);

    // Checkout Steps State
    const [step, setStep] = useState<'shipping' | 'payment'>('shipping');

    // Coupon State
    const [couponCode, setCouponCode] = useState("");
    const [discount, setDiscount] = useState(0);
    const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
    const [couponError, setCouponError] = useState("");
    const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        fullname: "",
        phone: "",
        pincode: "",
        city: "",
        state: "",
        flat: "",
        area: "",
        landmark: "",
        email: "",
        utr: "", // Transaction ID
    });

    const INDIAN_STATES = [
        "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana",
        "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
        "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan",
        "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
        "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli", "Daman and Diu", "Delhi",
        "Lakshadweep", "Puducherry"
    ];

    // Calculated Total
    const finalTotal = Math.max(0, subtotal - discount);

    const STORAGE_BUCKET = 'product-images';

    useEffect(() => {
        // If order appears to be placed (based on local state), don't redirect to shop
        if (orderPlaced) return;

        if (items.length === 0) {
            router.push('/shop');
            return;
        }

        const fetchPaymentSettings = async () => {
            try {
                // Fetch from payment_settings table
                const { data, error } = await supabase
                    .from("payment_settings")
                    .select("*")
                    .eq("is_active", true)
                    .single();

                if (error) {
                    console.error("Error fetching payment settings:", error);
                }

                if (data) {
                    setPaymentSettings({
                        upi_id: data.upi_id,
                        qr_code_url: data.qr_code_url,
                        account_name: "Hayase Collectibles"
                    });

                    // Debugging
                    const qrUrl = getQrUrl(data.qr_code_url);
                    console.log('QR Path:', data.qr_code_url, 'Final URL:', qrUrl);
                }
            } catch (err) {
                console.error("Error fetching payment settings:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPaymentSettings();
    }, [items, router, supabase, orderPlaced]);

    const getQrUrl = (url: string | undefined) => {
        if (!url) return null;
        if (url.startsWith('http')) return url;
        return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${url}`;
    };

    const getImageUrl = (url: string) => {
        if (!url) return null;
        if (url.startsWith('http')) return url;
        return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/store-assets/${url}`;
    };

    const handleCopy = () => {
        if (paymentSettings?.upi_id) {
            navigator.clipboard.writeText(paymentSettings.upi_id);
            setCopied(true);
            toast.success("UPI ID copied to clipboard");
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) return;
        setIsApplyingCoupon(true);
        setCouponError("");

        try {
            const { data, error } = await supabase
                .from('coupons')
                .select('*')
                .eq('code', couponCode.toUpperCase())
                .eq('is_active', true)
                .single();

            if (error || !data) {
                setCouponError("Invalid code");
                setDiscount(0);
                setAppliedCoupon(null);
                return;
            }

            if (data.min_order_value && subtotal < data.min_order_value) {
                setCouponError(`Min order value ₹${data.min_order_value} required`);
                setDiscount(0);
                setAppliedCoupon(null);
                return;
            }

            let calculatedDiscount = 0;
            if (data.discount_type === 'percent') {
                calculatedDiscount = (subtotal * data.discount_value) / 100;
            } else {
                calculatedDiscount = data.discount_value; // 'fixed'
            }

            // Cap discount at subtotal to avoid negative total
            calculatedDiscount = Math.min(calculatedDiscount, subtotal);

            setDiscount(calculatedDiscount);
            setAppliedCoupon(data.code);
            toast.success("Coupon applied!");
        } catch (err) {
            console.error("Coupon error:", err);
            setCouponError("Something went wrong");
        } finally {
            setIsApplyingCoupon(false);
        }
    };

    const handleProceedToPayment = () => {
        // Validation
        if (!formData.fullname || !formData.phone || !formData.pincode || !formData.city || !formData.state || !formData.flat || !formData.area || !formData.email) {
            toast.error("Please fill in all required fields.");
            return;
        }

        if (formData.pincode.length !== 6 || isNaN(Number(formData.pincode))) {
            toast.error("Please enter a valid 6-digit Pincode.");
            return;
        }

        if (formData.phone.length < 10) {
            toast.error("Please enter a valid phone number.");
            return;
        }

        setStep('payment');
        window.scrollTo(0, 0);
    };

    const handleSubmit = async () => {
        if (!formData.utr) {
            toast.error("Please enter the UTR / Transaction ID");
            return;
        }

        setSubmitting(true);

        try {
            // Construct full address for storage if needed, or just store granular
            // We'll store granular in customer_details

            // 1. Create Order Payload
            const orderPayload = {
                // Legacy columns to satisfy constraints
                customer_name: formData.fullname,
                customer_email: formData.email,
                customer_phone: formData.phone,
                // Also map granular address back to a string for 'shipping_address' if needed, or just let it be if not required.
                // Assuming 'shipping_address' might be required if 'customer_name' is.
                shipping_address: `${formData.flat}, ${formData.area}, ${formData.landmark ? formData.landmark + ', ' : ''}${formData.city}, ${formData.state} - ${formData.pincode}`,

                customer_details: {
                    name: formData.fullname,
                    email: formData.email,
                    phone: formData.phone,
                    address: {
                        flat: formData.flat,
                        area: formData.area,
                        landmark: formData.landmark,
                        city: formData.city,
                        state: formData.state,
                        pincode: formData.pincode
                    }
                },
                total_amount: finalTotal,
                shipping_cost: 0,
                payment_status: "pending", // Default
                payment_id: formData.utr, // Store UTR
                order_status: "processing",
                coupon_code: appliedCoupon,
                discount_amount: discount
            };

            console.log("Submitting Order Payload:", orderPayload);

            // 1. Create Order with JSONB customer_details
            const { data: order, error: orderError } = await supabase
                .from("orders")
                .insert(orderPayload)
                .select()
                .single();

            if (orderError) throw orderError;

            // 2. Insert Order Items
            const orderItems = items.map(item => ({
                order_id: order.id,
                product_id: item.id,
                quantity: item.quantity,
                price: item.price
            }));

            const { error: itemsError } = await supabase
                .from("order_items")
                .insert(orderItems);

            if (itemsError) throw itemsError;

            // 3. Clear Cart & Redirect
            setOrderPlaced(true); // Flag to prevent useEffect redirect
            clearCart();
            toast.success("Order placed successfully!");
            router.push(`/order-confirmed/${order.id}`);

        } catch (error: any) {
            console.error("Full Error Details:", JSON.stringify(error, null, 2));
            if (error.code) console.error("Supabase Error Code:", error.code);
            if (error.message) console.error("Supabase Error Message:", error.message);

            const message = error.message || "Something went wrong. Please try again.";
            toast.error(message);
            setSubmitting(false);
            setOrderPlaced(false); // Reset on error
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
                {/* Steps Header */}
                <div className="flex items-center justify-center mb-12">
                    <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${step === 'shipping' ? 'bg-cyber-pink text-black' : 'bg-green-500 text-black'}`}>
                            {step === 'payment' ? <Check size={20} /> : '1'}
                        </div>
                        <div className={`w-24 h-1 mx-4 rounded-full ${step === 'payment' ? 'bg-green-500' : 'bg-white/10'}`} />
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${step === 'payment' ? 'bg-cyber-pink text-black' : 'bg-white/10 text-white'}`}>
                            2
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Left Column: Content based on Step */}
                    <div className="lg:col-span-7 space-y-8">

                        {step === 'shipping' ? (
                            /* STEP 1: SHIPPING FORM */
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                                    <Truck className="text-cyber-cyan" size={24} />
                                    <h2 className="text-xl font-bold text-white">Shipping Information</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Full Name */}
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-sm text-gray-400">Full Name *</label>
                                        <input
                                            required
                                            type="text"
                                            value={formData.fullname}
                                            onChange={e => setFormData({ ...formData, fullname: e.target.value })}
                                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-cyber-cyan outline-none"
                                        />
                                    </div>

                                    {/* Mobile Number */}
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-sm text-gray-400">Mobile Number *</label>
                                        <input
                                            required
                                            type="tel"
                                            value={formData.phone}
                                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-cyber-cyan outline-none"
                                        />
                                    </div>

                                    {/* Email */}
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

                                    {/* Pincode */}
                                    <div className="space-y-2">
                                        <label className="text-sm text-gray-400">Pincode (6 digits) *</label>
                                        <input
                                            required
                                            type="text"
                                            maxLength={6}
                                            value={formData.pincode}
                                            onChange={e => setFormData({ ...formData, pincode: e.target.value })}
                                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-cyber-cyan outline-none"
                                        />
                                    </div>

                                    {/* City */}
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

                                    {/* State Dropdown */}
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-sm text-gray-400">State *</label>
                                        <select
                                            required
                                            value={formData.state}
                                            onChange={e => setFormData({ ...formData, state: e.target.value })}
                                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-cyber-cyan outline-none appearance-none"
                                        >
                                            <option value="">Select State</option>
                                            {INDIAN_STATES.map((state) => (
                                                <option key={state} value={state} className="bg-neutral-900">{state}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Flat/House No */}
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-sm text-gray-400">Flat, House no., Building, Company, Apartment *</label>
                                        <input
                                            required
                                            type="text"
                                            value={formData.flat}
                                            onChange={e => setFormData({ ...formData, flat: e.target.value })}
                                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-cyber-cyan outline-none"
                                        />
                                    </div>

                                    {/* Area/Street */}
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-sm text-gray-400">Area, Street, Sector, Village *</label>
                                        <input
                                            required
                                            type="text"
                                            value={formData.area}
                                            onChange={e => setFormData({ ...formData, area: e.target.value })}
                                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-cyber-cyan outline-none"
                                        />
                                    </div>

                                    {/* Landmark */}
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-sm text-gray-400">Landmark (Optional)</label>
                                        <input
                                            type="text"
                                            value={formData.landmark}
                                            onChange={e => setFormData({ ...formData, landmark: e.target.value })}
                                            placeholder="E.g. near Apollo Hospital"
                                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-cyber-cyan outline-none"
                                        />
                                    </div>

                                </div>
                                <button
                                    onClick={handleProceedToPayment}
                                    className="w-full mt-8 py-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-lg shadow-lg transition-all"
                                >
                                    Proceed to Payment
                                </button>
                            </div>
                        ) : (
                            /* STEP 2: PAYMENT QR & UTR */
                            <div className="bg-gradient-to-b from-white/5 to-black/40 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
                                <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4 relative z-10">
                                    <ShieldCheck className="text-green-400" size={24} />
                                    <h2 className="text-xl font-bold text-white">Scan to Pay</h2>
                                </div>

                                {paymentSettings ? (
                                    <div className="space-y-8 relative z-10">
                                        <div className="text-center space-y-2">
                                            <p className="text-gray-400 text-sm uppercase tracking-widest">Amount to Pay</p>
                                            <p className="text-4xl font-mono font-bold text-yellow-400">Please make a payment of ₹{finalTotal.toLocaleString('en-IN')}</p>
                                        </div>

                                        <div className="flex flex-col items-center justify-center p-6 bg-white rounded-xl max-w-sm mx-auto shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                                            {paymentSettings.qr_code_url ? (
                                                <div className="relative w-64 h-64 mx-auto">
                                                    <Image
                                                        src={getQrUrl(paymentSettings.qr_code_url) || ''}
                                                        alt="UPI QR Code"
                                                        fill
                                                        className="object-contain"
                                                        unoptimized
                                                    />
                                                </div>
                                            ) : (
                                                <div className="w-64 h-64 mx-auto bg-neutral-800 rounded-xl flex items-center justify-center border-2 border-dashed border-red-500 text-center p-4">
                                                    <p className="text-red-400 text-xs">Error: QR Code not set in Admin Dashboard. <br /> Please upload one in Settings.</p>
                                                </div>
                                            )}
                                            <div className="mt-6 flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full w-full justify-between border border-gray-200">
                                                <span className="text-black font-mono font-medium truncate">{paymentSettings.upi_id}</span>
                                                <button
                                                    onClick={handleCopy}
                                                    className="text-gray-500 hover:text-black transition-colors"
                                                >
                                                    {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="max-w-md mx-auto">
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

                                        <div className="flex gap-4 pt-4">
                                            <button
                                                onClick={() => setStep('shipping')}
                                                className="px-6 py-4 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-colors font-bold"
                                            >
                                                Back
                                            </button>
                                            <button
                                                onClick={handleSubmit}
                                                disabled={submitting || !formData.utr || items.length === 0}
                                                className="flex-1 py-4 rounded-xl bg-gradient-to-r from-cyber-pink to-purple-600 text-white font-bold text-lg hover:shadow-[0_0_20px_rgba(255,0,255,0.4)] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                            >
                                                {submitting ? <Loader2 className="animate-spin" /> : <ShoppingBag size={20} />}
                                                Confirm Order
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-400">
                                        Payment details unavailable. Please contact support.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right Column: Order Summary (Always Visible or Sticky) */}
                    <div className="lg:col-span-5 space-y-8">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 lg:sticky lg:top-32">
                            <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                                <ShoppingBag className="text-cyber-pink" size={24} />
                                <h2 className="text-xl font-bold text-white">Order Summary</h2>
                            </div>

                            <div className="max-h-60 overflow-y-auto pr-2 space-y-4 mb-6 custom-scrollbar">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="relative w-16 h-16 aspect-square rounded overflow-hidden bg-neutral-900 border border-neutral-800 flex-shrink-0">
                                            {item.images?.[0] && (
                                                <Image
                                                    src={getImageUrl(item.images[0]) || '/placeholder.png'}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover"
                                                    unoptimized
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

                            {/* Coupon Section */}
                            <div className="mb-6">
                                <label className="text-xs text-gray-400 uppercase tracking-wider mb-2 block">Discount Code</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Enter code"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                        disabled={!!appliedCoupon}
                                        className="flex-1 bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white text-sm outline-none focus:border-cyber-pink uppercase placeholder:text-gray-600 disabled:opacity-50"
                                    />
                                    {appliedCoupon ? (
                                        <button
                                            onClick={() => {
                                                setAppliedCoupon(null);
                                                setDiscount(0);
                                                setCouponCode("");
                                            }}
                                            className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-sm font-medium hover:bg-red-500/30 transition-colors"
                                        >
                                            Remove
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleApplyCoupon}
                                            disabled={!couponCode || isApplyingCoupon}
                                            className="px-4 py-2 bg-white/10 text-white rounded-lg text-sm font-medium hover:bg-white/20 transition-colors disabled:opacity-50"
                                        >
                                            {isApplyingCoupon ? <Loader2 className="w-4 h-4 animate-spin" /> : "Apply"}
                                        </button>
                                    )}
                                </div>
                                {couponError && <p className="text-red-400 text-xs mt-1">{couponError}</p>}
                                {appliedCoupon && <p className="text-green-400 text-xs mt-1">Code applied successfully!</p>}
                            </div>

                            <div className="border-t border-white/10 pt-4 space-y-2">
                                <div className="flex justify-between text-gray-400">
                                    <span>Subtotal</span>
                                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between text-green-400">
                                        <span>Discount</span>
                                        <span>-₹{discount.toLocaleString('en-IN')}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-gray-400">
                                    <span>Shipping</span>
                                    <span className="text-cyber-cyan">Free</span>
                                </div>
                                <div className="flex justify-between text-xl font-bold text-white pt-2 border-t border-white/10 mt-2">
                                    <span>Total</span>
                                    <span>₹{finalTotal.toLocaleString('en-IN')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
