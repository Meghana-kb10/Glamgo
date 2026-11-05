import React from 'react';

export interface SidebarGroupProps {
  title?: string;
  isCollapsed?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const SidebarGroup: React.FC<SidebarGroupProps> = ({
  title,
  isCollapsed = false,
  children,
  className = '',
}) => {
  return (
    <div className={`space-y-1 ${className}`}>
      {title && !isCollapsed && (
        <div className="px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-text-muted select-none">
          {title}
        </div>
      )}
      {title && isCollapsed && (
        <div className="my-2 border-t border-border mx-2" aria-hidden="true" />
      )}
      <div className="space-y-1">
        {children}
      </div>
    </div>
  );
};
