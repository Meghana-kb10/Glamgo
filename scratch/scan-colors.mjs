import fs from 'fs';

const files = [
  'src/components/ArtistProfileModal.tsx',
  'src/components/ArtistCard.tsx',
  'src/components/shop/ProductCatalog.tsx',
  'src/components/shop/ProductDetailModal.tsx',
  'src/components/ProductCard.tsx',
  'src/components/offers/OffersPage.tsx',
  'src/components/search/SearchModal.tsx',
  'src/components/FilterBar.tsx',
  'src/components/home/ArtistServicesExplorer.tsx',
  'src/components/home/ProductRail.tsx',
  'src/components/catalog/CategoryListingPage.tsx',
  'src/components/catalog/ServiceDetailModal.tsx',
  'src/components/catalog/VariantPickerSheet.tsx',
];

const patterns = [
  { name: 'soft-ivory', regex: /\bsoft-ivory\b/g },
  { name: 'mist', regex: /\bmist\b/g },
  { name: 'text-ink', regex: /\btext-ink\b/g },
  { name: 'mauve-grey', regex: /\bmauve-grey\b/g },
  { name: 'rose-plum', regex: /\brose-plum\b/g },
  { name: 'bg-blush', regex: /\bbg-blush\b/g },
  { name: 'champagne-gold', regex: /\bchampagne-gold\b/g },
  { name: 'bg-white', regex: /\bbg-white\b/g },
  { name: 'text-black', regex: /\btext-black\b/g },
  { name: 'stone-', regex: /\bstone-[a-z0-9]+\b/g },
  { name: 'gray-', regex: /\bgray-[a-z0-9]+\b/g },
  { name: 'slate-', regex: /\bslate-[a-z0-9]+\b/g },
  { name: 'hex', regex: /#[0-9a-fA-F]{3,8}/g },
];

for (const file of files) {
  if (!fs.existsSync(file)) {
    console.log(`File not found: ${file}`);
    continue;
  }
  const content = fs.readFileSync(file, 'utf8');
  const results = [];
  for (const { name, regex } of patterns) {
    const matches = content.match(regex);
    if (matches && matches.length > 0) {
      results.push(`${name}: ${matches.length}`);
    }
  }
  if (results.length > 0) {
    console.log(`${file} => ${results.join(', ')}`);
  } else {
    console.log(`${file} => CLEAN (0 legacy colors)`);
  }
}
