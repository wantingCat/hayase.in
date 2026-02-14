import Link from "next/link";
import { Twitter, Instagram } from "lucide-react";

export function Footer() {
    return (
        <footer className="relative z-10 bg-zinc-900 border-t border-zinc-800 text-zinc-400 py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Brand & Copyright */}
                    <div>
                        <h3 className="text-white text-lg font-bold mb-4">Hayase</h3>
                        <p className="text-sm">
                            Premium anime figures imported directly from Japan.
                        </p>
                        <div className="mt-4 flex space-x-4">
                            <a href="#" className="hover:text-white transition-colors">
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a href="#" className="hover:text-white transition-colors">
                                <Instagram className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white text-lg font-bold mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/shop" className="hover:text-white transition-colors">
                                    Shop All
                                </Link>
                            </li>
                            <li>
                                <Link href="/faq" className="hover:text-white transition-colors">
                                    FAQ
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="hover:text-white transition-colors">
                                    About Us
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="text-white text-lg font-bold mb-4">Legal</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/privacy" className="hover:text-white transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="hover:text-white transition-colors">
                                    Terms of Service
                                </Link>
                            </li>
                            <li>
                                <Link href="/refund-policy" className="hover:text-white transition-colors">
                                    Refund Policy
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-zinc-800 mt-8 pt-8 text-center text-xs">
                    &copy; 2026 Hayase. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
