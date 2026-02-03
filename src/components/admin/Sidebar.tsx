"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, LogOut } from "lucide-react";
import clsx from "clsx";
import { motion } from "framer-motion";

const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <motion.aside
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="w-64 h-screen fixed left-0 top-0 bg-navy/90 backdrop-blur-md border-r border-white/10 flex flex-col z-50 text-foreground"
        >
            <div className="p-6 border-b border-white/10">
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyber-pink to-soft-cyan">
                    HAYASE
                </h1>
                <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">Admin Portal</p>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={clsx(
                                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group relative overflow-hidden",
                                isActive
                                    ? "text-white shadow-[0_0_15px_rgba(255,0,255,0.3)] bg-white/5 border border-cyber-pink/30"
                                    : "text-gray-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-cyber-pink/10 rounded-lg"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                            <Icon size={20} className={clsx("relative z-10 transition-colors", isActive ? "text-cyber-pink" : "group-hover:text-soft-cyan")} />
                            <span className="relative z-10 font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-white/10">
                <button className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                    <LogOut size={20} />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </motion.aside>
    );
}
