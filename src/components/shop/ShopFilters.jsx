import React, { useState, useEffect, useRef } from 'react';
import { SlidersHorizontal, X, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';

const formatPrice = (n) =>
  n != null && !Number.isNaN(n) ? `₹${Number(n).toLocaleString('en-IN')}` : '';

// Defined outside so it's not recreated each render (fixes price input losing focus)
const FilterSection = ({ id, title, children, visible, openSections, onToggle }) => {
  if (!visible) return null;
  const open = openSections[id];
  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        type="button"
        onClick={() => onToggle(id)}
        className="w-full flex items-center justify-between py-3.5 text-left group"
      >
        <span className="text-xs font-semibold uppercase tracking-widest text-gray-700 group-hover:text-[#985991] transition-colors">
          {title}
        </span>
        {open ? (
          <ChevronUp size={18} className="text-gray-400 shrink-0" />
        ) : (
          <ChevronDown size={18} className="text-gray-400 shrink-0" />
        )}
      </button>
      {open && <div className="pb-4">{children}</div>}
    </div>
  );
};

const OptionButton = ({ active, onClick, label }) => (
  <button
    type="button"
    onClick={onClick}
    className={`block w-full text-left text-sm py-2 px-3 rounded-lg transition-colors truncate ${active ? 'bg-[#985991] text-white font-medium' : 'text-gray-600 hover:bg-[#985991]/10 hover:text-[#985991]'
      }`}
  >
    {label}
  </button>
);

