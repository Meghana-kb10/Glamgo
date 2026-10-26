import React from 'react';

export const ArtistCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-luxury border border-rose-gold/15 flex flex-col animate-pulse">
      {/* Shimmer Image Area */}
      <div className="relative aspect-[4/5] w-full champagne-shimmer">
        <div className="absolute top-3.5 left-3.5 w-24 h-6 rounded-full bg-surface-cream/80" />
        <div className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-surface-cream/80" />
        <div className="absolute bottom-3.5 left-3.5 right-3.5 space-y-2">
          <div className="w-1/3 h-4 rounded bg-surface-cream/90" />
          <div className="w-2/3 h-6 rounded bg-surface-cream/90" />
          <div className="w-1/2 h-3 rounded bg-surface-cream/70" />
        </div>
      </div>

      {/* Shimmer Details Area */}
      <div className="p-4 sm:p-5 space-y-3 bg-white">
        <div className="flex justify-between items-center">
          <div className="w-28 h-4 rounded bg-surface-cream" />
          <div className="w-16 h-3 rounded bg-surface-cream" />
        </div>
        <div className="w-full h-8 rounded-lg bg-surface-cream/60" />
        <div className="flex justify-between items-center pt-2">
          <div className="w-20 h-6 rounded bg-surface-cream" />
          <div className="w-24 h-8 rounded-xl bg-surface-cream" />
        </div>
      </div>
    </div>
  );
};

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-luxury border border-rose-gold/15 flex flex-col animate-pulse">
      <div className="aspect-square w-full champagne-shimmer" />
      <div className="p-4 sm:p-5 space-y-3">
        <div className="w-16 h-3 rounded bg-surface-cream" />
        <div className="w-3/4 h-5 rounded bg-surface-cream" />
        <div className="w-full h-8 rounded bg-surface-cream/60" />
        <div className="flex justify-between items-center pt-2">
          <div className="w-16 h-5 rounded bg-surface-cream" />
          <div className="w-24 h-8 rounded-xl bg-surface-cream" />
        </div>
      </div>
    </div>
  );
};
