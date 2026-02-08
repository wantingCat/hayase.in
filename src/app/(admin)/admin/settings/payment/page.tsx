"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { Upload, Save, Loader2, QrCode } from "lucide-react";
import Image from "next/image";

interface PaymentSettings {
    id?: string;
    upi_id: string;
    qr_code_url: string | null;
    account_name: string;
    is_active: boolean;
}

export default function PaymentSettingsPage() {
    const supabase = createClient();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState<PaymentSettings>({
        upi_id: "",
        qr_code_url: null,
        account_name: "",
        is_active: true,
    });
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const { data, error } = await supabase
                    .from("payment_settings")
                    .select("*")
                    .single();

                if (error && error.code !== 'PGRST116') {
                    console.error("Error fetching settings:", error);
                    throw error;
                }

                if (data) {
                    setSettings(data);
                    if (data.qr_code_url) {
                        setPreviewUrl(getImageUrl(data.qr_code_url));
                    }
                }
            } catch (error) {
                console.error("Error fetching settings:", error);
                toast.error("Failed to load payment settings");
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, [supabase]);

    const getImageUrl = (url: string) => {
        if (!url) return null;
        if (url.startsWith('http')) return url;
        return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/${url}`;
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            let qrCodePath = settings.qr_code_url;

            // Upload new image if selected
            const file = fileInputRef.current?.files?.[0];
            if (file) {
                const ext = file.name.split(".").pop();
                const fileName = `qr-codes/${Date.now()}.${ext}`;
                const { error: uploadError } = await supabase.storage
                    .from("product-images")
                    .upload(fileName, file);

                if (uploadError) throw uploadError;
                qrCodePath = fileName;
            }

            const upsertData = {
                upi_id: settings.upi_id,
                account_name: settings.account_name,
                qr_code_url: qrCodePath,
                is_active: settings.is_active,
                // If it's an update, include ID? Supabase upsert needs conflict target or ID.
                // If we have an ID, use it. If not, we might need a fixed ID or handle insert.
                ...(settings.id ? { id: settings.id } : {}),
            };

            const { data, error } = await supabase
                .from("payment_settings")
                .upsert(upsertData)
                .select()
                .single();

            if (error) throw error;

            setSettings(data);
            toast.success("Payment settings saved successfully");
        } catch (error: unknown) {
            console.error("Error saving settings:", error);
            // safe to cast to any for error message or use unknown
            const message = error instanceof Error ? error.message : "Unknown error";
            toast.error(`Failed to save settings: ${message}`);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="w-8 h-8 animate-spin text-cyber-pink" />
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Payment Settings</h1>
                <p className="text-gray-400">Manage UPI details and QR code for customer checkout.</p>
            </div>

            <form onSubmit={handleSave} className="space-y-6 bg-white/5 p-6 rounded-2xl border border-white/10">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">UPI ID</label>
                        <input
                            type="text"
                            required
                            value={settings.upi_id}
                            onChange={(e) => setSettings({ ...settings, upi_id: e.target.value })}
                            placeholder="e.g. username@upi"
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyber-pink transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Account Name (Optional)</label>
                        <input
                            type="text"
                            value={settings.account_name}
                            onChange={(e) => setSettings({ ...settings, account_name: e.target.value })}
                            placeholder="e.g. Hayase Store"
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyber-pink transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">QR Code Image</label>
                        <div className="mt-2 flex items-center gap-6">
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="relative w-40 h-40 bg-black/40 rounded-xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center cursor-pointer hover:border-cyber-pink/50 transition-colors group overflow-hidden"
                            >
                                {previewUrl ? (
                                    <Image
                                        src={previewUrl}
                                        alt="QR Code Preview"
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <>
                                        <QrCode className="w-8 h-8 text-gray-500 mb-2 group-hover:text-cyber-pink transition-colors" />
                                        <span className="text-xs text-gray-500">Click to upload</span>
                                    </>
                                )}
                            </div>
                            <div className="flex flex-col gap-2">
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm text-white transition-colors flex items-center gap-2"
                                >
                                    <Upload size={16} />
                                    Choose Image
                                </button>
                                <p className="text-xs text-gray-500">Supported formats: PNG, JPG</p>
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                                className="hidden"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                        <input
                            type="checkbox"
                            id="isActive"
                            checked={settings.is_active}
                            onChange={(e) => setSettings({ ...settings, is_active: e.target.checked })}
                            className="w-4 h-4 rounded border-gray-600 bg-black/20 text-cyber-pink focus:ring-cyber-pink"
                        />
                        <label htmlFor="isActive" className="text-sm text-gray-300">Enable Payment Method</label>
                    </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-6 py-3 bg-cyber-pink hover:bg-cyber-pink/90 text-black font-bold rounded-xl flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        Save Payment Settings
                    </button>
                </div>
            </form>
        </div>
    );
}