const ShopFilters = ({
  filterOptions,
  loading: optionsLoading,
  category: selectedCategory,
  subcategory: selectedSubcategory,
  categoryName,
  subcategoryName,
  brands: selectedBrands = [],
  minPrice: selectedMinPrice,
  maxPrice: selectedMaxPrice,
  productTypes: selectedProductTypes = [],
  variants: selectedVariants = [],
  onApply,
  onClear,
  hasActiveFilters,
  sort,
  onSortChange,
  totalCount,
}) => {
  const [openSections, setOpenSections] = useState({
    category: true,
    subcategory: true,
    price: true,
    brand: true,
    type: true,
    variant: true,
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [localMin, setLocalMin] = useState('');
  const [localMax, setLocalMax] = useState('');
  const priceFocusedRef = useRef(false);
  const [brandSearch, setBrandSearch] = useState('');
  const [showAllBrands, setShowAllBrands] = useState(false);

  const brands = filterOptions?.brands || [];
  const categories = filterOptions?.categories || [];
  const subcategories = filterOptions?.subcategories || [];
  const productTypes = filterOptions?.productTypes || [];
  const variants = filterOptions?.variants || [];
  const minPriceRange = filterOptions?.minPrice ?? 0;
  const maxPriceRange = filterOptions?.maxPrice ?? 0;

  // Sync price from URL only when not focused on price input (avoids clearing while typing)
  useEffect(() => {
    if (priceFocusedRef.current) return;
    setLocalMin(selectedMinPrice != null && selectedMinPrice !== '' ? String(selectedMinPrice) : '');
    setLocalMax(selectedMaxPrice != null && selectedMaxPrice !== '' ? String(selectedMaxPrice) : '');
  }, [selectedMinPrice, selectedMaxPrice]);

  const toggleSection = (key) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const filteredBrands = brandSearch.trim()
    ? brands.filter((b) => b.toLowerCase().includes(brandSearch.toLowerCase()))
    : brands;
  const displayBrands = showAllBrands ? filteredBrands : filteredBrands.slice(0, 10);

  const handleApplyPrice = () => {
    const min = localMin === '' ? undefined : parseFloat(localMin);
    const max = localMax === '' ? undefined : parseFloat(localMax);
    onApply({ minPrice: min, maxPrice: max });
  };

  const handleCategoryClick = (slug) => {
    onApply({ category: selectedCategory === slug ? undefined : slug, subcategory: undefined });
  };

  const handleSubcategoryClick = (slug) => {
    onApply({ subcategory: selectedSubcategory === slug ? undefined : slug });
  };

  const handleBrandToggle = (b) => {
    const next = selectedBrands.includes(b) ? selectedBrands.filter((x) => x !== b) : [...selectedBrands, b];
    onApply({ brands: next });
  };

  const handleTypeToggle = (value) => {
    const next = selectedProductTypes.includes(value)
      ? selectedProductTypes.filter((x) => x !== value)
      : [...selectedProductTypes, value];
    onApply({ productTypes: next });
  };

  const handleVariantToggle = (value) => {
    const next = selectedVariants.includes(value)
      ? selectedVariants.filter((x) => x !== value)
      : [...selectedVariants, value];
    onApply({ variants: next });
  };

  // Subcategory list: always show when category is selected; include selected sub if missing from API (e.g. slug-only)
  const showSubcategorySection = selectedCategory && (subcategories.length > 0 || selectedSubcategory);
  const displaySubcategories = [...subcategories];
  if (selectedSubcategory && !displaySubcategories.some((s) => s.slug === selectedSubcategory)) {
    displaySubcategories.push({
      id: selectedSubcategory,
      slug: selectedSubcategory,
      name: selectedSubcategory.replace(/-/g, ' '),
    });
  }

  const removeChip = (type, value) => {
    switch (type) {
      case 'category':
        onApply({ category: undefined, subcategory: undefined });
        break;
      case 'subcategory':
        onApply({ subcategory: undefined });
        break;
      case 'brand':
        onApply({ brands: selectedBrands.filter((b) => b !== value) });
        break;
      case 'price':
        onApply({ minPrice: undefined, maxPrice: undefined });
        break;
      case 'productType':
        onApply({ productTypes: selectedProductTypes.filter((t) => t !== value) });
        break;
      case 'variant':
        onApply({ variants: selectedVariants.filter((v) => v !== value) });
        break;
      default:
        break;
    }
  };

  const chips = [];
  if (selectedCategory) chips.push({ type: 'category', label: categoryName || selectedCategory.replace(/-/g, ' '), value: selectedCategory });
  if (selectedSubcategory) chips.push({ type: 'subcategory', label: subcategoryName || selectedSubcategory.replace(/-/g, ' '), value: selectedSubcategory });
  if (selectedMinPrice != null && selectedMinPrice !== '' || selectedMaxPrice != null && selectedMaxPrice !== '') {
    chips.push({ type: 'price', label: `${formatPrice(selectedMinPrice) || 'Min'} – ${formatPrice(selectedMaxPrice) || 'Max'}`, value: 'price' });
  }
  selectedBrands.forEach((b) => chips.push({ type: 'brand', label: b, value: b }));
  selectedProductTypes.forEach((t) => chips.push({ type: 'productType', label: productTypes.find((x) => x.value === t)?.label || t, value: t }));
  selectedVariants.forEach((v) => chips.push({ type: 'variant', label: v, value: v }));

  const filterContent = (
    <div className="space-y-0">
      {chips.length > 0 && (
        <div className="mb-4 pb-4 border-b border-gray-100">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">Selected filters</p>
          <div className="flex flex-wrap gap-1.5">
            {chips.map((chip) => (
              <span
                key={`${chip.type}-${chip.value}`}
                className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1 rounded-full bg-[#985991]/10 text-[#985991] text-xs font-medium"
              >
                {chip.label}
                <button
                  type="button"
                  onClick={() => removeChip(chip.type, chip.value)}
                  className="rounded-full p-0.5 hover:bg-[#985991]/20"
                  aria-label={`Remove ${chip.label}`}
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      <FilterSection
        id="category"
        title="Category"
        visible={categories.length > 0}
        openSections={openSections}
        onToggle={toggleSection}
      >
        <ul className="space-y-0.5">
          {categories.map((c) => (
            <li key={c.id}>
              <OptionButton
                active={selectedCategory === c.slug}
                onClick={() => handleCategoryClick(c.slug)}
                label={c.name}
              />
            </li>
          ))}
        </ul>
      </FilterSection>

      <FilterSection
        id="subcategory"
        title="Sub-category"
        visible={showSubcategorySection}
        openSections={openSections}
        onToggle={toggleSection}
      >
        <ul className="space-y-0.5">
          {displaySubcategories.map((c) => (
            <li key={c.id}>
              <OptionButton
                active={selectedSubcategory === c.slug}
                onClick={() => handleSubcategoryClick(c.slug)}
                label={c.name}
              />
            </li>
          ))}
        </ul>
      </FilterSection>

      <FilterSection id="price" title="
      
      nge" visible openSections={openSections} onToggle={toggleSection}>
        <div className="space-y-3">
          <div className="flex gap-2 items-center">
            <input
              type="number"
              min={minPriceRange}
              max={maxPriceRange}
              step="1"
              placeholder="Min"
              value={localMin}
              onFocus={() => { priceFocusedRef.current = true; }}
              onBlur={() => { priceFocusedRef.current = false; }}
              onChange={(e) => setLocalMin(e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#985991]/30 focus:border-[#985991]"
            />
            <span className="text-gray-400 font-medium">–</span>
            <input
              type="number"
              min={minPriceRange}
              max={maxPriceRange}
              step="1"
              placeholder="Max"
              value={localMax}
              onFocus={() => { priceFocusedRef.current = true; }}
              onBlur={() => { priceFocusedRef.current = false; }}
              onChange={(e) => setLocalMax(e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#985991]/30 focus:border-[#985991]"
            />
          </div>
          <p className="text-xs text-gray-500">
            {formatPrice(minPriceRange)} – {formatPrice(maxPriceRange)}
          </p>
          <button
            type="button"
            onClick={handleApplyPrice}
            className="w-full text-sm font-semibold text-[#985991] border-2 border-[#985991] rounded-lg py-2.5 hover:bg-[#985991]/5 transition-colors"
          >
            Apply Price
          </button>
        </div>
      </FilterSection>

      <FilterSection id="brand" title="Brand" visible={brands.length > 0} openSections={openSections} onToggle={toggleSection}>
        <input
          type="text"
          placeholder="Search brand..."
          value={brandSearch}
          onChange={(e) => setBrandSearch(e.target.value)}
          className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-[#985991]/30 focus:border-[#985991]"
        />
        <ul className="space-y-0.5 max-h-44 overflow-y-auto scrollbar-thin">
          {displayBrands.map((b) => (
            <li key={b}>
              <OptionButton
                active={selectedBrands.includes(b)}
                onClick={() => handleBrandToggle(b)}
                label={b}
              />
            </li>
          ))}
        </ul>
        {filteredBrands.length > 10 && (
          <button
            type="button"
            onClick={() => setShowAllBrands(!showAllBrands)}
            className="text-xs text-[#985991] font-medium hover:underline mt-2"
          >
            {showAllBrands ? 'Show less' : `Show all (${filteredBrands.length})`}
          </button>
        )}
      </FilterSection>

      <FilterSection
        id="type"
        title="Product Type"
        visible={productTypes.length > 0}
        openSections={openSections}
        onToggle={toggleSection}
      >
        <ul className="space-y-0.5">
          {productTypes.map((t) => (
            <li key={t.value}>
              <OptionButton
                active={selectedProductTypes.includes(t.value)}
                onClick={() => handleTypeToggle(t.value)}
                label={t.label}
              />
            </li>
          ))}
        </ul>
      </FilterSection>

      <FilterSection
        id="variant"
        title="Variant"
        visible={variants.length > 0}
        openSections={openSections}
        onToggle={toggleSection}
      >
        <ul className="space-y-0.5">
          {variants.map((v) => (
            <li key={v.value}>
              <OptionButton
                active={selectedVariants.includes(v.value)}
                onClick={() => handleVariantToggle(v.value)}
                label={v.label}
              />
            </li>
          ))}
        </ul>
      </FilterSection>
    </div>
  );

  return (
    <>
      <div className="lg:hidden sticky top-[calc(var(--navbar-height,72px)+2rem)] z-30 bg-white/95 backdrop-blur-sm border border-gray-100 rounded-xl p-2 mb-3">
        <div className="grid grid-cols-2 gap-2 w-full">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className={`inline-flex w-full items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-center transition-colors ${
              hasActiveFilters
                ? 'bg-[#985991] text-white shadow-md'
                : 'bg-white border border-gray-200 text-gray-700 hover:border-[#985991] hover:text-[#985991]'
            }`}
          >
            <SlidersHorizontal size={16} />
            Filters
            {hasActiveFilters && (
              <span className="min-w-[18px] h-[18px] rounded-full bg-white/20 flex items-center justify-center text-[10px]">•</span>
            )}
          </button>

          <select
            value={sort || ''}
            onChange={(e) => onSortChange && onSortChange(e.target.value)}
            className="w-full min-w-0 text-xs border border-gray-200 rounded-xl px-3 py-2 bg-white text-gray-700 text-center focus:outline-none focus:border-[#985991]"
          >
            <option value="">Sort: Newest</option>
            <option value="newest">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="popular">Popular</option>
            <option value="discount">Discount</option>
          </select>
        </div>
        {!Number.isNaN(totalCount) && totalCount != null && (
          <p className="text-[11px] text-gray-500 text-right mt-1 pr-0.5">
            {totalCount} product{totalCount !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileOpen(false)} aria-hidden />
          <div className="fixed inset-y-0 left-0 w-full max-w-md bg-white shadow-2xl z-50 lg:hidden flex flex-col">
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100 bg-white">
              <h2 className="text-lg font-serif font-semibold text-gray-900">Filters</h2>
              <div className="flex items-center gap-2">
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={() => { onClear(); setMobileOpen(false); }}
                    className="text-sm text-[#985991] font-medium flex items-center gap-1"
                  >
                    <RotateCcw size={14} /> Clear all
                  </button>
                )}
                <button type="button" onClick={() => setMobileOpen(false)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-600">
                  <X size={22} />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {optionsLoading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-12 bg-gray-100 rounded-lg" />
                  <div className="h-32 bg-gray-100 rounded-lg" />
                  <div className="h-24 bg-gray-100 rounded-lg" />
                </div>
              ) : (
                filterContent
              )}
            </div>
          </div>
        </>
      )}

      <aside className="hidden lg:block w-72 flex-shrink-0">
        <div
          className="sticky top-[calc(var(--navbar-height,180px)+1rem)] rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden"
          style={{ maxHeight: 'calc(100vh - var(--navbar-height, 180px) - 2rem)' }}
        >
          <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-800">Filters</h2>
            {hasActiveFilters && (
              <button type="button" onClick={onClear} className="text-xs font-medium text-[#985991] hover:underline flex items-center gap-1">
                <RotateCcw size={12} /> Clear all
              </button>
            )}
          </div>
          <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - var(--navbar-height, 180px) - 6rem)' }}>
            {optionsLoading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-10 bg-gray-100 rounded-lg" />
                <div className="h-28 bg-gray-100 rounded-lg" />
                <div className="h-24 bg-gray-100 rounded-lg" />
              </div>
            ) : (
              filterContent
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default ShopFilters;
