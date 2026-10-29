import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { MOTION_SPRINGS } from '../../motion/tokens';

export interface SidebarItemProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  isActive?: boolean;
  onClick: () => void;
  badge?: string | number;
  isCollapsed?: boolean;
  hasSubItems?: boolean;
  isExpanded?: boolean;
  onToggleExpand?: (e: React.MouseEvent) => void;
  className?: string;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  icon: Icon,
  label,
  isActive = false,
  onClick,
  badge,
  isCollapsed = false,
  hasSubItems = false,
  isExpanded = false,
  onToggleExpand,
  className = '',
}) => {
  return (
    <div className="relative group">
      <button
        type="button"
        onClick={onClick}
        aria-current={isActive ? 'page' : undefined}
        aria-expanded={hasSubItems ? isExpanded : undefined}
        aria-label={isCollapsed ? (badge !== undefined && badge !== null ? `${label}, ${badge}` : label) : undefined}
        className={`w-full h-11 flex items-center px-3.5 rounded-xl text-[15px] font-medium transition-all duration-150 cursor-pointer relative select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-plum ${
          isActive
            ? 'bg-blush text-rose-plum font-semibold'
            : 'text-ink hover:bg-blush/40 hover:text-ink'
        } ${isCollapsed ? 'justify-center' : 'justify-between'} ${className}`}
      >
        {/* Active 3px plum indicator on left edge */}
        {isActive && (
          <motion.div
            layoutId="sidebar-active-indicator"
            transition={MOTION_SPRINGS.slider}
            className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r-full bg-rose-plum"
          />
        )}

        <div className={`flex items-center min-w-0 ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
          <Icon
            className={`w-5 h-5 shrink-0 transition-colors ${
              isActive ? 'text-rose-plum' : 'text-mauve-grey group-hover:text-ink'
            }`}
          />
          {!isCollapsed && (
            <span className="truncate">{label}</span>
          )}
        </div>

        {/* Right side controls: badge or expandable chevron (when expanded) */}
        {!isCollapsed && (
          <div className="flex items-center gap-1.5 shrink-0 ml-2">
            {badge !== undefined && badge !== null && (
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  isActive
                    ? 'bg-rose-plum text-white'
                    : 'bg-blush text-rose-plum'
                }`}
              >
                {badge}
              </span>
            )}
            {hasSubItems && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleExpand?.(e);
                }}
                aria-label={`Toggle ${label} subcategories`}
                className="p-1 rounded-md hover:bg-black/5 text-mauve-grey transition-colors cursor-pointer"
              >
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isExpanded ? 'rotate-180 text-rose-plum' : ''
                  }`}
                />
              </button>
            )}
          </div>
        )}
      </button>

      {/* Floating Tooltip when in Collapsed Rail Mode */}
      {isCollapsed && (
        <div
          role="tooltip"
          className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3.5 z-50 hidden group-hover:flex items-center gap-2 whitespace-nowrap bg-ink text-white text-xs font-medium px-2.5 py-1.5 rounded-lg shadow-md transition-opacity duration-150"
        >
          <span>{label}</span>
          {badge !== undefined && badge !== null && (
            <span className="bg-rose-plum text-white text-[10px] px-1.5 py-0.2 rounded-full">
              {badge}
            </span>
          )}
          <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-ink" />
        </div>
      )}
    </div>
  );
};
