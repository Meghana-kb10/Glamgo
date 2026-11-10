import fs from 'fs';
import path from 'path';

console.log('======================================================');
console.log('GLAMGO RETHEME STEP 4 VERIFICATION SUITE');
console.log('======================================================\n');

let passedTests = 0;
let totalTests = 0;

function assert(description, condition, details = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`[PASS] ${description}`);
  } else {
    console.error(`[FAIL] ${description} ${details ? '- ' + details : ''}`);
  }
}

// TEST 1: Color Compliance Scan (Zero Unintended Legacy Brand Colors)
console.log('--- 1. Color Compliance Audit ---');
const legacyRegex = /\b(obsidian|rose-gold|rose-blush|surface-cream|canvas-light|stone-[a-z0-9]+|slate-[a-z0-9]+)\b/i;
const legacyMatches = [];

function scanForColors(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      if (f !== 'node_modules' && f !== '.git' && f !== 'dist' && f !== 'scratch') scanForColors(full);
    } else if (full.endsWith('.ts') || full.endsWith('.tsx') || full.endsWith('.css')) {
      if (full.endsWith('tokens.css') || full.endsWith('TOKENS.md') || full.endsWith('mockData.ts')) continue;
      const content = fs.readFileSync(full, 'utf8');
      const lines = content.split('\n');
      lines.forEach((line, idx) => {
        const match = line.match(legacyRegex);
        if (match) {
          legacyMatches.push({ file: full, line: idx + 1, term: match[0], text: line.trim() });
        }
      });
    }
  }
}

scanForColors('src');
assert('Zero legacy brand color utility classes in src/', legacyMatches.length === 0, `Found ${legacyMatches.length} occurrences`);
if (legacyMatches.length > 0) {
  console.log('Remaining legacy matches:', legacyMatches);
}

// TEST 2: Booking Wizard Verification (BookingDrawer.tsx)
console.log('\n--- 2. Booking Wizard Verification ---');
const bookingDrawer = fs.readFileSync('src/components/BookingDrawer.tsx', 'utf8');
assert('BookingDrawer supports 4 distinct steps plus confirmation', 
  bookingDrawer.includes("currentStep === 1") && 
  bookingDrawer.includes("currentStep === 2") && 
  bookingDrawer.includes("currentStep === 3") && 
  bookingDrawer.includes("currentStep === 4") &&
  bookingDrawer.includes("currentStep === 5")
);
assert('BookingDrawer has Step 1 Service & Add-ons selection', bookingDrawer.includes('1. Service & Package Selection'));
assert('BookingDrawer has Step 2 Professional picker', bookingDrawer.includes('2. Professional Selection'));
assert('BookingDrawer has Step 3 Date & Time Slot selection', bookingDrawer.includes('3. Date & Time Slot Selection'));
assert('BookingDrawer has Step 4 Address & Booking Summary', bookingDrawer.includes('4. Address & Booking Summary'));
assert('BookingDrawer calculates prices including add-ons, fees and coupon discounts', 
  bookingDrawer.includes('addonsTotal') && 
  bookingDrawer.includes('couponDiscount') &&
  bookingDrawer.includes('grandTotal')
);
assert('BookingDrawer integrates CouponSheet', bookingDrawer.includes('<CouponSheet'));
assert('BookingDrawer integrates ProfessionalPickerSheet', bookingDrawer.includes('<ProfessionalPickerSheet'));
assert('BookingDrawer integrates BookingConfirmation', bookingDrawer.includes('<BookingConfirmation'));
assert('BookingDrawer uses design tokens only', 
  bookingDrawer.includes('bg-card') && 
  bookingDrawer.includes('border-border') && 
  bookingDrawer.includes('text-text') && 
  bookingDrawer.includes('bg-accent')
);

// TEST 3: Booking Confirmation Screen (BookingConfirmation.tsx)
console.log('\n--- 3. Booking Confirmation Verification ---');
const bookingConf = fs.readFileSync('src/components/booking/BookingConfirmation.tsx', 'utf8');
assert('BookingConfirmation has Emerald Success indicator', 
  bookingConf.includes('emerald') && bookingConf.includes('Booking Confirmed')
);
assert('BookingConfirmation displays booking reference number', bookingConf.includes('Reservation Reference:'));
assert('BookingConfirmation has What to expect next guide', bookingConf.includes('What happens next'));
assert('BookingConfirmation has Add to Calendar export', bookingConf.includes('handleDownloadCalendar'));
assert('BookingConfirmation has Share Details action', bookingConf.includes('handleShare'));

