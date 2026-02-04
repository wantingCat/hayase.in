"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Loader2, Plus, Image as ImageIcon, Trash2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import imageCompression from 'browser-image-compression';

interface ProductFormData {
    name: string;
    price: number;
    stock: number;
    manufacturer: string;
    scale: string;
    condition: "New" | "Pre-owned";
    description: string;
}

export default function ProductForm() {
    const supabase = createClient();
    const [isOpen, setIsOpen] = useState(false);
    const [images, setImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);

    const router = useRouter();
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ProductFormData>({
        defaultValues: {
            condition: "New"
        }
    });

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setImages((prev) => [...prev, ...newFiles]);

            const newPreviews = newFiles.map(file => URL.createObjectURL(file));
            setImagePreviews((prev) => [...prev, ...newPreviews]);
        }
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => {
            // Revoke URL to avoid memory leaks
            URL.revokeObjectURL(prev[index]);
            return prev.filter((_, i) => i !== index);
        });
    };

    const onSubmit = async (data: ProductFormData) => {
        if (images.length === 0) {
            toast.error("Please upload at least one image");
            return;
        }

        setUploading(true);
        try {
            const imageUrls: string[] = [];
            const compressedImages: File[] = [];

            // Compress Images
            toast.info("Compressing images...", { id: "compression-toast" }); // Show loading toast

            for (const file of images) {
                const options = {
                    maxSizeMB: 0.8,
                    maxWidthOrHeight: 1920,
                    useWebWorker: true,
                };

                try {
                    const compressedFile = await imageCompression(file, options);
                    compressedImages.push(compressedFile);
                } catch (error) {
                    console.error("Compression failed for", file.name, error);
                    // Fallback to original file if compression fails
                    compressedImages.push(file);
                }
            }
            toast.dismiss("compression-toast");

            // Upload Images
            toast.loading("Uploading images...", { id: "upload-toast" });

            for (const file of compressedImages) {
                const fileExt = file.name.split('.').pop();
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
                const { error: uploadError } = await supabase.storage
                    .from('product-images')
                    .upload(fileName, file);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('product-images')
                    .getPublicUrl(fileName);

                imageUrls.push(publicUrl);
            }
            toast.dismiss("upload-toast");

            // Save to DB
            const { error: insertError } = await supabase
                .from('products')
                .insert({
                    ...data,
                    condition: 'New',
                    images: imageUrls,
                    price: parseFloat(data.price.toString()), // Ensure number
                    stock: parseInt(data.stock.toString()), // Ensure number
                });

            if (insertError) throw insertError;

            toast.success("Product created successfully!");
            setIsOpen(false);
            resetInternal();
            router.refresh();

        } catch (error) {
            console.error(error);
            const message = error instanceof Error ? error.message : "Failed to create product";
            toast.error(message);
            toast.dismiss("compression-toast");
            toast.dismiss("upload-toast");
        } finally {
            setUploading(false);
        }
    };

    const resetInternal = () => {
        reset();
        setImages([]);
        setImagePreviews([]);

    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 bg-cyber-pink hover:bg-cyber-pink/80 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-[0_0_15px_rgba(255,0,255,0.4)]"
            >
                <Plus size={18} />
                Add Product
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                        />

                        {/* Slide-over Panel */}
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            className="fixed inset-y-0 right-0 w-full max-w-xl bg-navy border-l border-white/10 shadow-2xl z-[101] overflow-y-auto flex flex-col"
                        >
                            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-navy/95 backdrop-blur sticky top-0 z-10">
                                <h2 className="text-xl font-bold text-white">New Product</h2>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8 flex-1">

                                {/* Image Upload Section */}
                                <div className="space-y-4">
                                    <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                        <ImageIcon size={16} className="text-cyber-pink" />
                                        Product Images
                                    </label>

                                    <div className="grid grid-cols-3 gap-4">
                                        {imagePreviews.map((src, index) => (
                                            <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-white/20 group">
                                                <Image src={src} alt="Preview" fill className="object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="absolute top-2 right-2 bg-black/70 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        ))}

                                        <label className="aspect-square border-2 border-dashed border-white/10 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-cyber-pink/50 hover:bg-white/5 transition-all text-gray-500 hover:text-cyber-pink">
                                            <Upload size={24} className="mb-2" />
                                            <span className="text-xs">Upload</span>
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleImageSelect}
                                            />
                                        </label>
                                    </div>
                                </div>

                                {/* Initial Info */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider border-b border-white/5 pb-2">Basic Info</h3>

                                    <div className="space-y-2">
                                        <label className="text-sm text-gray-300">Product Name</label>
                                        <input
                                            {...register("name", { required: "Name is required" })}
                                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyber-pink/50 transition-colors"
                                            placeholder="e.g. Miku Hatsune 1/7 Scale"
                                        />
                                        {errors.name && <p className="text-red-400 text-xs">{errors.name.message}</p>}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm text-gray-300">Price (₹)</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                {...register("price", { required: "Price is required", min: 0 })}
                                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyber-pink/50 transition-colors"
                                                placeholder="0.00"
                                            />
                                            {errors.price && <p className="text-red-400 text-xs">{errors.price.message}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm text-gray-300">Stock</label>
                                            <input
                                                type="number"
                                                {...register("stock", { required: "Stock is required", min: 0 })}
                                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyber-pink/50 transition-colors"
                                                placeholder="0"
                                            />
                                            {errors.stock && <p className="text-red-400 text-xs">{errors.stock.message}</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider border-b border-white/5 pb-2">Details</h3>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm text-gray-300">Manufacturer</label>
                                            <input
                                                {...register("manufacturer")}
                                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyber-pink/50 transition-colors"
                                                placeholder="e.g. Good Smile"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm text-gray-300">Scale</label>
                                            <input
                                                {...register("scale")}
                                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyber-pink/50 transition-colors"
                                                placeholder="e.g. 1/7"
                                            />
                                        </div>
                                    </div>



                                    <div className="space-y-2">
                                        <label className="text-sm text-gray-300">Description</label>
                                        <textarea
                                            {...register("description")}
                                            rows={4}
                                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyber-pink/50 transition-colors resize-none"
                                            placeholder="Product details..."
                                        />
                                    </div>
                                </div>
                            </form>

                            <div className="p-6 border-t border-white/10 bg-navy sticky bottom-0 z-10 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="px-6 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmit(onSubmit)}
                                    disabled={isSubmitting || uploading}
                                    className="flex items-center gap-2 bg-gradient-to-r from-cyber-pink to-electric-purple text-white px-8 py-2.5 rounded-lg font-bold shadow-lg shadow-cyber-pink/20 hover:shadow-cyber-pink/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {(isSubmitting || uploading) && <Loader2 size={18} className="animate-spin" />}
                                    Save Product
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
