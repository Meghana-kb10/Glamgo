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

  // Platform Commission Split
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-obsidian/75 backdrop-blur-md flex justify-center p-2 sm:p-4 md:p-6 print:p-0 print:bg-white">
      
      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={spatialSpring}
        className="relative w-full max-w-4xl bg-white sm:rounded-3xl shadow-2xl border border-rose-gold/20 overflow-hidden flex flex-col my-auto print:shadow-none print:border-none print:rounded-none"
      >
        {/* Floating Controls Bar (Hidden during print) */}
        <div className="sticky top-0 z-30 px-6 py-3.5 bg-white/95 backdrop-blur-md border-b border-rose-gold/20 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider text-rose-gold bg-rose-blush/60 px-2.5 py-0.5 rounded-full">
              Official Tax Invoice
            </span>
            <span className="font-mono text-xs font-bold text-obsidian">
              {invoiceNo}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              transition={snappySpring}
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-full bg-obsidian hover:bg-obsidian-deep text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-3.5 h-3.5 text-champagne-light" />
              <span>Print / Save PDF</span>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={onClose}
              className="p-1.5 rounded-full bg-surface-cream hover:bg-rose-blush text-obsidian border border-rose-gold/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* Invoice Printable Sheet Content */}
        <div className="p-6 sm:p-10 space-y-8 print:p-6 text-obsidian font-sans">
          
          {/* 1. Header & GST Identity */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-rose-gold/20">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-3xl font-bold tracking-tight text-obsidian">
                  GLAMGO
                </span>
                <span className="text-[10px] font-mono tracking-widest text-champagne-dark border border-champagne/40 px-2 py-0.5 rounded-md">
                  COUTURE CONCIERGE
                </span>
              </div>
              <p className="text-xs text-obsidian-muted mt-1 leading-relaxed">
                Glamgo Luxury Lifestyle Services Pvt. Ltd.<br />
                Level 14, Platina Towers, BKC, Bandra East, Mumbai - 400051<br />
                <strong className="text-obsidian">GSTIN:</strong> 27AABCG9482L1ZX • <strong className="text-obsidian">State:</strong> Maharashtra (27)<br />
                <span className="text-[11px] text-obsidian-subtle">CIN: U74999MH2026PTC394812 • nodalescrow@glamgo.luxury</span>
              </p>
            </div>

            <div className="sm:text-right space-y-1 text-xs">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-surface-cream text-obsidian inline-block">
                TAX INVOICE / RECEIPT
              </span>
              <p className="font-mono text-xs"><strong>Invoice No:</strong> {invoiceNo}</p>
              <p className="font-mono text-xs"><strong>Order Ref:</strong> {orderNo}</p>
              <p className="font-mono text-xs"><strong>Booking ID:</strong> {bookingNo}</p>
              <p className="font-mono text-xs"><strong>Date:</strong> {invoiceDate}</p>
              <p className="font-mono text-xs text-emerald-700 font-semibold">
                Payment: ONLINE (UPI / CARDS)
              </p>
            </div>
          </div>

          {/* 2. Customer & Place of Supply */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-surface-cream/50 border border-rose-gold/15 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-obsidian-subtle block mb-1">
                Billed To (Customer):
              </span>
              <p className="font-bold text-obsidian text-sm">{customerName}</p>
              <p className="text-obsidian-muted">{customerPhone}</p>
              <p className="text-obsidian-muted mt-1">{venueAddress}</p>
            </div>

            <div className="sm:text-right">
              <span className="text-[10px] uppercase font-bold text-obsidian-subtle block mb-1">
                Place of Supply:
              </span>
              <p className="font-semibold text-obsidian">Maharashtra (State Code: 27)</p>
              <p className="text-obsidian-muted">Reverse Charge Applicable: <strong className="text-obsidian">NO</strong></p>
              <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono text-[11px] font-bold">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Escrow Guarantee Protected</span>
              </div>
            </div>
          </div>

          {/* 3. PART A: SERVICE INVOICE (SAC 999722) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-rose-gold/20">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-obsidian text-white flex items-center justify-center text-[10px] font-bold">
                  A
                </span>
                <h3 className="font-serif text-base font-bold text-obsidian">
                  Part A: Couture Beauty & Wellness Service Invoice
                </h3>
              </div>
              <span className="font-mono text-xs text-obsidian-subtle">
                SAC Code: <strong className="text-obsidian">999722</strong>
              </span>
            </div>

            <table className="w-full text-left text-xs">
              <thead className="bg-surface-cream/70 text-obsidian-subtle uppercase text-[10px] font-bold">
                <tr>
                  <th className="py-2.5 px-3">Service & Verified Artist</th>
                  <th className="py-2.5 px-2 text-center">SAC</th>
                  <th className="py-2.5 px-2 text-right">Taxable Val</th>
                  <th className="py-2.5 px-2 text-right">CGST (9%)</th>
                  <th className="py-2.5 px-2 text-right">SGST (9%)</th>
                  <th className="py-2.5 px-3 text-right">Gross Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-gold/10 font-mono text-xs">
                <tr>
                  <td className="py-3 px-3 font-sans">
                    <p className="font-bold text-obsidian">{packageName}</p>
                    <p className="text-[11px] text-obsidian-muted">
                      Artist: {artistName} • Duration: 180 Mins
                    </p>
                    <div className="mt-1 flex items-center gap-2 text-[10px]">
                      <span className="bg-rose-blush px-2 py-0.5 rounded text-rose-velvet font-mono font-bold">
                        Check-In OTP: #{checkInOtp}
                      </span>
                      <span className="text-emerald-700 font-semibold">
                        Status: {escrowStatus}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-center text-obsidian-muted">999722</td>
                  <td className="py-3 px-2 text-right tabular-nums">₹{serviceBase.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  <td className="py-3 px-2 text-right tabular-nums">₹{serviceCgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  <td className="py-3 px-2 text-right tabular-nums">₹{serviceSgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  <td className="py-3 px-3 text-right font-bold text-obsidian tabular-nums">
                    ₹{serviceGross.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 4. PART B: RETAIL TAX INVOICE (HSN 3304) */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between pb-2 border-b border-rose-gold/20">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-obsidian text-white flex items-center justify-center text-[10px] font-bold">
                  B
                </span>
                <h3 className="font-serif text-base font-bold text-obsidian">
                  Part B: Retail Luxury Cosmetic Tax Invoice
                </h3>
              </div>
              <span className="font-mono text-xs text-obsidian-subtle">
                HSN Code: <strong className="text-obsidian">3304</strong>
              </span>
            </div>

            <table className="w-full text-left text-xs">
              <thead className="bg-surface-cream/70 text-obsidian-subtle uppercase text-[10px] font-bold">
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
              <tbody className="divide-y divide-rose-gold/10 font-mono text-xs">
                {products.map((p, idx) => {
                  const itemGross = p.price * p.quantity;
                  const itemBase = Math.round((itemGross / 1.18) * 100) / 100;
                  const itemGst = Math.round((itemGross - itemBase) * 100) / 100;
                  const itemCgst = Math.round((itemGst / 2) * 100) / 100;
                  const itemSgst = Math.round((itemGst - itemCgst) * 100) / 100;

                  return (
                    <tr key={idx}>
                      <td className="py-3 px-3 font-sans">
                        <p className="font-bold text-obsidian">{p.title}</p>
                        <p className="text-[11px] text-obsidian-muted">
                          Brand: {p.brand} • Batch: <strong className="font-mono">{p.batchNumber}</strong> • Exp: {p.expiryDate}
                        </p>
                      </td>
                      <td className="py-3 px-2 text-center text-obsidian-muted">{p.hsnCode}</td>
                      <td className="py-3 px-2 text-center font-bold">{p.quantity}</td>
                      <td className="py-3 px-2 text-right tabular-nums">₹{itemBase.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      <td className="py-3 px-2 text-right tabular-nums">₹{itemCgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      <td className="py-3 px-2 text-right tabular-nums">₹{itemSgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      <td className="py-3 px-3 text-right font-bold text-obsidian tabular-nums">
                        ₹{itemGross.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* 5. PART C: PLATFORM SETTLEMENT & ESCROW LEDGER SPLIT */}
          <div className="p-4 sm:p-5 rounded-2xl bg-surface-cream border border-rose-gold/25 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-rose-gold/20">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-champagne-dark text-white flex items-center justify-center text-[10px] font-bold">
                  C
                </span>
                <h4 className="font-serif text-sm font-bold text-obsidian">
                  Part C: Platform Split Ledger & Partner Disbursement Summary
                </h4>
              </div>
              <span className="text-[10px] font-mono uppercase text-champagne-dark font-bold">
                RBI Compliant Nodal Escrow Model
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-rose-gold/15">
                <span className="text-[10px] uppercase font-bold text-obsidian-subtle block">
                  Total Customer Payment
                </span>
                <span className="font-mono text-base font-bold text-obsidian tabular-nums">
                  ₹{totalGrossPaid.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-obsidian-subtle block mt-1">
                  Paid Deposit: ₹{depositPaidToday.toLocaleString('en-IN')} • Venue Bal: ₹{balanceAtVenue.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-rose-gold/15">
                <span className="text-[10px] uppercase font-bold text-obsidian-subtle block">
                  Glamgo Platform Fee (18% / 12%)
                </span>
                <span className="font-mono text-base font-bold text-rose-gold tabular-nums">
                  ₹{totalPlatformFee.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-obsidian-subtle block mt-1">
                  Service Comm: ₹{serviceCommission} • Product Comm: ₹{productCommission}
                </span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-rose-gold/15">
                <span className="text-[10px] uppercase font-bold text-obsidian-subtle block">
                  Net Partner Disbursement
                </span>
                <span className="font-mono text-base font-bold text-emerald-700 tabular-nums">
                  ₹{(netArtistPayout + netVendorPayout).toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-obsidian-subtle block mt-1">
                  Artist Payout: ₹{netArtistPayout} • Vendor: ₹{netVendorPayout}
                </span>
              </div>
            </div>
          </div>

          {/* 6. Footer Legal & Signatures */}
          <div className="pt-4 border-t border-rose-gold/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-obsidian-muted">
            <div className="space-y-0.5">
              <p className="font-medium text-obsidian">Terms & Conditions:</p>
              <p className="text-[11px] text-obsidian-subtle">
                1. Service fees are released from Escrow only upon client OTP verification.<br />
                2. Unused cosmetics are eligible for white-glove exchange within 7 days.<br />
                3. This is a computer-generated tax invoice and requires no physical signature.
              </p>
            </div>

            <div className="sm:text-right font-mono text-[11px] text-obsidian">
              <div className="inline-block p-2 border border-champagne/40 rounded-xl bg-champagne-light/30 text-center">
                <span className="text-[10px] uppercase font-bold text-champagne-dark block">
                  Authorised Signatory
                </span>
                <span className="font-serif italic font-bold text-obsidian text-sm block mt-0.5">
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