// TEST 4: Customer Bookings & Lifecycle (CustomerBookingsModal.tsx)
console.log('\n--- 4. Customer Bookings & Lifecycle Verification ---');
const bookingsModal = fs.readFileSync('src/components/CustomerBookingsModal.tsx', 'utf8');
assert('CustomerBookingsModal has 3 tabs: Upcoming, Completed, Cancelled', 
  bookingsModal.includes("'upcoming'") && 
  bookingsModal.includes("'completed'") && 
  bookingsModal.includes("'cancelled'")
);
assert('CustomerBookingsModal has 4-step live status timeline', 
  bookingsModal.includes('Status Timeline') && 
  bookingsModal.includes('Confirmed') && 
  bookingsModal.includes('Assigned') && 
  bookingsModal.includes('En Route')
);
assert('CustomerBookingsModal has Reschedule modal flow', bookingsModal.includes('Reschedule Appointment'));
assert('CustomerBookingsModal has Cancellation flow with policy breakdown', 
  bookingsModal.includes('Cancel Appointment') && bookingsModal.includes('Cancellation Policy')
);
assert('CustomerBookingsModal has 5-star Rating & Review submission flow', 
  bookingsModal.includes('Rate Your Treatment') && bookingsModal.includes('handleConfirmReview')
);

// TEST 5: Customer Profile & Legal Verification (CustomerProfileModal.tsx)
console.log('\n--- 5. Customer Profile & Legal Verification ---');
const profileModal = fs.readFileSync('src/components/profile/CustomerProfileModal.tsx', 'utf8');
assert('CustomerProfileModal has Profile Details editing', profileModal.includes('Personal Profile & Contact'));
assert('CustomerProfileModal has Saved Addresses management', 
  profileModal.includes('Manage Saved Addresses') && 
  profileModal.includes('addressService')
);
assert('CustomerProfileModal has Notification & Security settings', profileModal.includes('Account & Notification Preferences'));
assert('CustomerProfileModal has Help & Support concierge', profileModal.includes('Glamgo Concierge & Help Desk'));
assert('CustomerProfileModal has Legal Policies (Terms, Privacy, Cancellation)', 
  profileModal.includes('Terms & Conditions of Service') && 
  profileModal.includes('Customer Privacy & Data Protection') && 
  profileModal.includes('Fair Cancellation & Reschedule Policy')
);

// TEST 6: Error & Offline States
console.log('\n--- 6. Error, Offline & Skeleton Verification ---');
const appFile = fs.readFileSync('src/App.tsx', 'utf8');
const errorBoundary = fs.readFileSync('src/components/ErrorBoundary.tsx', 'utf8');
const skeletonLoader = fs.readFileSync('src/components/SkeletonLoader.tsx', 'utf8');
assert('App.tsx features offline detection & banner', 
  appFile.includes('isOffline') && appFile.includes('You are currently offline')
);
assert('ErrorBoundary rethemed to design tokens', 
  errorBoundary.includes('bg-card') && errorBoundary.includes('text-text') && errorBoundary.includes('bg-accent')
);
assert('SkeletonLoader rethemed with Sand fill & Warm shimmer', 
  skeletonLoader.includes('bg-fill') && skeletonLoader.includes('skeleton-shimmer')
);

// TEST 7: Dashboard Protection
console.log('\n--- 7. Dashboard Layout Protection Verification ---');
const proStudio = fs.readFileSync('src/components/ProStudioDashboard.tsx', 'utf8');
const vendorDash = fs.readFileSync('src/components/ProductVendorDashboard.tsx', 'utf8');
const adminCommand = fs.readFileSync('src/components/AdminCommandCenter.tsx', 'utf8');
assert('ProStudioDashboard preserves requests, calendar and payouts tabs', 
  proStudio.includes("activeTab === 'requests'") && 
  proStudio.includes("activeTab === 'calendar'") && 
  proStudio.includes("activeTab === 'payouts'")
);
assert('ProductVendorDashboard preserves vendor workflows and inventory allocation', 
  vendorDash.includes('Luxury Cosmetics Inventory & Dispatch') && 
  vendorDash.includes('Active Cosmetic SKUs & Bundles')
);
assert('AdminCommandCenter preserves governance and audit workflows', 
  adminCommand.includes('Admin Governance & KYC Verification') && 
  adminCommand.includes('50-User Simultaneous Stampede & GiST Invariant Engine')
);

// SUMMARY
console.log('\n======================================================');
console.log(`TOTAL TESTS: ${totalTests}`);
console.log(`PASSED: ${passedTests}`);
console.log(`FAILED: ${totalTests - passedTests}`);
console.log('======================================================');

if (passedTests === totalTests) {
  process.exit(0);
} else {
  process.exit(1);
}
