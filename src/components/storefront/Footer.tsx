"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { Mail, Twitter, Instagram, Github } from "lucide-react";

export function Footer() {
    const supabase = createClient();
    const [email, setEmail] = useState("");
    const [subscribing, setSubscribing] = useState(false);
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setSubscribing(true);
        try {
            const { error } = await supabase
                .from("newsletter_subscribers")
                .insert([{ email }]);

            if (error) {
                if (error.code === '23505') { // Unique violation
                    toast.success("You're already on the list!");
                    setSubscribed(true);
                } else {
                    throw error;
                }
            } else {
                toast.success("Welcome to the Hunter Association!");
                setSubscribed(true);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to join.");
        } finally {
            setSubscribing(false);
        }
    };

    return (
        <footer className="bg-black text-white relative border-t border-white/5 overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none" />
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black to-transparent pointer-events-none" />

            <div className="container mx-auto px-4 py-20 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div className="space-y-6">
                        <Link href="/" className="inline-block group">
                            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyber-pink via-purple-500 to-soft-cyan group-hover:opacity-80 transition-opacity">
                                HAYASE
                            </h2>
                        </Link>
                        <p className="text-gray-400 leading-relaxed font-light">
                            Premium figures and collectibles from the anime multiverse. Curated for true fans and collectors.
                        </p>
                        <div className="flex gap-4 pt-2">
                            {/* Social Icons */}
                            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-cyber-pink/20 hover:border-cyber-pink/40 hover:text-cyber-pink transition-all cursor-pointer">
                                <Twitter size={18} />
                            </div>
                            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-cyber-pink/20 hover:border-cyber-pink/40 hover:text-cyber-pink transition-all cursor-pointer">
                                <Instagram size={18} />
                            </div>
                            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-cyber-pink/20 hover:border-cyber-pink/40 hover:text-cyber-pink transition-all cursor-pointer">
                                <Github size={18} />
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h3 className="font-bold text-lg mb-6 text-white tracking-wide">Explore</h3>
                        <ul className="space-y-4 text-gray-400">
                            <li><Link href="/products" className="hover:text-cyber-pink transition-colors">All Products</Link></li>
                            <li><Link href="/products?category=Scale" className="hover:text-cyber-pink transition-colors">Scale Figures</Link></li>
                            <li><Link href="/products?category=Nendoroid" className="hover:text-cyber-pink transition-colors">Nendoroids</Link></li>
                            <li><Link href="/request" className="hover:text-cyber-pink transition-colors">Request Figure</Link></li>
                        </ul>
                    </div>

                    {/* Information */}
                    <div>
                        <h3 className="font-bold text-lg mb-6 text-white tracking-wide">Information</h3>
                        <ul className="space-y-4 text-gray-400">
                            <li><Link href="/about" className="hover:text-cyber-pink transition-colors">About Us</Link></li>
                            <li><Link href="/shipping" className="hover:text-cyber-pink transition-colors">Shipping & Returns</Link></li>
                            <li><Link href="/faq" className="hover:text-cyber-pink transition-colors">FAQ</Link></li>
                            <li><Link href="/contact" className="hover:text-cyber-pink transition-colors">Contact Support</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="space-y-6">
                        <h3 className="font-bold text-lg text-white tracking-wide">Hunter Association</h3>
                        <p className="text-gray-400 text-sm">
                            Join the ranks. Get notified about exclusive drops, pre-orders, and secret sales.
                        </p>
                        {subscribed ? (
                            <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-xl flex items-center gap-2">
                                <span className="font-bold">✓ Welcome Aboard</span>
                            </div>
                        ) : (
                            <form onSubmit={handleSubscribe} className="space-y-3">
                                <div className="relative">
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="hunter@example.com"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyber-pink/50 transition-colors placeholder:text-gray-600"
                                    />
                                    <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                </div>
                                <button
                                    type="submit"
                                    disabled={subscribing}
                                    className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] border border-white/5 disabled:opacity-50"
                                >
                                    {subscribing ? "Joining..." : "Join the Guild"}
                                </button>
                            </form>
                        )}
                        <p className="text-xs text-gray-600">
                            By joining, you agree to our Terms of Service. No spam, only rare loot.
                        </p>
                    </div>
                </div>

                <div className="border-t border-white/5 mt-20 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
                    <p>&copy; {new Date().getFullYear()} Hayase. All rights reserved.</p>
                    <div className="flex gap-8">
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
