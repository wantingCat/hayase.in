"use client";

import { motion } from "framer-motion";
import { Package, Smartphone, Heart, Box } from "lucide-react";
import { FAQAccordion } from "@/components/storefront/FAQ";

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-navy text-foreground overflow-x-hidden">
            {/* Hero Section */}
            <section className="relative pt-40 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-cyber-pink/5 rounded-full blur-[120px]" />
                </div>

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                            Built by Collectors, <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-pink to-electric-purple">
                                For Collectors.
                            </span>
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                            Hayase was born from a simple frustration: Collecting figures in India shouldn't be a gamble.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Our Story */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/5 border-y border-white/5">
                <div className="max-w-4xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold text-white">Collecting Shouldn't Be Complicated.</h2>
                            <p className="text-gray-300 leading-relaxed">
                                We started Hayase with a simple goal: to make anime figures accessible in India. We know the pain—official imports cost a fortune, and buying from random sellers is scary.
                            </p>
                            <p className="text-gray-300 leading-relaxed">
                                We aren't a massive corporation. We are a small team of collectors based in Uttar Pradesh. We source the best quality budget-friendly figures we can find, inspect them personally, and ensure they actually reach you in one piece. No scams, no ghosting, just cool figures for your shelf.
                            </p>
                        </div>
                        <div className="relative h-64 md:h-full min-h-[300px] rounded-2xl overflow-hidden border border-white/10 bg-black/40 flex items-center justify-center group">
                            {/* Placeholder for warehouse/packaging image */}
                            <div className="absolute inset-0 bg-gradient-to-br from-cyber-pink/10 to-purple-500/10 opacity-50" />
                            <Box className="w-16 h-16 text-white/20" />
                            <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md p-3 rounded-lg border border-white/10 text-xs text-gray-400">
                                <span>Real packaging, real care. Not a stock photo.</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Hayase? Grid */}
            <section className="py-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-white">Why Trust Us?</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* 1. The Tank Build */}
                        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-cyber-pink/50 transition-colors group">
                            <div className="w-12 h-12 bg-cyber-pink/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Package className="w-6 h-6 text-cyber-pink" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">The Tank Build</h3>
                            <p className="text-gray-400 leading-relaxed">
                                We know couriers play football with parcels. That's why we use multi-layer bubble wrap and reinforced boxes. If it breaks, we refund it.
                            </p>
                        </div>

                        {/* 2. Budget Friendly */}
                        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-cyber-cyan/50 transition-colors group">
                            <div className="w-12 h-12 bg-cyber-cyan/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Heart className="w-6 h-6 text-cyber-cyan" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Budget Friendly</h3>
                            <p className="text-gray-400 leading-relaxed">
                                We focus on 'Third-Party' and replica figures that look great on a shelf but cost a fraction of the premium imports. Great looks, low price.
                            </p>
                        </div>

                        {/* 3. Real Support */}
                        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-purple-500/50 transition-colors group">
                            <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Smartphone className="w-6 h-6 text-purple-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Real Support</h3>
                            <p className="text-gray-400 leading-relaxed">
                                You are talking to a real person, not a bot. We are based in UP, and if you have an issue, we fix it locally and quickly.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Embedded FAQ */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 bg-black/20">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-white mb-4">Common Questions</h2>
                        <p className="text-gray-400">Everything you need to know before your first order.</p>
                    </div>

                    <FAQAccordion />
                </div>
            </section>
        </main>
    );
}
