import React from 'react';

export interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div
      className={`
        animate-pulse bg-gradient-to-r from-mist/70 via-blush/40 to-mist/70
        rounded-xl ${className}
      `}
    />
  );
};
