
export default function PrivacyPolicy() {
    return (
        <div className="max-w-4xl mx-auto py-12 px-6 pt-32 min-h-screen">
            <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
            <div className="space-y-4 text-gray-300">
                <section>
                    <h2 className="text-xl font-semibold mb-2 text-white">Data Collection</h2>
                    <p>We collect your name, email, and shipping address to process orders.</p>
                </section>
                <section>
                    <h2 className="text-xl font-semibold mb-2 text-white">Marketing</h2>
                    <p>We may use your email to send you updates about new figures and exclusive coupons. You can opt-out anytime.</p>
                </section>
                <section>
                    <h2 className="text-xl font-semibold mb-2 text-white">Cookies</h2>
                    <p>We use cookies to remember your cart and preferences.</p>
                </section>
                <section>
                    <h2 className="text-xl font-semibold mb-2 text-white">Sharing</h2>
                    <p>We do not sell your data to third parties, except for shipping partners to deliver your order.</p>
                </section>
            </div>
        </div>
    );
}
