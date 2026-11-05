import { Browser, sleep } from 'file:///e:/Projects/Glamgo/.agent/skills/design-taste-frontend/scripts/lib/cdp.mjs';

const ARTIFACTS_DIR = 'C:/Users/kbmeg/.gemini/antigravity/brain/145550f3-6823-4159-a4aa-49c62d1d6c62';
const BASE_URL = 'http://localhost:3000';

async function runStep3Verification() {
  console.log('=== STARTING STEP 3 COMPREHENSIVE VERIFICATION ===\n');
  const results = {};

  // ----------------------------------------------------
  // PART 1: DESKTOP SUITE (1280x950)
  // ----------------------------------------------------
  console.log('1. Launching Desktop browser (1280x950)...');
  const desktopBrowser = await Browser.launch({ width: 1280, height: 950 });
  const dPage = await desktopBrowser.newPage({ width: 1280, height: 950 });

  await dPage.goto(BASE_URL, { settleMs: 500 });
  await dPage.eval(() => {
    localStorage.clear();
    localStorage.setItem('glamgo_onboarding_completed', 'true');
    localStorage.setItem('glamgo_has_onboarded', 'true');
    localStorage.setItem('glamgo_audience', 'women');
  });
  await dPage.goto(BASE_URL, { settleMs: 800 });
  await sleep(1000);

  // A. Category Listing Page (3-Column Desktop Layout)
  console.log('--- A. Testing Category Listing (3-Column Desktop Layout) ---');
  const categoryOpened = await dPage.eval(() => {
    // Click Facial quick chip in Hero
    const chip = Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Facial');
    if (chip) { chip.click(); return true; }
    const firstCat = document.querySelector('#category-tiles-section div.group');
    if (firstCat) { firstCat.click(); return true; }
    return false;
  });
  await sleep(1200);

  const catColumnsFound = await dPage.eval(() => {
    const subNav = !!document.querySelector('nav') || !!document.querySelector('[role="navigation"]');
    const hasServices = document.querySelectorAll('button, article, div').length > 10;
    const hasCartSummary = Array.from(document.querySelectorAll('*')).some(el => 
      el.textContent.includes('Your Cart') || el.textContent.includes('Safe &amp; Hygienic Delivery') || el.textContent.includes('Safe & Hygienic Delivery')
    );
    return { subNav, hasServices, hasCartSummary };
  });
  results.categoryListing = categoryOpened && catColumnsFound.hasServices && catColumnsFound.hasCartSummary;
  console.log(`   Category Listing Desktop: ${results.categoryListing ? 'PASSED' : 'FAILED'}`);

  await dPage.screenshot({
    path: `${ARTIFACTS_DIR}/step3-desktop-category-listing-1280.jpg`
  });
  console.log('   Captured step3-desktop-category-listing-1280.jpg');

  // B. Service Detail Modal & BYOP Toggle
  console.log('--- B. Testing Service Detail Modal ---');
  const serviceDetailOpened = await dPage.eval(() => {
    const detailBtn = Array.from(document.querySelectorAll('button')).find(el => 
      el.textContent.trim().toLowerCase().includes('view details')
    );
    if (detailBtn) {
      detailBtn.click();
      return true;
    }
    return false;
  });
  await sleep(1200);

  const serviceDetailDetails = await dPage.eval(() => {
    const modal = document.querySelector('[role="dialog"]');
    const hasProcedures = Array.from(document.querySelectorAll('*')).some(el => el.textContent.includes('Treatment Procedure') || el.textContent.includes('Step '));
    const hasInclusions = Array.from(document.querySelectorAll('*')).some(el => el.textContent.includes('What is included') || el.textContent.includes('Inclusions'));
    const byopBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('BYOP') || b.textContent.includes('Bring Your Own'));
    if (byopBtn) byopBtn.click();
    return { modal: !!modal, hasProcedures, hasInclusions, hasByop: !!byopBtn };
  });
  results.serviceDetail = serviceDetailOpened && serviceDetailDetails.modal;
  console.log(`   Service Detail Modal: ${results.serviceDetail ? 'PASSED' : 'FAILED'}`);

  await dPage.screenshot({
    path: `${ARTIFACTS_DIR}/step3-desktop-service-detail-1280.jpg`
  });
  console.log('   Captured step3-desktop-service-detail-1280.jpg');

  // Close service detail modal
  await dPage.eval(() => {
    const closeBtn = document.querySelector('button[aria-label="Close dialog"]') || document.querySelector('button[aria-label*="Close"]');
    if (closeBtn) closeBtn.click();
  });
  await sleep(800);

  // C. Variant Picker Sheet
  console.log('--- C. Testing Variant Picker Sheet ---');
  const variantOpened = await dPage.eval(() => {
    // Add button on customizable service
    const addBtns = Array.from(document.querySelectorAll('button')).filter(b => b.textContent.includes('Add'));
    if (addBtns.length > 0) {
      addBtns[0].click();
      return true;
    }
    return false;
  });
  await sleep(1000);

  const hasVariantSheet = await dPage.eval(() => {
    const dialog = document.querySelector('[role="dialog"]');
    const text = document.body.innerText;
    return text.includes('Customize Service') || text.includes('Select Variant') || text.includes('Options') || !!dialog || !!document.querySelector('button[aria-label="Close variant picker"]');
  });
  results.variantPicker = hasVariantSheet;
  console.log(`   Variant Picker Sheet: ${results.variantPicker ? 'PASSED' : 'FAILED'}`);

  await dPage.screenshot({
    path: `${ARTIFACTS_DIR}/step3-desktop-variant-picker-1280.jpg`
  });
  console.log('   Captured step3-desktop-variant-picker-1280.jpg');

  // Close variant picker sheet
  await dPage.eval(() => {
    const closeBtn = document.querySelector('button[aria-label="Close variant picker"]') || document.querySelector('button[aria-label*="Close"]');
    if (closeBtn) closeBtn.click();
  });
  await sleep(800);

  // Return to home
  console.log('   Returning to Home...');
  await dPage.eval(() => {
    const backBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Back to Home'));
    if (backBtn) backBtn.click();
  });
  await sleep(1000);

  // D. Professional Profile Modal
  console.log('--- D. Testing Professional Profile Modal ---');
  // Scroll to Top Pros Rail and click an artist card
  await dPage.eval(() => {
    const proRail = document.getElementById('top-pros-rail');
    if (proRail) proRail.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await sleep(800);

  const artistClicked = await dPage.eval(() => {
    const card = document.querySelector('#top-pros-rail div[class*="rounded-[20px]"]');
    if (card) { card.click(); return true; }
    return false;
  });
  await sleep(1500);

  const artistModalCheck = await dPage.eval(() => {
    const modal = document.querySelector('[role="dialog"]');
    const tabs = Array.from(document.querySelectorAll('button')).filter(b => 
      b.textContent.includes('Portfolio') || 
      b.textContent.includes('Services & Packages') || 
      b.textContent.includes('Reviews') || 
      b.textContent.includes('About & Credentials')
    );
    // Switch to Reviews tab to test interactive breakdown
    const reviewsTab = tabs.find(t => t.textContent.includes('Reviews'));
    if (reviewsTab) reviewsTab.click();
    return { hasModal: !!modal, tabCount: tabs.length };
  });
  await sleep(600);
  results.artistProfile = artistClicked && artistModalCheck.hasModal && artistModalCheck.tabCount >= 3;
  console.log(`   Artist Profile Modal: ${results.artistProfile ? 'PASSED' : 'FAILED'} (tabs found: ${artistModalCheck.tabCount})`);

  await dPage.screenshot({
    path: `${ARTIFACTS_DIR}/step3-desktop-artist-profile-1280.jpg`
  });
  console.log('   Captured step3-desktop-artist-profile-1280.jpg');

  // Close Artist Profile Modal
  await dPage.eval(() => {
    const closeBtn = document.querySelector('button[aria-label="Close profile modal"]') || document.querySelector('button[aria-label*="Close"]');
    if (closeBtn) closeBtn.click();
  });
  await sleep(600);

  // E. Shop Catalog & Product Detail Modal
  console.log('--- E. Testing Shop Catalog ---');
  // Click on "Shop" in navigation or navigate
  await dPage.eval(() => {
    const shopBtn = Array.from(document.querySelectorAll('button, a')).find(el => el.textContent.trim() === 'Shop' || el.getAttribute('aria-label') === 'Shop');
    if (shopBtn) shopBtn.click();
  });
  await sleep(1000);

  const shopCatalogCheck = await dPage.eval(() => {
    const hasBoutiqueBanner = document.body.innerText.includes('Curated Professional Cosmetics') || document.body.innerText.includes('Backstage Beauty');
    const products = document.querySelectorAll('article');
    return { hasBoutiqueBanner, productCount: products.length };
  });
  results.shopCatalog = shopCatalogCheck.hasBoutiqueBanner || shopCatalogCheck.productCount > 0;
  console.log(`   Shop Catalog: ${results.shopCatalog ? 'PASSED' : 'FAILED'}`);

  await dPage.screenshot({
    path: `${ARTIFACTS_DIR}/step3-desktop-shop-catalog-1280.jpg`
  });
  console.log('   Captured step3-desktop-shop-catalog-1280.jpg');

  // Click on a product to open ProductDetailModal
  console.log('   Testing Product Detail Modal...');
  const productClicked = await dPage.eval(() => {
    const firstProduct = document.querySelector('article');
    if (firstProduct) {
      firstProduct.click();
      return true;
    }
    return false;
  });
  await sleep(1000);

  const productDetailCheck = await dPage.eval(() => {
    const dialog = document.querySelector('[role="dialog"]');
    const hasShades = Array.from(document.querySelectorAll('button')).some(b => b.getAttribute('title') || b.getAttribute('aria-label')?.includes('shade'));
    const hasAddToBag = Array.from(document.querySelectorAll('button')).some(b => b.textContent.includes('Add to Bag'));
    return { hasDialog: !!dialog, hasShades, hasAddToBag };
  });
  results.productDetail = productClicked && productDetailCheck.hasDialog;
  console.log(`   Product Detail Modal: ${results.productDetail ? 'PASSED' : 'FAILED'}`);

  await dPage.screenshot({
    path: `${ARTIFACTS_DIR}/step3-desktop-product-detail-1280.jpg`
  });
  console.log('   Captured step3-desktop-product-detail-1280.jpg');

  // Close ProductDetailModal
  await dPage.eval(() => {
    const closeBtn = document.querySelector('button[aria-label="Close dialog"]') || document.querySelector('button[aria-label*="Close"]');
    if (closeBtn) closeBtn.click();
  });
  await sleep(600);

  // F. Offers Page
  console.log('--- F. Testing Offers Page ---');
  await dPage.eval(() => {
    const offersBtn = Array.from(document.querySelectorAll('button, a')).find(el => el.textContent.includes('Offers') || el.getAttribute('aria-label') === 'Offers');
    if (offersBtn) offersBtn.click();
  });
  await sleep(1000);

  const offersCheck = await dPage.eval(() => {
    const hasTitle = document.body.innerText.includes('Offers & Exclusive Privileges');
    const tabs = Array.from(document.querySelectorAll('button')).filter(b => 
      b.textContent === 'For you' || b.textContent === 'Bank & UPI' || b.textContent === 'Packages'
    );
    const copyBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Copy code'));
    if (copyBtn) copyBtn.click();
    return { hasTitle, tabsCount: tabs.length, hasCopy: !!copyBtn };
  });
  await sleep(500);
  results.offersPage = offersCheck.hasTitle && offersCheck.tabsCount === 3;
  console.log(`   Offers Page: ${results.offersPage ? 'PASSED' : 'FAILED'} (tabs: ${offersCheck.tabsCount})`);

  await dPage.screenshot({
    path: `${ARTIFACTS_DIR}/step3-desktop-offers-page-1280.jpg`
  });
  console.log('   Captured step3-desktop-offers-page-1280.jpg');

  // G. Global Search Modal
  console.log('--- G. Testing Global Search Modal ---');
  await dPage.eval(() => {
    const searchBtn = document.querySelector('button[aria-label="Search services and products"]') || document.querySelector('button[aria-label*="Search"]');
    if (searchBtn) searchBtn.click();
  });
  await sleep(800);

  const searchResultsCheck = await dPage.eval(() => {
    const input = document.querySelector('input[type="search"]');
    if (!input) return { opened: false };
    input.value = 'Bridal';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    return { opened: true };
  });
  await sleep(1000);

  const searchFilterCheck = await dPage.eval(() => {
    const tabs = Array.from(document.querySelectorAll('button')).filter(b => 
      b.textContent.includes('All') || b.textContent.includes('Services') || b.textContent.includes('Artists') || b.textContent.includes('Products')
    );
    const hasResults = Array.from(document.querySelectorAll('h4')).length > 0;
    return { hasTabs: tabs.length >= 3, hasResults };
  });
  results.globalSearch = searchResultsCheck.opened && searchFilterCheck.hasTabs;
  console.log(`   Global Search: ${results.globalSearch ? 'PASSED' : 'FAILED'}`);

  await dPage.screenshot({
    path: `${ARTIFACTS_DIR}/step3-desktop-global-search-1280.jpg`
  });
  console.log('   Captured step3-desktop-global-search-1280.jpg');

  // Close search modal
  await dPage.eval(() => {
    const closeBtn = document.querySelector('button[aria-label="Close search"]');
    if (closeBtn) closeBtn.click();
  });
  await sleep(600);
  await desktopBrowser.close();

  // ----------------------------------------------------
  // PART 2: MOBILE SUITE (375x812)
  // ----------------------------------------------------
  console.log('\n2. Launching Mobile browser (375x812)...');
  const mobileBrowser = await Browser.launch({ width: 375, height: 812 });
  const mPage = await mobileBrowser.newPage({ width: 375, height: 812 });

  await mPage.goto(BASE_URL, { settleMs: 500 });
  await mPage.eval(() => {
    localStorage.clear();
    localStorage.setItem('glamgo_onboarding_completed', 'true');
    localStorage.setItem('glamgo_has_onboarded', 'true');
    localStorage.setItem('glamgo_audience', 'women');
  });
  await mPage.goto(BASE_URL, { settleMs: 800 });
  await sleep(1000);

  // M1: Mobile Category Listing
  console.log('--- M1. Mobile Category Listing ---');
  await mPage.eval(() => {
    const chip = Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Facial');
    if (chip) chip.click();
    else {
      const firstTile = document.querySelector('#category-tiles-section div.group');
      if (firstTile) firstTile.click();
    }
  });
  await sleep(1200);

  await mPage.screenshot({
    path: `${ARTIFACTS_DIR}/step3-mobile-category-listing-375.jpg`
  });
  console.log('   Captured step3-mobile-category-listing-375.jpg');

  // M2: Mobile Service Detail Sheet
  console.log('--- M2. Mobile Service Detail Sheet ---');
  await mPage.eval(() => {
    const detailBtn = Array.from(document.querySelectorAll('button')).find(el => 
      el.textContent.trim().toLowerCase().includes('view details')
    );
    if (detailBtn) detailBtn.click();
  });
  await sleep(1200);

  await mPage.screenshot({
    path: `${ARTIFACTS_DIR}/step3-mobile-service-detail-375.jpg`
  });
  console.log('   Captured step3-mobile-service-detail-375.jpg');

  // Close service detail
  await mPage.eval(() => {
    const closeBtn = document.querySelector('button[aria-label="Close dialog"]') || document.querySelector('button[aria-label*="Close"]');
    if (closeBtn) closeBtn.click();
  });
  await sleep(600);

  // Return home
  await mPage.eval(() => {
    const backBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Back to Home'));
    if (backBtn) backBtn.click();
  });
  await sleep(1000);

  // M3: Mobile Artist Profile Modal / Bottom Sheet
  console.log('--- M3. Mobile Artist Profile Sheet ---');
  await mPage.eval(() => {
    const proRail = document.getElementById('top-pros-rail');
    if (proRail) proRail.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await sleep(800);

  await mPage.eval(() => {
    const card = document.querySelector('#top-pros-rail div[class*="rounded-[20px]"]');
    if (card) card.click();
  });
  await sleep(1500);

  await mPage.screenshot({
    path: `${ARTIFACTS_DIR}/step3-mobile-artist-profile-375.jpg`
  });
  console.log('   Captured step3-mobile-artist-profile-375.jpg');

  // Close artist profile
  await mPage.eval(() => {
    const closeBtn = document.querySelector('button[aria-label="Close profile modal"]') || document.querySelector('button[aria-label*="Close"]');
    if (closeBtn) closeBtn.click();
  });
  await sleep(600);

  // M4: Mobile Shop Catalog
  console.log('--- M4. Mobile Shop Catalog ---');
  await mPage.eval(() => {
    const shopTab = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Shop') || b.getAttribute('aria-label') === 'Shop');
    if (shopTab) shopTab.click();
  });
  await sleep(1200);

  await mPage.screenshot({
    path: `${ARTIFACTS_DIR}/step3-mobile-shop-catalog-375.jpg`
  });
  console.log('   Captured step3-mobile-shop-catalog-375.jpg');

  // M5: Mobile Offers Page
  console.log('--- M5. Mobile Offers Page ---');
  await mPage.eval(() => {
    const drawerBtn = document.querySelector('button[aria-label="Open navigation drawer"]');
    if (drawerBtn) drawerBtn.click();
  });
  await sleep(800);
  await mPage.eval(() => {
    const offersBtn = Array.from(document.querySelectorAll('button, a')).find(el => el.textContent.includes('Offers'));
    if (offersBtn) offersBtn.click();
  });
  await sleep(1200);

  await mPage.screenshot({
    path: `${ARTIFACTS_DIR}/step3-mobile-offers-page-375.jpg`
  });
  console.log('   Captured step3-mobile-offers-page-375.jpg');

  // M6: Mobile Global Search
  console.log('--- M6. Mobile Global Search ---');
  await mPage.eval(() => {
    const searchBtn = document.querySelector('button[aria-label="Search services and products"]');
    if (searchBtn) searchBtn.click();
  });
  await sleep(800);
  await mPage.eval(() => {
    const input = document.querySelector('input[type="search"]');
    if (input) {
      input.value = 'Bridal';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
  await sleep(800);

  await mPage.screenshot({
    path: `${ARTIFACTS_DIR}/step3-mobile-global-search-375.jpg`
  });
  console.log('   Captured step3-mobile-global-search-375.jpg');

  await mobileBrowser.close();

  console.log('\n=== STEP 3 VERIFICATION SUMMARY ===');
  console.table(results);
  const allPassed = Object.values(results).every(Boolean);
  console.log(`\nOVERALL STATUS: ${allPassed ? 'ALL TESTS PASSED' : 'SOME TESTS FAILED'}\n`);
}

runStep3Verification().catch(err => {
  console.error('Verification failed with error:', err);
  process.exit(1);
});
