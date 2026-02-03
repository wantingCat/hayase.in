"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";
import clsx from "clsx";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createClient();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) throw authError;

            // Check if user is admin
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Authentication failed");

            const { data: adminData, error: adminError } = await supabase
                .from('admins')
                .select('id')
                .eq('id', user.id)
                .single();

            if (adminError || !adminData) {
                // Not an admin, sign out
                await supabase.auth.signOut();
                throw new Error("Unauthorized Access: You are not an admin.");
            }

            router.push("/admin");
            router.refresh();

        } catch (err: any) {
            setError(err.message || "Invalid credentials");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-navy flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyber-pink/20 blur-[120px] rounded-full pointer-events-none" />

            <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl relative z-10 glassmorphism">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-12 h-12 bg-cyber-pink/10 rounded-full flex items-center justify-center text-cyber-pink mb-4 border border-cyber-pink/20">
                        <Lock size={24} />
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Admin Portal</h1>
                    <p className="text-gray-400 text-sm mt-1">Authenticate to access the dashboard</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg text-center">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyber-pink/50 transition-colors placeholder:text-gray-600"
                            placeholder="admin@hayase.in"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyber-pink/50 transition-colors placeholder:text-gray-600"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={clsx(
                            "w-full bg-gradient-to-r from-cyber-pink to-electric-purple text-white font-bold py-3 rounded-lg shadow-lg shadow-cyber-pink/20 transition-all hover:shadow-cyber-pink/40 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2",
                            loading && "opacity-70 cursor-not-allowed"
                        )}
                    >
                        {loading ? <Loader2 size={20} className="animate-spin" /> : "Authenticate"}
                    </button>
                </form>

                <div className="mt-6 text-center text-xs text-gray-500">
                    <p>Protected System • Authorized Personnel Only</p>
                </div>
            </div>
        </main>
    );
}
