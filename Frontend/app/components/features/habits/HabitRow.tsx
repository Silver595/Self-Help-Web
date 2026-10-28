import {
  Archive,
  Check,
  Flame,
  History,
  LoaderCircle,
  Pencil,
  RotateCcw,
  Trash2,
} from 'lucide-react';

import type { Habit, TodayHabit } from '~/lib/habits';

interface HabitRowProps {
  habit: Habit;
  todayRecord?: TodayHabit;
  showArchived: boolean;
  isUpdating: boolean;
  onEdit: (habit: Habit) => void;
  onViewHistory: (habit: Habit) => void;
  onProgress: (item: TodayHabit) => void;
  onManage: (
    habit: Habit,
    action: 'archive' | 'restore' | 'delete',
  ) => void;
}

const primaryButtonClass =
  'inline-flex items-center justify-center gap-2 rounded-lg bg-[#fa3600] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#d92f00] disabled:cursor-not-allowed disabled:opacity-50';

const secondaryButtonClass =
  'inline-flex items-center justify-center gap-2 rounded-lg border border-[#d8d8d3] bg-white px-3 py-2.5 text-sm font-medium text-[#333] transition hover:bg-[#f6f6f3] disabled:cursor-not-allowed disabled:opacity-50';

const dangerButtonClass =
  'inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2.5 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:opacity-50';

const DAYS = [
  'Sun',
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
];

function getScheduleLabel(habit: Habit) {
  if (habit.schedule.type === 'daily') return 'Every day';
  if (habit.schedule.type === 'weekdays') return 'Weekdays';

  return habit.schedule.daysOfWeek
    .map((day) => DAYS[day])
    .filter(Boolean)
    .join(', ');
}

export default function HabitRow({
  habit,
  todayRecord,
  showArchived,
  isUpdating,
  onEdit,
  onViewHistory,
  onProgress,
  onManage,
}: HabitRowProps) {
  const isDueToday = Boolean(todayRecord) && !showArchived;
  const isCompleted = todayRecord?.completed ?? false;

  const progress = todayRecord
    ? Math.min(
        100,
        Math.round(
          (todayRecord.value /
            Math.max(todayRecord.target, 1)) *
            100,
        ),
      )
    : 0;

  function handleManage(
    action: 'archive' | 'restore' | 'delete',
  ) {
    const messages = {
      archive: `Archive "${habit.title}"?`,
      restore: `Restore "${habit.title}"?`,
      delete: `Permanently delete "${habit.title}" and its progress history? This cannot be undone.`,
    };

    if (
      action !== 'restore' &&
      !window.confirm(messages[action])
    ) {
      return;
    }

    onManage(habit, action);
  }

  return (
    <article className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
      <div className="flex min-w-0 items-start gap-3">
        <div
          className="mt-1 h-10 w-1.5 shrink-0 rounded-full"
          style={{ backgroundColor: habit.color }}
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="break-words font-semibold">
              {habit.title}
            </h3>

            {isCompleted && (
              <span className="rounded-full bg-orange-50-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#fa3600]">
                Completed
              </span>
            )}
          </div>

          {habit.description && (
            <p className="mt-1 break-words text-sm text-[#72726f]">
              {habit.description}
            </p>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#72726f]">
            <span>{getScheduleLabel(habit)}</span>

            <span>
              Target: {habit.target.count} {habit.target.unit}
            </span>

            {habit.currentStreak > 0 && (
              <span className="inline-flex items-center gap-1">
                <Flame size={13} />
                {habit.currentStreak}-day streak
              </span>
            )}
          </div>

          {habit.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {habit.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-[#f4f4f1] px-2 py-1 text-[11px] text-[#626260]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {isDueToday && todayRecord && (
            <div className="mt-3 max-w-sm">
              <div className="mb-1.5 flex justify-between text-xs text-[#72726f]">
                <span>Today's progress</span>
                <span>
                  {todayRecord.value}/{todayRecord.target}
                </span>
              </div>

              <div className="h-1.5 overflow-hidden rounded-full bg-[#ededE8]">
                <div
                  className="h-full rounded-full bg-[#fa3600] transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {!showArchived && !isDueToday && (
            <p className="mt-2 text-xs text-[#858580]">
              Not scheduled today
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
        <button
          type="button"
          disabled={isUpdating}
          onClick={() => onViewHistory(habit)}
          className={secondaryButtonClass}
        >
          <History size={15} />
          History
        </button>

        {showArchived ? (
          <>
            <button
              type="button"
              disabled={isUpdating}
              onClick={() => handleManage('restore')}
              className={secondaryButtonClass}
            >
              {isUpdating ? (
                <LoaderCircle size={15} className="animate-spin" />
              ) : (
                <RotateCcw size={15} />
              )}
              Restore
            </button>

            <button
              type="button"
              disabled={isUpdating}
              onClick={() => handleManage('delete')}
              className={dangerButtonClass}
            >
              {isUpdating ? (
                <LoaderCircle size={15} className="animate-spin" />
              ) : (
                <Trash2 size={15} />
              )}
              Delete
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              disabled={isUpdating}
              onClick={() => onEdit(habit)}
              className={secondaryButtonClass}
            >
              <Pencil size={15} />
              Edit
            </button>

            <button
              type="button"
              disabled={isUpdating}
              onClick={() => handleManage('archive')}
              className={secondaryButtonClass}
            >
              {isUpdating ? (
                <LoaderCircle size={15} className="animate-spin" />
              ) : (
                <Archive size={15} />
              )}
              Archive
            </button>

            {isDueToday && todayRecord ? (
              <button
                type="button"
                disabled={isUpdating}
                onClick={() => onProgress(todayRecord)}
                className={
                  isCompleted
                    ? secondaryButtonClass
                    : primaryButtonClass
                }
              >
                {isUpdating ? (
                  <LoaderCircle size={16} className="animate-spin" />
                ) : (
                  <Check size={16} />
                )}

                {isCompleted
                  ? 'Undo completion'
                  : 'Mark complete'}
              </button>
            ) : (
              <span className="inline-flex rounded-lg bg-[#f4f4f1] px-3 py-2.5 text-xs text-[#72726f]">
                Rest day
              </span>
            )}
          </>
        )}
      </div>
    </article>
  );
}
