import { Browser, sleep } from 'file:///e:/Projects/Glamgo/.agent/skills/design-taste-frontend/scripts/lib/cdp.mjs';

async function debugCategory() {
  const browser = await Browser.launch({ width: 1280, height: 950 });
  const page = await browser.newPage({ width: 1280, height: 950 });

  await page.goto('http://localhost:3000', { settleMs: 500 });
  await page.eval(() => {
    localStorage.clear();
    localStorage.setItem('glamgo_onboarding_completed', 'true');
    localStorage.setItem('glamgo_has_onboarded', 'true');
    localStorage.setItem('glamgo_audience', 'women');
  });
  await page.goto('http://localhost:3000', { settleMs: 800 });
  await sleep(1000);

  // Click category tile
  await page.eval(() => {
    const tiles = Array.from(document.querySelectorAll('button'));
    const hairTile = tiles.find(b => b.textContent.includes('Salon for Women') || b.textContent.includes('Hair Care'));
    if (hairTile) hairTile.click();
  });
  await sleep(1000);

  const buttons = await page.eval(() => {
    return Array.from(document.querySelectorAll('button')).map(b => ({
      text: b.textContent.trim(),
      aria: b.getAttribute('aria-label'),
      className: b.className
    })).slice(0, 30);
  });
  console.log('Buttons on Category Page:\n', buttons);

  await browser.close();
}

debugCategory().catch(console.error);
