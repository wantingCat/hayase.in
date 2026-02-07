"use client";

import Link from "next/link";
import { ShoppingCart, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

import { useCart } from "@/context/CartContext";

export default function Navbar() {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { setIsCartOpen, items } = useCart();

    // Calculate total items
    const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

    const links = [
        { name: "Home", href: "/" },
        { name: "Shop", href: "/shop" },
        { name: "Request", href: "/request" },
    ];

    return (
        <header>
            <nav
                className="fixed top-5 inset-x-0 mx-auto w-[90%] max-w-5xl z-[9999] flex items-center justify-between px-6 py-4 rounded-full backdrop-blur-xl bg-[#0a0e17]/80 border border-white/10 shadow-2xl transition-all duration-300 pointer-events-auto"
            >
                {/* Logo - Compact on mobile */}
                <Link href="/" className="flex items-center gap-1 font-bold text-lg tracking-tighter text-white mr-4 shrink-0">
                    <div className="relative h-14 w-32 filter drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">
                        <Image
                            src="/logo.png"
                            alt="Hayase Logo"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8 text-sm font-medium">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={clsx(
                                "transition-all duration-300 hover:text-cyber-pink relative group",
                                pathname === link.href ? "text-cyber-pink drop-shadow-[0_0_8px_rgba(255,42,109,0.5)]" : "text-gray-300"
                            )}
                        >
                            {link.name}
                            <span className={clsx(
                                "absolute -bottom-1 left-0 w-full h-0.5 bg-cyber-pink transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100",
                                pathname === link.href ? "scale-x-100" : ""
                            )} />
                        </Link>
                    ))}
                </div>

                {/* Right Side: Cart & Mobile Toggle */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsCartOpen(true)}
                        className="relative group cursor-pointer"
                    >
                        <div className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
                            <ShoppingCart size={18} className="text-white group-hover:text-cyber-pink transition-colors pointer-events-none" />
                        </div>
                        {totalItems > 0 && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-cyber-pink rounded-full border-2 border-[#0a0e17] flex items-center justify-center text-[10px] font-bold text-white">
                                {totalItems > 9 ? '9+' : totalItems}
                            </div>
                        )}
                    </button>

                    <button
                        className="md:hidden text-white p-1 hover:text-cyber-pink transition-colors"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Dropdown */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="fixed top-24 right-5 w-64 z-50 md:hidden"
                    >
                        <div className="rounded-2xl border border-white/10 shadow-2xl bg-[#0a0e17]/90 backdrop-blur-xl overflow-hidden p-4 flex flex-col gap-2 max-h-[80vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-2 pb-2 border-b border-white/5">
                                <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Menu</span>
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="p-1 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {links.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={clsx(
                                        "px-4 py-3 rounded-xl font-medium transition-colors flex items-center justify-between group",
                                        pathname === link.href
                                            ? "bg-cyber-pink/10 text-cyber-pink"
                                            : "text-gray-300 hover:bg-white/5 hover:text-white"
                                    )}
                                >
                                    {link.name}
                                    {pathname === link.href && <div className="w-1.5 h-1.5 rounded-full bg-cyber-pink" />}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
