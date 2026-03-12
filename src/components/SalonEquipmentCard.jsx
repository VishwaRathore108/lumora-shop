import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, Phone } from 'lucide-react';

const SalonEquipmentCard = ({
  id,
  name,
  image,
  badge,
  startingPrice,
  isPremium = false,
  slug,
}) => {
  const navigate = useNavigate();

  const handleViewDetails = (e) => {
    e.stopPropagation();
    navigate(`/shop?category=salon&product=${slug || id}`);
  };

  const handleEnquire = (e) => {
    e.stopPropagation();
    navigate(`/contact?enquire=${encodeURIComponent(name)}`);
  };

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#985991]/30 transition-all duration-300">
      {/* Badge */}
      <div className="absolute top-4 left-4 z-10">
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-semibold ${
            isPremium
              ? 'bg-amber-500/90 text-white shadow-md'
              : 'bg-[#985991] text-white'
          }`}
        >
          {badge}
        </span>
      </div>

      {/* Image with zoom */}
      <div className="aspect-square overflow-hidden bg-gray-50">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
      </div>

      <div className="p-5">
        <h3 className="font-serif text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {name}
        </h3>
        <p className="text-[#985991] font-bold text-sm mb-4">{startingPrice}</p>

        <div className="flex gap-2">
          <button
            onClick={handleViewDetails}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-[#985991] text-white text-xs font-semibold hover:bg-[#7A4774] transition-colors"
          >
            View Details
            <ExternalLink size={14} />
          </button>
          <button
            onClick={handleEnquire}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full border-2 border-[#985991] text-[#985991] text-xs font-semibold hover:bg-[#985991] hover:text-white transition-colors"
          >
            Enquire Now
            <Phone size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SalonEquipmentCard;
