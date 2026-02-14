"use client";

import { useState } from "react";
import { ChevronDown, Truck, Shield, Banknote } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const FAQ_DATA = [
    {
        title: "Orders & Shipping",
        icon: Truck,
        questions: [
            {
                q: "How much is shipping?",
                a: "We offer flat-rate shipping of ₹60 all over India. Orders over ₹999 ship for FREE."
            },
            {
                q: "When will I receive my order?",
                a: "Orders are processed within 24-48 hours. Delivery typically takes 1-2 weeks depending on your location."
            },
            {
                q: "Do you ship internationally?",
                a: "Currently, we only ship within India. We are working on expanding globally soon!"
            },
            {
                q: "How do you pack the figures?",
                a: "We use a 'Tank Build' method: Multi-layer bubble wrap and foam inside a reinforced hard cardboard box to ensure your figure arrives in perfect condition."
            }
        ]
    },
    {
        title: "Products & Quality",
        icon: Shield,
        questions: [
            {
                q: "Are these official Japanese imports?",
                a: "To keep prices affordable for everyone, we stock high-quality third-party versions. They look great on a shelf and cost a fraction of the premium imports."
            },
            {
                q: "Do they come with the original retail box?",
                a: "Most of our budget-friendly figures are shipped in our custom secure packaging to prevent transit damage and keep shipping costs low."
            },
            {
                q: "What if the figure is Sold Out?",
                a: "We restock popular items frequently! Click the 'Notify Me' button on the product page to get an email alert the moment it's back."
            }
        ]
    },
    {
        title: "Payments & Returns",
        icon: Banknote,
        questions: [
            {
                q: "Is Cash on Delivery (COD) available?",
                a: "Not at the moment. We accept secure UPI payments (GPay, PhonePe, Paytm). Credit Cards are coming soon!"
            },
            {
                q: "How do I confirm my payment?",
                a: "After paying via UPI, simply paste the 12-digit Transaction ID (UTR) in the box at checkout. If you forget, don't worry—we will email you to confirm it manually."
            },
            {
                q: "My figure arrived broken. What do I do?",
                a: "We have a 100% Refund Policy for damaged items. You MUST record an unboxing video. Email us the video within 3 days of delivery, and we will refund the full amount (including shipping)."
            },
            {
                q: "Can I return it if I change my mind?",
                a: "We do not accept returns for 'change of mind'. Please check the photos and description carefully before ordering."
            }
        ]
    }
];

export function FAQAccordion() {
    const [openIndex, setOpenIndex] = useState<string | null>(null);

    const toggle = (id: string) => {
        setOpenIndex(openIndex === id ? null : id);
    };

    return (
        <div className="space-y-8">
            {FAQ_DATA.map((category, catIndex) => (
                <div key={catIndex} className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-sm">
                    <div className="flex items-center gap-4 mb-6 md:mb-8">
                        <div className="p-3 bg-cyber-pink/10 rounded-xl">
                            <category.icon className="text-cyber-pink w-6 h-6" />
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold text-white">{category.title}</h2>
                    </div>

                    <div className="space-y-4">
                        {category.questions.map((item, qIndex) => {
                            const id = `${catIndex}-${qIndex}`;
                            const isOpen = openIndex === id;

                            return (
                                <div
                                    key={qIndex}
                                    className="border-b border-white/5 last:border-0"
                                >
                                    <button
                                        onClick={() => toggle(id)}
                                        className="w-full py-4 flex items-center justify-between gap-4 text-left group hover:bg-white/5 rounded-lg px-2 transition-colors"
                                    >
                                        <span className={`font-medium text-lg transition-colors ${isOpen ? 'text-cyber-cyan' : 'text-gray-200 group-hover:text-white'}`}>
                                            {item.q}
                                        </span>
                                        <ChevronDown
                                            className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180 text-cyber-cyan' : ''}`}
                                        />
                                    </button>
                                    <AnimatePresence>
                                        {isOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                                className="overflow-hidden"
                                            >
                                                <p className="pb-6 px-2 text-gray-400 leading-relaxed text-base border-t border-white/5 pt-2 mt-2">
                                                    {item.a}
                                                </p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}
