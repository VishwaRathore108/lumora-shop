import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  ShoppingBag,
  Heart,
  Star,
  Truck,
  ArrowRight,
  Clock,
  Sparkles
} from 'lucide-react';
import { selectUser } from '../features/auth/authSlice';
import {
  fetchMyOrders,
  selectMyOrders,
  selectOrdersError,
  selectOrdersLoading,
} from '../features/orders/orderSlice';
import {
  selectWishlistItems,
  selectWishlistLoading,
} from '../features/wishlist/wishlistSlice';
import {
  fetchMyReviews,
  selectMyReviews,
  selectReviewsLoading,
} from '../features/reviews/reviewSlice';

const UserOverview = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const orders = useSelector(selectMyOrders);
  const ordersLoading = useSelector(selectOrdersLoading);
  const ordersError = useSelector(selectOrdersError);
  const wishlistItems = useSelector(selectWishlistItems);
  const wishlistLoading = useSelector(selectWishlistLoading);
  const reviews = useSelector(selectMyReviews);
  const reviewsLoading = useSelector(selectReviewsLoading);
  const [bootTriggered, setBootTriggered] = useState(false);
  const [bootDone, setBootDone] = useState(false);

  const displayName = user?.name?.trim() || user?.email?.split('@')[0] || 'there';

  useEffect(() => {
    dispatch(fetchMyOrders());
    setBootTriggered(true);
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchMyReviews());
  }, [dispatch]);

  useEffect(() => {
    if (!bootTriggered) return;
    if (!ordersLoading && !wishlistLoading && !reviewsLoading) {
      setBootDone(true);
    }
  }, [bootTriggered, ordersLoading, wishlistLoading, reviewsLoading]);

  const sortedOrders = useMemo(() => {
    const arr = Array.isArray(orders) ? [...orders] : [];
    // Backend already sorts, but we keep this deterministic.
    arr.sort((a, b) => new Date(b?.createdAt || 0).getTime() - new Date(a?.createdAt || 0).getTime());
    return arr;
  }, [orders]);

  const latestOrder = sortedOrders[0] || null;

  const statusToProgress = (rawStatus) => {
    const s = String(rawStatus || '').trim().toLowerCase();
    // Map backend orderStatus -> dashboard steps
    switch (s) {
      case 'pending':
        return 25;
      case 'confirmed':
        return 50;
      case 'assigned':
        return 60;
      case 'shipped':
        return 80;
      case 'delivered':
        return 100;
      case 'cancelled':
        return 0;
      default:
        return 35;
    }
  };

  const statusToLabel = (rawStatus) => {
    const s = String(rawStatus || '').trim().toLowerCase();
    if (['pending', 'confirmed', 'assigned'].includes(s)) return 'Processing';
    if (s === 'shipped') return 'Shipped';
    if (s === 'delivered') return 'Delivered';
    if (s === 'cancelled') return 'Cancelled';
    // Fallback: try to use original string, but keep it readable.
    return rawStatus ? String(rawStatus).replace(/^\w/, (c) => c.toUpperCase()) : 'Processing';
  };

  const latestOrderStatusRaw = latestOrder?.orderStatus || latestOrder?.status || '';
  const latestOrderProgress = statusToProgress(latestOrderStatusRaw);
  const latestOrderStatusLabel = statusToLabel(latestOrderStatusRaw);

  const latestOrderItems = Array.isArray(latestOrder?.items) ? latestOrder.items : [];
  const latestOrderFirstItemName = latestOrderItems?.[0]?.product?.name || 'Product';
  const latestOrderItemSummary =
    latestOrderItems.length > 1
      ? `${latestOrderFirstItemName} (+${latestOrderItems.length - 1} more)`
      : latestOrderFirstItemName;

  const latestOrderTotal =
    latestOrder?.totalPrice ??
    latestOrder?.totalAmount ??
    0;

  const etaText = latestOrder?.delivery?.assignmentExpiresAt
    ? new Date(latestOrder.delivery.assignmentExpiresAt).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : '—';

  const recentPurchases = useMemo(() => {
    const flattened = sortedOrders.flatMap((order) => (order?.items || []).map((item) => ({
      productId: item?.product?._id || null,
      name: item?.product?.name || 'Product',
      imageUrl: item?.product?.images?.[0] || 'https://placehold.co/80x80?text=Item',
      // Your current order list payload doesn't populate product category name here,
      // so we fall back to whatever exists on the item/product.
      categoryLabel: item?.product?.category?.name || item?.product?.category || item?.category || 'Product',
      price: Number(item?.price ?? 0),
    })));

    // De-dupe by productId while keeping most recent order.
    const seen = new Set();
    const unique = [];
    for (const p of flattened) {
      const key = p.productId ? String(p.productId) : `${p.name}-${unique.length}`;
      if (seen.has(key)) continue;
      seen.add(key);
      unique.push(p);
      if (unique.length >= 4) break;
    }
    return unique;
  }, [sortedOrders]);

  const reviewScore = useMemo(() => {
    const ratings = (Array.isArray(reviews) ? reviews : [])
      .map((r) => Number(r?.rating))
      .filter((n) => Number.isFinite(n));
    if (!ratings.length) return 0;
    return Number((ratings.reduce((sum, n) => sum + n, 0) / ratings.length).toFixed(1));
  }, [reviews]);

  const statsLoading = !bootDone;

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">

      {/* Welcome Banner */}
      <div className="relative bg-gradient-to-r from-[#985991] via-[#A86BA1] to-[#B87AB2] rounded-3xl p-8 md:p-10 text-white overflow-hidden shadow-xl shadow-purple-100">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-900 opacity-10 rounded-full -ml-10 -mb-10 blur-xl"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h2 className="text-3xl font-serif font-bold mb-1">
              Hello, {displayName}! ✨
            </h2>
            <p className="text-purple-100 text-sm md:text-base mb-4 max-w-lg">
              Welcome back to your beauty hub. Track your orders, manage favourites, and keep your glow ritual in one place.
            </p>
            <button className="bg-white text-[#985991] px-6 py-2.5 rounded-full text-sm font-bold shadow-md hover:bg-gray-50 transition-transform active:scale-95">
              Redeem Points
            </button>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl px-5 py-4 flex items-center gap-4 shadow-lg shadow-black/10">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Sparkles size={20} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-purple-100/80">Loyalty status</p>
              <p className="text-sm font-semibold text-white">Gold Member · 450 points</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-pink-50 text-pink-500 rounded-full flex items-center justify-center">
            <ShoppingBag size={22} />
          </div>
          <div>
            {statsLoading ? (
              <div className="h-8 w-10 bg-gray-100 animate-pulse rounded" />
            ) : (
              <p className="text-2xl font-bold text-gray-800">{Array.isArray(orders) ? orders.length : 0}</p>
            )}
            <p className="text-sm text-gray-500">Total Orders</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-purple-50 text-[#985991] rounded-full flex items-center justify-center">
            <Heart size={22} />
          </div>
          <div>
            {statsLoading ? (
              <div className="h-8 w-14 bg-gray-100 animate-pulse rounded" />
            ) : (
              <p className="text-2xl font-bold text-gray-800">{Array.isArray(wishlistItems) ? wishlistItems.length : 0}</p>
            )}
            <p className="text-sm text-gray-500">Wishlist Items</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-yellow-50 text-yellow-600 rounded-full flex items-center justify-center">
            <Star size={22} />
          </div>
          <div>
            {statsLoading ? (
              <div className="h-8 w-16 bg-gray-100 animate-pulse rounded" />
            ) : (
              <p className="text-2xl font-bold text-gray-800">{reviewScore}</p>
            )}
            <p className="text-sm text-gray-500">Review Score</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Latest Order Tracking */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm">
          {latestOrder ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <Truck size={20} className="text-[#985991]" /> Track Order
                </h3>
                <span className="text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full font-bold">
                  {latestOrderStatusLabel}
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-bold text-gray-800">{latestOrderItemSummary}</p>
                    <p className="text-xs text-gray-500 mt-1">Order ID: {latestOrder?._id}</p>
                  </div>
                  <p className="text-sm font-bold text-[#985991]">
                    ₹{Number(latestOrderTotal || 0).toLocaleString('en-IN')}
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="relative pt-4 pb-2">
                  <div className="flex justify-between text-xs font-medium text-gray-400 mb-2">
                    <span className={latestOrderProgress >= 45 ? 'text-[#985991]' : ''}>Confirmed</span>
                    <span className={latestOrderProgress >= 75 ? 'text-[#985991]' : ''}>Shipped</span>
                    <span className={latestOrderProgress >= 90 ? 'text-[#985991]' : ''}>Out for Delivery</span>
                    <span className={latestOrderProgress >= 100 ? 'text-[#985991]' : ''}>Delivered</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#985991] rounded-full transition-all duration-1000"
                      style={{ width: `${latestOrderProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-3 flex items-center gap-1">
                    <Clock size={12} /> Estimated Delivery: <span className="font-bold text-gray-700">{etaText}</span>
                  </p>
                </div>

                <button
                  onClick={() => navigate(`/user/orders/${latestOrder?._id}`)}
                  className="w-full mt-2 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                >
                  View Order Details
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <Truck size={20} className="text-[#985991]" /> Track Order
                </h3>
                <span className="text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full font-bold">
                  {ordersLoading ? 'Loading...' : '—'}
                </span>
              </div>

              <div className="space-y-4 mt-2 flex-1">
                {ordersError ? (
                  <p className="text-sm text-red-600">{ordersError}</p>
                ) : ordersLoading ? (
                  <div className="text-center py-8">
                    <p className="text-sm font-bold text-gray-800">Loading your latest order...</p>
                    <p className="text-xs text-gray-500 mt-1">One moment.</p>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-sm font-bold text-gray-800">No active orders. Start shopping!</p>
                    <p className="text-xs text-gray-500 mt-1">Your latest order status will show up here.</p>
                    <div className="mt-6">
                      <Link
                        to="/shop"
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#985991] text-white rounded-full text-sm font-bold hover:bg-[#7A4774] transition-colors"
                      >
                        Shop Now <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Recent Purchases */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Sparkles size={20} className="text-yellow-500" /> Recent Purchases
            </h3>
            <button className="p-2 hover:bg-gray-50 rounded-full text-gray-400 hover:text-[#985991]">
              <ArrowRight size={20} />
            </button>
          </div>

          <div className="space-y-4 flex-1 overflow-y-auto pr-1 custom-scrollbar">
            {recentPurchases.length > 0 ? (
              recentPurchases.map((product, idx) => (
                <div
                  key={`${product.productId || product.name}-${idx}`}
                  className="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-colors group cursor-pointer border border-transparent hover:border-gray-100"
                >
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-gray-800">{product.name}</h4>
                  <p className="text-xs text-gray-500">{product.categoryLabel}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-[#985991]">
                    ₹{Number(product.price || 0).toLocaleString('en-IN')}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (product.productId) navigate(`/product-details/${product.productId}`);
                    }}
                    className="text-[10px] font-bold text-gray-400 uppercase tracking-wider group-hover:text-[#985991] mt-1"
                    type="button"
                    aria-label={`View product ${product.name}`}
                    disabled={!product.productId}
                  >
                    View
                  </button>
                </div>
              </div>
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-sm font-bold text-gray-800">No recent purchases yet.</p>
                <p className="text-xs text-gray-500 mt-1">When you place an order, products will appear here.</p>
                <div className="mt-6">
                  <Link
                    to="/shop"
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#985991] text-white rounded-full text-sm font-bold hover:bg-[#7A4774] transition-colors"
                  >
                    Start Shopping <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default UserOverview;