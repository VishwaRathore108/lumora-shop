import React from 'react';
import { Star } from 'lucide-react';

const testimonials = [
    {
        name: 'Riya, 27',
        city: 'Indore',
        text: 'The in‑store experience plus online exclusives make this my go‑to beauty destination. The curation feels premium but still approachable.',
        rating: 5
    },
    {
        name: 'Ananya, 24',
        city: 'Bhopal',
        text: 'I love how quickly my orders arrive and how everything feels thoughtfully packed. The recommendations actually suit my skin tone.',
        rating: 4.5
    },
    {
        name: 'Mehak, 30',
        city: 'Ujjain',
        text: 'Feels like a mini Sephora experience right here in MP. The brands, the packaging, the entire vibe – it all feels very elevated.',
        rating: 5
    }
];

const Testimonials = () => {
    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                    <div>
                        <p className="text-xs font-semibold tracking-[0.25em] uppercase text-[#985991] mb-2">
                            Loved by Beauty Lovers
                        </p>
                        <h2 className="text-3xl md:text-4xl font-serif text-gray-900">
                            What our community is saying
                        </h2>
                    </div>
                    <div className="text-sm text-gray-600">
                        <p className="font-semibold text-gray-900">
                            4.8/5 rating · 10K+ happy customers
                        </p>
                        <p className="text-xs text-gray-500">Across in‑store and online purchases</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {testimonials.map((t, idx) => (
                        <article
                            key={idx}
                            className="relative bg-[#FFF7FB] border border-pink-100 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <p className="font-serif text-base text-gray-900">{t.name}</p>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">{t.city}</p>
                                </div>
                                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white text-xs text-gray-900">
                                    <Star size={14} className="text-amber-400 fill-amber-400" />
                                    {t.rating.toFixed(1)}
                                </div>
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed">
                                “{t.text}”
                            </p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;

