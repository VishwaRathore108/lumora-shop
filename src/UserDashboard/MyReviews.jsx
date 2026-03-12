import React, { useState } from 'react';
import { 
  Star, 
  MessageSquare, 
  Image as ImageIcon, 
  Send, 
  ThumbsUp, 
   MoreVertical,
  CheckCircle,
  X,
  Camera
} from 'lucide-react';

const MyReviews = () => {
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' or 'published'
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  // Mock Data: Products waiting for review
  const PENDING_REVIEWS = [
    {
      id: 1,
      name: "Radiance Vitamin C Serum",
      orderDate: "Delivered on Oct 24, 2024",
      img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=200"
    },
    {
      id: 2,
      name: "Velvet Matte Lipstick - Ruby",
      orderDate: "Delivered on Oct 24, 2024",
      img: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=200"
    }
  ];

  // Mock Data: Past reviews
  const PUBLISHED_REVIEWS = [
    {
      id: 101,
      name: "Rose Clay Mask",
      rating: 5,
      date: "Oct 15, 2024",
      comment: "Absolutely love this mask! It made my skin feel so soft and glowing immediately after use. The smell is divine too.",
      img: "https://images.unsplash.com/photo-1596462502278-27bfdd403348?auto=format&fit=crop&q=80&w=200",
      likes: 12
    },
    {
      id: 102,
      name: "Luxury Night Cream",
      rating: 4,
      date: "Sep 30, 2024",
      comment: "Great texture, very hydrating. Took away one star because the packaging feels a bit fragile, but the product is amazing.",
      img: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&q=80&w=200",
      likes: 5
    }
  ];

  const openReviewModal = (product) => {
    setSelectedProduct(product);
    setRating(0);
    setShowModal(true);
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">My Reviews</h2>
          <p className="text-gray-500 text-sm">Share your experience and help others choose.</p>
        </div>
        
        {/* Tab Switcher */}
        <div className="bg-white p-1 rounded-xl border border-gray-100 flex shadow-sm">
           <button 
             onClick={() => setActiveTab('pending')}
             className={`px-5 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'pending' ? 'bg-[#985991] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
           >
             To Review ({PENDING_REVIEWS.length})
           </button>
           <button 
             onClick={() => setActiveTab('published')}
             className={`px-5 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'published' ? 'bg-[#985991] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
           >
             History ({PUBLISHED_REVIEWS.length})
           </button>
        </div>
      </div>

      {/* --- CONTENT AREA --- */}
      {activeTab === 'pending' ? (
        /* PENDING REVIEWS GRID */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {PENDING_REVIEWS.length > 0 ? (
             PENDING_REVIEWS.map((item) => (
               <div key={item.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-all">
                  <div className="w-20 h-20 bg-gray-50 rounded-2xl flex-shrink-0 overflow-hidden border border-gray-100">
                     <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                     <h3 className="font-bold text-gray-800 line-clamp-1">{item.name}</h3>
                     <p className="text-xs text-gray-500 mb-4">{item.orderDate}</p>
                     <button 
                       onClick={() => openReviewModal(item)}
                       className="text-sm font-bold text-[#985991] bg-purple-50 px-4 py-2 rounded-xl hover:bg-[#985991] hover:text-white transition-all flex items-center gap-2"
                     >
                        <Star size={16}/> Write a Review
                     </button>
                  </div>
               </div>
             ))
           ) : (
             <div className="col-span-2 text-center py-10 text-gray-400">
                <CheckCircle size={40} className="mx-auto mb-3 text-green-400"/>
                <p>You're all caught up! No pending reviews.</p>
             </div>
           )}
        </div>
      ) : (
        /* PUBLISHED REVIEWS LIST */
        <div className="space-y-6">
           {PUBLISHED_REVIEWS.map((review) => (
             <div key={review.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <div className="flex gap-5">
                   <div className="w-16 h-16 bg-gray-50 rounded-2xl flex-shrink-0 overflow-hidden border border-gray-100">
                      <img src={review.img} alt={review.name} className="w-full h-full object-cover" />
                   </div>
                   <div className="flex-1">
                      <div className="flex justify-between items-start">
                         <div>
                            <h3 className="font-bold text-gray-800">{review.name}</h3>
                            <div className="flex items-center gap-1 my-1">
                               {[...Array(5)].map((_, i) => (
                                  <Star key={i} size={14} fill={i < review.rating ? "#FBBF24" : "none"} className={i < review.rating ? "text-yellow-400" : "text-gray-300"} />
                               ))}
                               <span className="text-xs text-gray-400 ml-2">on {review.date}</span>
                            </div>
                         </div>
                         <button className="text-gray-400 hover:text-gray-600">
                            <MoreVertical size={18}/> {/* You might need to import MoreVertical if used */}
                         </button>
                      </div>
                      
                      <p className="text-sm text-gray-600 mt-2 italic">"{review.comment}"</p>
                      
                      <div className="mt-4 flex items-center gap-4 text-xs text-gray-500 border-t border-gray-50 pt-3">
                         <span className="flex items-center gap-1 font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                            <CheckCircle size={12}/> Verified Purchase
                         </span>
                         <span className="flex items-center gap-1">
                            <ThumbsUp size={12}/> {review.likes} people found this helpful
                         </span>
                      </div>
                   </div>
                </div>
             </div>
           ))}
        </div>
      )}

      {/* --- WRITE REVIEW MODAL --- */}
      {showModal && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div>
                 <h3 className="text-lg font-bold text-gray-800">Write Review</h3>
                 <p className="text-xs text-gray-500 truncate max-w-[200px]">{selectedProduct.name}</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-red-500">
                <X size={20} />
              </button>
            </div>

            <div className="p-8 space-y-6">
               
               {/* Star Rating Input */}
               <div className="flex flex-col items-center gap-2">
                  <p className="text-sm font-bold text-gray-500 uppercase">How would you rate it?</p>
                  <div className="flex gap-2">
                     {[1, 2, 3, 4, 5].map((star) => (
                        <button
                           key={star}
                           onMouseEnter={() => setHoverRating(star)}
                           onMouseLeave={() => setHoverRating(0)}
                           onClick={() => setRating(star)}
                           className="transition-transform hover:scale-110"
                        >
                           <Star 
                              size={32} 
                              fill={(hoverRating || rating) >= star ? "#FBBF24" : "none"} 
                              className={(hoverRating || rating) >= star ? "text-yellow-400 drop-shadow-sm" : "text-gray-200"} 
                           />
                        </button>
                     ))}
                  </div>
                  <p className="text-xs font-medium text-[#985991] h-4">
                     {rating === 5 ? "It's Amazing! 😍" : rating === 4 ? "Pretty Good! 🙂" : rating === 3 ? "Average 😐" : rating === 2 ? "Disappointed 😞" : rating === 1 ? "Terrible 😡" : ""}
                  </p>
               </div>

               {/* Review Text */}
               <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Your Experience</label>
                  <textarea 
                    rows="4" 
                    placeholder="What did you like or dislike? How was the texture/smell?" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#985991]"
                  ></textarea>
               </div>

               {/* Photo Upload */}
               <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Add Photos (Optional)</label>
                  <div className="flex gap-3">
                     <button className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-400 hover:border-[#985991] hover:text-[#985991] hover:bg-purple-50 transition-all">
                        <Camera size={20}/>
                     </button>
                  </div>
               </div>
            </div>

            <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-6 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-200 rounded-xl transition-colors">
                Cancel
              </button>
              <button onClick={() => setShowModal(false)} className="px-8 py-2.5 bg-[#985991] text-white text-sm font-bold rounded-xl hover:bg-[#7A4774] shadow-md shadow-purple-100 flex items-center gap-2">
                <Send size={16}/> Submit Review
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default MyReviews;