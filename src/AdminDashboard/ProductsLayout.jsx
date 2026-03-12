import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Package, Plus, List, ChevronRight } from 'lucide-react';

function ProductsLayout() {
  const location = useLocation();
  const isAdd = location.pathname.includes('add-products');
  const isEdit = location.pathname.includes('edit/');

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500">
        <NavLink to="/admin" className="hover:text-[#985991]">Admin</NavLink>
        <ChevronRight size={14} className="text-gray-400" />
        <NavLink to="/admin/products" className="hover:text-[#985991] font-medium text-gray-700">Products</NavLink>
        {isAdd && (
          <>
            <ChevronRight size={14} className="text-gray-400" />
            <span className="text-[#985991] font-medium">Add product</span>
          </>
        )}
        {isEdit && (
          <>
            <ChevronRight size={14} className="text-gray-400" />
            <span className="text-[#985991] font-medium">Edit product</span>
          </>
        )}
      </nav>

      {/* Sub-nav when on list (only show when not in add/edit to avoid clutter) */}
      {!isAdd && !isEdit && (
        <div className="flex flex-wrap items-center gap-2">
          <NavLink
            to="/admin/products"
            end
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                isActive ? 'bg-[#985991] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-[#985991] hover:text-[#985991]'
              }`
            }
          >
            <List size={18} /> All products
          </NavLink>
          <NavLink
            to="/admin/products/add-products"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                isActive ? 'bg-[#985991] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-[#985991] hover:text-[#985991]'
              }`
            }
          >
            <Plus size={18} /> Add product
          </NavLink>
        </div>
      )}

      <Outlet />
    </div>
  );
}

export default ProductsLayout;
