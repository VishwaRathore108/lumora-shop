import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// Import Pages & Components
import Loader from './components/Loader';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FestiveOffers from './components/FestiveOffers';
import BeautySection from './components/BeautySection';
import GlowEdit from './components/GlowEdit';
import OffersSection from './components/OffersSection';
import ProductGrid from './components/ProductGrid';
import SkinQuiz from './components/SkinQuiz';
import SkinQuizModal from './components/SkinQuiz/SkinQuizModal';
// import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import StoreLocations from './components/StoreLocations';
import BrandScroll from './components/BrandScroll';
import Features from './components/Features';
import CartDrawer from './components/CartDrawer';
import FixedActions from './components/FixedActions';
import ProtectedRoute from './components/ProtectedRoute';
import api from './services/apiClient';
import { replaceCartItems, selectCartItems } from './features/cart/cartSlice';
import { selectToken, selectUser } from './features/auth/authSlice';
import { fetchWishlist } from './features/wishlist/wishlistSlice';

// Pages
import Login from './pages/Login';
import Story from './pages/Story';
import Shop from './pages/Shop';
import Contact from './pages/Contact';
import TrackOrder from './pages/TrackOrder';
import ProductDetails from './pages/ProductDetails';
import CartPage from './pages/CartPage';
import Checkout from './pages/Checkout';
// Admin (layout + nested pages)
import AdminDashboard from './AdminDashboard/AdminDashboard';
import DashboardHome from './AdminDashboard/DashboardHome';
import Products from './AdminDashboard/Products';
import Orders from './AdminDashboard/Orders';
import AdminOrderDetails from './AdminDashboard/AdminOrderDetails';
import Customers from './AdminDashboard/Customers';
import Analytics from './AdminDashboard/Analytics';
import Settings from './AdminDashboard/Settings';
import Categories from './AdminDashboard/Categories';
import Coupons from './AdminDashboard/Coupons';
import Shipping from './AdminDashboard/Shipping';
import Payments from './AdminDashboard/Payments';
import Reports from './AdminDashboard/Reports';
import Notifications from './AdminDashboard/Notifications';
import Security from './AdminDashboard/Security';
import Admins from './AdminDashboard/Admins';
import ManageDeals from './AdminDashboard/ManageDeals';
import AdminLiveCarts from './AdminDashboard/AdminLiveCarts';
import DriverOrders from './AdminDashboard/DriverOrders';
import AssignedOrders from './AdminDashboard/AssignedOrders';
import DriverDashboard from './DriverDashboard/DriverDashboard';
import DriverHome from './DriverDashboard/DriverHome';


//  User Dashboard (layout + nested pages)
import UserDashboard from './UserDashboard/UserDashboard';
import UserOverview from './UserDashboard/UserOverview';
import MyOrders from './UserDashboard/MyOrders';
import Wishlist from './UserDashboard/Wishlist';
import Addresses from './UserDashboard/Addresses';
import UserPayments from './UserDashboard/UserPayments';
import MyReviews from './UserDashboard/MyReviews';
import UserProfile from './UserDashboard/UserProfile';
import ViewOrderDetails from './UserDashboard/ViewOrderDetails';
import DashboardCart from './UserDashboard/DashboardCart';
import DashboardBilling from './UserDashboard/DashboardBilling';
import CategoriesLayout from './AdminDashboard/CategoriesLayout';
import AddCategories from './AdminDashboard/AddCategories';
import ProductsLayout from './AdminDashboard/ProductsLayout';
import AddNewProducts from './AdminDashboard/AddNewProducts';
import EditProduct from './AdminDashboard/EditProduct';
import MegaOffers from './components/MegaOffers';

const Home = () => {
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  return (
    <div className="">
      <Navbar />
      <Hero />
      <FestiveOffers />
      <MegaOffers />
      <BeautySection />
      <GlowEdit />
      <OffersSection />
      <ProductGrid />
      <SkinQuiz onStartQuiz={() => setIsQuizOpen(true)} />
      {/* <Testimonials /> */}
      <StoreLocations />
      <BrandScroll />
      <Features />
      <Footer />
      <CartDrawer />
      <SkinQuizModal isOpen={isQuizOpen} onClose={() => setIsQuizOpen(false)} />
    </div>
  );
};

const ScrollToTop = () => {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    // Keep hash-link behavior for in-page anchors.
    if (hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname, search, hash]);

  return null;
};

