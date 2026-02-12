
export const metadata = {
    title: 'Terms of Service',
};

export default function TermsAndConditions() {
    return (
        <div className="max-w-4xl mx-auto py-12 px-6 pt-32 min-h-screen">
            <h1 className="text-3xl font-bold mb-6">Terms & Conditions</h1>
            <div className="space-y-4 text-gray-300">
                <section>
                    <h2 className="text-xl font-semibold mb-2 text-white">Usage</h2>
                    <p>By using Hayase.in, you agree to these terms.</p>
                </section>
                <section>
                    <h2 className="text-xl font-semibold mb-2 text-white">Products</h2>
                    <p>Figures are authentic imports. Small box imperfections may occur during shipping from Japan.</p>
                </section>
                <section>
                    <h2 className="text-xl font-semibold mb-2 text-white">Pricing</h2>
                    <p>Prices are subject to change without notice.</p>
                </section>
                <section>
                    <h2 className="text-xl font-semibold mb-2 text-white">Law</h2>
                    <p>Governed by the laws of India.</p>
                </section>
            </div>
        </div>
    );
}
