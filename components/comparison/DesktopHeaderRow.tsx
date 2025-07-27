// components/comparison/DesktopHeaderRow.tsx
import React from 'react';

interface DesktopHeaderRowProps {
  label: string;
  showDetails: boolean;
}

export const DesktopHeaderRow: React.FC<DesktopHeaderRowProps> = ({ label, showDetails }) => {
  const rowClass = `sticky left-0 z-10 bg-background border-b md:border-b-0 md:border-r flex flex-col p-3 transition-all duration-300 ${showDetails ? 'h-[5.5rem]' : 'h-14'}`;
  
  return (
    <div className={rowClass}>
      <span className="font-bold text-xs text-foreground">{label}</span>
    </div>
  );
};