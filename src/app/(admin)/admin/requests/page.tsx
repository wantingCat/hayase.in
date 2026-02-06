"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Search, Filter, MoreVertical, Loader2, ExternalLink, Calendar, User, DollarSign, Package } from "lucide-react";
import { format } from "date-fns";
import clsx from "clsx";

type Request = {
    id: string;
    created_at: string;
    name: string;
    email: string;
    character_name: string;
    budget: string;
    reference_image_url: string | null;
    status: 'pending' | 'found' | 'unavailable';
};

export default function RequestsPage() {
    const [requests, setRequests] = useState<Request[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('requests')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error fetching requests:", error);
        } else {
            setRequests(data as Request[] || []);
        }
        setLoading(false);
    };

    const handleStatusUpdate = async (id: string, newStatus: Request['status']) => {
        setUpdatingId(id);
        const { error } = await supabase
            .from('requests')
            .update({ status: newStatus })
            .eq('id', id);

        if (error) {
            alert("Failed to update status");
        } else {
            setRequests(prev => prev.map(req => req.id === id ? { ...req, status: newStatus } : req));
        }
        setUpdatingId(null);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
            case 'found': return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'unavailable': return 'bg-red-500/10 text-red-500 border-red-500/20';
            default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
        }
    };

    const filteredRequests = requests.filter(req =>
        req.character_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 max-w-[100vw] overflow-x-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Figure Requests</h1>
                    <p className="text-gray-400 mt-1">Manage concierge requests from customers</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search requests..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-navy border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white text-sm focus:outline-none focus:border-cyber-pink/50 w-full md:w-64"
                        />
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="animate-spin text-cyber-pink" size={32} />
                </div>
            ) : (
                <div className="space-y-4">
                    {/* Desktop Table Header */}
                    <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-navy/50 border border-white/10 rounded-t-xl text-xs font-bold text-gray-400 uppercase tracking-wider">
                        <div className="col-span-3">Character / Item</div>
                        <div className="col-span-3">Customer</div>
                        <div className="col-span-2">Budget</div>
                        <div className="col-span-2">Status</div>
                        <div className="col-span-2 text-right">Date</div>
                    </div>

                    {filteredRequests.length === 0 ? (
                        <div className="text-center py-12 text-gray-500 bg-navy/30 rounded-xl border border-white/5">
                            No requests found matching your search.
                        </div>
                    ) : (
                        <div className="space-y-4 md:space-y-0">
                            {filteredRequests.map((req) => (
                                <div
                                    key={req.id}
                                    className="group bg-navy/30 border border-white/5 rounded-xl md:rounded-none md:border-t-0 md:border-x-0 md:border-b md:border-white/10 p-5 md:px-6 md:py-4 hover:bg-white/5 transition-colors grid md:grid-cols-12 gap-4 md:items-center"
                                >
                                    {/* Mobile Header: Status & Date */}
                                    <div className="flex md:hidden justify-between items-start mb-2">
                                        <div className={clsx("px-2 py-1 rounded text-xs font-bold border capitalize", getStatusColor(req.status))}>
                                            {req.status}
                                        </div>
                                        <span className="text-xs text-gray-500">{format(new Date(req.created_at), 'MMM d, yyyy')}</span>
                                    </div>

                                    {/* Character Info */}
                                    <div className="col-span-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                                                <Package size={18} className="text-cyber-cyan" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-white text-sm md:text-base">{req.character_name}</h3>
                                                {req.reference_image_url && (
                                                    <a
                                                        href={req.reference_image_url}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="flex items-center gap-1 text-xs text-cyber-pink hover:underline mt-0.5"
                                                    >
                                                        View Reference <ExternalLink size={10} />
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Customer Info */}
                                    <div className="col-span-3">
                                        <div className="flex items-center gap-2 md:hidden mb-1 text-xs text-gray-500 uppercase font-bold">Customer</div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center text-xs font-bold text-white border border-white/10">
                                                {req.name.charAt(0)}
                                            </div>
                                            <div className="overflow-hidden">
                                                <div className="text-sm text-white font-medium truncate">{req.name}</div>
                                                <div className="text-xs text-gray-400 truncate">{req.email}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Budget */}
                                    <div className="col-span-2">
                                        <div className="flex items-center gap-2 md:hidden mb-1 text-xs text-gray-500 uppercase font-bold">Budget</div>
                                        <div className="inline-flex items-center px-2 py-1 rounded bg-white/5 border border-white/10 text-sm text-gray-300">
                                            <DollarSign size={12} className="mr-1 text-green-400" />
                                            {req.budget || "N/A"}
                                        </div>
                                    </div>

                                    {/* Status (Desktop) */}
                                    <div className="hidden md:block col-span-2">
                                        <select
                                            value={req.status}
                                            onChange={(e) => handleStatusUpdate(req.id, e.target.value as Request['status'])}
                                            disabled={updatingId === req.id}
                                            className={clsx(
                                                "w-full bg-transparent border rounded px-2 py-1 text-sm font-medium focus:outline-none cursor-pointer",
                                                getStatusColor(req.status)
                                            )}
                                        >
                                            <option value="pending" className="bg-navy text-yellow-500">Pending</option>
                                            <option value="found" className="bg-navy text-green-500">Found</option>
                                            <option value="unavailable" className="bg-navy text-red-500">Unavailable</option>
                                        </select>
                                    </div>

                                    {/* Status (Mobile) */}
                                    <div className="md:hidden mt-2">
                                        <label className="text-xs text-gray-500 font-bold uppercase block mb-1">Update Status</label>
                                        <select
                                            value={req.status}
                                            onChange={(e) => handleStatusUpdate(req.id, e.target.value as Request['status'])}
                                            disabled={updatingId === req.id}
                                            className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-cyber-pink/50"
                                        >
                                            <option value="pending" className="bg-navy">Pending</option>
                                            <option value="found" className="bg-navy">Found</option>
                                            <option value="unavailable" className="bg-navy">Unavailable</option>
                                        </select>
                                    </div>

                                    {/* Date (Desktop) */}
                                    <div className="hidden md:block col-span-2 text-right text-sm text-gray-400 font-mono">
                                        {format(new Date(req.created_at), 'MMM d, yyyy')}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
