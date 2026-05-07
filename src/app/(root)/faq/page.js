"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

const FAQPage = () => {
    const [openFAQ, setOpenFAQ] = useState(null);

    const faqItems = [
        {
            id: 1,
            question: "What is Daily satta kings?",
            answer:
                "Daily Satta Kings is an online platform that provides daily result updates, charts, and market-related information for various satta markets.",
        },
        {
            id: 2,
            question: "What is Satta Disawar?",
            answer:
                "Satta Disawar is a type of number-based betting game where players guess numbers and place bets on different markets.",
        },
        {
            id: 3,
            question: "How can I check today's result?",
            answer:
                "You can check today’s result directly on the homepage or in the results section. Results are updated regularly as soon as markets announce them.",
        },
        {
            id: 4,
            question: "How often are results updated?",
            answer:
                "Results are updated multiple times a day based on market timings to ensure users get the latest and accurate information.",
        },
        {
            id: 5,
            question: "What markets are available on the platform?",
            answer:
                "We provide results for markets like SADAR BAZAR, GWALIOR, DELHI BAZAR, DELHI MATKA, SHRI GANESH, AGRA, FARIDABAD, ALWAR, GHAZIABAD, DWARKA, GALI, and DISAWAR.",
        },
        {
            id: 6,
            question: "What are record charts?",
            answer:
                "Record charts show historical results from previous days, weeks, or months. They help users review past numbers and understand trends.",
        },
        {
            id: 7,
            question: "Can I check old results on this website?",
            answer:
                "Yes, you can easily access old results through charts and archive sections available on the website.",
        },
        {
            id: 8,
            question: "Can numbers be predicted in satta?",
            answer:
                "Some users analyze past data, but results are random. There is no guaranteed method for accurate prediction.",
        },
        {
            id: 9,
            question: "Is the website mobile-friendly?",
            answer:
                "Yes, the website is fully mobile-friendly and works smoothly on all devices for easy access anytime.",
        },
        {
            id: 10,
            question: "What payment methods are accepted?",
            answer:
                "We accept PAYTM, Bank Transfer, PhonePe, Google Pay, and other digital payment options for user convenience.",
        },
    ];

    const toggleFAQ = (id) => {
        setOpenFAQ(openFAQ === id ? null : id);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-teal-950 to-slate-900 pt-20">
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-950 via-teal-950 to-slate-900 border-b border-teal-400/25 shadow-xl shadow-teal-950/30">
                <div className="max-w-6xl mx-auto px-4 py-12">
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-2">
                        ❓ Frequently Asked Questions
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Find answers to common questions about Daily satta kings and our services
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="space-y-4">
                    {faqItems.map((item) => {
                        const isOpen = openFAQ === item.id;
                        return (
                            <div
                                key={item.id}
                                className="bg-gradient-to-r from-slate-800 to-slate-800/50 rounded-xl border border-teal-400/25 overflow-hidden hover:border-teal-300/50 transition-all"
                            >
                                <button
                                    onClick={() => toggleFAQ(item.id)}
                                    className="w-full flex items-center justify-between px-6 py-4 hover:bg-teal-500/10 transition-colors"
                                >
                                    <h3 className="text-lg font-bold text-white text-left flex items-center gap-3">
                                        <span className="text-amber-400 font-black">
                                            {item.id}.
                                        </span>
                                        {item.question}
                                    </h3>
                                    <ChevronDown
                                        size={24}
                                        className={`text-amber-400 flex-shrink-0 transition-transform ${isOpen ? "rotate-180" : ""
                                            }`}
                                    />
                                </button>

                                {isOpen && (
                                    <div className="px-6 py-4 border-t border-teal-400/25 bg-slate-800/50">
                                        <p className="text-gray-300 leading-relaxed">
                                            {item.answer}
                                        </p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Additional Info */}
                <div className="mt-12 bg-gradient-to-br from-amber-500/10 to-teal-500/10 rounded-xl border border-teal-400/25 p-8">
                    <h2 className="text-2xl font-bold text-white mb-4">
                        Need More Help?
                    </h2>
                    <p className="text-gray-300 mb-4">
                        If you couldn&apos;t find the answer to your question, please feel free to contact us. Our support team is here to help you 24/7.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <Link
                            href="/contact"
                            className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 px-8 py-3 rounded-lg font-bold hover:shadow-lg hover:shadow-amber-500/40 transition-all"
                        >
                            Contact Us
                        </Link>
                        <a
                            href="https://wa.me/918950312367"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-lg font-bold hover:shadow-lg hover:shadow-green-500/40 transition-all"
                        >
                            WhatsApp Support
                        </a>
                    </div>
                </div>

                {/* Disclaimer */}
                <div className="mt-8 bg-red-500/10 rounded-xl border border-red-500/30 p-6">
                    <h3 className="text-lg font-bold text-red-400 mb-2">⚠️ Disclaimer</h3>
                    <p className="text-gray-300 text-sm">
                        This website is created for informational and news publishing purposes only. All numbers and data displayed
                        on this website are generated based on mathematical calculations, publicly available information, and artificial
                        intelligence models, including zodiac-based interpretations.
                        We do not promote, support, or have any association with gambling or betting activities. This website has no
                        connection with any gambling platforms, agents, or operators. Any reference to results or numbers is purely for
                        informational purposes.
                        We strictly do not encourage any illegal activities such as gambling, money laundering, or any other unlawful
                        practices. Users are advised to follow the laws and regulations applicable in their region.
                        All content published on this website is collected from various internet sources and is presented for general
                        informational use. We do not guarantee the accuracy or completeness of the information.
                        This website operates independently and is supported through advertising services such as Google Ads.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FAQPage;
