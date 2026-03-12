import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

const PromoBanners = () => {
  return (
    <div className="bg-gradient-to-r from-[#985991]/10 via-[#A86BA1]/15 to-[#985991]/10 border-b border-[#985991]/10">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex flex-wrap items-center justify-center gap-3 text-center">
          <Sparkles className="w-4 h-4 text-[#985991] shrink-0 hidden sm:block" />
          <p className="text-sm text-gray-700">
            <span className="font-semibold text-[#985991]">New:</span> Radiance Serum – clean, vegan & dermatologist-approved. Free shipping on orders over ₹999.
          </p>
          <Link
            to="/shop"
            className="shrink-0 text-sm font-semibold text-[#985991] hover:text-[#7A4774] underline underline-offset-2 transition-colors"
          >
            Shop now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PromoBanners;
