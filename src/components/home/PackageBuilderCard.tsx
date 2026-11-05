import React, { useState, useMemo } from 'react';
import { Check, Plus, Sparkles, PackagePlus, ArrowRight } from 'lucide-react';
import { SavingsMeter } from './SavingsMeter';
import { DetailedService, marketplaceService } from '../../services/marketplaceService';

interface PackageBuilderCardProps {
  onBuildPackage: (selectedServices: DetailedService[]) => void;
  className?: string;
}

const BUILDER_CANDIDATE_SERVICES: {
  id: string;
  title: string;
  price: number;
  duration: string;
  category: string;
}[] = [
  { id: 'srv-005', title: 'Hydra-Oxygen Facial', price: 1299, duration: '45 mins', category: 'Skin' },
  { id: 'srv-006', title: 'Rica White Chocolate Wax', price: 899, duration: '40 mins', category: 'Waxing' },
  { id: 'srv-003', title: 'Dyson Bouncy Blowout', price: 799, duration: '35 mins', category: 'Hair' },
  { id: 'srv-004', title: 'Gel Couture Manicure', price: 999, duration: '45 mins', category: 'Nails' },
];

export const PackageBuilderCard: React.FC<PackageBuilderCardProps> = ({
  onBuildPackage,
  className = '',
}) => {
  // Initial selection: 2 services
  const [selectedIds, setSelectedIds] = useState<string[]>(['srv-005', 'srv-003']);

  const toggleService = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        if (prev.length <= 1) return prev; // Keep at least one
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const currentTotal = useMemo(() => {
    return BUILDER_CANDIDATE_SERVICES
      .filter((s) => selectedIds.includes(s.id))
      .reduce((sum, s) => sum + s.price, 0);
  }, [selectedIds]);

  const targetThreshold = 2200;
  const isTargetReached = currentTotal >= targetThreshold;
  const finalPrice = isTargetReached ? Math.round(currentTotal * 0.85) : currentTotal;
  const totalSavings = isTargetReached ? currentTotal - finalPrice : 0;

  const handleBuild = () => {
    const fullServices: DetailedService[] = [];
    selectedIds.forEach((id) => {
      const srv = marketplaceService.getServiceById(id);
      if (srv) fullServices.push(srv);
    });
    onBuildPackage(fullServices);
  };

  return (
    <section aria-labelledby="custom-package-builder-title" className={`py-4 ${className}`}>
      <div className="p-5 sm:p-7 rounded-[22px] bg-bg-alt border border-border/80 shadow-warm-sm">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-soft text-accent-pressed border border-accent/20 text-[11px] font-bold uppercase tracking-wider mb-2">
              <PackagePlus className="w-3.5 h-3.5" />
              <span>Custom Bundle Saver</span>
            </div>
            <h2
              id="custom-package-builder-title"
              className="font-serif text-xl sm:text-2xl font-bold text-text"
            >
              Create your own package
            </h2>
            <p className="text-xs sm:text-sm text-text-muted mt-0.5">
              Pick 2-3 services to unlock an extra 15% bundle discount and zero convenience fee.
            </p>
          </div>

          <div className="text-right hidden sm:block">
            <span className="text-[11px] text-text-muted uppercase font-bold tracking-wider block">
              Bundle Price
            </span>
            <div className="flex items-baseline gap-2 justify-end">
              {totalSavings > 0 && (
                <span className="text-xs line-through text-text-muted font-mono">
                  ₹{currentTotal}
                </span>
              )}
              <span className="font-heading font-bold text-2xl text-text">
                ₹{finalPrice}
              </span>
            </div>
          </div>
        </div>

        {/* Live Savings Meter */}
        <div className="mb-5">
          <SavingsMeter
            currentTotal={currentTotal}
            targetTotal={targetThreshold}
            discountPercentage={15}
          />
        </div>

        {/* Candidate Services Choice Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6">
          {BUILDER_CANDIDATE_SERVICES.map((srv) => {
            const isSelected = selectedIds.includes(srv.id);
            return (
              <div
                key={srv.id}
                onClick={() => toggleService(srv.id)}
                className={`p-4 rounded-[18px] border transition-all cursor-pointer flex flex-col justify-between select-none ${
                  isSelected
                    ? 'bg-card border-accent shadow-warm-card ring-2 ring-accent/20'
                    : 'bg-card hover:bg-card border-border hover:border-border-strong shadow-warm-sm'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-fill border border-border text-text">
                      {srv.category}
                    </span>
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-accent text-white'
                          : 'border border-border text-transparent'
                      }`}
                    >
                      <Check className="w-3 h-3" />
                    </div>
                  </div>
                  <h3 className="font-heading font-bold text-xs sm:text-sm text-text leading-snug">
                    {srv.title}
                  </h3>
                  <p className="text-[11px] text-text-muted mt-0.5">{srv.duration}</p>
                </div>

                <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-border/70 text-xs font-semibold">
                  <span className="text-text">₹{srv.price}</span>
                  <span className={`text-[11px] font-bold ${isSelected ? 'text-accent-pressed' : 'text-text-muted'}`}>
                    {isSelected ? 'Included' : '+ Add'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Price & CTA Row */}
        <div className="flex items-center justify-between gap-4 pt-3 border-t border-border/80">
          <div className="sm:hidden">
            <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider block">
              Bundle Total
            </span>
            <div className="flex items-baseline gap-1.5">
              {totalSavings > 0 && (
                <span className="text-xs line-through text-text-muted font-mono">
                  ₹{currentTotal}
                </span>
              )}
              <span className="font-heading font-bold text-lg text-text">
                ₹{finalPrice}
              </span>
            </div>
          </div>

          <div className="ml-auto">
            <button
              type="button"
              onClick={handleBuild}
              className="px-6 py-2.5 rounded-[14px] bg-accent text-white font-bold text-xs sm:text-sm hover:bg-accent-pressed transition-all shadow-warm-sm cursor-pointer flex items-center gap-2"
            >
              <span>Build package ({selectedIds.length} services)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
