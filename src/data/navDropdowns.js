// Navigation dropdown content - Tira-style mega menu data
// All links route to /shop with category query for filtering
import { DROPDOWN_BRANDS_COMBINED, SKINCARE_BRANDS_TO_KNOW, HAIRCARE_BRANDS_TO_KNOW } from './brands';

export const SHOP_BY = [
  { label: "What's New", slug: 'new' },
  { label: 'Bestsellers', slug: 'bestsellers' },
  { label: 'Minis', slug: 'minis' },
  { label: 'Sets & Bundles', slug: 'bundles' },
  { label: 'Homegrown', slug: 'homegrown' },
  { label: 'Budget Buys', slug: 'budget' },
];

// Brand logos for dropdown carousels – skincare & haircare brands we sell (logo optional)
export const DROPDOWN_BRANDS = DROPDOWN_BRANDS_COMBINED;

// Main nav order: Women, Men, Kids, Skincare, Hair, Makeup, Body (meaningful options)
export const CATEGORY_NAV_ORDER = ['women', 'men', 'kids', 'skin', 'hair', 'makeup', 'body'];

// Category mega menu config - each category has columns + brands
export const CATEGORY_DROPDOWNS = {
  women: {
    label: 'Women',
    columns: [
      { title: 'Makeup', items: ['Lipstick', 'Foundation', 'Blush', 'Eye Shadow', 'Mascara', 'Kajal', 'Compact', 'Concealer'] },
      { title: 'Skincare', items: ['Face Wash', 'Serum', 'Moisturizer', 'Sunscreen', 'Night Cream', 'Face Oil'] },
      { title: 'Hair', items: ['Shampoo', 'Conditioner', 'Hair Oil', 'Serum', 'Hair Mask'] },
      { title: 'Body', items: ['Body Lotion', 'Body Wash', 'Body Butter', 'Hand Cream'] },
      { title: 'Fragrance', items: ['Perfume', 'Body Mist', 'Roll-on'] },
    ],
    shopBy: SHOP_BY,
    brandsToKnow: ['Lumora', 'Plum', 'M.A.C', 'The Ordinary', 'Maybelline', 'Lakme', 'Huda Beauty', 'Bobbi Brown'],
  },
  men: {
    label: 'Men',
    columns: [
      { title: 'Skincare', items: ['Face Wash', 'Moisturizer', 'Sunscreen', 'Grooming Kit'] },
      { title: 'Grooming', items: ['Shaving', 'Trimmers', 'Hair Care', 'Beard Care'] },
      { title: 'Fragrance', items: ['Cologne', 'Deodorant', 'Body Spray'] },
    ],
    shopBy: SHOP_BY,
    brandsToKnow: ['Nivea Men', 'Gillette', "L'Oréal Men", 'The Man Company', 'Bombay Shaving'],
  },
  kids: {
    label: 'Kids',
    columns: [
      { title: 'Baby Care', items: ['Baby Lotion', 'Baby Oil', 'Diaper Cream', 'Baby Wash', 'Baby Powder'] },
      { title: 'Mom Care', items: ['Stretch Marks', 'Nipple Care', 'Postpartum'] },
    ],
    shopBy: SHOP_BY.slice(0, 4),
    brandsToKnow: ['Mamaearth', 'Himalaya', 'Sebamed', "Johnson's"],
  },
  skin: {
    label: 'Skincare',
    columns: [
      { title: 'Cleansers', items: ['Face Wash', 'Cleansing Balm', 'Micellar Water', 'Cleansing Oil', 'Exfoliators'] },
      { title: 'Moisturizers', items: ['Day Cream', 'Night Cream', 'Gel Moisturizer', 'Serum', 'Face Oil'] },
      { title: 'Treatments', items: ['Retinol', 'Vitamin C', 'Niacinamide', 'Hyaluronic Acid', 'AHA/BHA', 'Spot Treatment'] },
      { title: 'Sunscreen', items: ['SPF 30', 'SPF 50', 'Sunscreen Gel', 'Mineral Sunscreen'] },
    ],
    shopBy: SHOP_BY,
    brandsToKnow: SKINCARE_BRANDS_TO_KNOW,
  },
  hair: {
    label: 'Hair',
    columns: [
      { title: 'Shampoo & Conditioner', items: ['Shampoo', 'Conditioner', 'Hair Mask', 'Scalp Care', 'Clarifying Shampoo'] },
      { title: 'Treatments', items: ['Hair Oil', 'Serum', 'Leave-in Cream', 'Hair Fall Control', 'Keratin'] },
      { title: 'Styling', items: ['Hair Gel', 'Mousse', 'Wax', 'Hair Spray', 'Heat Protectant'] },
    ],
    shopBy: SHOP_BY,
    brandsToKnow: HAIRCARE_BRANDS_TO_KNOW,
  },
  makeup: {
    label: 'Makeup',
    columns: [
      {
        title: 'Face',
        items: [
          'Blush', 'Bronzer', 'Compact', 'Concealers & Correctors', 'Contour',
          'Foundation', 'Highlighters & Illuminators', 'Setting Powder', 'Makeup Remover',
          'Primer', 'Setting Spray', 'BB & CC Creams', 'Loose Powder',
        ],
      },
      {
        title: 'Eye',
        items: [
          'Eye Makeup Remover', 'Eyebrow Enhancer', 'False Eyelashes', 'Eyeliner',
          'Eye Shadow', 'Kajal & Kohls', 'Mascara', 'Under Eye Concealer', 'Eye Bases & Primers',
        ],
      },
      {
        title: 'Lip',
        items: [
          'Lip Balm', 'Lip Crayon', 'Lip Gloss', 'Lip Oils', 'Lip Liner',
          'Lip Stain', 'Lip Primers & Plumpers', 'Lipstick', 'Liquid Lipstick',
        ],
      },
      {
        title: 'Tools & Brushes',
        items: [
          'Brush Sets', 'Eye Brushes & Eyelash Curlers', 'Face Brush', 'Lip Brush',
          'Makeup Pouch', 'Sharpeners & Tweezers', 'Sponges & Blenders', 'Mirror',
        ],
      },
      {
        title: 'Nail',
        items: [
          'Nail Art Kits', 'Nail Care', 'Nail Polishes & Sets', 'Nail Polish Remover',
          'Manicure & Pedicure Kits', 'Files & Buffers',
        ],
      },
    ],
    shopBy: SHOP_BY,
    brandsToKnow: ['SHEGLAM', 'Kiko Milano', 'Makeup Revolution', 'Etude House', 'M.A.C', 'Laura Mercier', 'Benefit Cosmetics', 'Huda Beauty', 'Bobbi Brown'],
  },
  body: {
    label: 'Body',
    columns: [
      { title: 'Bath & Shower', items: ['Body Wash', 'Body Scrubs', 'Soap', 'Bath Salts'] },
      { title: 'Body Care', items: ['Body Lotion', 'Body Butter', 'Hand Cream', 'Foot Care'] },
      { title: 'Hygiene', items: ['Hand Sanitizer', 'Intimate Care'] },
    ],
    shopBy: SHOP_BY.slice(0, 4),
    brandsToKnow: ['The Body Shop', 'Mamaearth', 'Plum', 'Dove', 'Nivea', 'Vaseline'],
  },
};

// Brands mega menu - tabs + grid
export const BRANDS_TABS = [
  { id: 'loves', label: 'Beauty Hub Loves' },
  { id: 'top', label: 'Top Brands' },
  { id: 'new', label: 'Newly Added' },
  { id: 'featured', label: 'Featured' },
  { id: 'homegrown', label: 'Homegrown' },
];

// All brand names for Brands mega menu search (skincare + haircare + legacy)
export const BRANDS_LIST = [
  ...SKINCARE_BRANDS_TO_KNOW,
  ...HAIRCARE_BRANDS_TO_KNOW,
  'Lumora', 'Lakme', 'M.A.C', 'Maybelline', 'The Ordinary', 'Huda Beauty', 'Bobbi Brown',
  'Olaplex', 'Mamaearth', 'Nivea', 'Dove', 'Vaseline', 'The Body Shop', 'Nykaa',
];
