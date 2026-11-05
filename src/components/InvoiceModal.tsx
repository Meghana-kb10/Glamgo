import React from 'react';
import { motion } from 'framer-motion';
import {
  X,
  Printer,
  Download,
  ShieldCheck,
  CheckCircle,
  Sparkles,
  FileText,
  Calendar,
  Lock,
  ExternalLink,
  Package,
  Layers,
  Building
} from 'lucide-react';
import { snappySpring, spatialSpring } from '../constants/motion';

export interface InvoiceModalData {
  invoiceNumber?: string;
  orderNumber?: string;
  bookingNumber?: string;
  date?: string;
  customerName?: string;
  customerPhone?: string;
  venueAddress?: string;
  artistName?: string;
  packageName?: string;
  packagePrice?: number;
  checkInOtp?: string;
  escrowStatus?: 'HELD_IN_ESCROW' | 'SETTLED' | 'REFUNDED';
  products?: {
    title: string;
    brand: string;
    batchNumber: string;
    expiryDate: string;
    hsnCode: string;
    price: number;
    quantity: number;
  }[];
}

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  data?: InvoiceModalData;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  if (!isOpen) return null;

  const invoiceNo = data?.invoiceNumber || `INV-202611-${Math.floor(1000 + Math.random() * 9000)}`;
  const orderNo = data?.orderNumber || 'GLAM-ORD-948201';
  const bookingNo = data?.bookingNumber || 'GLAM-BK-492104';
  const invoiceDate = data?.date || new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const customerName = data?.customerName || 'Rhea Singhania';
  const customerPhone = data?.customerPhone || '+91 98201 99481';
  const venueAddress = data?.venueAddress || 'Suite 4B, Pali Hill Heritage, Bandra West, Mumbai, Maharashtra 400050';

  const artistName = data?.artistName || 'Tanya Grewal Artistry Studio';
  const packageName = data?.packageName || 'Signature Sabyasachi Bridal HD Package';
  const serviceGross = data?.packagePrice || 32000;
  const checkInOtp = data?.checkInOtp || '4921';
  const escrowStatus = data?.escrowStatus || 'HELD_IN_ESCROW';

  const products = data?.products && data.products.length > 0 ? data.products : [
    {
      title: '24K Gold Camellia Glow Serum Primer',
      brand: 'Backstage Formulations',
      batchNumber: 'BOM-2026-B81',
      expiryDate: '12/2027',
      hsnCode: '3304',
      price: 3600,
      quantity: 1,
    },
  ];

  const productGross = products.reduce((sum, p) => sum + p.price * p.quantity, 0);

  // Calculations for Split Tax
  // Part A: Service SAC 999722 (18% GST: 9% CGST + 9% SGST)
  const serviceBase = Math.round((serviceGross / 1.18) * 100) / 100;
  const serviceGst = Math.round((serviceGross - serviceBase) * 100) / 100;
  const serviceCgst = Math.round((serviceGst / 2) * 100) / 100;
  const serviceSgst = Math.round((serviceGst - serviceCgst) * 100) / 100;

  // Part B: Product HSN 3304 (18% GST: 9% CGST + 9% SGST)
  const productBase = Math.round((productGross / 1.18) * 100) / 100;
  const productGst = Math.round((productGross - productBase) * 100) / 100;
  const productCgst = Math.round((productGst / 2) * 100) / 100;
  const productSgst = Math.round((productGst - productCgst) * 100) / 100;

  // Part C: Platform Payout & Escrow Split Ledger
  const serviceCommission = Math.round(serviceGross * 0.18);
  const productCommission = Math.round(productGross * 0.12);
  const totalPlatformFee = serviceCommission + productCommission;
  const netArtistPayout = serviceGross - serviceCommission;
  const netVendorPayout = productGross - productCommission;

  const totalGrossPaid = serviceGross + productGross;
  const depositPaidToday = Math.round(serviceGross * 0.3) + productGross;
  const balanceAtVenue = serviceGross - Math.round(serviceGross * 0.3);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="invoice-modal-title"
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-text/60 backdrop-blur-sm"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={spatialSpring}
        className="relative w-full max-w-3xl bg-card rounded-3xl shadow-warm-lg border border-border overflow-hidden z-10 flex flex-col max-h-[92vh]"
      >
        {/* Printable Top Bar */}
        <div className="px-6 py-4 bg-bg-alt border-b border-border flex items-center justify-between print:hidden shrink-0">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-accent" />
            <h2 id="invoice-modal-title" className="font-heading text-sm sm:text-base font-bold text-text">
              GST Tax Invoice & Payout Ledger
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl border border-border bg-card text-xs font-semibold text-text hover:bg-fill transition-colors flex items-center gap-1.5 cursor-pointer shadow-warm-xs"
            >
              <Printer className="w-3.5 h-3.5 text-accent" />
              <span>Print / Save PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close invoice"
              className="p-1.5 rounded-full bg-card hover:bg-fill text-text-muted hover:text-text border border-border transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Printable Sheet Content */}
        <div className="p-6 sm:p-10 space-y-8 print:p-6 text-text font-sans overflow-y-auto">
          
          {/* 1. Header & GST Identity */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-border">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading text-3xl font-bold tracking-tight text-text">
                  GLAMGO
                </span>
                <span className="text-[10px] font-mono tracking-widest text-accent border border-accent/30 bg-accent-soft px-2 py-0.5 rounded-md">
                  COUTURE CONCIERGE
                </span>
              </div>
              <p className="text-xs text-text-muted mt-1 leading-relaxed">
                Glamgo Luxury Lifestyle Services Pvt. Ltd.<br />
                Level 14, Platina Towers, BKC, Bandra East, Mumbai - 400051<br />
                <strong className="text-text">GSTIN:</strong> 27AABCG9482L1ZX • <strong className="text-text">State:</strong> Maharashtra (27)<br />
                <span className="text-[11px] text-text-muted">CIN: U74999MH2026PTC394812 • nodalescrow@glamgo.luxury</span>
              </p>
            </div>

            <div className="sm:text-right space-y-1 text-xs">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-fill text-accent-pressed inline-block">
                TAX INVOICE / RECEIPT
              </span>
              <p className="font-mono text-xs"><strong>Invoice No:</strong> {invoiceNo}</p>
              <p className="font-mono text-xs"><strong>Order Ref:</strong> {orderNo}</p>
              <p className="font-mono text-xs"><strong>Booking ID:</strong> {bookingNo}</p>
              <p className="font-mono text-xs"><strong>Date:</strong> {invoiceDate}</p>
              <p className="font-mono text-xs text-success font-semibold">
                Payment: ONLINE (UPI / CARDS)
              </p>
            </div>
          </div>

          {/* 2. Customer & Place of Supply */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-bg-alt border border-border text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-text-muted block mb-1">
                Billed To (Customer):
              </span>
              <p className="font-bold text-text text-sm">{customerName}</p>
              <p className="text-text-muted">{customerPhone}</p>
              <p className="text-text-muted mt-1">{venueAddress}</p>
            </div>

            <div className="sm:text-right">
              <span className="text-[10px] uppercase font-bold text-text-muted block mb-1">
                Place of Supply:
              </span>
              <p className="font-semibold text-text">Maharashtra (State Code: 27)</p>
              <p className="text-text-muted">Reverse Charge Applicable: <strong className="text-text">NO</strong></p>
              <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success/10 text-success border border-success/30 font-mono text-[11px] font-bold">
                <CheckCircle className="w-3.5 h-3.5 text-success" />
                <span>Escrow Guarantee Protected</span>
              </div>
            </div>
          </div>

          {/* 3. PART A: SERVICE INVOICE (SAC 999722) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-accent text-white flex items-center justify-center text-[10px] font-bold">
                  A
                </span>
                <h3 className="font-heading text-base font-bold text-text">
                  Part A: Couture Beauty & Wellness Service Invoice
                </h3>
              </div>
              <span className="font-mono text-xs text-text-muted">
                SAC Code: <strong className="text-text">999722</strong>
              </span>
            </div>

            <table className="w-full text-left text-xs">
              <thead className="bg-bg-alt text-text-muted uppercase text-[10px] font-bold">
                <tr>
                  <th className="py-2.5 px-3">Service & Verified Artist</th>
                  <th className="py-2.5 px-2 text-center">SAC</th>
                  <th className="py-2.5 px-2 text-right">Taxable Val</th>
                  <th className="py-2.5 px-2 text-right">CGST (9%)</th>
                  <th className="py-2.5 px-2 text-right">SGST (9%)</th>
                  <th className="py-2.5 px-3 text-right">Gross Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-mono text-xs">
                <tr>
                  <td className="py-3 px-3 font-sans">
                    <p className="font-bold text-text">{packageName}</p>
                    <p className="text-[11px] text-text-muted">
                      Artist: {artistName} • Duration: 180 Mins
                    </p>
                    <div className="mt-1 flex items-center gap-2 text-[10px]">
                      <span className="bg-accent-soft px-2 py-0.5 rounded text-accent-pressed font-mono font-bold">
                        Check-In OTP: #{checkInOtp}
                      </span>
                      <span className="text-success font-semibold">
                        Status: {escrowStatus}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-center text-text-muted">999722</td>
                  <td className="py-3 px-2 text-right tabular-nums">₹{serviceBase.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  <td className="py-3 px-2 text-right tabular-nums">₹{serviceCgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  <td className="py-3 px-2 text-right tabular-nums">₹{serviceSgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  <td className="py-3 px-3 text-right font-bold text-text tabular-nums">
                    ₹{serviceGross.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 4. PART B: RETAIL TAX INVOICE (HSN 3304) */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-accent text-white flex items-center justify-center text-[10px] font-bold">
                  B
                </span>
                <h3 className="font-heading text-base font-bold text-text">
                  Part B: Retail Luxury Cosmetic Tax Invoice
                </h3>
              </div>
              <span className="font-mono text-xs text-text-muted">
                HSN Code: <strong className="text-text">3304</strong>
              </span>
            </div>

            <table className="w-full text-left text-xs">
              <thead className="bg-bg-alt text-text-muted uppercase text-[10px] font-bold">
                <tr>
                  <th className="py-2.5 px-3">Cosmetic SKU & Batch Metadata</th>
                  <th className="py-2.5 px-2 text-center">HSN</th>
                  <th className="py-2.5 px-2 text-center">Qty</th>
                  <th className="py-2.5 px-2 text-right">Taxable Val</th>
                  <th className="py-2.5 px-2 text-right">CGST (9%)</th>
                  <th className="py-2.5 px-2 text-right">SGST (9%)</th>
                  <th className="py-2.5 px-3 text-right">Gross Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-mono text-xs">
                {products.map((p, idx) => {
                  const itemGross = p.price * p.quantity;
                  const itemBase = Math.round((itemGross / 1.18) * 100) / 100;
                  const itemGst = Math.round((itemGross - itemBase) * 100) / 100;
                  const itemCgst = Math.round((itemGst / 2) * 100) / 100;
                  const itemSgst = Math.round((itemGst - itemCgst) * 100) / 100;

                  return (
                    <tr key={idx}>
                      <td className="py-3 px-3 font-sans">
                        <p className="font-bold text-text">{p.title}</p>
                        <p className="text-[11px] text-text-muted">
                          Brand: {p.brand} • Batch: <strong className="font-mono">{p.batchNumber}</strong> • Exp: {p.expiryDate}
                        </p>
                      </td>
                      <td className="py-3 px-2 text-center text-text-muted">{p.hsnCode}</td>
                      <td className="py-3 px-2 text-center font-bold">{p.quantity}</td>
                      <td className="py-3 px-2 text-right tabular-nums">₹{itemBase.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      <td className="py-3 px-2 text-right tabular-nums">₹{itemCgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      <td className="py-3 px-2 text-right tabular-nums">₹{itemSgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      <td className="py-3 px-3 text-right font-bold text-text tabular-nums">
                        ₹{itemGross.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* 5. PART C: PLATFORM SETTLEMENT & ESCROW LEDGER SPLIT */}
          <div className="p-4 sm:p-5 rounded-2xl bg-bg-alt border border-border space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-accent text-white flex items-center justify-center text-[10px] font-bold">
                  C
                </span>
                <h4 className="font-heading text-sm font-bold text-text">
                  Part C: Platform Split Ledger & Partner Disbursement Summary
                </h4>
              </div>
              <span className="text-[10px] font-mono uppercase text-accent font-bold">
                RBI Compliant Nodal Escrow Model
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-card rounded-xl border border-border shadow-warm-xs">
                <span className="text-[10px] uppercase font-bold text-text-muted block">
                  Total Customer Payment
                </span>
                <span className="font-mono text-base font-bold text-text tabular-nums">
                  ₹{totalGrossPaid.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-text-muted block mt-1">
                  Paid Deposit: ₹{depositPaidToday.toLocaleString('en-IN')} • Venue Bal: ₹{balanceAtVenue.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="p-3 bg-card rounded-xl border border-border shadow-warm-xs">
                <span className="text-[10px] uppercase font-bold text-text-muted block">
                  Glamgo Platform Fee (18% / 12%)
                </span>
                <span className="font-mono text-base font-bold text-accent tabular-nums">
                  ₹{totalPlatformFee.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-text-muted block mt-1">
                  Service Comm: ₹{serviceCommission} • Product Comm: ₹{productCommission}
                </span>
              </div>

              <div className="p-3 bg-card rounded-xl border border-border shadow-warm-xs">
                <span className="text-[10px] uppercase font-bold text-text-muted block">
                  Net Partner Disbursement
                </span>
                <span className="font-mono text-base font-bold text-success tabular-nums">
                  ₹{(netArtistPayout + netVendorPayout).toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-text-muted block mt-1">
                  Artist Payout: ₹{netArtistPayout} • Vendor: ₹{netVendorPayout}
                </span>
              </div>
            </div>
          </div>

          {/* 6. Footer Legal & Signatures */}
          <div className="pt-4 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-text-muted">
            <div className="space-y-0.5">
              <p className="font-medium text-text">Terms & Conditions:</p>
              <p className="text-[11px] text-text-muted">
                1. Service fees are released from Escrow only upon client OTP verification.<br />
                2. Unused cosmetics are eligible for white-glove exchange within 7 days.<br />
                3. This is a computer-generated tax invoice and requires no physical signature.
              </p>
            </div>

            <div className="sm:text-right font-mono text-[11px] text-text">
              <div className="inline-block p-2 border border-border rounded-xl bg-fill text-center">
                <span className="text-[10px] uppercase font-bold text-text-muted block">
                  Authorised Signatory
                </span>
                <span className="font-heading font-bold text-text text-sm block mt-0.5">
                  Glamgo Finance & Escrow Cell
                </span>
              </div>
            </div>
          </div>

        </div>

      </motion.div>
    </div>
  );
};
