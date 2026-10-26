import React, { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { RefreshCw, CheckCircle2, Sparkles } from 'lucide-react';
import { MOTION_PRIMITIVES, spatialSpring, snappySpring, tapScale, hoverElevate } from '../constants/motion';
import { triggerChampagneSparkles } from '../utils/confetti';

interface PullToRefreshProps {
  onRefresh: () => Promise<void> | void;
  children: React.ReactNode;
}

export const PullToRefresh: React.FC<PullToRefreshProps> = ({ onRefresh, children }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [justRefreshed, setJustRefreshed] = useState(false);

  const y = useMotionValue(0);
  const pullHeight = useTransform(y, [0, 80], [0, 60]);
  const iconRotation = useTransform(y, [0, 80], [0, 360]);
  const iconOpacity = useTransform(y, [10, 50], [0.3, 1]);

  const handleRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    triggerChampagneSparkles(0.5, 0.25);
    try {
      await Promise.resolve(onRefresh());
    } finally {
      setTimeout(() => {
        setIsRefreshing(false);
        setJustRefreshed(true);
        setTimeout(() => setJustRefreshed(false), 2000);
      }, 700);
    }
  };

  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.y > 50 && !isRefreshing) {
      handleRefresh();
    }
  };

  return (
    <div className="relative w-full">
      {/* Elastic Pull-Down Indicator Capsule */}
      <motion.div
        style={{ height: isRefreshing ? 60 : pullHeight }}
        className="w-full overflow-hidden flex items-center justify-center pointer-events-none select-none transition-[height] duration-200"
      >
        <motion.div
          style={{ opacity: isRefreshing ? 1 : iconOpacity }}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-xs border border-rose-gold/25 text-obsidian text-[13px] font-semibold"
        >
          {justRefreshed ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>Catalog Synchronized with Redis &amp; PostGIS</span>
            </>
          ) : isRefreshing ? (
            <>
              <RefreshCw className="w-4 h-4 text-rose-dark animate-spin" />
              <span>Refreshing MUA Calendars &amp; Inventory...</span>
            </>
          ) : (
            <>
              <motion.div style={{ rotate: iconRotation }}>
                <RefreshCw className="w-4 h-4 text-rose-dark" />
              </motion.div>
              <span>Pull to Refresh Catalog</span>
            </>
          )}
        </motion.div>
      </motion.div>

      {/* Draggable Content Wrapper with Elastic Spring Resistance */}
      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.35}
        onDragEnd={handleDragEnd}
        style={{ y }}
        transition={spatialSpring}
        className="relative z-10 touch-pan-x"
      >
        {children}
      </motion.div>

      {/* Quick Desktop Trigger Strip */}
      <div className="py-2 flex justify-center items-center">
        <motion.button
          type="button"
          whileHover={hoverElevate}
          whileTap={tapScale}
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-surface-cream hover:bg-surface-hover text-obsidian-muted hover:text-obsidian text-[13px] font-semibold transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-rose-gold focus-visible:outline-none"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-rose-dark ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>{isRefreshing ? 'Re-syncing...' : 'Click or Drag to Refresh Marketplace'}</span>
        </motion.button>
      </div>
    </div>
  );
};
