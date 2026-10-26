import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Package,
  AlertTriangle,
  FileText,
  Printer,
  CheckCircle,
  Truck,
  Plus,
  Minus,
  Sparkles,
  Search,
  ExternalLink
} from 'lucide-react';
import { snappySpring } from '../constants/motion';
import { triggerChampagneSparkles } from '../utils/confetti';
import { useVendorInventory } from '../hooks/useGlamgoApi';
import { glamgoApi } from '../services/apiClient';
import { ShippingLabelModal, ShippingLabelData } from './ShippingLabelModal';

export const ProductVendorDashboard: React.FC = () => {
  const { inventory, isLoading, adjustStock, generateAwb } = useVendorInventory();
  const [generatingLabelId, setGeneratingLabelId] = useState<string | null>(null);
  const [activeLabel, setActiveLabel] = useState<ShippingLabelData | null>(null);
  const [isLabelModalOpen, setIsLabelModalOpen] = useState(false);

  const handleGenerateLabel = async (subOrderId: string, e: React.MouseEvent) => {
    setGeneratingLabelId(subOrderId);
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    triggerChampagneSparkles(
      (rect.left + rect.width / 2) / window.innerWidth,
      (rect.top + rect.height / 2) / window.innerHeight
    );

    try {
      const res = await glamgoApi.vendor.generateShippingLabel({
        subOrderId,
        courier: 'BlueDart Priority Air',
        weightKg: 0.65,
      });
      if (res.data) {
        setActiveLabel(res.data);
        setIsLabelModalOpen(true);
      }
    } finally {
      setGeneratingLabelId(null);
    }
  };

  const handleAdjustStock = async (variantId: string, delta: number) => {
    await adjustStock(variantId, delta);
  };

  const variants = inventory?.variants || [];
  const products = inventory?.products || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Vendor Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-rose-gold/15">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-champagne-dark bg-champagne-light/70 px-2.5 py-0.5 rounded-full">
              Vendor Fulfillment Node
            </span>
            <span className="text-xs text-obsidian-subtle font-mono">
              Hub ID: BOM-BKC-HUB-04 • POST /api/v1/vendor/inventory
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-obsidian mt-1.5">
            Luxury Cosmetics Inventory & Dispatch
          </h1>
          <p className="text-xs sm:text-sm text-obsidian-muted">
            Track real-time SKU levels bundled with bridal appointments, generate instant Bluedart/Delhivery airway bills.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-white border border-rose-gold/20 shadow-sm text-right">
            <span className="text-[10px] uppercase font-bold text-obsidian-subtle block">
              Auto-Dispatch Mode
            </span>
            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5 justify-end">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              <span>Active (Same-Day)</span>
            </span>
          </div>
        </div>
      </div>

      {/* Inventory Table Card */}
      <div className="bg-white rounded-3xl border border-rose-gold/20 shadow-luxury overflow-hidden">
        <div className="px-6 py-4 border-b border-rose-gold/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-serif text-lg font-bold text-obsidian">
              Active Cosmetic SKUs & Bundles
            </h2>
            <span className="text-xs text-obsidian-muted">
              Live database state tied to `products` and `product_variants` tables
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-cream border border-rose-gold/15 text-xs">
              <Search className="w-3.5 h-3.5 text-rose-gold" />
              <input
                type="text"
                placeholder="Search SKU code or brand..."
                className="bg-transparent outline-none text-obsidian text-xs font-medium"
              />
            </div>
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-cream/50 text-obsidian-subtle uppercase text-[10px] tracking-wider border-b border-rose-gold/15">
              <tr>
                <th className="px-6 py-3.5">SKU & Item Name</th>
                <th className="px-6 py-3.5">Shade / Size</th>
                <th className="px-6 py-3.5 text-center">Available Stock</th>
                <th className="px-6 py-3.5 text-center">Stock Alert Status</th>
                <th className="px-6 py-3.5">Retail Price</th>
                <th className="px-6 py-3.5 text-right">Fulfillment Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rose-gold/10">
              {variants.map((v: any) => {
                const prod = products.find((p: any) => p.id === v.product_id);
                const status =
                  v.stock_quantity <= 5
                    ? 'CRITICAL'
                    : v.stock_quantity <= 15
                    ? 'LOW_STOCK'
                    : 'IN_STOCK';

                return (
                  <tr key={v.id} className="hover:bg-surface-cream/30 transition-colors">
                    {/* SKU & Brand */}
                    <td className="px-6 py-4">
                      <span className="font-mono text-[10px] text-obsidian-subtle block">
                        {v.sku}
                      </span>
                      <span className="font-semibold text-obsidian text-sm block">
                        {prod?.title || 'Luxury Cosmetic Item'}
                      </span>
                      <span className="text-xs text-rose-gold font-medium">
                        {prod?.brand_name || 'Charlotte Tilbury'}
                      </span>
                    </td>

                    {/* Shade / Size */}
                    <td className="px-6 py-4 text-obsidian-muted font-medium">
                      {v.shade_name ? (
                        <div className="flex items-center gap-1.5">
                          {v.shade_hex && (
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-gray-300"
                              style={{ backgroundColor: v.shade_hex }}
                            />
                          )}
                          <span>{v.shade_name}</span>
                        </div>
                      ) : (
                        <span>{v.size_label || 'Standard'}</span>
                      )}
                    </td>

                    {/* Available Stock + Quick adjust buttons */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleAdjustStock(v.id, -1)}
                          className="p-1 rounded-md bg-surface-cream hover:bg-rose-blush border border-rose-gold/20"
                        >
                          <Minus className="w-3 h-3 text-obsidian" />
                        </motion.button>

                        <span className="font-mono text-sm font-bold text-obsidian w-8 text-center tabular-nums">
                          {v.stock_quantity}
                        </span>

                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleAdjustStock(v.id, 1)}
                          className="p-1 rounded-md bg-surface-cream hover:bg-rose-blush border border-rose-gold/20"
                        >
                          <Plus className="w-3 h-3 text-obsidian" />
                        </motion.button>
                      </div>
                      <span className="text-[10px] text-obsidian-subtle text-center block mt-1">
                        {v.reserved_quantity} held in carts
                      </span>
                    </td>

                    {/* Low Stock Pulsing Badges */}
                    <td className="px-6 py-4 text-center">
                      {status === 'CRITICAL' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-800 border border-red-300 animate-pulse">
                          <AlertTriangle className="w-3 h-3 text-red-600" />
                          <span>Critical (&lt; 5)</span>
                        </span>
                      ) : status === 'LOW_STOCK' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-300">
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                          <span>Low Stock</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                          <CheckCircle className="w-3 h-3 text-emerald-600" />
                          <span>Healthy</span>
                        </span>
                      )}
                    </td>

                    {/* Price */}
                    <td className="px-6 py-4 font-mono font-bold text-obsidian tabular-nums">
                      ₹{v.retail_price.toLocaleString('en-IN')}
                    </td>

                    {/* 1-Click "Generate Shipping Label" Morphing Button */}
                    <td className="px-6 py-4 text-right">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.94 }}
                        transition={snappySpring}
                        onClick={(e) => handleGenerateLabel(v.id, e)}
                        disabled={generatingLabelId === v.id}
                        className="px-3.5 py-1.5 rounded-xl bg-obsidian hover:bg-obsidian-deep text-white text-xs font-semibold inline-flex items-center gap-1.5 shadow-sm transition-all"
                      >
                        {generatingLabelId === v.id ? (
                          <>
                            <Sparkles className="w-3.5 h-3.5 text-champagne-light animate-spin" />
                            <span>Calling Logistics API...</span>
                          </>
                        ) : (
                          <>
                            <FileText className="w-3.5 h-3.5 text-champagne-light" />
                            <span>Generate 3PL AWB</span>
                          </>
                        )}
                      </motion.button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Printable Thermal 4x6 Shipping Label Modal */}
      <ShippingLabelModal
        isOpen={isLabelModalOpen}
        onClose={() => setIsLabelModalOpen(false)}
        labelData={activeLabel}
      />
    </div>
  );
};
