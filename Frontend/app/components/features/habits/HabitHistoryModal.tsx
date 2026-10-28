
import { useEffect } from 'react';
import {
  CalendarDays,
  CheckCircle2,
  Flame,
  LoaderCircle,
  Trophy,
  X,
} from 'lucide-react';

import { useHabitStats } from '~/hooks/useHabitStats';
import type { Habit } from '~/lib/habits';

interface HabitHistoryModalProps {
  habit: Habit;
  onClose: () => void;
}

function formatDate(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatShortDate(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

const statCardClass =
  'rounded-xl border border-[#e7e7e2] bg-white p-4';

export default function HabitHistoryModal({
  habit,
  onClose,
}: HabitHistoryModalProps) {
  const { stats, isLoading, error } = useHabitStats(habit._id);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const completionPercent = stats
    ? Math.round(stats.completionRate * 100)
    : 0;

  const days = stats ? [...stats.days].reverse() : [];

  return (
    <div
      className="fixed inset-0 z-[110] grid place-items-center overflow-y-auto bg-black/40 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="habit-history-title"
        className="my-auto max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl border border-[#e7e7e2] bg-[#fafaf8] p-5 shadow-xl sm:p-7"
      >
        <header className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <div
              className="mt-1 h-10 w-1.5 shrink-0 rounded-full"
              style={{ backgroundColor: habit.color }}
            />

            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#72726f]">
                Habit analytics
              </p>

              <h2
                id="habit-history-title"
                className="mt-2 break-words text-2xl font-normal"
              >
                {habit.title}
              </h2>

              <p className="mt-1 text-sm text-[#72726f]">
                Progress history and consistency.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close habit history"
            className="rounded-lg p-2 text-[#72726f] hover:bg-[#ededE8]"
          >
            <X size={20} />
          </button>
        </header>

        {isLoading ? (
          <div className="flex min-h-48 items-center justify-center gap-2 text-sm text-[#72726f]">
            <LoaderCircle size={19} className="animate-spin" />
            Loading habit history...
          </div>
        ) : error ? (
          <div
            role="alert"
            className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800"
          >
            {error}
          </div>
        ) : stats ? (
          <div className="mt-6 space-y-6">
            <p className="text-xs text-[#72726f]">
              Period: {formatDate(stats.from)} to {formatDate(stats.to)}
            </p>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <article className={statCardClass}>
                <div className="flex items-center gap-2 text-xs text-[#72726f]">
                  <CheckCircle2 size={15} />
                  Completion
                </div>

                <p className="mt-3 text-2xl font-semibold">
                  {completionPercent}%
                </p>

                <p className="mt-1 text-xs text-[#72726f]">
                  {stats.completedDays} of {stats.scheduledDays} days
                </p>
              </article>

              <article className={statCardClass}>
                <div className="flex items-center gap-2 text-xs text-[#72726f]">
                  <CalendarDays size={15} />
                  Scheduled
                </div>

                <p className="mt-3 text-2xl font-semibold">
                  {stats.scheduledDays}
                </p>

                <p className="mt-1 text-xs text-[#72726f]">
                  Days due in this period
                </p>
              </article>

              <article className={statCardClass}>
                <div className="flex items-center gap-2 text-xs text-[#72726f]">
                  <Flame size={15} />
                  Current streak
                </div>

                <p className="mt-3 text-2xl font-semibold">
                  {stats.currentStreak}
                </p>

                <p className="mt-1 text-xs text-[#72726f]">
                  Consecutive scheduled days
                </p>
              </article>

              <article className={statCardClass}>
                <div className="flex items-center gap-2 text-xs text-[#72726f]">
                  <Trophy size={15} />
                  Best streak
                </div>

                <p className="mt-3 text-2xl font-semibold">
                  {stats.longestStreak}
                </p>

                <p className="mt-1 text-xs text-[#72726f]">
                  Longest consecutive streak
                </p>
              </article>
            </div>

            <section className="rounded-xl border border-[#e7e7e2] bg-white p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="font-semibold">Daily history</h3>
                  <p className="mt-1 text-xs text-[#72726f]">
                    Target: {habit.target.count} {habit.target.unit} per scheduled day
                  </p>
                </div>

                <span className="text-xs text-[#72726f]">
                  Latest first
                </span>
              </div>

              <div className="mt-4 max-h-80 space-y-3 overflow-y-auto pr-1">
                {days.length === 0 ? (
                  <p className="py-6 text-center text-sm text-[#72726f]">
                    No history available for this habit yet.
                  </p>
                ) : (
                  days.map((day) => {
                    const progress = day.scheduled
                      ? Math.min(
                          100,
                          Math.round(
                            (day.value /
                              Math.max(habit.target.count, 1)) *
                              100,
                          ),
                        )
                      : 0;

                    const status = !day.scheduled
                      ? 'Not scheduled'
                      : day.completed
                        ? 'Completed'
                        : 'Not completed';

                    return (
                      <article
                        key={day.date}
                        className="flex items-center gap-3 border-b border-[#f0f0ec] pb-3 last:border-0 last:pb-0"
                      >
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                            !day.scheduled
                              ? 'bg-[#f4f4f1] text-[#858580]'
                              : day.completed
                                ? 'bg-green-50 text-green-700'
                                : 'bg-red-50 text-red-700'
                          }`}
                        >
                          {day.completed && day.scheduled ? (
                            <CheckCircle2 size={17} />
                          ) : (
                            <CalendarDays size={17} />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="text-sm font-medium">
                              {formatShortDate(day.date)}
                            </p>

                            <span className="text-xs text-[#72726f]">
                              {status}
                            </span>
                          </div>

                          {day.scheduled && (
                            <>
                              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#ededE8]">
                                <div
                                  className="h-full rounded-full transition-all"
                                  style={{
                                    width: `${progress}%`,
                                    backgroundColor: habit.color,
                                  }}
                                />
                              </div>

                              <p className="mt-1 text-xs text-[#858580]">
                                {day.value} of {habit.target.count}{' '}
                                {habit.target.unit}
                              </p>
                            </>
                          )}
                        </div>
                      </article>
                    );
                  })
                )}
              </div>
            </section>
          </div>
        ) : null}
      </section>
    </div>
  );
}
