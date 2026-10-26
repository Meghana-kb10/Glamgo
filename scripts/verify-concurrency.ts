/**
 * CLI Concurrency & Mathematical Integrity Torture Suite
 * Run with: npm run verify:concurrency
 */

import { runConcurrencyDiagnostics, ConcurrencyAuditResult } from '../server/concurrencyDiagnostics';

async function main() {
  console.log('\n' + '='.repeat(80));
  console.log('   👑 GLAMGO CONCURRENCY & MATHEMATICAL INTEGRITY TORTURE SUITE');
  console.log('   Target Engine: PostgreSQL 16 (PostGIS + btree_gist) + Redis 7 (Alpine)');
  console.log('='.repeat(80) + '\n');

  console.log('⏳ Firing 50-User Stampede, GiST Overlap Collision, and Stock Invariant Checks...\n');

  try {
    const report: ConcurrencyAuditResult = await runConcurrencyDiagnostics();

    // Suite 1 ASCII Box
    console.log('┌' + '─'.repeat(78) + '┐');
    console.log('│ [SUITE 1] 50-User Simultaneous Redis Slot-Lock Stampede                      │');
    console.log('├' + '─'.repeat(78) + '┤');
    console.log(`│ Total Concurrent Requests : ${report.suite1_redisStampede.totalRequests.toString().padEnd(50)}│`);
    console.log(`│ Acquired Locks (200 OK)   : ${report.suite1_redisStampede.succeeded.toString().padEnd(50)}│`);
    console.log(`│ Blocked Contenders (409)  : ${report.suite1_redisStampede.blocked.toString().padEnd(50)}│`);
    console.log(`│ Latency Breakdown (ms)    : Min: ${report.suite1_redisStampede.minLatencyMs}ms | Max: ${report.suite1_redisStampede.maxLatencyMs}ms | Avg: ${report.suite1_redisStampede.avgLatencyMs}ms | p95: ${report.suite1_redisStampede.p95LatencyMs}ms`.padEnd(79) + '│');
    console.log(`│ Invariant Met (1 Won / 49 Blocked) : ${report.suite1_redisStampede.expectedInvariantMet ? '✅ PASS (Mathematically Guaranteed)' : '❌ FAIL'}`.padEnd(88) + '│');
    console.log('└' + '─'.repeat(78) + '┘\n');

    // Suite 2 ASCII Box
    console.log('┌' + '─'.repeat(78) + '┐');
    console.log('│ [SUITE 2] PostgreSQL btree_gist Overlapping Range Exclusion Proof             │');
    console.log('├' + '─'.repeat(78) + '┤');
    console.log(`│ Initial Confirmed Booking : ${report.suite2_gistExclusion.bookingIdCreated.padEnd(50)}│`);
    console.log(`│ Collision Attempt Blocked : ${report.suite2_gistExclusion.collisionAttemptBlocked ? '✅ TRUE (409 BOOKING_COLLISION_EXCLUDED)' : '❌ FALSE'}`.padEnd(88) + '│');
    console.log(`│ GiST Constraint Exclusion : ${report.suite2_gistExclusion.collisionErrorCode.padEnd(50)}│`);
    console.log(`│ Booking Cancellation      : ${report.suite2_gistExclusion.cancellationSucceeded ? '✅ SUCCESS (Slot range freed in GiST index)' : '❌ FAILED'}`.padEnd(88) + '│');
    console.log(`│ Re-Booking Exact Slot     : ${report.suite2_gistExclusion.rebookingSucceeded ? '✅ SUCCESS (200 OK Confirmed)' : '❌ FAILED'}`.padEnd(88) + '│');
    console.log(`│ GiST Invariant Met        : ${report.suite2_gistExclusion.gistInvariantMet ? '✅ PASS (Zero Double-Booking Vulnerability)' : '❌ FAIL'}`.padEnd(88) + '│');
    console.log('└' + '─'.repeat(78) + '┘\n');

    // Suite 3 ASCII Box
    console.log('┌' + '─'.repeat(78) + '┐');
    console.log('│ [SUITE 3] Last-Unit Cosmetic SKU Race Condition Guard                        │');
    console.log('├' + '─'.repeat(78) + '┤');
    console.log(`│ Simultaneous Checkouts    : ${report.suite3_skuRaceGuard.simultaneousCheckouts.toString().padEnd(50)}│`);
    console.log(`│ Units Purchased           : ${report.suite3_skuRaceGuard.unitsPurchased.toString().padEnd(50)}│`);
    console.log(`│ Oversell Prevented        : ${report.suite3_skuRaceGuard.oversellPrevented ? '✅ TRUE (stock_quantity >= 0 enforced)' : '❌ FALSE'}`.padEnd(88) + '│');
    console.log(`│ Stock Integrity Validated : ${report.suite3_skuRaceGuard.finalStockNonNegative ? '✅ PASS (No Negative Inventory Overflow)' : '❌ FAIL'}`.padEnd(88) + '│');
    console.log('└' + '─'.repeat(78) + '┘\n');

    // Suite 4 ASCII Box
    console.log('┌' + '─'.repeat(78) + '┐');
    console.log('│ [SUITE 4] Zero-Discrepancy Split-Escrow Math & OTP Release Audit             │');
    console.log('├' + '─'.repeat(78) + '┤');
    console.log(`│ Gross Order Total         : ₹${report.suite4_escrowMath.grossTotal.toLocaleString('en-IN')}`.padEnd(79) + '│');
    console.log(`│ Platform Commission (18/12): ₹${report.suite4_escrowMath.totalPlatformCommission.toLocaleString('en-IN')} (Service: ₹${report.suite4_escrowMath.platformServiceCommission} + Retail: ₹${report.suite4_escrowMath.platformProductCommission})`.padEnd(79) + '│');
    console.log(`│ Net Artist Payout         : ₹${report.suite4_escrowMath.netArtistPayout.toLocaleString('en-IN')}`.padEnd(79) + '│');
    console.log(`│ Net Vendor Payout         : ₹${report.suite4_escrowMath.netVendorPayout.toLocaleString('en-IN')}`.padEnd(79) + '│');
    console.log(`│ Floating-Point Drift      : ₹${report.suite4_escrowMath.floatingPointDiscrepancy.toFixed(2)} (Target: ₹0.00)`.padEnd(79) + '│');
    console.log(`│ Mathematical Balance      : ${report.suite4_escrowMath.mathBalanced ? '✅ BALANCED (Zero Discrepancy)' : '❌ UNBALANCED'}`.padEnd(88) + '│');
    console.log(`│ Invalid OTP Blocked       : ${report.suite4_escrowMath.invalidOtpBlocked ? '✅ BLOCKED (400 Invalid OTP)' : '❌ FAILED'}`.padEnd(88) + '│');
    console.log(`│ Valid OTP Escrow Release  : ${report.suite4_escrowMath.validOtpSettled ? '✅ SETTLED (Escrow Disbursed)' : '❌ FAILED'}`.padEnd(88) + '│');
    console.log('└' + '─'.repeat(78) + '┘\n');

    // Final Summary Box
    console.log('='.repeat(80));
    console.log(`🏆 OVERALL BENCHMARK RESULT : ${report.allPassed ? '🌟 100% PASS - PRODUCTION READY' : '⚠️ INVARIANTS FAILED'}`);
    console.log(`⏱️ TOTAL EXECUTION TIME    : ${report.durationMs}ms`);
    console.log(`📡 ACTIVE ENGINES           : ${report.databaseEngine} & ${report.redisEngine}`);
    console.log('='.repeat(80) + '\n');

    if (!report.allPassed) {
      process.exit(1);
    }
  } catch (err: any) {
    console.error('❌ Benchmark Execution Failed:', err.message);
    process.exit(1);
  }
}

main();
