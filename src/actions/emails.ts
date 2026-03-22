"use server";

import { resend } from "@/lib/resend";

interface EmailParams {
    email: string;
    customerName: string;
    orderId: string;
    totalAmount: number;
    items: { name: string; quantity: number; price: number }[];
}

export async function sendOrderConfirmationEmail({
    email,
    customerName,
    orderId,
    totalAmount,
    items
}: EmailParams) {
    try {
        const { data, error } = await resend.emails.send({
            from: 'Hayase Orders <orders@hayase.in>',
            to: [email],
            subject: `Order Confirmed! (Order #${orderId.slice(0, 8)})`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1>Hi ${customerName},</h1>
                    <p>Thanks for your order! We have received your request and will process it shortly.</p>
                    
                    <div style="background: #f4f4f4; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3>Order Summary (ID: ${orderId})</h3>
                        <ul style="list-style: none; padding: 0;">
                            ${items.map(item => `
                                <li style="border-bottom: 1px solid #ddd; padding: 10px 0; display: flex; justify-content: space-between;">
                                    <span>${item.quantity} x ${item.name}</span>
                                    <span>₹${(item.price * item.quantity).toLocaleString('en-IN')}</span>
                                </li>
                            `).join('')}
                        </ul>
                        <div style="border-top: 2px solid #333; padding-top: 10px; font-weight: bold; display: flex; justify-content: space-between;">
                            <span>Total</span>
                            <span>₹${totalAmount.toLocaleString('en-IN')}</span>
                        </div>
                    </div>

                    <p>We will verify your payment (if applicable) and notify you when your items are shipped.</p>
                    <p>If you have any questions, reply to this email.</p>
                    
                    <p>Best regards,<br/>Team Hayase</p>
                </div>
            `
        });

        if (error) {
            console.error('Error sending confirmation email:', error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (error) {
        console.error('Unexpected error sending confirmation email:', error);
        return { success: false, error };
    }
}
