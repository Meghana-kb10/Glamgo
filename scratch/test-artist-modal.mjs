import { Browser, sleep } from 'file:///e:/Projects/Glamgo/.agent/skills/design-taste-frontend/scripts/lib/cdp.mjs';

async function testArtist() {
  const browser = await Browser.launch({ width: 1280, height: 950 });
  const page = await browser.newPage({ width: 1280, height: 950 });
  await page.goto('http://localhost:3000', { settleMs: 1000 });

  // Scroll to Top Pros Rail
  await page.eval(() => {
    const rail = document.getElementById('top-pros-rail');
    if (rail) rail.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await sleep(800);

  // Click first professional card
  const clicked = await page.eval(() => {
    const card = document.querySelector('#top-pros-rail div[class*="rounded-[20px]"]');
    if (card) { card.click(); return true; }
    return false;
  });
  console.log('Top pro card clicked:', clicked);
  await sleep(1500);

  const modalState = await page.eval(() => {
    const dialog = document.querySelector('[role="dialog"]');
    const title = document.querySelector('#artist-profile-title')?.textContent;
    const tabs = Array.from(document.querySelectorAll('button')).filter(b => 
      b.textContent.includes('Portfolio') || 
      b.textContent.includes('Services & Packages') || 
      b.textContent.includes('Reviews') || 
      b.textContent.includes('About & Credentials')
    ).map(b => b.textContent.trim());
    return { dialog: !!dialog, title, tabs };
  });
  console.log('Artist Modal State:', modalState);

  await browser.close();
}

testArtist().catch(console.error);
