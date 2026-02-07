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
                className="relative min-h-screen bg-[#0a0e17] text-white selection:bg-cyber-pink selection:text-white overflow-x-hidden"
            >
                <Navbar />
                <main className="pb-12 w-full min-h-screen flex flex-col">
                    {children}
                </main>
                <Footer />
                <CartDrawer />
            </div>
        </CartProvider>
    );
}
