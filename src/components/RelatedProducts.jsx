import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';

const RelatedProducts = ({ currentCategory }) => {
    const navigate = useNavigate();

    // Mock Data: In real app, filter by category or tag
    const SUGGESTIONS = [
        { id: 101, name: "Primer Base", price: 899, image: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=300" },
        { id: 102, name: "Setting Spray", price: 699, image: "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?w=300" },
        { id: 103, name: "Beauty Blender", price: 299, image: "https://images.unsplash.com/photo-1571658735756-11b0e527d353?w=300" }
    ];

    const handleViewDetails = (id) => {
        navigate(`/product-details/${id}`);
    };

    return (
        <div className="border-t border-gray-100 pt-10">
            <h3 className="font-serif text-2xl text-gray-900 mb-6">Complete The Look</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {SUGGESTIONS.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                        <div className="w-16 h-16 bg-white rounded-lg overflow-hidden border border-gray-200 shrink-0">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                            <p className="text-sm text-gray-500">₹{item.price}</p>
                        </div>
                        <button
                            onClick={() => handleViewDetails(item.id)}
                            className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-[#985991] hover:text-white hover:border-[#985991] transition-all"
                        >
                            <Plus size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RelatedProducts;