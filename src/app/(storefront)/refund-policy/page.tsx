
export default function RefundPolicy() {
    return (
        <div className="max-w-4xl mx-auto py-12 px-6 pt-32 min-h-screen">
            <h1 className="text-3xl font-bold mb-6">Refund & Return Policy</h1>
            <div className="space-y-4 text-gray-300">
                <section>
                    <h2 className="text-xl font-semibold mb-2 text-white">Return Window</h2>
                    <p>We offer a 7-Day Return Policy for defective or incorrect items.</p>
                </section>
                <section>
                    <h2 className="text-xl font-semibold mb-2 text-white">Condition</h2>
                    <p>Items must be unopened and in original packaging.</p>
                </section>
                <section>
                    <h2 className="text-xl font-semibold mb-2 text-white">Process</h2>
                    <p>To initiate a return, contact us with your Order ID and an unboxing video.</p>
                </section>
                <section>
                    <h2 className="text-xl font-semibold mb-2 text-white">Refunds</h2>
                    <p>Processed within 5-7 business days after we receive the return.</p>
                </section>
            </div>
        </div>
    );
}
