import React from 'react';
import {
  BookOpen,
  CheckCircle2,
  Archive,
  Pencil,
  RotateCcw,
  Trash2,
} from 'lucide-react';
import {
  updateHabit,
  getArchivedHabits,
  archiveHabit,
  restoreHabit,
  deleteHabit
} from '~/lib/habits';

interface PracticeItemRowProps {
  title?: string;
  category?: string;
  duration?: string;
  completed?: boolean;
  icon?: React.ReactNode;
  onToggle?: () => void;
  className?: string;
}

/**
 * PracticeItemRow - A reusable list item component representing a daily practice or habit,
 * complete with an icon box, title, category metadata, duration, and a completion toggle button.
 */
export default function PracticeItemRow({
  title = 'Reading',
  category = 'Learning · Every day',
  duration = '20 min',
  completed = true,
  icon = <BookOpen size={16} className='text-[#ff3d00]' />,
  onToggle = () => {},
  className = '',
}: PracticeItemRowProps) {
  return (
    <div
      className={`flex items-center justify-between py-3.5 px-4 border-b border-b-gray-400 rounded-xl transition-all font-mono text-[12px] ${className}`}
    >
      {/* Left Group: Icon + Title & Category Metadata */}
      <div className='flex items-center gap-3.5'>
        <span className='flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-300 bg-white shadow-sm'>
          {icon}
        </span>
        <div>
          <div className='font-sans font-semibold text-neutral-900 text-[13px]'>
            {title}
          </div>
          <div className='text-[11px] text-neutral-500'>{category}</div>
        </div>
      </div>

      {/* Right Group: Duration + Interactive Completion Button */}
      <div className='flex items-center gap-5'>
        <span className='text-[11px] text-neutral-400 font-medium'>
          {duration}
        </span>
        <button
          onClick={onToggle}
          className={`rounded-lg border px-3.5 py-1.5 text-[10px] font-bold tracking-wider transition-all cursor-pointer ${
            completed
              ? 'border-[#ff3d00] bg-[#ff3d00] text-white shadow-sm'
              : 'border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-100 shadow-sm'
          }`}
        >
          {completed ? 'COMPLETED' : 'MARK DONE'}
        </button>
      </div>
    </div>
  );
}
