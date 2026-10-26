import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  X,
  Printer,
  Truck,
  CheckSquare,
  Square,
  Package,
  ShieldCheck,
  AlertCircle,
  QrCode
} from 'lucide-react';
import { snappySpring, spatialSpring } from '../constants/motion';

export interface ShippingLabelData {
  awb_number: string;
  carrier: string;
  routing_code: string;
  order_id: string;
  sub_order_id: string;
  dispatch_hub: string;
  destination_pincode: string;
  recipient: {
    name: string;
    phone: string;
    address: string;
  };
  package_specs: {
    weight_kg: number;
    dimensions: string;
    declared_value: number;
    handling: string;
  };
  skus: {
    title: string;
    brand: string;
    batch_number: string;
    expiry: string;
    quantity: number;
    hsn_code: string;
    shade?: string;
  }[];
  dispatch_date: string;
  estimated_delivery: string;
  status: string;
}

interface ShippingLabelModalProps {
  isOpen: boolean;
  onClose: () => void;
  labelData: ShippingLabelData | null;
}

export const ShippingLabelModal: React.FC<ShippingLabelModalProps> = ({
  isOpen,
  onClose,
  labelData,
}) => {
  const [checkedSkus, setCheckedSkus] = useState<Record<number, boolean>>({ 0: true });

  if (!isOpen || !labelData) return null;

  const toggleCheck = (idx: number) => {
    setCheckedSkus((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-obsidian/75 backdrop-blur-md flex justify-center p-3 sm:p-6 print:p-0 print:bg-white">
      
      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 15 }}
        transition={spatialSpring}
        className="relative w-full max-w-lg bg-white sm:rounded-3xl shadow-2xl border border-rose-gold/25 overflow-hidden flex flex-col my-auto print:shadow-none print:border-none print:rounded-none"
      >
        {/* Floating Controls Bar (Hidden during print) */}
        <div className="px-6 py-3.5 bg-white border-b border-rose-gold/20 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider text-champagne-dark bg-champagne-light/70 px-2.5 py-0.5 rounded-full">
              Thermal 4x6 Label
            </span>
            <span className="font-mono text-xs font-bold text-obsidian">
              {labelData.awb_number}
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
              <span>Print 4x6 Label</span>
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

        {/* 4x6 Thermal Label Standard Layout */}
        <div className="p-6 text-black font-mono text-xs border-2 border-black m-4 rounded-xl print:m-0 print:border-2 print:border-black">
          
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-3 border-b-2 border-black">
            <div>
              <span className="text-xl font-extrabold tracking-tighter uppercase font-sans">
                {labelData.carrier}
              </span>
              <span className="text-[10px] block font-bold tracking-widest uppercase">
                EXPRESS AIR PRIORITY • SURFACE CARGO
              </span>
            </div>

            <div className="text-right">
              <span className="text-2xl font-black">{labelData.routing_code}</span>
              <span className="text-[9px] block uppercase font-sans font-bold">Sort Hub</span>
            </div>
          </div>

          {/* Barcode Graphic Block */}
          <div className="py-4 text-center border-b-2 border-black">
            <div className="flex justify-center items-center h-16 gap-[3px] select-none">
              {/* Pseudo SVG Barcode Bars */}
              {[4, 1, 3, 2, 5, 2, 1, 4, 2, 3, 1, 5, 2, 4, 1, 3, 2, 4, 1, 5, 2, 3, 1, 4, 2, 5, 1, 3, 4, 2, 1, 5, 3, 2, 4, 1, 5].map((w, i) => (
                <div
                  key={i}
                  className="bg-black h-full"
                  style={{ width: `${w}px` }}
                />
              ))}
            </div>
            <span className="text-sm font-bold tracking-widest mt-1 block font-mono">
              *{labelData.awb_number}*
            </span>
          </div>

          {/* Routing & Pincode Grid */}
          <div className="grid grid-cols-2 border-b-2 border-black">
            <div className="p-3 border-r-2 border-black">
              <span className="text-[9px] uppercase font-bold block">Dest Pincode:</span>
              <span className="text-2xl font-black tracking-tight">{labelData.destination_pincode}</span>
              <span className="text-[10px] block font-bold">MUMBAI METRO</span>
            </div>

            <div className="p-3">
              <span className="text-[9px] uppercase font-bold block">Weight / Dimensions:</span>
              <span className="text-sm font-bold block">{labelData.package_specs.weight_kg} KG</span>
              <span className="text-[10px] block text-gray-700">{labelData.package_specs.dimensions}</span>
            </div>
          </div>

          {/* Ship To Section */}
          <div className="p-3 border-b-2 border-black font-sans">
            <span className="text-[9px] font-mono uppercase font-bold block text-gray-700">SHIP TO:</span>
            <p className="text-sm font-bold">{labelData.recipient.name}</p>
            <p className="text-xs text-gray-800 leading-snug">{labelData.recipient.address}</p>
            <p className="text-xs font-mono font-bold mt-1">TEL: {labelData.recipient.phone}</p>
          </div>

          {/* Ship From */}
          <div className="p-3 border-b-2 border-black font-sans text-[11px]">
            <span className="text-[9px] font-mono uppercase font-bold block text-gray-700">RETURN / SHIP FROM:</span>
            <p className="font-semibold">Glamgo Nodal Logistics Center</p>
            <p className="text-gray-700 leading-snug">{labelData.dispatch_hub}</p>
          </div>

          {/* SKU Batch Verification Checklist */}
          <div className="p-3 bg-gray-50 print:bg-transparent">
            <span className="text-[9px] uppercase font-bold block text-gray-700 mb-2">
              WAREHOUSE QC CHECKLIST:
            </span>

            <div className="space-y-2">
              {labelData.skus.map((sku, idx) => {
                const isChecked = !!checkedSkus[idx];
                return (
                  <div
                    key={idx}
                    onClick={() => toggleCheck(idx)}
                    className="flex items-start gap-2 cursor-pointer select-none text-xs"
                  >
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4 text-black shrink-0 mt-0.5" />
                    ) : (
                      <Square className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="font-bold font-sans">{sku.title}</p>
                      <p className="text-[10px] text-gray-700">
                        Batch: <strong>{sku.batch_number}</strong> • Exp: {sku.expiry} • Qty: {sku.quantity} • HSN: {sku.hsn_code}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Warnings */}
          <div className="pt-3 border-t-2 border-black text-center text-[9px] font-sans font-bold">
            <p className="uppercase">{labelData.package_specs.handling}</p>
            <p className="font-mono text-gray-600 mt-0.5">ESTIMATED DELIVERY: {labelData.estimated_delivery} • COURIER RUNNER SCAN REQUIRED</p>
          </div>

        </div>

      </motion.div>
    </div>
  );
};
