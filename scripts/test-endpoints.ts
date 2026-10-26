async function test() {
  const base = 'http://localhost:4000/api/v1';
  
  // 1. Health
  const h = await (await fetch(base + '/health')).json();
  console.log('1. Health check:', h.status, 'Postgres:', h.postgres.connected, 'Redis:', h.redis.connected);

  // 2. OTP send
  const otpSend = await (await fetch(base + '/auth/otp/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone: '+919820199481' })
  })).json();
  console.log('2. OTP send:', otpSend.success, otpSend.message);

  // 3. OTP verify
  const otpVer = await (await fetch(base + '/auth/otp/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone: '+919820199481', otp: '492104' })
  })).json();
  console.log('3. OTP verify:', otpVer.success, 'Token created:', !!otpVer.token);

  // 4. Bookings My
  const bks = await (await fetch(base + '/bookings/my')).json();
  console.log('4. Bookings my:', bks.success, 'Count:', bks.data?.length, 'Source:', bks.source);

  // 5. Orders My
  const ords = await (await fetch(base + '/orders/my')).json();
  console.log('5. Orders my:', ords.success, 'Count:', ords.data?.length, 'Source:', ords.source);

  // 6. Pro Payouts
  const payouts = await (await fetch(base + '/pro/payouts')).json();
  console.log('6. Pro payouts:', payouts.success, 'Gross:', payouts.data?.gross_revenue, 'Escrow held:', payouts.data?.escrow_held);

  // 7. Logistics Webhook
  const logRes = await (await fetch(base + '/webhooks/logistics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      awb_number: 'BLR-BD-948102',
      status: 'IN_TRANSIT',
      carrier: 'BlueDart Priority Air',
      location: 'BOM Central Air Sorting Hub'
    })
  })).json();
  console.log('7. Logistics webhook:', logRes.success, 'Status:', logRes.data?.status);

  // 8. Dispute resolve
  const dispRes = await (await fetch(base + '/admin/disputes/resolve', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      booking_id: 'c1000000-0000-0000-0000-000000000001',
      resolution: 'PARTIAL_REFUND',
      refund_amount: 5000,
      dispute_notes: 'Mediation agreement reached'
    })
  })).json();
  console.log('8. Dispute resolve:', dispRes.success, 'Resolution:', dispRes.data?.resolution);
}
test().catch(console.error);
