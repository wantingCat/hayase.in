export interface Product {
    id: string;
    created_at: string;
    name: string;
    description: string | null;
    price: number;
    stock: number;
    images: string[];
    manufacturer: string | null;
    scale: string | null;
    condition: string | null;
    is_featured: boolean;
    category: string | null;
    tags: string[] | null;
}

export interface Order {
    id: string;
    created_at: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string | null;
    shipping_address: string;
    total_amount: number;
    status: 'pending_verification' | 'confirmed' | 'shipped' | 'cancelled';
    upi_transaction_id: string | null;
}

export interface Coupon {
    id: string;
    code: string;
    discount_type: 'percent' | 'fixed';
    discount_value: number;
    min_order_value: number;
    max_uses: number | null;
    current_uses: number;
    expires_at: string | null;
    is_active: boolean;
    created_at: string;
}

export interface Review {
    id: string;
    product_id: string;
    user_name: string;
    rating: number;
    comment: string;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
}
