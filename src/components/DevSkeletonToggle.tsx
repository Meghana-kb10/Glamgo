import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Eye, EyeOff } from 'lucide-react';
import { snappySpring } from '../constants/motion';

interface DevSkeletonToggleProps {
  isLoading: boolean;
  onToggle: () => void;
}

export const DevSkeletonToggle: React.FC<DevSkeletonToggleProps> = ({ isLoading, onToggle }) => {
  return (
    <div className="fixed bottom-24 left-5 z-40">
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
        <span>{isLoading ? 'Champagne Skeletons: Active' : 'Simulate Skeletons'}</span>
        {isLoading ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
      </motion.button>
    </div>
  );
};
