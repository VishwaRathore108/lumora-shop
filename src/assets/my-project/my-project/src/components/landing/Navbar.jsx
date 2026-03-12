import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, Sparkles } from 'lucide-react';
import logo from '../../assets/logo.jpg'; 

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Link Styles
  const linkStyle = "text-slate-600 font-medium hover:text-blue-600 transition-colors text-sm";
  const activeLinkStyle = "text-blue-600 font-bold text-sm";

  return (
    <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md border-b border-slate-100 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* --- LOGO (Clicking this also goes Home) --- */}
        <NavLink to="/" className="flex items-center gap-2">
          <img src={logo} alt="Leadcore" className="h-10 object-contain" />
        </NavLink>

        {/* --- DESKTOP MENU --- */}
        <div className="hidden md:flex items-center gap-8">
          
          {/* 1. HOME LINK ADDED HERE */}
          <NavLink 
            to="/" 
            className={({isActive}) => isActive ? activeLinkStyle : linkStyle}
            end // 'end' zaroori hai taaki ye sirf Exact Home par active dikhe
          >
            Home
          </NavLink>

          {/* Highlighted AI Link */}
          <NavLink to="/ai" className="flex items-center gap-1.5 text-blue-700 font-bold bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-all shadow-sm text-xs">
            <Sparkles size={14} className="text-blue-600 fill-blue-600" /> 
            Generative AI
          </NavLink>

          {/* Other Links */}
          <NavLink to="/solutions" className={({isActive}) => isActive ? activeLinkStyle : linkStyle}>Solutions</NavLink>
          <NavLink to="/pricing" className={({isActive}) => isActive ? activeLinkStyle : linkStyle}>Pricing</NavLink>
          <NavLink to="/contact" className={({isActive}) => isActive ? activeLinkStyle : linkStyle}>Contact</NavLink>
        </div>

        {/* --- RIGHT BUTTONS --- */}
        <div className="hidden md:flex items-center gap-4">
          <NavLink to="/login" className="text-slate-600 font-semibold text-sm hover:text-blue-600 transition-colors">
            Log In
          </NavLink>
          <NavLink to="/contact" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full font-semibold text-sm transition-all shadow-lg shadow-blue-600/20">
            Get Started
          </NavLink>
        </div>

        {/* --- MOBILE TOGGLE --- */}
        <button className="md:hidden text-slate-700" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* --- MOBILE MENU --- */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 absolute w-full left-0 shadow-xl p-6 flex flex-col gap-4 animate-in slide-in-from-top-5">
          
          {/* Mobile Home Link */}
          <NavLink to="/" className="text-slate-600 font-medium p-2" onClick={() => setIsMenuOpen(false)}>Home</NavLink>
          
          <NavLink to="/ai" className="flex items-center gap-2 text-blue-700 font-bold bg-blue-50 p-3 rounded-lg" onClick={() => setIsMenuOpen(false)}>
             <Sparkles size={16} /> Generative AI
          </NavLink>
          <NavLink to="/solutions" className="text-slate-600 font-medium p-2" onClick={() => setIsMenuOpen(false)}>Solutions</NavLink>
          <NavLink to="/pricing" className="text-slate-600 font-medium p-2" onClick={() => setIsMenuOpen(false)}>Pricing</NavLink>
          <NavLink to="/contact" className="text-slate-600 font-medium p-2" onClick={() => setIsMenuOpen(false)}>Contact</NavLink>
          
          <div className="h-px bg-slate-100 my-2"></div>
          
          <NavLink to="/login" className="text-center text-slate-600 font-bold p-2" onClick={() => setIsMenuOpen(false)}>Log In</NavLink>
          <NavLink to="/contact" className="bg-blue-600 text-white text-center py-3 rounded-lg font-bold shadow-lg" onClick={() => setIsMenuOpen(false)}>
            Get Started
          </NavLink>
        </div>
      )}
    </nav>
  );
};

export default Navbar;