import { Browser, sleep } from 'file:///e:/Projects/Glamgo/.agent/skills/design-taste-frontend/scripts/lib/cdp.mjs';

async function test() {
  const browser = await Browser.launch({ width: 1280, height: 950 });
  const page = await browser.newPage({ width: 1280, height: 950 });
  await page.goto('http://localhost:3000', { settleMs: 1000 });

  // Click Facial quick chip in Hero
  const clicked = await page.eval(() => {
    const chip = Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Facial');
    if (chip) { chip.click(); return true; }
    return false;
  });
  console.log('Facial chip clicked:', clicked);
  await sleep(1200);

  const state = await page.eval(() => {
    const title = document.querySelector('h1')?.textContent;
    const viewDetailsButtons = Array.from(document.querySelectorAll('button')).filter(b => b.textContent.includes('View details'));
    return { title, viewDetailsCount: viewDetailsButtons.length };
  });
  console.log('Category page state:', state);

  // Click View details on first service
  const detailClicked = await page.eval(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('View details'));
    if (btn) { btn.click(); return true; }
    return false;
  });
  console.log('View details clicked:', detailClicked);
  await sleep(1000);

  const modalState = await page.eval(() => {
    const dialog = document.querySelector('[role="dialog"]');
    const text = dialog ? dialog.innerText.slice(0, 200) : null;
    return { dialog: !!dialog, text };
  });
  console.log('Service Detail Modal state:', modalState);

  await browser.close();
}

test().catch(console.error);
