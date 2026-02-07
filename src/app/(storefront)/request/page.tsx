"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Sparkles, Send, Loader2, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function RequestPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        character_name: "",
        budget: "",
        reference_image_url: "",
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase
                .from('requests')
                .insert([formData]);

            if (error) throw error;
            setSuccess(true);
        } catch (error) {
            console.error("Error submitting request:", error);
            alert("Failed to submit request. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-700">
                <div className="w-24 h-24 rounded-full bg-cyber-pink/20 flex items-center justify-center mb-6">
                    <CheckCircle className="w-12 h-12 text-cyber-pink" />
                </div>
                <h1 className="text-4xl font-bold text-white mb-4">Request Received!</h1>
                <p className="text-xl text-gray-400 max-w-md mx-auto">
                    We have started the hunt for your figure. We will contact you at <span className="text-cyber-cyan">{formData.email}</span> once we find it.
                </p>
                <button
                    onClick={() => setSuccess(false)}
                    className="mt-8 text-sm text-gray-500 hover:text-white underline"
                >
                    Submit another request
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center py-12 pt-40 px-4 w-full max-w-7xl mx-auto sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-2xl"
            >
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center p-2 rounded-full bg-cyber-cyan/10 border border-cyber-cyan/20 text-cyber-cyan mb-4">
                        <Sparkles size={16} className="mr-2" />
                        <span className="text-xs font-bold uppercase tracking-wider">Concierge Service</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">The Hunt Begins.</h1>
                    <p className="text-lg text-gray-400">Looking for a specific figure? We&apos;ll find it for you.</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-[#0a0e17]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Your Name</label>
                            <input
                                required
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyber-pink/50 focus:ring-1 focus:ring-cyber-pink/50 transition-all placeholder:text-gray-600"
                                placeholder="Enter your name"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Email Address</label>
                            <input
                                required
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyber-pink/50 focus:ring-1 focus:ring-cyber-pink/50 transition-all placeholder:text-gray-600"
                                placeholder="name@example.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Character / Anime Name</label>
                        <input
                            required
                            type="text"
                            value={formData.character_name}
                            onChange={(e) => setFormData({ ...formData, character_name: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyber-pink/50 focus:ring-1 focus:ring-cyber-pink/50 transition-all placeholder:text-gray-600"
                            placeholder="e.g. Rem - Re:Zero Crystal Dress Ver."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Budget Range</label>
                            <select
                                required
                                value={formData.budget}
                                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyber-pink/50 focus:ring-1 focus:ring-cyber-pink/50 transition-all appearance-none cursor-pointer"
                            >
                                <option value="" disabled>Select your budget</option>
                                <option value="<5k">Under ₹5,000</option>
                                <option value="5k-10k">₹5,000 - ₹10,000</option>
                                <option value="10k-20k">₹10,000 - ₹20,000</option>
                                <option value="20k+">₹20,000+</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Ref Image URL (Optional)</label>
                            <input
                                type="url"
                                value={formData.reference_image_url}
                                onChange={(e) => setFormData({ ...formData, reference_image_url: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyber-pink/50 focus:ring-1 focus:ring-cyber-pink/50 transition-all placeholder:text-gray-600"
                                placeholder="https://..."
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-gradient-to-r from-cyber-pink to-purple-600 text-white font-bold text-lg rounded-xl shadow-[0_0_20px_rgba(255,0,255,0.3)] hover:shadow-[0_0_30px_rgba(255,0,255,0.5)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <>Send Request <Send size={18} /></>}
                    </button>
                </form>
            </motion.div>
        </div>
    );
}
