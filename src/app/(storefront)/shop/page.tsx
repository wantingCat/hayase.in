import ProductCard from "@/components/storefront/ProductCard";
import ShopSidebar from "@/components/storefront/ShopSidebar";
import { createClient } from "@/utils/supabase/server";
import { Ghost, Search, X } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';
export const metadata = {
    title: 'Shop',
};

export default async function ShopPage(props: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const searchParams = await props.searchParams;
    const supabase = await createClient();

    // Extract filters
    const search = typeof searchParams.search === 'string' ? searchParams.search : undefined;
    const categoryParam = typeof searchParams.category === 'string' ? searchParams.category : undefined;
    const categoriesFilter = categoryParam ? categoryParam.split(',') : [];
    const minPrice = typeof searchParams.min === 'string' ? Number(searchParams.min) : undefined;
    const maxPrice = typeof searchParams.max === 'string' ? Number(searchParams.max) : undefined;

    // Fetch unique categories
    const { data: categoryData } = await supabase
        .from('products')
        .select('category');

    const uniqueCategories = Array.from(new Set(
        categoryData?.map(item => item.category).filter(Boolean) as string[]
    )).sort();

    // Build Query
    let query = supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

    if (search) {
        query = query.ilike('name', `%${search}%`);
    }

    if (categoriesFilter.length > 0) {
        query = query.in('category', categoriesFilter);
    }

    if (minPrice !== undefined) {
        query = query.gte('price', minPrice);
    }

    if (maxPrice !== undefined) {
        query = query.lte('price', maxPrice);
    }

    const { data: products } = await query;

    const isEmpty = !products || products.length === 0;
    const hasFilters = search || categoriesFilter.length > 0 || minPrice !== undefined || maxPrice !== undefined;

    return (
        <div className="flex flex-col md:flex-row gap-8 min-h-[60vh] pt-32 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
            {/* Sidebar */}
            <ShopSidebar categories={uniqueCategories} />

            {/* Main Content */}
            <div className="flex-1">
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h1 className="text-3xl font-bold text-white">
                        {search ? `Results for "${search}"` : "All Products"}
                    </h1>
                    <span className="text-gray-400 text-sm">
                        Showing {products?.length || 0} results
                    </span>
                </div>

                {isEmpty ? (
                    <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/10 rounded-2xl bg-white/5">
                        <Ghost className="w-16 h-16 text-gray-600 mb-4" />
                        <h2 className="text-xl font-bold text-white mb-2">No products found</h2>
                        <p className="text-gray-400 text-center max-w-md mb-6">
                            We couldn't find any figures matching your criteria.
                        </p>
                        {hasFilters && (
                            <Link
                                href="/shop"
                                className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors flex items-center gap-2"
                            >
                                <X size={16} />
                                Clear Filters
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
