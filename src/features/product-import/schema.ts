export const SKIP_PROPERTY = '__SKIP__';

export const SYSTEM_PROPERTY_OPTIONS = [
  { key: SKIP_PROPERTY, label: 'Skip Column' },
  { key: 'id', label: 'Product ID (Update Target)' },
  { key: 'name', label: 'Product Name' },
  { key: 'slug', label: 'Product Slug' },
  { key: 'description', label: 'Description' },
  { key: 'price', label: 'Price' },
  { key: 'stock', label: 'Stock Quantity' },
  { key: 'image_url', label: 'Image URL' },
  { key: 'category', label: 'Category' },
  { key: 'brand', label: 'Brand' },
  { key: 'sku', label: 'SKU' },
  { key: 'weight', label: 'Weight' },
  { key: 'dimensions', label: 'Dimensions' },
  { key: 'active', label: 'Active (true/false)' },
];

export function buildDefaultColumnMappings(headers) {
  const mappings = {};
  headers.forEach((header) => {
    // Basic heuristic to auto-map common headers
    const lowerHeader = header.toLowerCase();
    const found = SYSTEM_PROPERTY_OPTIONS.find((option) =>
      option.key !== SKIP_PROPERTY && lowerHeader.includes(option.key.toLowerCase())
    );
    mappings[header] = {
      targetField: found ? found.key : SKIP_PROPERTY,
      modifier: '',
    };
  });
  return mappings;
}
