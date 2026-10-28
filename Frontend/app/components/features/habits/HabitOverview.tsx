
import { CalendarDays, Check, Target } from 'lucide-react';

import type { HabitWeeklySummary, TodayHabit } from '~/lib/habits';

interface HabitOverviewProps {
  isLoading: boolean;
  todayHabits: TodayHabit[];
  weeklySummary: HabitWeeklySummary | null;
}

function formatWeekday(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString(undefined, {
    weekday: 'short',
  });
}

export default function HabitOverview({
  isLoading,
  todayHabits,
  weeklySummary,
}: HabitOverviewProps) {
  const completedToday = todayHabits.filter(
    (item) => item.completed,
  ).length;

  const weeklyPercent = Math.round(
    (weeklySummary?.completionRate ?? 0) * 100,
  );

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <article className="rounded-xl border border-[#e7e7e2] bg-white p-5">
          <div className="flex items-center gap-2 text-sm text-[#72726f]">
            <CalendarDays size={17} />
            Scheduled today
          </div>
          <p className="mt-4 text-3xl font-semibold">
            {isLoading ? '—' : todayHabits.length}
          </p>
          <p className="mt-1 text-xs text-[#72726f]">
            Habits due today
          </p>
        </article>

        <article className="rounded-xl border border-[#e7e7e2] bg-white p-5">
          <div className="flex items-center gap-2 text-sm text-[#72726f]">
            <Check size={17} />
            Completed today
          </div>
          <p className="mt-4 text-3xl font-semibold">
            {isLoading
              ? '—'
              : `${completedToday}/${todayHabits.length}`}
          </p>
          <p className="mt-1 text-xs text-[#72726f]">
            {todayHabits.length
              ? `${Math.round(
                  (completedToday / todayHabits.length) * 100,
                )}% of today's habits`
              : 'Nothing scheduled yet'}
          </p>
        </article>

        <article className="rounded-xl border border-[#e7e7e2] bg-white p-5">
          <div className="flex items-center gap-2 text-sm text-[#72726f]">
            <Target size={17} />
            This week
          </div>
          <p className="mt-4 text-3xl font-semibold">
            {isLoading ? '—' : `${weeklyPercent}%`}
          </p>
          <p className="mt-1 text-xs text-[#72726f]">
            {weeklySummary
              ? `${weeklySummary.completedActions} of ${weeklySummary.scheduledActions} scheduled actions`
              : 'Weekly summary unavailable'}
          </p>
        </article>
      </div>

      <section className="rounded-xl border border-[#e7e7e2] bg-white p-5 sm:p-6">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Weekly activity</h2>
            <p className="mt-1 text-sm text-[#72726f]">
              Your progress from Monday through Sunday.
            </p>
          </div>
          <CalendarDays size={21} className="text-[#72726f]" />
        </div>

        {isLoading ? (
          <p className="py-6 text-center text-sm text-[#72726f]">
            Loading weekly activity...
          </p>
        ) : weeklySummary ? (
          <div className="grid grid-cols-7 gap-2 sm:gap-4">
            {weeklySummary.days.map((day) => {
              const percentage =
                day.scheduled > 0
                  ? Math.round((day.completed / day.scheduled) * 100)
                  : 0;

              const height =
                day.scheduled > 0
                  ? Math.max(10, Math.round((percentage / 100) * 48))
                  : 4;

              return (
                <div
                  key={day.date}
                  title={`${day.completed} completed of ${day.scheduled} scheduled`}
                  className="flex min-w-0 flex-col items-center gap-2"
                >
                  <span className="text-xs text-[#72726f]">
                    {formatWeekday(day.date)}
                  </span>
                  <div className="flex h-14 w-full items-end justify-center">
                    <div
                      className="w-full max-w-10 rounded-t-md bg-[#fa3600] transition-all"
                      style={{
                        height: `${height}px`,
                        opacity:
                          day.scheduled === 0
                            ? 0.18
                            : 0.3 + percentage / 140,
                      }}
                    />
                  </div>
                  <span className="text-xs font-medium">
                    {day.scheduled
                      ? `${day.completed}/${day.scheduled}`
                      : '—'}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-[#72726f]">
            Weekly activity is unavailable.
          </p>
        )}
      </section>
    </>
  );
}
