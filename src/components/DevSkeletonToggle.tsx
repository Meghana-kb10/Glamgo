import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Eye, EyeOff, Database, Server, RefreshCw } from 'lucide-react';
import { snappySpring } from '../constants/motion';
import { subscribeBackendStatus, checkBackendHealth, glamgoApi } from '../services/apiClient';

interface DevSkeletonToggleProps {
  isLoading: boolean;
  onToggle: () => void;
}

export const DevSkeletonToggle: React.FC<DevSkeletonToggleProps> = ({ isLoading, onToggle }) => {
  const [isLive, setIsLive] = useState(false);
  const [isPinging, setIsPinging] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeBackendStatus((live) => {
      setIsLive(live);
    });
    return unsubscribe;
  }, []);

  const handlePing = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPinging(true);
    await checkBackendHealth();
    setTimeout(() => setIsPinging(false), 500);
  };

  return (
    <div className="fixed bottom-4 left-4 z-40 hidden lg:flex items-center gap-2">
      
      {/* 1. Live DB / Simulated Mode Indicator Pill */}
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        transition={snappySpring}
        onClick={handlePing}
        title={isLive ? 'PostgreSQL (Supabase) Connected (Click to re-check)' : 'Running in Simulated Mode (Click to check backend)'}
        className={`px-3 py-2 rounded-full text-xs font-mono font-medium shadow-warm border flex items-center gap-2 backdrop-blur-md transition-all cursor-pointer ${
          isLive
            ? 'bg-success/15 text-success border-success/40'
            : 'bg-card/90 text-text-muted border-border hover:text-text'
        }`}
      >
        <div className="relative flex items-center justify-center">
          <div
            className={`w-2 h-2 rounded-full ${
              isLive ? 'bg-success' : 'bg-star'
            }`}
          />
          {isLive && (
            <div className="absolute w-2 h-2 rounded-full bg-success animate-ping opacity-75" />
          )}
        </div>
        <span className="flex items-center gap-1.5">
          <Database className="w-3.5 h-3.5" />
          {isLive ? 'Postgres Live' : 'Simulated DB'}
        </span>
        <RefreshCw className={`w-3 h-3 ml-0.5 text-text-muted ${isPinging ? 'animate-spin text-accent' : ''}`} />
      </motion.button>

      {/* 2. Dev Shimmer Skeleton Toggle */}
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        transition={snappySpring}
        onClick={onToggle}
        title="Toggle Shimmer Skeletons for UI Inspection"
        className={`px-3 py-2 rounded-full text-xs font-mono font-medium shadow-warm border flex items-center gap-1.5 backdrop-blur-md transition-all cursor-pointer ${
          isLoading
            ? 'bg-accent text-white border-accent'
            : 'bg-card/90 text-text-muted border-border hover:text-text'
        }`}
      >
        {isLoading ? (
          <>
            <EyeOff className="w-3.5 h-3.5" />
            <span>Skeletons Active</span>
          </>
        ) : (
          <>
            <Eye className="w-3.5 h-3.5" />
            <span>Preview Skeletons</span>
          </>
        )}
      </motion.button>

    </div>
  );
};
