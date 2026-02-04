import Sidebar from "@/components/admin/Sidebar";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { Toaster } from "sonner";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Check if user is an admin in the database
    const { data: adminData } = await supabase
        .from('admins')
        .select('id')
        .eq('id', user.id)
        .single();

    if (!adminData) {
        // Optional: Sign out logic isn't straightforward in server components without actions/middleware handling redirect loop
        // For now, redirect to login (or a 403 page if we created one)
        redirect("/login");
    }

    return (
        <div className="flex min-h-screen bg-navy text-foreground">
            <Sidebar />
            <main className="flex-1 ml-0 md:ml-64 p-4 pt-24 md:p-8 md:pt-8 overflow-y-auto">
                {children}
            </main>
            <Toaster richColors theme="dark" position="top-right" />
        </div>
    );
}
