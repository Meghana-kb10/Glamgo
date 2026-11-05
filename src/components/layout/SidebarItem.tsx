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
        className={`w-full h-11 flex items-center px-3.5 rounded-xl text-[15px] font-medium transition-all duration-150 cursor-pointer relative select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
          isActive
            ? 'bg-fill text-accent-pressed font-semibold'
            : 'text-text hover:bg-fill/40 hover:text-text'
        } ${isCollapsed ? 'justify-center' : 'justify-between'} ${className}`}
      >
        {/* Active 3px plum indicator on left edge */}
        {isActive && (
          <motion.div
            layoutId="sidebar-active-indicator"
            transition={MOTION_SPRINGS.slider}
            className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r-full bg-accent"
          />
        )}

        <div className={`flex items-center min-w-0 ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
          <Icon
            className={`w-5 h-5 shrink-0 transition-colors ${
              isActive ? 'text-accent' : 'text-text-muted group-hover:text-text'
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
                    ? 'bg-accent text-white'
                    : 'bg-accent-soft text-accent-pressed'
                }`}
              >
                {badge}
              </span>
            )}
            {hasSubItems && (
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleExpand?.(e);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.stopPropagation();
                    e.preventDefault();
                    onToggleExpand?.(e as any);
                  }
                }}
                aria-label={`Toggle ${label} subcategories`}
                className="p-1 rounded-md hover:bg-fill/50 text-text-muted transition-colors cursor-pointer"
              >
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isExpanded ? 'rotate-180 text-accent' : ''
                  }`}
                />
              </span>
            )}
          </div>
        )}
      </button>

      {/* Floating Tooltip when in Collapsed Rail Mode */}
      {isCollapsed && (
        <div className="absolute left-full ml-2.5 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-text text-bg text-xs font-semibold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-50 shadow-warm-modal border border-border">
          {label}
          {badge !== undefined && badge !== null && (
            <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-accent text-white text-[10px]">
              {badge}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
