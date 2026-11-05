import fs from 'fs';
import path from 'path';

function walk(dir) {
  let res = [];
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) {
      if (!full.includes('node_modules') && !full.includes('.git') && !full.includes('dist')) {
        res.push(...walk(full));
      }
    } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
      res.push(full.replace(/\\/g, '/'));
    }
  }
  return res;
}

const all = walk('src');
const step3Files = all.filter(f => 
  f.includes('catalog') || 
  f.includes('shop') || 
  f.includes('offer') || 
  f.includes('search') || 
  f.includes('Artist') ||
  f.includes('Product') ||
  f.includes('Filter')
);
console.log('Step 3 files:\n', step3Files.join('\n'));
