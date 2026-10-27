import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <!-- Background Gradient: Deep Obsidian Noir to Regal Velvet -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#211924"/>
      <stop offset="50%" stop-color="#140F18"/>
      <stop offset="100%" stop-color="#0B090E"/>
    </linearGradient>

    <!-- Bezel Rim Gradient: Rose Gold to Champagne -->
    <linearGradient id="rimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FCE7D8"/>
      <stop offset="35%" stop-color="#E0A99E"/>
      <stop offset="70%" stop-color="#C58B7E"/>
      <stop offset="100%" stop-color="#E8D5B5"/>
    </linearGradient>

    <!-- Emblem Gold Gradient: Haute Luster -->
    <linearGradient id="goldGrad" x1="15%" y1="10%" x2="85%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="20%" stop-color="#FCE7D8"/>
      <stop offset="45%" stop-color="#E5B2A8"/>
      <stop offset="75%" stop-color="#C8877B"/>
      <stop offset="100%" stop-color="#F0D8C8"/>
    </linearGradient>

    <!-- Sparkle Flare Gradient -->
    <radialGradient id="flareGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.9"/>
      <stop offset="40%" stop-color="#FEE9DF" stop-opacity="0.6"/>
      <stop offset="75%" stop-color="#E0A99E" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="#E0A99E" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- Base Squircle Container with Gilded Bezel -->
  <rect x="20" y="20" width="472" height="472" rx="118" fill="url(#bgGrad)" stroke="url(#rimGrad)" stroke-width="12"/>
  <rect x="36" y="36" width="440" height="440" rx="104" fill="none" stroke="#FFFFFF" stroke-opacity="0.08" stroke-width="2"/>

  <!-- Subtle Ambient Glow -->
  <circle cx="256" cy="256" r="170" fill="url(#flareGrad)"/>

  <!-- Regal Monogram 'G' (Sculpted Luxury Serif) -->
  <g fill="url(#goldGrad)">
    <path d="M 346 166 
             C 324 138, 296 124, 256 124 
             C 176 124, 122 184, 122 262 
             C 122 340, 178 396, 260 396 
             C 322 396, 368 360, 376 304 
             L 254 304 
             L 254 252 
             L 426 252 
             C 426 338, 368 444, 256 444 
             C 148 444, 68 362, 68 260 
             C 68 154, 150 76, 258 76 
             C 314 76, 362 98, 400 140 
             Z"/>
  </g>

  <!-- Signature 4-Point Faceted Atelier Sparkle (Top-Right) -->
  <g transform="translate(390, 122)">
    <!-- Primary Flare -->
    <circle cx="0" cy="0" r="30" fill="url(#flareGrad)" opacity="0.8"/>
    <!-- Star Rays -->
    <path d="M 0 -68 Q 0 -10 58 0 Q 0 10 0 68 Q 0 10 -58 0 Q 0 -10 0 -68 Z" fill="url(#goldGrad)"/>
    <!-- Diagonal Subtle Rays -->
    <path d="M 0 -32 Q 0 -5 28 0 Q 0 5 0 32 Q 0 5 -28 0 Q 0 -5 0 -32 Z" fill="#FFFFFF" transform="rotate(45)" opacity="0.8"/>
    <!-- Center Diamond Core -->
    <circle cx="0" cy="0" r="9" fill="#FFFFFF"/>
  </g>

  <!-- Secondary Micro-Sparkle (Bottom-Left) -->
  <g transform="translate(132, 386)" opacity="0.9">
    <path d="M 0 -24 Q 0 -4 20 0 Q 0 4 0 24 Q 0 4 -20 0 Q 0 -4 0 -24 Z" fill="url(#goldGrad)"/>
    <circle cx="0" cy="0" r="3.5" fill="#FFFFFF"/>
  </g>
</svg>`;

async function generateFavicons() {
  const publicDir = path.resolve('public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // 1. Write the vector SVG favicon
  const svgPath = path.join(publicDir, 'favicon.svg');
  fs.writeFileSync(svgPath, svgContent, 'utf-8');
  console.log('✅ Created:', svgPath);

  // 2. Generate PNG sizes using Sharp
  const svgBuffer = Buffer.from(svgContent);

  // 32x32 standard favicon
  const png32Path = path.join(publicDir, 'favicon-32x32.png');
  await sharp(svgBuffer).resize(32, 32).png().toFile(png32Path);
  console.log('✅ Created:', png32Path);

  // 16x16 small favicon
  const png16Path = path.join(publicDir, 'favicon-16x16.png');
  await sharp(svgBuffer).resize(16, 16).png().toFile(png16Path);
  console.log('✅ Created:', png16Path);

  // 180x180 Apple touch icon
  const applePath = path.join(publicDir, 'apple-touch-icon.png');
  await sharp(svgBuffer).resize(180, 180).png().toFile(applePath);
  console.log('✅ Created:', applePath);

  // 192x192 & 512x512 Android / PWA icons
  const pwa192Path = path.join(publicDir, 'pwa-192x192.png');
  await sharp(svgBuffer).resize(192, 192).png().toFile(pwa192Path);
  console.log('✅ Created:', pwa192Path);

  const pwa512Path = path.join(publicDir, 'pwa-512x512.png');
  await sharp(svgBuffer).resize(512, 512).png().toFile(pwa512Path);
  console.log('✅ Created:', pwa512Path);

  // 3. Generate favicon.ico (Sharp can write png which browsers accept as .ico, or copy 32x32)
  const icoPath = path.join(publicDir, 'favicon.ico');
  await sharp(svgBuffer).resize(48, 48).toFormat('png').toFile(icoPath);
  console.log('✅ Created:', icoPath);

  console.log('\n🎉 ALL GLAMGO FAVICONS GENERATED SUCCESSFULLY!');
}

generateFavicons();
