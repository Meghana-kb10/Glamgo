import { execSync } from 'child_process';
import fs from 'fs';

const DESKTOP_OUT = 'C:/Users/kbmeg/.gemini/antigravity/brain/145550f3-6823-4159-a4aa-49c62d1d6c62/scratch/lh-step4-desktop.json';
const MOBILE_OUT = 'C:/Users/kbmeg/.gemini/antigravity/brain/145550f3-6823-4159-a4aa-49c62d1d6c62/scratch/lh-step4-mobile.json';

console.log('=== RUNNING LIGHTHOUSE AUDITS FOR STEP 4 ===\n');

try {
  console.log('1. Running Desktop Lighthouse audit on http://localhost:4173...');
  execSync(
    `npx lighthouse http://localhost:4173 --preset=desktop --output=json --output-path="${DESKTOP_OUT}" --chrome-flags="--headless=new --no-sandbox"`,
    { encoding: 'utf8', timeout: 120000, stdio: 'inherit' }
  );

  const dData = JSON.parse(fs.readFileSync(DESKTOP_OUT, 'utf8'));
  console.log('\n--- DESKTOP LIGHTHOUSE SCORES ---');
  console.log(`Performance:    ${Math.round(dData.categories.performance?.score * 100)}/100`);
  console.log(`Accessibility:  ${Math.round(dData.categories.accessibility?.score * 100)}/100`);
  console.log(`Best Practices: ${Math.round(dData.categories['best-practices']?.score * 100)}/100`);
  console.log(`SEO:            ${Math.round(dData.categories.seo?.score * 100)}/100`);
  console.log(`FCP: ${dData.audits['first-contentful-paint']?.displayValue}`);
  console.log(`LCP: ${dData.audits['largest-contentful-paint']?.displayValue}`);
  console.log(`TBT: ${dData.audits['total-blocking-time']?.displayValue}`);
  console.log(`CLS: ${dData.audits['cumulative-layout-shift']?.displayValue}`);
} catch (e) {
  console.error('Desktop Lighthouse error:', e.message);
}

try {
  console.log('\n2. Running Mobile Lighthouse audit on http://localhost:4173...');
  execSync(
    `npx lighthouse http://localhost:4173 --form-factor=mobile --screenEmulation.mobile=true --output=json --output-path="${MOBILE_OUT}" --chrome-flags="--headless=new --no-sandbox"`,
    { encoding: 'utf8', timeout: 120000, stdio: 'inherit' }
  );

  const mData = JSON.parse(fs.readFileSync(MOBILE_OUT, 'utf8'));
  console.log('\n--- MOBILE LIGHTHOUSE SCORES ---');
  console.log(`Performance:    ${Math.round(mData.categories.performance?.score * 100)}/100`);
  console.log(`Accessibility:  ${Math.round(mData.categories.accessibility?.score * 100)}/100`);
  console.log(`Best Practices: ${Math.round(mData.categories['best-practices']?.score * 100)}/100`);
  console.log(`SEO:            ${Math.round(mData.categories.seo?.score * 100)}/100`);
  console.log(`FCP: ${mData.audits['first-contentful-paint']?.displayValue}`);
  console.log(`LCP: ${mData.audits['largest-contentful-paint']?.displayValue}`);
  console.log(`TBT: ${mData.audits['total-blocking-time']?.displayValue}`);
  console.log(`CLS: ${mData.audits['cumulative-layout-shift']?.displayValue}`);
} catch (e) {
  console.error('Mobile Lighthouse error:', e.message);
}
