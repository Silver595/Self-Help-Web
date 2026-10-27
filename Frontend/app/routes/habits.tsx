
import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import {
  CalendarDays,
  Check,
  Flame,
  LoaderCircle,
  Plus,
  Search,
  Target,
  X,
} from 'lucide-react';

import {
  createHabit,
  getHabits,
  getTodayHabits,
  getHabitWeeklySummary,
  setHabitProgress,
  removeHabitProgress,
  type Habit,
  type HabitScheduleType,
  type CreateHabitInput,
  type TodayHabit,
  type HabitWeeklySummary,
} from '~/lib/habits';

const inputClass =
  'mt-1 w-full rounded-lg border border-[#d8d8d3] bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#fa3600] focus:ring-2 focus:ring-[#fa3600]/10';

const primaryButtonClass =
  'inline-flex items-center justify-center gap-2 rounded-lg bg-[#fa3600] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#d92f00] disabled:cursor-not-allowed disabled:opacity-50';

const secondaryButtonClass =
  'inline-flex items-center justify-center gap-2 rounded-lg border border-[#d8d8d3] bg-white px-4 py-2.5 text-sm font-medium text-[#333] transition hover:bg-[#f6f6f3] disabled:opacity-50';

const DAYS = [
  { label: 'Sun', value: 0 },
  { label: 'Mon', value: 1 },
  { label: 'Tue', value: 2 },
  { label: 'Wed', value: 3 },
  { label: 'Thu', value: 4 },
  { label: 'Fri', value: 5 },
  { label: 'Sat', value: 6 },
];

