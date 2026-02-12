import Link from 'next/link';
import { CheckCircle, ShoppingBag } from 'lucide-react';

export default async function OrderConfirmedPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    return (
        <div className="min-h-screen pt-32 flex flex-col items-center justify-center text-center px-4 bg-navy text-foreground">
            <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mb-6 animate-bounce-in">
                <CheckCircle className="w-12 h-12 text-green-500" />
            </div>

            <h1 className="text-4xl font-bold text-white mb-2">Order Placed Successfully!</h1>
            <p className="text-gray-400 mb-8">Thank you for your purchase.</p>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 max-w-md w-full mb-8">
                <p className="text-sm text-gray-400 uppercase tracking-wider mb-1">Order ID</p>
                <p className="text-xl font-mono text-cyber-cyan font-bold break-all">{params.id}</p>

                <div className="mt-6 pt-6 border-t border-white/10 text-left">
                    <p className="text-white text-sm leading-relaxed">
                        We have received your payment reference (UTR).
                        Our team will verify the transaction shortly.
                        You will receive an email confirmation once the status is updated to <span className="text-green-400">Paid</span>.
                    </p>
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
