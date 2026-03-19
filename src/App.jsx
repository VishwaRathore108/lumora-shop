import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

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
// import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import StoreLocations from './components/StoreLocations';
import BrandScroll from './components/BrandScroll';
import Features from './components/Features';
import CartDrawer from './components/CartDrawer';
import FixedActions from './components/FixedActions';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Story from './pages/Story';
import Shop from './pages/Shop';
import Contact from './pages/Contact';
import TrackOrder from './pages/TrackOrder';
import ProductDetails from './pages/ProductDetails';
import CartPage from './pages/CartPage';
// Admin (layout + nested pages)
import AdminDashboard from './AdminDashboard/AdminDashboard';
import DashboardHome from './AdminDashboard/DashboardHome';
import Products from './AdminDashboard/Products';
import Orders from './AdminDashboard/Orders';
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
import CategoriesLayout from './AdminDashboard/CategoriesLayout';
import AddCategories from './AdminDashboard/AddCategories';
import ProductsLayout from './AdminDashboard/ProductsLayout';
import AddNewProducts from './AdminDashboard/AddNewProducts';
import EditProduct from './AdminDashboard/EditProduct';
import MegaOffers from './components/MegaOffers';

const Home = () => {
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
      <SkinQuiz />
      {/* <Testimonials /> */}
      <StoreLocations />
      <BrandScroll />
      <Features />
      <Footer />
      <CartDrawer />
    </div>
  );
};

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && <Loader onComplete={() => setLoading(false)} />}
      <BrowserRouter>
        <FixedActions />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/story" element={<Story />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/cart" element={<CartPage />} />
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
            <Route path="customers" element={<Customers />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
            <Route path="categories" element={<CategoriesLayout />} >
              <Route index element={<Categories />} />
              <Route path='add-categories' element={<AddCategories />} />
            </Route>
            <Route path="coupons" element={<Coupons />} />
            <Route path="shipping" element={<Shipping />} />
            <Route path="payments" element={<Payments />} />
            <Route path="reports" element={<Reports />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="security" element={<Security />} />
            <Route path="admins" element={<Admins />} />
          </Route>

          {/* User Dashboard layout with nested routes (protected) */}
          <Route path="/user" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>}>
            <Route index element={<UserOverview />} />
            <Route path="overview" element={<UserOverview />} />
            <Route path="orders" element={<MyOrders />} />
            <Route path="orders/:orderId" element={<ViewOrderDetails />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="addresses" element={<Addresses />} />
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