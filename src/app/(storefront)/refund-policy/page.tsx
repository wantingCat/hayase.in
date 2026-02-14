import { AlertTriangle, Mail } from "lucide-react";

export const metadata = {
    title: 'Refund & Cancellation Policy | Hayase',
    description: 'Our strict but fair refund policy. Unboxing video is mandatory for all claims.',
};

export default function RefundPolicy() {
    return (
        <main className="min-h-screen bg-navy text-gray-300 pt-32 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-12">

                {/* Header */}
                <div className="text-center space-y-4">
                    <h1 className="text-3xl md:text-5xl font-bold text-white">Refund & Cancellation Policy</h1>
                    <p className="text-lg text-gray-400">Please read our policy carefully before making a purchase.</p>
                </div>

                {/* The Golden Rule - Alert */}
                <div className="bg-red-500/10 border border-red-500/50 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start">
                    <div className="p-3 bg-red-500/20 rounded-xl shrink-0">
                        <AlertTriangle className="w-8 h-8 text-red-500" />
                    </div>
                    <div className="space-y-3">
                        <h2 className="text-xl font-bold text-white">The Golden Rule: Unboxing Video is Mandatory</h2>
                        <p className="text-red-200 leading-relaxed">
                            To be eligible for a refund for damaged or incorrect items, you <span className="font-bold underline">MUST</span> record a clear, continuous unboxing video starting from the sealed courier package. No cuts, no edits. Without this video, we cannot process any claims.
                        </p>
                    </div>
                </div>

                {/* Policy Details */}
                <div className="space-y-12">
                    {/* Reporting Window */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-white border-l-4 border-cyber-pink pl-4">Reporting Window</h2>
                        <p className="leading-relaxed">
                            You must report any damage, defects, or missing items within <strong className="text-white">3 days</strong> of delivery. Please send your unboxing video and Order ID via email to <a href="mailto:support@hayase.in" className="text-cyber-cyan hover:underline">support@hayase.in</a>. Late reports will not be accepted.
                        </p>
                    </section>

                    {/* Eligibility */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-white border-l-4 border-cyber-pink pl-4">Refund Eligibility</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                                <h3 className="text-green-400 font-bold mb-3 flex items-center gap-2">
                                    <span className="w-2 h-2 bg-green-500 rounded-full" /> Accepted for Refund
                                </h3>
                                <ul className="space-y-2 text-sm list-disc list-inside text-gray-400">
                                    <li>Broken or damaged parts upon arrival</li>
                                    <li>Major paint defects (e.g., missing eyes)</li>
                                    <li>Wrong item received</li>
                                    <li>Package lost in transit (confirmed by courier)</li>
                                </ul>
                            </div>
                            <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                                <h3 className="text-red-400 font-bold mb-3 flex items-center gap-2">
                                    <span className="w-2 h-2 bg-red-500 rounded-full" /> NOT Accepted
                                </h3>
                                <ul className="space-y-2 text-sm list-disc list-inside text-gray-400">
                                    <li>Minor box dents (transit happens)</li>
                                    <li>"Change of mind" or "I didn't like it"</li>
                                    <li>Minor paint imperfections common in prize figures</li>
                                    <li>Damage caused by user mishandling</li>
                                </ul>
                            </div>
                        </div>
                        <p className="bg-white/5 p-4 rounded-lg border border-white/10 text-sm">
                            <strong className="text-white">Resolution:</strong> If your claim is approved, we will issue a <strong className="text-white">100% Refund (including shipping charges)</strong> to your original payment method within 5-7 business days.
                        </p>
                    </section>

                    {/* Cancellations */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-white border-l-4 border-cyber-pink pl-4">Cancellations</h2>
                        <p className="leading-relaxed">
                            Orders can be cancelled regarding any reason before they are shipped. However, once the <strong className="text-white">tracking number is generated</strong>, the order cannot be cancelled as it has already left our facility or is in the process of being handed over to the courier.
                        </p>
                    </section>
                </div>

                {/* Contact Footer */}
                <div className="border-t border-white/10 pt-12 mt-12 text-center">
                    <p className="mb-6">Need to file a claim? We're here to help.</p>
                    <a
                        href="mailto:support@hayase.in"
                        className="inline-flex items-center gap-2 px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors"
                    >
                        <Mail className="w-5 h-5" />
                        Email Support
                    </a>
                </div>

            </div>
        </main>
    );
}
