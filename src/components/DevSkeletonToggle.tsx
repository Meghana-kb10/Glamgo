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
    <div className="fixed bottom-24 left-5 z-40 hidden lg:flex items-center gap-2">
      
      {/* 1. Live DB / Simulated Mode Indicator Pill */}
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        transition={snappySpring}
        onClick={handlePing}
        title={isLive ? 'PostgreSQL 16 (PostGIS) & Redis 7 Connected (Click to re-check)' : 'Running in High-Fidelity In-Memory Simulated Mode (Click to check backend)'}
        className={`px-3 py-2 rounded-full text-xs font-mono font-medium shadow-luxury border flex items-center gap-2 backdrop-blur-md transition-all ${
          isLive
            ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40 shadow-emerald-900/20'
            : 'bg-white/90 text-obsidian-muted border-rose-gold/25 hover:text-obsidian hover:border-rose-gold/50'
        }`}
      >
        <div className="relative flex items-center justify-center">
          <div
            className={`w-2 h-2 rounded-full ${
              isLive ? 'bg-emerald-500' : 'bg-champagne-dark'
            }`}
          />
        </div>

        <span className="font-sans font-semibold tracking-wide">
          {isLive ? 'Live DB Connected' : 'Simulated Mode'}
        </span>

        {isPinging ? (
          <RefreshCw className="w-3 h-3 animate-spin text-emerald-400" />
        ) : isLive ? (
          <Database className="w-3 h-3 text-emerald-400" />
        ) : (
          <Server className="w-3 h-3 text-champagne-dark" />
        )}
      </motion.button>

      {/* 2. Skeleton Loading State Toggle */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={snappySpring}
        onClick={onToggle}
        className={`px-3 py-2 rounded-full text-xs font-mono font-medium shadow-luxury border flex items-center gap-2 backdrop-blur-md transition-colors ${
          isLoading
            ? 'bg-champagne-light text-obsidian border-champagne-dark shadow-gold-glow'
            : 'bg-white/90 text-obsidian-muted border-rose-gold/25 hover:text-obsidian hover:border-rose-gold/50'
        }`}
      >
        <Sparkles className={`w-3.5 h-3.5 ${isLoading ? 'text-champagne-dark animate-spin' : 'text-rose-gold'}`} />
        <span>{isLoading ? 'Skeletons: Active' : 'Skeletons'}</span>
        {isLoading ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
      </motion.button>

    </div>
  );
};
