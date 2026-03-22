"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Mail, Loader2, Copy, Check, Info } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface Subscriber {
    id: string;
    email: string;
    subscribed_at: string;
    status: string;
}

export default function NewsletterPage() {
    const supabase = createClient();
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        fetchSubscribers();
    }, []);

    const fetchSubscribers = async () => {
        try {
            const { data, error } = await supabase
                .from("newsletter_subscribers")
                .select("*")
                .order("subscribed_at", { ascending: false });

            if (error) throw error;
            setSubscribers(data || []);
        } catch (error) {
            console.error("Error fetching subscribers:", error);
            toast.error("Failed to load subs");
        } finally {
            setLoading(false);
        }
    };

    const copyAllEmails = () => {
        const emailList = subscribers.map(s => s.email).join(", ");
        navigator.clipboard.writeText(emailList);
        setCopied(true);
        toast.success("All emails copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="w-8 h-8 animate-spin text-cyber-pink" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Newsletter</h1>
                    <p className="text-gray-400 mt-2">The Hunter Association recruitment list.</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <span className="text-sm font-mono text-soft-cyan bg-cyber-pink/10 px-3 py-1 rounded-full border border-cyber-pink/20">
                        Total Recruits: {subscribers.length}
                    </span>
                    <button
                        onClick={copyAllEmails}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors text-sm font-medium border border-white/10"
                    >
                        {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                        {copied ? "Copied!" : "Copy All Emails"}
                    </button>
                </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-white/10 glassmorphism">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-white/5 text-gray-400 uppercase text-xs tracking-wider">
                        <tr>
                            <th className="p-4">Email</th>
                            <th className="p-4">Date Joined</th>
                            <th className="p-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10 text-gray-300">
                        {subscribers.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="p-8 text-center text-gray-500">
                                    No recruits yet.
                                </td>
                            </tr>
                        ) : (
                            subscribers.map((sub) => (
                                <tr key={sub.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4 font-medium text-white">{sub.email}</td>
                                    <td className="p-4 font-mono text-sm text-gray-500">
                                        {format(new Date(sub.subscribed_at), 'MMM d, yyyy')}
                                    </td>
                                    <td className="p-4">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-400 border border-green-500/20">
                                            Active
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 text-sm">
                <Info size={18} className="shrink-0" />
                <p>
                    Pro Tip: Use the "Copy All Emails" button to paste into your email marketing tool (e.g. Resend, Mailchimp) to send campaigns.
                </p>
            </div>
        </div>
    );
}
