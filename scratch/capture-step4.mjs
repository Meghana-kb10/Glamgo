import { Browser, sleep } from 'file:///e:/Projects/Glamgo/.agent/skills/design-taste-frontend/scripts/lib/cdp.mjs';
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/kbmeg/.gemini/antigravity/brain/145550f3-6823-4159-a4aa-49c62d1d6c62';

async function captureAll() {
  console.log('=== CAPTURING STEP 4 SCREENSHOTS ===\n');

  // 1. DESKTOP CAPTURES (1280px)
  console.log('1. Launching Desktop browser (1280x900)...');
  const browser = await Browser.launch({ width: 1280, height: 900 });
  const page = await browser.newPage({ width: 1280, height: 900 });

  await page.goto('http://localhost:3000', { settleMs: 1500 });

  // A. Booking Wizard Step 1
  console.log('-> Opening Booking Drawer (Step 1)...');
  await page.eval(() => {
    const cartBtn = document.querySelector('button[aria-label^="Shopping Cart"]');
    if (cartBtn) cartBtn.click();
  });
  await sleep(1000);
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'step4-desktop-booking-wizard-step1-1280.jpg'),
    format: 'jpeg',
    quality: 85,
  });
  console.log('   Saved step4-desktop-booking-wizard-step1-1280.jpg');

  // B. Booking Wizard Step 2 (Select Beauty Specialist)
  console.log('-> Navigating to Step 2 (Select Beauty Specialist)...');
  await page.eval(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Choose Beauty Specialist') || b.textContent.includes('Continue'));
    if (btn) btn.click();
  });
  await sleep(800);
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'step4-desktop-booking-wizard-step2-1280.jpg'),
    format: 'jpeg',
    quality: 85,
  });
  console.log('   Saved step4-desktop-booking-wizard-step2-1280.jpg');

  // C. Booking Wizard Step 3 (Select Date & Time Slot)
  console.log('-> Navigating to Step 3 (Select Date & Time)...');
  await page.eval(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Select Date & Time') || b.textContent.includes('Continue'));
    if (btn) btn.click();
  });
  await sleep(800);
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'step4-desktop-booking-wizard-step3-1280.jpg'),
    format: 'jpeg',
    quality: 85,
  });
  console.log('   Saved step4-desktop-booking-wizard-step3-1280.jpg');

  // D. Booking Wizard Step 4 (Address & Summary)
  console.log('-> Navigating to Step 4 (Address & Review Summary)...');
  await page.eval(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Address & Review') || b.textContent.includes('Continue to Review'));
    if (btn) btn.click();
  });
  await sleep(800);
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'step4-desktop-booking-wizard-step4-1280.jpg'),
    format: 'jpeg',
    quality: 85,
  });
  console.log('   Saved step4-desktop-booking-wizard-step4-1280.jpg');

  // E. Booking Confirmation Step 5
  console.log('-> Confirming Booking to show Confirmation Screen...');
  await page.eval(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Confirm Booking') || b.textContent.includes('Pay'));
    if (btn) btn.click();
  });
  await sleep(1200);
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'step4-desktop-booking-confirmation-1280.jpg'),
    format: 'jpeg',
    quality: 85,
  });
  console.log('   Saved step4-desktop-booking-confirmation-1280.jpg');

  // Close Booking Drawer
  await page.eval(() => {
    const closeBtn = document.querySelector('button[aria-label="Close"]');
    if (closeBtn) closeBtn.click();
  });
  await sleep(500);

  // F. Customer Bookings Modal (Upcoming Tab with Timeline)
  console.log('-> Opening Customer Bookings Modal (Upcoming)...');
  await page.eval(() => {
    const bookingsLink = Array.from(document.querySelectorAll('button, a')).find(b => b.textContent.includes('My Bookings') || b.textContent.includes('Bookings'));
    if (bookingsLink) bookingsLink.click();
  });
  await sleep(1000);
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'step4-desktop-customer-bookings-upcoming-1280.jpg'),
    format: 'jpeg',
    quality: 85,
  });
  console.log('   Saved step4-desktop-customer-bookings-upcoming-1280.jpg');

  // G. Customer Bookings Modal (Completed Tab with Rating & Review)
  console.log('-> Switching to Completed Tab in Bookings Modal...');
  await page.eval(() => {
    const completedTab = Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim().startsWith('Completed'));
    if (completedTab) completedTab.click();
  });
  await sleep(800);
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'step4-desktop-customer-bookings-completed-1280.jpg'),
    format: 'jpeg',
    quality: 85,
  });
  console.log('   Saved step4-desktop-customer-bookings-completed-1280.jpg');

  // Close Bookings Modal
  await page.eval(() => {
    const closeBtn = document.querySelector('button[aria-label="Close dialog"], button[aria-label="Close"]');
    if (closeBtn) closeBtn.click();
  });
  await sleep(500);

  // H. Customer Profile Modal (Personal Details)
  console.log('-> Opening Customer Profile Modal...');
  await page.eval(() => {
    const profileLink = Array.from(document.querySelectorAll('button, a')).find(b => b.textContent.includes('Profile') || b.textContent.includes('Account'));
    if (profileLink) profileLink.click();
  });
  await sleep(1000);
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'step4-desktop-customer-profile-details-1280.jpg'),
    format: 'jpeg',
    quality: 85,
  });
  console.log('   Saved step4-desktop-customer-profile-details-1280.jpg');

  // I. Customer Profile Modal (Saved Addresses)
  console.log('-> Switching to Saved Addresses tab...');
  await page.eval(() => {
    const tab = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Addresses'));
    if (tab) tab.click();
  });
  await sleep(800);
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'step4-desktop-customer-profile-addresses-1280.jpg'),
    format: 'jpeg',
    quality: 85,
  });
  console.log('   Saved step4-desktop-customer-profile-addresses-1280.jpg');

  // J. Customer Profile Modal (Terms & Conditions)
  console.log('-> Switching to Terms & Conditions tab...');
  await page.eval(() => {
    const tab = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Terms & Conditions') || b.textContent.includes('Terms'));
    if (tab) tab.click();
  });
  await sleep(800);
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'step4-desktop-customer-profile-terms-1280.jpg'),
    format: 'jpeg',
    quality: 85,
  });
  console.log('   Saved step4-desktop-customer-profile-terms-1280.jpg');

  // Close Profile Modal
  await page.eval(() => {
    const closeBtn = document.querySelector('button[aria-label="Close dialog"], button[aria-label="Close"]');
    if (closeBtn) closeBtn.click();
  });
  await sleep(500);

  // 2. TABLET CAPTURE (768px)
  console.log('\n2. Switching to Tablet Viewport (768x1024)...');
  await page.setViewport({ width: 768, height: 1024 });
  await page.goto('http://localhost:3000', { settleMs: 1200 });

  // Open cart in tablet
  await page.eval(() => {
    const cartBtn = document.querySelector('button[aria-label^="Shopping Cart"]');
    if (cartBtn) cartBtn.click();
  });
  await sleep(800);
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'step4-tablet-booking-wizard-step1-768.jpg'),
    format: 'jpeg',
    quality: 85,
  });
  console.log('   Saved step4-tablet-booking-wizard-step1-768.jpg');

  // 3. MOBILE CAPTURE (375px)
  console.log('\n3. Switching to Mobile Viewport (375x812)...');
  await page.setViewport({ width: 375, height: 812 });
  await page.goto('http://localhost:3000', { settleMs: 1200 });

  // Mobile Booking Drawer Step 1
  console.log('-> Opening Mobile Cart Bottom Sheet (Step 1)...');
  await page.eval(() => {
    const cartBtn = document.querySelector('button[aria-label^="Shopping Cart"]');
    if (cartBtn) cartBtn.click();
  });
  await sleep(800);
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'step4-mobile-booking-wizard-step1-375.jpg'),
    format: 'jpeg',
    quality: 85,
  });
  console.log('   Saved step4-mobile-booking-wizard-step1-375.jpg');

  // Mobile Booking Drawer Step 3 (Date & Slot)
  console.log('-> Navigating to Step 3 on Mobile...');
  await page.eval(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Choose Beauty Specialist') || b.textContent.includes('Continue'));
    if (btn) btn.click();
  });
  await sleep(600);
  await page.eval(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Select Date & Time') || b.textContent.includes('Continue'));
    if (btn) btn.click();
  });
  await sleep(800);
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'step4-mobile-booking-wizard-step3-375.jpg'),
    format: 'jpeg',
    quality: 85,
  });
  console.log('   Saved step4-mobile-booking-wizard-step3-375.jpg');

  // Mobile Booking Confirmation Screen
  console.log('-> Navigating to Confirmation on Mobile...');
  await page.eval(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Address & Review') || b.textContent.includes('Continue'));
    if (btn) btn.click();
  });
  await sleep(600);
  await page.eval(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Confirm Booking') || b.textContent.includes('Pay'));
    if (btn) btn.click();
  });
  await sleep(1000);
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'step4-mobile-booking-confirmation-375.jpg'),
    format: 'jpeg',
    quality: 85,
  });
  console.log('   Saved step4-mobile-booking-confirmation-375.jpg');

  // Close mobile drawer
  await page.eval(() => {
    const closeBtn = document.querySelector('button[aria-label="Close"]');
    if (closeBtn) closeBtn.click();
  });
  await sleep(500);

  // Mobile Bookings Timeline
  console.log('-> Opening Bookings Modal on Mobile...');
  await page.eval(() => {
    const bookingsLink = Array.from(document.querySelectorAll('button, a')).find(b => b.textContent.includes('Bookings'));
    if (bookingsLink) bookingsLink.click();
  });
  await sleep(800);
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'step4-mobile-customer-bookings-timeline-375.jpg'),
    format: 'jpeg',
    quality: 85,
  });
  console.log('   Saved step4-mobile-customer-bookings-timeline-375.jpg');

  // Close bookings modal
  await page.eval(() => {
    const closeBtn = document.querySelector('button[aria-label="Close dialog"], button[aria-label="Close"]');
    if (closeBtn) closeBtn.click();
  });
  await sleep(500);

  // Mobile Profile
  console.log('-> Opening Profile Modal on Mobile...');
  await page.eval(() => {
    const profileLink = Array.from(document.querySelectorAll('button, a')).find(b => b.textContent.includes('Profile') || b.textContent.includes('Account'));
    if (profileLink) profileLink.click();
  });
  await sleep(800);
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'step4-mobile-customer-profile-375.jpg'),
    format: 'jpeg',
    quality: 85,
  });
  console.log('   Saved step4-mobile-customer-profile-375.jpg');

  await browser.close();
  console.log('\n=== ALL SCREENSHOTS CAPTURED SUCCESSFULLY ===');
}

captureAll().catch(err => {
  console.error('Error during screenshot capture:', err);
  process.exit(1);
});
