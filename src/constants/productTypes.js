/**
 * Product type & variant options – aligned with backend Product schema.
 * Use for admin product create/edit and filters.
 */
export const PRODUCT_TYPES = [
  { value: 'makeup', label: 'Makeup' },
  { value: 'skincare', label: 'Skincare' },
  { value: 'haircare', label: 'Haircare' },
  { value: 'bodycare', label: 'Bodycare' },
  { value: 'fragrance', label: 'Fragrance' },
  { value: 'tool', label: 'Tool' },
  { value: 'accessory', label: 'Accessory' },
  { value: 'other', label: 'Other' },
];

export const PRODUCT_SUB_TYPE_EXAMPLES = {
  makeup: ['lipstick', 'foundation', 'blush', 'eyeshadow', 'mascara', 'concealer', 'lip gloss', 'kajal'],
  skincare: ['sunscreen', 'serum', 'moisturizer', 'cleanser', 'toner', 'face mask', 'eye cream', 'sunscreen gel'],
  haircare: ['shampoo', 'conditioner', 'hair oil', 'hair mask', 'serum'],
  bodycare: ['lotion', 'body wash', 'body oil', 'scrub'],
  fragrance: ['perfume', 'body mist', 'deodorant'],
  tool: ['brush', 'sponge', 'tweezers', 'mirror'],
  accessory: ['pouch', 'organizer', 'case'],
  other: [],
};

export const VARIANT_FINISH = [
  { value: 'matte', label: 'Matte' },
  { value: 'dewy', label: 'Dewy' },
  { value: 'satin', label: 'Satin' },
  { value: 'glossy', label: 'Glossy' },
  { value: 'metallic', label: 'Metallic' },
  { value: 'natural', label: 'Natural' },
  { value: 'other', label: 'Other' },
];

export const VARIANT_COVERAGE = [
  { value: 'sheer', label: 'Sheer' },
  { value: 'light', label: 'Light' },
  { value: 'medium', label: 'Medium' },
  { value: 'full', label: 'Full' },
  { value: 'buildable', label: 'Buildable' },
  { value: 'other', label: 'Other' },
];

export const VARIANT_UNDERTONE = [
  { value: 'cool', label: 'Cool' },
  { value: 'warm', label: 'Warm' },
  { value: 'neutral', label: 'Neutral' },
  { value: 'olive', label: 'Olive' },
  { value: 'other', label: 'Other' },
];

export const SIZE_UNITS = [
  { value: 'ml', label: 'ml' },
  { value: 'g', label: 'g' },
  { value: 'kg', label: 'kg' },
  { value: 'l', label: 'L' },
  { value: 'pcs', label: 'pcs' },
  { value: 'oz', label: 'oz' },
  { value: 'other', label: 'Other' },
];

export const PRODUCT_STATUSES = [
  { value: 'draft', label: 'Draft' },
  { value: 'active', label: 'Active' },
  { value: 'out_of_stock', label: 'Out of stock' },
  { value: 'discontinued', label: 'Discontinued' },
];

export const formatPrice = (n) =>
  n != null && !Number.isNaN(n) ? `₹${Number(n).toLocaleString('en-IN')}` : '–';
