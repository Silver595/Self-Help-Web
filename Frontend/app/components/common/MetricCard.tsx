import React from 'react';

interface MetricProgressCardProps {
  title?: string;
  current?: number;
  total?: number;
  description?: string;
  className?: string;
}

/**
 * MetricProgressCard - A reusable card component to display a progress ratio 
 * (e.g. 0/4), an animated progress bar, and an accompanying description.
 */
export default function MetricProgressCard({
  title = "TODAY'S RHYTHM",
  current = 0,
  total = 4,
  description = "No perfect day required. Your history is made one useful action at a time.",
  className = "",
}: MetricProgressCardProps) {
  // Calculate progress percentage for the bar width
  const percentage = total > 0 ? Math.min(Math.max((current / total) * 100, 0), 100) : 0;

  return (
    <div
      className={`rounded-2xl border border-[##72726F]] bg-[#f8f8f8] p-5 shadow-[0_8px_20px_-6px_rgba(0,0,0,0.05)] font-mono ${className}`}
    >
      {/* Card Section Header */}
      <h4 className="text-[10px] font-bold tracking-widest text-neutral-400 mb-3">
        {title}
      </h4>

      {/* Metric Ratio Display (Current / Total) */}
      <div className="font-sans text-3xl font-semibold text-neutral-900 mb-3">
        {current}
        <span className="text-neutral-400 text-lg font-normal">/{total}</span>
      </div>

      {/* Progress Track & Fill Bar */}
      <div className="h-1.5 w-full bg-neutral-200 rounded-full mb-3 overflow-hidden">
        <div
          className="h-full bg-[#ff3d00] transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Supporting Description / Quote */}
      <p className="font-sans text-[11px] text-neutral-500 leading-relaxed">
        {description}
      </p>
    </div>
  );
}