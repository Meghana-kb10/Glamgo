import React from 'react';

export const ArtistCardSkeleton: React.FC = () => {
  return (
    <div className="bg-card rounded-3xl overflow-hidden shadow-warm-xs border border-border flex flex-col animate-pulse">
      {/* Shimmer Image Area */}
      <div className="relative aspect-[4/5] w-full bg-fill">
        <div className="absolute top-3.5 left-3.5 w-24 h-6 rounded-full bg-card/80" />
        <div className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-card/80" />
        <div className="absolute bottom-3.5 left-3.5 right-3.5 space-y-2">
          <div className="w-1/3 h-4 rounded bg-card/90" />
          <div className="w-2/3 h-6 rounded bg-card/90" />
          <div className="w-1/2 h-3 rounded bg-card/70" />
        </div>
      </div>

      {/* Shimmer Details Area */}
      <div className="p-4 sm:p-5 space-y-3 bg-card">
        <div className="flex justify-between items-center">
          <div className="w-28 h-4 rounded bg-fill" />
          <div className="w-16 h-3 rounded bg-fill" />
        </div>
        <div className="w-full h-8 rounded-lg bg-fill/60" />
        <div className="flex justify-between items-center pt-2">
          <div className="w-20 h-6 rounded bg-fill" />
          <div className="w-24 h-8 rounded-xl bg-fill" />
        </div>
      </div>
    </div>
  );
};

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-card rounded-3xl overflow-hidden shadow-warm-xs border border-border flex flex-col animate-pulse">
      <div className="aspect-square w-full bg-fill" />
      <div className="p-4 sm:p-5 space-y-3 bg-card">
        <div className="w-16 h-3 rounded bg-fill" />
        <div className="w-3/4 h-5 rounded bg-fill" />
        <div className="w-full h-8 rounded bg-fill/60" />
        <div className="flex justify-between items-center pt-2">
          <div className="w-16 h-5 rounded bg-fill" />
          <div className="w-24 h-8 rounded-xl bg-fill" />
        </div>
      </div>
    </div>
  );
};
