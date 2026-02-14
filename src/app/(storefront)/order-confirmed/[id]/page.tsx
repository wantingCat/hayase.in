import Link from 'next/link';
import { CheckCircle, ShoppingBag, AlertCircle, Clock } from 'lucide-react';
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';

export default async function OrderConfirmedPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const supabase = createClient();

    const { data: order } = await (await supabase)
        .from('orders')
        .select('payment_id')
        .eq('id', params.id)
        .single();

    if (!order) {
        // In a real app, might handle this better, but for now allow flow to continue or 404
        // notFound(); 
    }

    const hasUTR = !!order?.payment_id;

    return (
        <div className="min-h-screen pt-32 flex flex-col items-center justify-center text-center px-4 bg-navy text-foreground">
            <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mb-6 animate-bounce-in">
                <CheckCircle className="w-12 h-12 text-green-500" />
            </div>

            <h1 className="text-4xl font-bold text-white mb-2">Order Placed - Thank You!</h1>
            <p className="text-gray-400 mb-8">Your order has been recorded.</p>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 max-w-md w-full mb-8">
                <div className="grid grid-cols-2 gap-4 text-left mb-6">
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">Order ID</p>
                        <p className="text-sm font-mono text-white break-all">{params.id}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">Status</p>
                        <div className="flex items-center gap-1.5 mt-1">
                            <Clock className="w-4 h-4 text-yellow-500" />
                            <span className="text-yellow-500 font-bold text-sm">Processing</span>
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-white/10 text-left">
                    {hasUTR ? (
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                            <h3 className="text-blue-400 font-bold flex items-center gap-2 mb-2">
                                <Clock className="w-4 h-4" /> Verifying Payment
                            </h3>
                            <p className="text-sm text-gray-300">
                                We have received your Transaction ID (<strong>{order?.payment_id}</strong>).
                                Our team will verify it within 24 hours. You will receive an email once confirmed.
                            </p>
                        </div>
                    ) : (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                            <h3 className="text-red-400 font-bold flex items-center gap-2 mb-2">
                                <AlertCircle className="w-4 h-4" /> Action Required
                            </h3>
                            <p className="text-sm text-gray-300 mb-3">
                                You did not provide a Transaction ID. To avoid cancellation, please complete payment and email us the screenshot/UTR.
                            </p>
                            <Link href="/contact" className="text-xs text-white underline hover:text-red-400">
                                Contact Support
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            <Link
                href="/shop"
                className="px-8 py-3 rounded-xl bg-cyber-pink hover:bg-cyber-pink/90 text-black font-bold flex items-center gap-2 transition-transform hover:scale-105"
            >
                <ShoppingBag size={18} />
                Continue Shopping
            </Link>
        </div>
    );
}
