import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

const SkinQuiz = () => {
    return (
        <section className="py-20 bg-gradient-to-b from-white via-[#FFF7FB] to-white border-y border-pink-100/60">
            <div className="max-w-7xl mx-auto px-4 grid gap-10 md:grid-cols-[1.1fr,1fr] items-center">
                <div>
                    <p className="text-xs font-semibold tracking-[0.25em] uppercase text-[#985991] mb-3">
                        2‑Minute Skin Quiz
                    </p>
                    <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-3">
                        Not sure where to start?
                    </h2>
                    <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-6 max-w-xl">
                        Answer a few quick questions about your skin type, concerns and climate. We&apos;ll
                        build a personalised routine using products that actually work for you.
                    </p>
                    <ul className="space-y-2 text-sm text-gray-700 mb-8">
                        <li>• Get a 3‑step AM &amp; PM routine in under 60 seconds</li>
                        <li>• Tailored to Indore&apos;s weather and pollution levels</li>
                        <li>• Save your results and shop your edit instantly</li>
                    </ul>
                    <button className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#985991] text-white text-sm font-semibold shadow-lg shadow-rose-200 hover:bg-[#7A4774] transition-all">
                        Start Your Quiz
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>

                <div className="relative">
                    <div className="absolute -inset-6 bg-[#FDF2F8] rounded-3xl blur-2xl opacity-70" />
                    <div className="relative bg-white rounded-3xl border border-pink-100 shadow-xl p-6 space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-50 text-[11px] font-semibold tracking-wide text-[#985991] uppercase">
                            <Sparkles className="w-3 h-3" />
                            LIVE PREVIEW
                        </div>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500">Skin type</span>
                                <span className="px-3 py-1 rounded-full bg-gray-50 text-gray-900 text-xs font-medium">
                                    Combination · Sensitive
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500">Primary concern</span>
                                <span className="px-3 py-1 rounded-full bg-gray-50 text-gray-900 text-xs font-medium">
                                    Dullness &amp; uneven tone
                                </span>
                            </div>
                            <div className="border-t border-dashed border-pink-100 pt-4 space-y-2">
                                <p className="text-xs font-semibold text-gray-900 uppercase tracking-wide">
                                    Your curated ritual
                                </p>
                                <ol className="space-y-1 text-xs text-gray-700">
                                    <li>1. Brightening gel cleanser · AM/PM</li>
                                    <li>2. Vitamin C + niacinamide serum · AM</li>
                                    <li>3. Ceramide barrier cream · PM</li>
                                    <li>4. SPF 50 matte sunscreen · AM</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SkinQuiz;