function toDateString(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function getWeekRange() {
  const today = new Date();
  const monday = new Date(today);

  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  return {
    from: toDateString(monday),
    to: toDateString(sunday),
  };
}

function getScheduleLabel(habit: Habit) {
  if (habit.schedule.type === 'daily') return 'Every day';
  if (habit.schedule.type === 'weekdays') return 'Weekdays';

  return habit.schedule.daysOfWeek
    .map((day) => DAYS.find((item) => item.value === day)?.label)
    .filter(Boolean)
    .join(', ');
}

function formatWeekday(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString(undefined, {
    weekday: 'short',
  });
}

export default function HabitsPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [todayHabits, setTodayHabits] = useState<TodayHabit[]>([]);
  const [weeklySummary, setWeeklySummary] =
    useState<HabitWeeklySummary | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [search, setSearch] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Create-form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [scheduleType, setScheduleType] =
    useState<HabitScheduleType>('daily');
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [targetCount, setTargetCount] = useState('1');
  const [targetUnit, setTargetUnit] = useState('times');
  const [startDate, setStartDate] = useState(() => toDateString(new Date()));
  const [color, setColor] = useState('#fa3600');

  const loadData = useCallback(async (showLoading = true) => {
    if (showLoading) setIsLoading(true);

    setError('');

    try {
      const { from, to } = getWeekRange();

      const [habitData, todayData, summaryData] = await Promise.all([
        getHabits(),
        getTodayHabits(),
        getHabitWeeklySummary(from, to),
      ]);

      setHabits(habitData);
      setTodayHabits(todayData);
      setWeeklySummary(summaryData);
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : 'Unable to load your habits. Please try again.',
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const todayById = useMemo(
    () => new Map(todayHabits.map((item) => [item.habit._id, item])),
    [todayHabits],
  );

  const filteredHabits = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return habits;

    return habits.filter((habit) =>
      [
        habit.title,
        habit.description,
        ...habit.tags,
      ]
        .join(' ')
        .toLowerCase()
        .includes(query),
    );
  }, [habits, search]);

  const completedToday = todayHabits.filter(
    (item) => item.completed,
  ).length;

  const weeklyPercent = Math.round(
    (weeklySummary?.completionRate ?? 0) * 100,
  );

  function resetCreateForm() {
    setTitle('');
    setDescription('');
    setTagsInput('');
    setScheduleType('daily');
    setSelectedDays([1, 2, 3, 4, 5]);
    setTargetCount('1');
    setTargetUnit('times');
    setStartDate(toDateString(new Date()));
    setColor('#fa3600');
  }

  function toggleDay(day: number) {
    setSelectedDays((current) =>
      current.includes(day)
        ? current.filter((item) => item !== day)
        : [...current, day].sort(),
    );
  }

  async function handleCreateHabit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setNotice('');

    if (scheduleType === 'custom' && selectedDays.length === 0) {
      setError('Choose at least one day for a custom schedule.');
      return;
    }

    const count = Number(targetCount);

    if (!Number.isInteger(count) || count < 1) {
      setError('The daily target must be a whole number of at least 1.');
      return;
    }

    const data: CreateHabitInput = {
      title: title.trim(),
      description: description.trim() || undefined,
      tags: tagsInput
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean)
        .slice(0, 10),
      schedule: {
        type: scheduleType,
        daysOfWeek: scheduleType === 'custom' ? selectedDays : [],
      },
      target: {
        count,
        unit: targetUnit.trim() || 'times',
      },
      timezone:
        Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata',
      startDate,
      color,
    };

    setIsSaving(true);

    try {
      await createHabit(data);
      setIsCreateOpen(false);
      resetCreateForm();
      setNotice('Habit created successfully.');
      await loadData(false);
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : 'Unable to create this habit.',
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleToggleProgress(item: TodayHabit) {
    setError('');
    setNotice('');
    setUpdatingId(item.habit._id);

    try {
      if (item.completed) {
        await removeHabitProgress(item.habit._id, item.date);
        setNotice(`Completion removed for "${item.habit.title}".`);
      } else {
        await setHabitProgress(
          item.habit._id,
          item.date,
          item.target,
        );
        setNotice(`"${item.habit.title}" marked complete.`);
      }

      await loadData(false);
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : 'Unable to update habit progress.',
      );
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <section className="mx-auto w-full max-w-6xl space-y-8 px-2 py-4 text-[#282828] sm:px-4">
      {/* Page heading and create action */}
      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#72726f]">
            Your daily practices
          </p>

          <h1 className="text-4xl font-normal tracking-tight sm:text-5xl">
            Habits
          </h1>

          <p className="mt-3 text-sm text-[#626260]">
            Build routines that support the life you want.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setError('');
            setNotice('');
            setIsCreateOpen(true);
          }}
          className={primaryButtonClass}
        >
          <Plus size={17} />
          New habit
        </button>
      </header>

      {/* API feedback */}
      {error && (
        <div
          role="alert"
          className="flex items-start justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          <p>{error}</p>
          <button
            type="button"
            aria-label="Dismiss error"
            onClick={() => setError('')}
          >
            <X size={17} />
          </button>
        </div>
      )}

      {notice && (
        <div
          role="status"
          className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
        >
          {notice}
        </div>
      )}

      {/* Overview cards */}
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
            {isLoading ? '—' : `${completedToday}/${todayHabits.length}`}
          </p>

          <p className="mt-1 text-xs text-[#72726f]">
            {todayHabits.length > 0
              ? `${Math.round((completedToday / todayHabits.length) * 100)}% of today's habits`
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
              : 'Weekly completion rate'}
          </p>
        </article>
      </div>

      {/* Weekly activity */}
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
          <div className="flex h-20 items-center justify-center gap-2 text-sm text-[#72726f]">
            <LoaderCircle size={18} className="animate-spin" />
            Loading weekly activity...
          </div>
        ) : weeklySummary ? (
          <div className="grid grid-cols-7 gap-2 sm:gap-4">
            {weeklySummary.days.map((day) => {
              const percentage =
                day.scheduled > 0
                  ? Math.round((day.completed / day.scheduled) * 100)
                  : 0;

              const barHeight =
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
                        height: `${barHeight}px`,
                        opacity: day.scheduled === 0 ? 0.18 : 0.3 + percentage / 140,
                      }}
                    />
                  </div>

                  <span className="text-xs font-medium">
                    {day.scheduled > 0
                      ? `${day.completed}/${day.scheduled}`
                      : '—'}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-[#72726f]">
            Weekly activity is not available yet.
          </p>
        )}
      </section>

      {/* Today's habits */}
      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Your habits</h2>
            <p className="mt-1 text-sm text-[#72726f]">
              Track your progress and keep your streak alive.
            </p>
          </div>

          <label className="relative block w-full sm:max-w-xs">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#858580]"
            />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search habits or tags..."
              aria-label="Search habits"
              className="w-full rounded-lg border border-[#d8d8d3] bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[#fa3600]"
            />
          </label>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center gap-2 rounded-xl border border-[#e7e7e2] bg-white p-10 text-sm text-[#72726f]">
            <LoaderCircle size={18} className="animate-spin" />
            Loading your habits...
          </div>
        ) : filteredHabits.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#d8d8d3] bg-white px-6 py-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#fff0eb] text-[#fa3600]">
              <Target size={23} />
            </div>

            <h3 className="mt-4 text-lg font-medium">
              {search ? 'No matching habits' : 'Start with one small habit'}
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm text-[#72726f]">
              {search
                ? 'Try a different search term.'
                : 'Create your first habit and begin building a routine that works for you.'}
            </p>

            {!search && (
              <button
                type="button"
                onClick={() => setIsCreateOpen(true)}
                className={`${primaryButtonClass} mt-5`}
              >
                <Plus size={17} />
                Create your first habit
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-[#ededE8] overflow-hidden rounded-xl border border-[#e7e7e2] bg-white">
            {filteredHabits.map((habit) => {
              const todayRecord = todayById.get(habit._id);
              const isDueToday = Boolean(todayRecord);
              const isCompleted = todayRecord?.completed ?? false;
              const isUpdating = updatingId === habit._id;

              const progress = todayRecord
                ? Math.min(
                    100,
                    Math.round(
                      (todayRecord.value / Math.max(todayRecord.target, 1)) *
                        100,
                    ),
                  )
                : 0;

              return (
                <article
                  key={habit._id}
                  className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
                >
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
                          <span className="rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-green-700">
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

                      {!isDueToday && (
                        <p className="mt-2 text-xs text-[#858580]">
                          Not scheduled today
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="sm:shrink-0">
                    {isDueToday && todayRecord ? (
                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() => void handleToggleProgress(todayRecord)}
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

                        {isCompleted ? 'Undo completion' : 'Mark complete'}
                      </button>
                    ) : (
                      <span className="inline-flex rounded-lg bg-[#f4f4f1] px-3 py-2 text-xs text-[#72726f]">
                        Rest day
                      </span>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {!isLoading && habits.length > 0 && (
          <p className="text-right text-xs text-[#858580]">
            Showing {filteredHabits.length} of {habits.length} habits
          </p>
        )}
      </section>

      {/* Create habit modal */}
      {isCreateOpen && (
        <div
          className="fixed inset-0 z-[100] grid place-items-center overflow-y-auto bg-black/40 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !isSaving) {
              setIsCreateOpen(false);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-habit-title"
            className="my-auto max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-xl border border-[#e7e7e2] bg-white p-5 shadow-xl sm:p-7"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#72726f]">
                  New practice
                </p>

                <h2
                  id="create-habit-title"
                  className="mt-2 text-2xl font-normal"
                >
                  Create a habit
                </h2>

                <p className="mt-2 text-sm text-[#72726f]">
                  Define a routine you can realistically repeat.
                </p>
              </div>

              <button
                type="button"
                disabled={isSaving}
                onClick={() => setIsCreateOpen(false)}
                aria-label="Close create habit dialog"
                className="rounded-lg p-2 text-[#72726f] hover:bg-[#f4f4f1] disabled:opacity-50"
              >
                <X size={19} />
              </button>
            </div>

            <form onSubmit={handleCreateHabit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="habit-title" className="text-sm font-medium">
                  Habit name *
                </label>

                <input
                  id="habit-title"
                  required
                  maxLength={80}
                  autoFocus
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="e.g. Read for 20 minutes"
                  className={inputClass}
                />
              </div>

              <div>
                <label
                  htmlFor="habit-description"
                  className="text-sm font-medium"
                >
                  Description
                </label>

                <textarea
                  id="habit-description"
                  maxLength={300}
                  rows={2}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Why is this habit important to you?"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="habit-tags" className="text-sm font-medium">
                  Tags
                </label>

                <input
                  id="habit-tags"
                  value={tagsInput}
                  onChange={(event) => setTagsInput(event.target.value)}
                  placeholder="health, learning, focus"
                  className={inputClass}
                />

                <p className="mt-1 text-xs text-[#858580]">
                  Separate tags with commas, up to 10 tags.
                </p>
              </div>

              <div>
                <label htmlFor="habit-schedule" className="text-sm font-medium">
                  Schedule
                </label>

                <select
                  id="habit-schedule"
                  value={scheduleType}
                  onChange={(event) =>
                    setScheduleType(event.target.value as HabitScheduleType)
                  }
                  className={inputClass}
                >
                  <option value="daily">Every day</option>
                  <option value="weekdays">Monday to Friday</option>
                  <option value="custom">Choose specific days</option>
                </select>
              </div>

              {scheduleType === 'custom' && (
                <fieldset>
                  <legend className="text-sm font-medium">
                    Repeat on *
                  </legend>

                  <div className="mt-2 flex flex-wrap gap-2">
                    {DAYS.map((day) => {
                      const selected = selectedDays.includes(day.value);

                      return (
                        <button
                          key={day.value}
                          type="button"
                          aria-pressed={selected}
                          onClick={() => toggleDay(day.value)}
                          className={`rounded-lg border px-3 py-2 text-xs transition ${
                            selected
                              ? 'border-[#fa3600] bg-[#fff0eb] text-[#c32c00]'
                              : 'border-[#d8d8d3] bg-white text-[#626260] hover:bg-[#f6f6f3]'
                          }`}
                        >
                          {day.label}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="habit-target-count"
                    className="text-sm font-medium"
                  >
                    Daily target *
                  </label>

                  <input
                    id="habit-target-count"
                    type="number"
                    min={1}
                    max={100000}
                    step={1}
                    required
                    value={targetCount}
                    onChange={(event) => setTargetCount(event.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label
                    htmlFor="habit-target-unit"
                    className="text-sm font-medium"
                  >
                    Target unit
                  </label>

                  <input
                    id="habit-target-unit"
                    maxLength={20}
                    value={targetUnit}
                    onChange={(event) => setTargetUnit(event.target.value)}
                    placeholder="pages, glasses, times..."
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="habit-start-date" className="text-sm font-medium">
                    Start date *
                  </label>

                  <input
                    id="habit-start-date"
                    type="date"
                    required
                    value={startDate}
                    onChange={(event) => setStartDate(event.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="habit-color" className="text-sm font-medium">
                    Accent color
                  </label>

                  <input
                    id="habit-color"
                    type="color"
                    value={color}
                    onChange={(event) => setColor(event.target.value)}
                    className="mt-1 h-[42px] w-full cursor-pointer rounded-lg border border-[#d8d8d3] bg-white p-1"
                  />
                </div>
              </div>

              <div className="flex flex-col-reverse gap-2 border-t border-[#ededE8] pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => setIsCreateOpen(false)}
                  className={secondaryButtonClass}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className={primaryButtonClass}
                >
                  {isSaving && (
                    <LoaderCircle size={16} className="animate-spin" />
                  )}
                  {isSaving ? 'Creating...' : 'Create habit'}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </section>
  );
}
