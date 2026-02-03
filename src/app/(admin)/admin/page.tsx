export default function AdminDashboard() {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-xl border border-white/10 glassmorphism">
                    <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider">Total Sales</h3>
                    <p className="text-3xl font-bold text-cyber-pink mt-2">₹0.00</p>
                </div>

                <div className="p-6 rounded-xl border border-white/10 glassmorphism">
                    <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider">Active Orders</h3>
                    <p className="text-3xl font-bold text-soft-cyan mt-2">0</p>
                </div>

                <div className="p-6 rounded-xl border border-white/10 glassmorphism">
                    <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider">Inventory Value</h3>
                    <p className="text-3xl font-bold text-electric-purple mt-2">₹0.00</p>
                </div>
            </div>

            <div className="p-8 rounded-xl border border-dashed border-white/10 text-center text-gray-500">
                <p>Chart visualization coming soon...</p>
            </div>
        </div>
    );
}
