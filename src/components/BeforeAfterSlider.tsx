import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronsLeftRight, Sparkles } from 'lucide-react';
import { BeforeAfterImage } from '../types';

interface BeforeAfterSliderProps {
  data: BeforeAfterImage;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({ data }) => {
  const [sliderPosition, setSliderPosition] = useState(50); // percentage 0 - 100
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  };

  return (
    <div className="w-full bg-white rounded-3xl p-5 sm:p-6 border border-rose-gold/20 shadow-luxury">
      
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-rose-gold bg-rose-blush/60 px-2.5 py-0.5 rounded-full">
              <Sparkles className="w-3 h-3 text-champagne-dark" />
              <span>Couture Makeover Inspection</span>
            </span>
            <span className="text-xs text-obsidian-subtle">• Drag divider to compare</span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-obsidian mt-1">
            {data.title}
          </h3>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <div className="px-3 py-1 rounded-full bg-surface-cream text-obsidian font-medium border border-rose-gold/20">
            Skin: <span className="font-semibold">{data.skinType}</span>
          </div>
        </div>
      </div>

      {/* Interactive Split-Screen Comparator Container */}
      <div
        ref={containerRef}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden cursor-ew-resize select-none border border-rose-gold/30 shadow-inner group"
      >
        {/* AFTER Image (Full background layer) */}
        <img
          src={data.afterUrl}
          alt="After HD Bridal Glam"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />

        {/* BEFORE Image (Clipped overlay layer) */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{ width: `${sliderPosition}%` }}
        >
          <img
            src={data.beforeUrl}
            alt="Before Transformation"
            className="absolute inset-0 w-full h-full object-cover max-w-none"
            style={{
              width: containerRef.current ? `${containerRef.current.offsetWidth}px` : '100%',
              height: '100%',
            }}
          />
        </div>

        {/* Labels Overlay */}
        <div className="absolute top-4 left-4 pointer-events-none z-10">
          <span className="px-3 py-1 rounded-full bg-obsidian/80 backdrop-blur-md text-white text-[11px] font-medium tracking-wide shadow-md border border-white/20">
            Bare Skin & Pre-Prep
          </span>
        </div>

        <div className="absolute top-4 right-4 pointer-events-none z-10">
          <span className="px-3 py-1 rounded-full bg-rose-velvet/85 backdrop-blur-md text-white text-[11px] font-medium tracking-wide shadow-md border border-white/20">
            HD Bridal Artistry
          </span>
        </div>

        {/* Physics Gold Divider Line */}
        <div
          className="absolute inset-y-0 pointer-events-none z-20 flex items-center justify-center"
          style={{ left: `${sliderPosition}%` }}
        >
          {/* Vertical gold line */}
          <div className="w-1 h-full bg-gradient-to-b from-champagne via-champagne-light to-champagne shadow-gold-glow -translate-x-1/2" />

          {/* Central Handle Pill */}
          <motion.div
            animate={{ scale: isDragging ? 1.15 : 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="absolute w-10 h-10 rounded-full bg-gradient-to-tr from-champagne-dark via-champagne to-champagne-light text-obsidian shadow-luxury flex items-center justify-center border-2 border-white -translate-x-1/2 cursor-grab active:cursor-grabbing"
          >
            <ChevronsLeftRight className="w-5 h-5 text-obsidian font-bold" />
          </motion.div>
        </div>

        {/* Bottom subtle prompt */}
        <div className="absolute bottom-3 inset-x-0 flex justify-center pointer-events-none z-10">
          <span className="px-3 py-1 rounded-full bg-white/70 backdrop-blur-md text-obsidian text-[10px] font-medium tracking-wider uppercase border border-rose-gold/20 shadow-sm opacity-80 group-hover:opacity-100 transition-opacity">
            Drag Handle Left / Right to Inspect Skin Texture & Pores
          </span>
        </div>

      </div>

    </div>
  );
};
