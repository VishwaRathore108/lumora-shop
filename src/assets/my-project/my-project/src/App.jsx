import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import ScrollToAnchor from './components/ScrollToAnchor';

// Imports
import Navbar from './components/landing/Navbar';
import Hero from './components/landing/Hero';
import FeatureTabs from './components/landing/FeatureTabs';
import HowItWorks from './components/landing/HowItWorks';
import Integrations from './components/landing/Integrations'; 
import AgenticAI from './components/landing/AgenticAI';       
import SocialProof from './components/landing/SocialProof';
import Testimonials from './components/landing/Testimonials';
import Footer from './components/landing/Footer';

// PAGE IMPORTS 
import Contact from './pages/contact';
import GenerativeAI from './pages/GenrativeAI'; // NEW
import Pricing from './pages/Pricing'    // NEW
import Solutions from './pages/Solutions';       // NEW

// Home Layout
const HomePage = () => (
  <>
    <Navbar />
    <Hero />
    <SocialProof />
    <AgenticAI />
    <FeatureTabs />
    <Integrations />
    <HowItWorks />
    <Testimonials />
    <Footer />
  </>
);

function App() {
  return (
    <BrowserRouter>
      <ScrollToAnchor />
      <Routes>
        
        {/* --- MAIN ROUTES --- */}
        <Route path="/" element={<HomePage />} />
        
        {/* --- DEDICATED PAGES --- */}
        <Route path="/contact" element={<Contact />} />
        <Route path="/ai" element={<GenerativeAI />} />      {/* /ai link */}
        <Route path="/pricing" element={<Pricing />} />      {/* /pricing link */}
        <Route path="/solutions" element={<Solutions />} />  {/* /solutions link */}
        
        {/* Login Placeholder */}
        <Route path="/login" element={<div className="h-screen flex items-center justify-center">Login Page</div>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;