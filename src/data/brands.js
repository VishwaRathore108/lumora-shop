/**
 * Brands currently sold on the site – skincare & haircare.
 * Each entry: { name, logo? } – logo is optional; when missing, UI shows brand name as text.
 * Add your logo image URLs (hosted or CDN) when available.
 */

// Skincare brands (with optional logo URL – use null or omit for text-only display)
export const SKINCARE_BRANDS = [
  { name: 'Ponds' },
  { name: 'O3+', tag: 'Premium / Salon' },
  { name: "L'Oréal Paris", logo: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/L%27Or%C3%A9al_logo.svg' },
  { name: 'VLCC' },
  { name: 'Lotus Herbals', tag: 'Professional' },
  { name: 'Dot & Key' },
  { name: 'Biotique' },
  { name: 'Pilgrim' },
  { name: 'Fixderma' },
  { name: 'Aura' },
  { name: 'Cetaphil', tag: 'Dermatologist Recommended' },
  { name: 'Plum' },
  { name: 'Minimalist' },
  { name: 'The Derma Co' },
  { name: 'Bioderma' },
  { name: "Dr. Sheth's" },
  { name: 'Aqualogica' },
  { name: 'Yuthika Professional', tag: 'Salon' },
  { name: "Victoria's Secret", tag: 'Premium Body Care' },
  { name: 'Bella Vita Luxury' },
  { name: 'UrbanGabru' },
];

// Haircare brands
export const HAIRCARE_BRANDS = [
  { name: 'Youvana Professional' },
  { name: "L'Oréal Professionnel", tag: 'Salon Favorites', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/L%27Or%C3%A9al_logo.svg' },
  { name: 'Matrix', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Matrix_Total_Results_logo.svg/1200px-Matrix_Total_Results_logo.svg.png' },
  { name: 'Schwarzkopf Professional' },
  { name: 'Wella Professionals', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Wella_logo.svg/1200px-Wella_logo.svg.png' },
  { name: 'Floractive', tag: 'Premium Salon' },
  { name: 'De Fabulous' },
  { name: 'iluvia' },
  { name: 'Yuthika' },
  { name: 'Raaga Professional' },
  { name: 'Krone' },
  { name: 'Streax Professional' },
  { name: 'BBlunt' },
  { name: 'Tresemmé' },
];

// Combined list for carousel / “Brands we sell” – all entries have at least { name }; logo optional
export const ALL_BRANDS = [
  ...SKINCARE_BRANDS.map((b) => ({ ...b, category: 'skincare' })),
  ...HAIRCARE_BRANDS.map((b) => ({ ...b, category: 'haircare' })),
];

// For dropdowns: { name, logo } – logo optional (null = text fallback)
export const DROPDOWN_BRANDS_SKINCARE = SKINCARE_BRANDS.map((b) => ({
  name: b.name,
  logo: b.logo || null,
}));

export const DROPDOWN_BRANDS_HAIRCARE = HAIRCARE_BRANDS.map((b) => ({
  name: b.name,
  logo: b.logo || null,
}));

export const DROPDOWN_BRANDS_COMBINED = [
  ...DROPDOWN_BRANDS_SKINCARE,
  ...DROPDOWN_BRANDS_HAIRCARE,
];

// Plain name lists for “Brands to know” in category menus
export const SKINCARE_BRANDS_TO_KNOW = SKINCARE_BRANDS.map((b) => b.name);
export const HAIRCARE_BRANDS_TO_KNOW = HAIRCARE_BRANDS.map((b) => b.name);
