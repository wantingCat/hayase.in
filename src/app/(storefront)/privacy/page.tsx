import { Shield, Lock, Eye, Share2, Mail } from "lucide-react";

export const metadata = {
    title: 'Privacy Policy | Hayase',
    description: 'How we collect, use, and protect your personal information.',
};

export default function PrivacyPolicy() {
    return (
        <main className="min-h-screen bg-navy text-gray-300 pt-32 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-12">

                {/* Header */}
                <div className="text-center space-y-4">
                    <h1 className="text-3xl md:text-5xl font-bold text-white">Privacy Policy</h1>
                    <p className="text-lg text-gray-400">Last Updated: February 2026</p>
                    <p className="max-w-2xl mx-auto leading-relaxed">
                        At Hayase, we value your trust. This policy outlines how we collect, use, and protect your personal information when you visit our store.
                    </p>
                </div>

                <div className="space-y-12">
                    {/* Section 1: Information We Collect */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                            <div className="p-2 bg-cyber-pink/10 rounded-lg">
                                <Eye className="w-6 h-6 text-cyber-pink" />
                            </div>
                            <h2 className="text-2xl font-bold text-white">1. Information We Collect</h2>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                                <h3 className="text-white font-bold mb-3">Personal Details</h3>
                                <p className="text-sm leading-relaxed">
                                    When you place an order, we collect your <strong className="text-gray-200">Name, Email Address, Phone Number, and Shipping Address</strong>. This is strictly required to fulfill your order and deliver it to you.
                                </p>
                            </div>
                            <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                                <h3 className="text-white font-bold mb-3">Payment Data</h3>
                                <p className="text-sm leading-relaxed">
                                    We do <strong className="text-red-400">NOT</strong> store your credit card or bank account numbers. We only store the Transaction ID (UTR) you provide for payment verification purposes.
                                </p>
                            </div>
                        </div>
                        <p className="text-sm bg-white/5 p-4 rounded-lg border border-white/10">
                            <strong className="text-white">Technical Data:</strong> We automatically collect basic device information (IP address, browser type) via cookies to optimize our website's performance and security.
                        </p>
                    </section>

                    {/* Section 2: How We Use Your Data */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                            <div className="p-2 bg-cyber-cyan/10 rounded-lg">
                                <Shield className="w-6 h-6 text-cyber-cyan" />
                            </div>
                            <h2 className="text-2xl font-bold text-white">2. How We Use Your Data</h2>
                        </div>
                        <ul className="space-y-4 text-gray-300">
                            <li className="flex gap-3">
                                <span className="w-1.5 h-1.5 bg-cyber-cyan rounded-full mt-2 shrink-0" />
                                <span>
                                    <strong className="text-white">Order Fulfillment:</strong> To process your payment, pack your order, and arrange delivery via our courier partners.
                                </span>
                            </li>
                            <li className="flex gap-3">
                                <span className="w-1.5 h-1.5 bg-cyber-cyan rounded-full mt-2 shrink-0" />
                                <span>
                                    <strong className="text-white">Communication:</strong> To send you order confirmations, tracking number updates, and respond to your support queries.
                                </span>
                            </li>
                            <li className="flex gap-3">
                                <span className="w-1.5 h-1.5 bg-cyber-cyan rounded-full mt-2 shrink-0" />
                                <span>
                                    <strong className="text-white">Marketing (Optional):</strong> To send you newsletters about new arrivals or exclusive discounts. You can unsubscribe from these emails at any time.
                                </span>
                            </li>
                        </ul>
                    </section>

                    {/* Section 3: Data Sharing */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                            <div className="p-2 bg-purple-500/10 rounded-lg">
                                <Share2 className="w-6 h-6 text-purple-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-white">3. Data Sharing & Third Parties</h2>
                        </div>
                        <div className="space-y-4">
                            <p className="leading-relaxed">
                                <strong className="text-white">We never sell, trade, or rent your personal identification information to others.</strong>
                            </p>
                            <p className="leading-relaxed">
                                We share necessary data (Name, Phone, Address) with trusted logistics partners (like Delhivery, DTDC, Bluedart) strictly for the purpose of delivering your order. These third parties are obligated to keep your information confidential.
                            </p>
                        </div>
                    </section>

                    {/* Section 4: Cookies & Security */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                            <div className="p-2 bg-green-500/10 rounded-lg">
                                <Lock className="w-6 h-6 text-green-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-white">4. Cookies & Security</h2>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-white font-bold mb-2">Cookies</h3>
                                <p className="text-sm leading-relaxed text-gray-400">
                                    We use essential cookies to keep your shopping cart active and remember your preferences. You can disable cookies in your browser, but some features of the site may not work correctly.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-white font-bold mb-2">Security</h3>
                                <p className="text-sm leading-relaxed text-gray-400">
                                    Your data is stored on secure, encrypted servers (Supabase). We implement standard security measures to protect your personal information against unauthorized access, alteration, or disclosure.
                                </p>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Contact Footer */}
                <div className="border-t border-white/10 pt-12 mt-12 text-center">
                    <p className="mb-6">Questions about your privacy? We're transparant.</p>
                    <a
                        href="mailto:privacy@hayase.in"
                        className="inline-flex items-center gap-2 px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors"
                    >
                        <Mail className="w-5 h-5" />
                        Email Privacy Team
                    </a>
                </div>

            </div>
        </main>
    );
}
