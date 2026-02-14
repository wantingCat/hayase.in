import { Scale, Truck, AlertOctagon, Gavel, Mail } from "lucide-react";

export const metadata = {
    title: 'Terms & Conditions | Hayase',
    description: 'The rules and regulations for using Hayase.in',
};

export default function TermsAndConditions() {
    return (
        <main className="min-h-screen bg-navy text-gray-300 pt-32 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-12">

                {/* Header */}
                <div className="text-center space-y-4">
                    <h1 className="text-3xl md:text-5xl font-bold text-white">Terms of Service</h1>
                    <p className="text-lg text-gray-400">Last Updated: February 2026</p>
                    <p className="max-w-2xl mx-auto leading-relaxed">
                        Welcome to Hayase.in. By accessing or purchasing from our store, you agree to be bound by the following terms and conditions.
                    </p>
                </div>

                <div className="space-y-12">
                    {/* Section 1: Products & Accuracy */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                            <div className="p-2 bg-cyber-pink/10 rounded-lg">
                                <AlertOctagon className="w-6 h-6 text-cyber-pink" />
                            </div>
                            <h2 className="text-2xl font-bold text-white">1. Products & Accuracy</h2>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                                <h3 className="text-white font-bold mb-3">Product Description</h3>
                                <p className="text-sm leading-relaxed">
                                    We strive to display the colors and details of our figures as accurately as possible. However, actual product colors may vary slightly due to screen settings and photography lighting.
                                </p>
                            </div>
                            <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                                <h3 className="text-white font-bold mb-3">Condition & Packaging</h3>
                                <p className="text-sm leading-relaxed">
                                    Minor paint imperfections are common in collectible figures and are not defects. The product box is designed to protect the figure during transit; minor dents to the packaging do not qualify for a replacement.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Section 2: Orders & Pricing */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                            <div className="p-2 bg-cyber-cyan/10 rounded-lg">
                                <Scale className="w-6 h-6 text-cyber-cyan" />
                            </div>
                            <h2 className="text-2xl font-bold text-white">2. Orders & Pricing</h2>
                        </div>
                        <ul className="space-y-4 text-gray-300">
                            <li className="flex gap-3">
                                <span className="w-1.5 h-1.5 bg-cyber-cyan rounded-full mt-2 shrink-0" />
                                <span>
                                    <strong className="text-white">Price Changes:</strong> Prices for our products are subject to change without notice. We rarely do this, but currency fluctuations happen.
                                </span>
                            </li>
                            <li className="flex gap-3">
                                <span className="w-1.5 h-1.5 bg-cyber-cyan rounded-full mt-2 shrink-0" />
                                <span>
                                    <strong className="text-white">Right to Cancel:</strong> We reserve the right to refuse or cancel any order for any reason, including limitations on quantities available for purchase or errors in product or pricing information.
                                </span>
                            </li>
                        </ul>
                    </section>

                    {/* Section 3: Shipping & Delivery */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                            <div className="p-2 bg-purple-500/10 rounded-lg">
                                <Truck className="w-6 h-6 text-purple-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-white">3. Shipping & Delivery</h2>
                        </div>
                        <div className="space-y-4">
                            <p className="leading-relaxed">
                                <strong className="text-white">Risk of Loss:</strong> All items purchased are made pursuant to a shipment contract. This means that the risk of loss and title for such items pass to you upon our delivery to the carrier.
                            </p>
                            <p className="leading-relaxed">
                                <strong className="text-white">Delays:</strong> Shipping timelines are estimates. We are not liable for delays caused by courier partners or unforeseen circumstances (like weather or strikes).
                            </p>
                        </div>
                    </section>

                    {/* Section 4: Limitation of Liability */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                            <div className="p-2 bg-red-500/10 rounded-lg">
                                <AlertOctagon className="w-6 h-6 text-red-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-white">4. Limitation of Liability</h2>
                        </div>
                        <p className="leading-relaxed bg-white/5 p-6 rounded-xl border border-white/10">
                            Hayase shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use our products or services.
                        </p>
                    </section>

                    {/* Section 5: Governing Law */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                            <div className="p-2 bg-yellow-500/10 rounded-lg">
                                <Gavel className="w-6 h-6 text-yellow-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-white">5. Governing Law</h2>
                        </div>
                        <p className="leading-relaxed">
                            These Terms shall be governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in <strong className="text-white">Rampur, Uttar Pradesh</strong>.
                        </p>
                    </section>
                </div>

                {/* Contact Footer */}
                <div className="border-t border-white/10 pt-12 mt-12 text-center">
                    <p className="mb-6">Have legal questions?</p>
                    <a
                        href="mailto:legal@hayase.in"
                        className="inline-flex items-center gap-2 px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors"
                    >
                        <Mail className="w-5 h-5" />
                        Contact Legal Team
                    </a>
                </div>

            </div>
        </main>
    );
}