function App() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [cartHydrated, setCartHydrated] = useState(false);
  const cartItems = useSelector(selectCartItems);
  const token = useSelector(selectToken);
  const user = useSelector(selectUser);

  useEffect(() => {
    if (!token || !user || user.role !== 'user') {
      setCartHydrated(false);
      return;
    }

    let cancelled = false;
    const hydrateCartFromBackend = async () => {
      try {
        const response = await api.get('/cart');
        const serverItems = Array.isArray(response.data?.cart?.items) ? response.data.cart.items : [];
        const mappedItems = serverItems.map((item) => ({
          id: item.product?._id || item.product || item.id,
          name: item.product?.name || item.prodName || '',
          image: item.product?.images?.[0] || item.img || '',
          price: Number(item.price || 0),
          quantity: Number(item.qty || item.quantity || 1),
          selectedShade: item.selectedShade?.name ? { name: item.selectedShade.name, hex: item.selectedShade.hex } : undefined,
        }));
        if (!cancelled) {
          dispatch(replaceCartItems(mappedItems));
          setCartHydrated(true);
        }
      } catch (error) {
        console.error('Cart hydrate failed:', error);
        if (!cancelled) setCartHydrated(true);
      }
    };
    hydrateCartFromBackend();
    return () => {
      cancelled = true;
    };
  }, [dispatch, token, user]);

  useEffect(() => {
    if (!token || !user || user.role !== 'user' || !cartHydrated) return;

    const timer = window.setTimeout(async () => {
      try {
        await api.post('/cart/sync', { items: cartItems });
      } catch (error) {
        console.error('Cart sync failed:', error);
      }
    }, 500);

    return () => window.clearTimeout(timer);
  }, [cartHydrated, cartItems, token, user]);

  useEffect(() => {
    if (!token || !user || user.role !== 'user') return;
    dispatch(fetchWishlist());
  }, [dispatch, token, user]);

  return (
    <>
      {loading && <Loader onComplete={() => setLoading(false)} />}
      <BrowserRouter>
        <ScrollToTop />
        <FixedActions />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/story" element={<Story />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/track-order" element={<TrackOrder />} />
          <Route path="/product-details/:id" element={<ProductDetails />} />
          {/* Admin layout with nested routes (protected) */}
          <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>}>
            {/* Index = main dashboard */}
            <Route index element={<DashboardHome />} />
            <Route path="dashboard" element={<DashboardHome />} />
            <Route path="products" element={<ProductsLayout />}>
              <Route index element={<Products />} />
              <Route path="add-products" element={<AddNewProducts />} />
              <Route path="edit/:id" element={<EditProduct />} />
            </Route>
            <Route path="orders" element={<Orders />} />
            <Route path="orders/:orderId" element={<AdminOrderDetails />} />
            <Route path="assigned-orders" element={<AssignedOrders />} />
            <Route path="driver-orders" element={<DriverOrders />} />
            <Route path="customers" element={<Customers />} />
            <Route path="live-carts" element={<AdminLiveCarts />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
            <Route path="categories" element={<CategoriesLayout />} >
              <Route index element={<Categories />} />
              <Route path='add-categories' element={<AddCategories />} />
            </Route>
            <Route path="coupons" element={<Coupons />} />
            <Route path="deals" element={<ManageDeals />} />
            <Route path="shipping" element={<Shipping />} />
            <Route path="payments" element={<Payments />} />
            <Route path="reports" element={<Reports />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="security" element={<Security />} />
            <Route path="admins" element={<Admins />} />
          </Route>

          <Route path="/driver" element={<ProtectedRoute role="driver"><DriverDashboard /></ProtectedRoute>}>
            <Route index element={<DriverHome />} />
            <Route path="dashboard" element={<DriverHome />} />
            <Route path="orders" element={<DriverOrders />} />
          </Route>

          {/* User Dashboard layout with nested routes (protected) */}
          <Route path="/user" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>}>
            <Route index element={<UserOverview />} />
            <Route path="overview" element={<UserOverview />} />
            <Route path="orders" element={<MyOrders />} />
            <Route path="orders/:orderId" element={<ViewOrderDetails />} />
            <Route path="cart" element={<DashboardCart />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="addresses" element={<Addresses />} />
            <Route path="billing-invoices" element={<DashboardBilling />} />
            <Route path="payments" element={<UserPayments />} />
            <Route path="reviews" element={<MyReviews />} />
            <Route path="profile" element={<UserProfile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;