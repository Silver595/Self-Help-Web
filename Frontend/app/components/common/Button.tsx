import React from 'react';
import { Plus } from 'lucide-react';

interface ActionButtonProps {
  label?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

/**
 * ActionButton - A reusable bold orange pill button with an icon, 
 * typically used for quick actions or capture triggers.
 */
export default function ActionButton({
  label = "QUICK CAPTURE",
  icon = <Plus size={16} strokeWidth={2.5} />,
  onClick = () => {},
  className = "",
}: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#ff3d00] text-[11px] font-bold tracking-wider text-white shadow-[0_10px_20px_-4px_rgba(255,61,0,0.35)] transition-colors hover:bg-[#e03600] cursor-pointer font-mono ${className}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}