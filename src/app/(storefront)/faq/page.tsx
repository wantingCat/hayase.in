"use client";

import { Mail } from "lucide-react"; // Keep only what's needed
import { FAQAccordion } from "@/components/storefront/FAQ";

export default function FAQPage() {
    // No state needed here anymore

    return (
        <main className="min-h-screen bg-navy pt-32 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Frequently Asked Questions</h1>
                    <p className="text-gray-400 text-lg">Everything you need to know about shopping with Hayase.</p>
                </div>

                <div className="space-y-12">
                    <FAQAccordion />
                </div>

                {/* Contact Section */}
                <div className="mt-20 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 mb-6">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="text-sm font-medium text-gray-300">We respond within 24 hours</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">Still have questions?</h3>
                    <p className="text-gray-400 mb-8 max-w-md mx-auto">
                        Can't find the answer you're looking for? Please seek help from out friendly support team.
                    </p>
                    <a
                        href="mailto:support@hayase.in"
                        className="inline-flex items-center gap-2 px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors"
                    >
                        <Mail className="w-5 h-5" />
                        Contact Support
                    </a>
                </div>
            </div>
        </main>
    );
}
