import Navbar from "@/components/storefront/Navbar";
import { Footer } from "@/components/storefront/Footer";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/storefront/CartDrawer";

export default function StorefrontLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <CartProvider>
            <div
                suppressHydrationWarning
                className="relative min-h-screen bg-[#0a0e17] text-white selection:bg-cyber-pink selection:text-white overflow-x-hidden flex flex-col"
            >
                <Navbar />
                <div className="flex-1 w-full flex flex-col">
                    {children}
                </div>
                <Footer />
                <CartDrawer />
            </div>
        </CartProvider>
    );
}
