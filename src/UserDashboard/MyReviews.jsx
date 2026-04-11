import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Star, Send, CheckCircle, X, Camera } from 'lucide-react';
import {
  fetchMyOrders,
  selectMyOrders,
  selectOrdersLoading,
} from '../features/orders/orderSlice';
import {
  fetchMyReviews,
  selectMyReviews,
  selectReviewsError,
  selectReviewsLoading,
  submitReview,
} from '../features/reviews/reviewSlice';

const MyReviews = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' or 'published'
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null); // { productId, name, imageUrl, deliveredAt }

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const orders = useSelector(selectMyOrders);
  const ordersLoading = useSelector(selectOrdersLoading);
  const reviews = useSelector(selectMyReviews);
  const reviewsLoading = useSelector(selectReviewsLoading);
  const reviewsError = useSelector(selectReviewsError);

  useEffect(() => {
    dispatch(fetchMyOrders());
    dispatch(fetchMyReviews());
  }, [dispatch]);

  const getDeliveredDate = (order) => {
    const steps = Array.isArray(order?.statusHistory) ? order.statusHistory : [];
    const delivered = steps.find((s) => String(s?.status || '').toLowerCase() === 'delivered');
    const raw = delivered?.changedAt || order?.createdAt;
    return raw ? new Date(raw) : null;
  };

  const toReviewItems = useMemo(() => {
    const deliveredOrders = (Array.isArray(orders) ? orders : []).filter((o) => {
      const st = String(o?.orderStatus || o?.status || '').toLowerCase();
      return st === 'delivered';
    });

    const reviewedProductIds = new Set((Array.isArray(reviews) ? reviews : []).map((r) => String(r?.productId || '')));
    const latestByProduct = new Map();

    for (const order of deliveredOrders) {
      const deliveredAt = getDeliveredDate(order);
      const items = Array.isArray(order?.items) ? order.items : [];
      for (const item of items) {
        const productId = item?.product?._id || item?.product;
        if (!productId) continue;
        const productIdStr = String(productId);
        if (reviewedProductIds.has(productIdStr)) continue;

        const current = latestByProduct.get(productIdStr);
        const img = item?.product?.images?.[0] || 'https://placehold.co/200x200?text=Product';
        const name = item?.product?.name || 'Product';

        const currentTime = current?.deliveredAt ? current.deliveredAt.getTime() : 0;
        const newTime = deliveredAt ? deliveredAt.getTime() : 0;
        if (!current || newTime >= currentTime) {
          latestByProduct.set(productIdStr, {
            productId: productIdStr,
            name,
            imageUrl: img,
            deliveredAt,
          });
        }
      }
    }

    return Array.from(latestByProduct.values()).sort((a, b) => {
      const at = a.deliveredAt ? a.deliveredAt.getTime() : 0;
      const bt = b.deliveredAt ? b.deliveredAt.getTime() : 0;
      return bt - at;
    });
  }, [orders, reviews]);

  const historyItems = useMemo(() => {
    const arr = Array.isArray(reviews) ? [...reviews] : [];
    arr.sort((a, b) => new Date(b?.createdAt || 0).getTime() - new Date(a?.createdAt || 0).getTime());
    return arr;
  }, [reviews]);

  const openReviewModal = (product) => {
    setSelectedProduct(product);
    setRating(0);
    setHoverRating(0);
    setTitle('');
    setDescription('');
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
            className={`px-5 py-2 text-sm font-bold rounded-lg transition-all ${
              activeTab === 'pending' ? 'bg-[#985991] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            To Review ({toReviewItems.length})
          </button>
          <button
            onClick={() => setActiveTab('published')}
            className={`px-5 py-2 text-sm font-bold rounded-lg transition-all ${
              activeTab === 'published' ? 'bg-[#985991] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            History ({historyItems.length})
          </button>
        </div>
      </div>

      {/* --- CONTENT AREA --- */}
      {activeTab === 'pending' ? (
        /* PENDING REVIEWS GRID */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {toReviewItems.length > 0 ? (
            toReviewItems.map((item) => (
              <div
                key={item.productId}
                className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-all"
              >
                <div className="w-20 h-20 bg-gray-50 rounded-2xl flex-shrink-0 overflow-hidden border border-gray-100">
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 line-clamp-1">{item.name}</h3>
                  <p className="text-xs text-gray-500 mb-4">
                    {item.deliveredAt ? `Delivered on ${item.deliveredAt.toLocaleDateString('en-IN')}` : 'Delivered'}
                  </p>
                  <button
                    onClick={() => openReviewModal(item)}
                    className="text-sm font-bold text-[#985991] bg-purple-50 px-4 py-2 rounded-xl hover:bg-[#985991] hover:text-white transition-all flex items-center gap-2"
                    type="button"
                  >
                    <Star size={16} /> Write a Review
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-10 text-gray-400">
              <CheckCircle size={40} className="mx-auto mb-3 text-green-400" />
              <p>{ordersLoading || reviewsLoading ? 'Loading...' : "You're all caught up! No pending reviews."}</p>
            </div>
          )}
        </div>
      ) : (
        /* PUBLISHED REVIEWS LIST */
        <div className="space-y-6">
          {historyItems.length > 0 ? (
            historyItems.map((review) => (
              <div key={review._id || review.productId} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <div className="flex gap-5">
                  <div className="w-16 h-16 bg-gray-50 rounded-2xl flex-shrink-0 overflow-hidden border border-gray-100">
                    <img
                      src={review?.product?.images?.[0] || 'https://placehold.co/200x200?text=Product'}
                      alt={review.product?.name || 'Product'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-800">{review.product?.name || 'Product'}</h3>
                        <div className="flex items-center gap-1 my-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              fill={i < Number(review.rating) ? '#FBBF24' : 'none'}
                              className={i < Number(review.rating) ? 'text-yellow-400' : 'text-gray-300'}
                            />
                          ))}
                          <span className="text-xs text-gray-400 ml-2">
                            on {review.createdAt ? new Date(review.createdAt).toLocaleDateString('en-IN') : '—'}
                          </span>
                        </div>
                        {review.title ? <p className="text-xs text-gray-500 mt-1 italic">{review.title}</p> : null}
                      </div>
                      <div />
                    </div>

                    {review.description ? (
                      <p className="text-sm text-gray-600 mt-2 italic">"{review.description}"</p>
                    ) : null}

                    <div className="mt-4 flex items-center gap-4 text-xs text-gray-500 border-t border-gray-50 pt-3">
                      <span className="flex items-center gap-1 font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                        <CheckCircle size={12} /> Verified Purchase
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-gray-400">
              <CheckCircle size={40} className="mx-auto mb-3 text-green-400" />
              <p>{reviewsLoading ? 'Loading...' : 'No reviews submitted yet.'}</p>
              {reviewsError ? <p className="text-red-600 text-sm mt-2">{reviewsError}</p> : null}
            </div>
          )}
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
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-red-500" type="button">
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
                      type="button"
                    >
                      <Star
                        size={32}
                        fill={(hoverRating || rating) >= star ? '#FBBF24' : 'none'}
                        className={(hoverRating || rating) >= star ? 'text-yellow-400 drop-shadow-sm' : 'text-gray-200'}
                      />
                    </button>
                  ))}
                </div>
                <p className="text-xs font-medium text-[#985991] h-4">
                  {rating === 5
                    ? "It's Amazing! 😍"
                    : rating === 4
                      ? 'Pretty Good! 🙂'
                      : rating === 3
                        ? 'Average 😐'
                        : rating === 2
                          ? 'Disappointed 😞'
                          : rating === 1
                            ? 'Terrible 😡'
                            : ''}
                </p>
              </div>

              {/* Title Input (required) */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                  Short Feedback / Title <span className="text-red-500">*</span>
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Great product, Good, Would buy again"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#985991]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Description (optional)</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What did you like or dislike? How was the texture/smell?"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#985991]"
                />
              </div>

              {/* Photo Upload (UI only for now) */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Add Photos (Optional)</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-400 hover:border-[#985991] hover:text-[#985991] hover:bg-purple-50 transition-all"
                  >
                    <Camera size={20} />
                  </button>
                </div>
              </div>
            </div>

            <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-200 rounded-xl transition-colors"
                type="button"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (!selectedProduct?.productId) return;
                  if (!rating || rating < 1) {
                    alert('Please select a rating.');
                    return;
                  }
                  if (!title.trim()) {
                    alert('Please enter a short feedback/title.');
                    return;
                  }

                  const result = await dispatch(
                    submitReview({
                      productId: selectedProduct.productId,
                      rating,
                      title: title.trim(),
                      description: description.trim(),
                    })
                  );

                  if (result?.error) return;
                  setShowModal(false);
                  setActiveTab('published');
                }}
                className="px-8 py-2.5 bg-[#985991] text-white text-sm font-bold rounded-xl hover:bg-[#7A4774] shadow-md shadow-purple-100 flex items-center gap-2"
              >
                <Send size={16} /> Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyReviews;