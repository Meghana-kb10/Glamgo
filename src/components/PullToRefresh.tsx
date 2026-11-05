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
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-card shadow-warm-xs border border-border text-text text-[13px] font-semibold"
        >
          {justRefreshed ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span>Catalog Synchronized</span>
            </>
          ) : isRefreshing ? (
            <>
              <RefreshCw className="w-4 h-4 text-accent animate-spin" />
              <span>Updating Beauty Offerings...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-accent" />
              <span>Pull to Synchronize</span>
            </>
          )}
        </motion.div>
      </motion.div>

      {/* Touch-Friendly Draggable Content Wrapper */}
      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.4}
        onDragEnd={handleDragEnd}
        style={{ y }}
        className="touch-pan-x"
      >
        {children}
      </motion.div>
    </div>
  );
};
