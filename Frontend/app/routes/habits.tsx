
import { useMemo, useState } from 'react';
import { Archive, Plus } from 'lucide-react';

import HabitFormModal from '~/components/features/habits/HabitFormModal';
import HabitHistoryModal from '~/components/features/habits/HabitHistoryModal';
import HabitOverview from '~/components/features/habits/HabitOverview';
import HabitFilters from '~/components/features/habits/HabitFilters';
import HabitList from '~/components/features/habits/HabitList';

import { useHabits } from '~/hooks/useHabits';
import type { Habit } from '~/lib/habits';
import ReminderSettings from '~/components/features/habits/ReminderSettings';

const primaryButtonClass =
  'inline-flex items-center justify-center gap-2 rounded-lg bg-[#fa3600] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#d92f00] disabled:opacity-50';

const secondaryButtonClass =
  'inline-flex items-center justify-center gap-2 rounded-lg border border-[#d8d8d3] bg-white px-4 py-2.5 text-sm font-medium text-[#333] transition hover:bg-[#f6f6f3] disabled:opacity-50';

export default function HabitsPage() {
  const [showArchived, setShowArchived] = useState(false);
  const [selectedTag, setSelectedTag] = useState('all');
  const [search, setSearch] = useState('');

  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [historyHabit, setHistoryHabit] = useState<Habit | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const {
    habits,
    todayHabits,
    weeklySummary,
    isLoading,
    isSaving,
    updatingId,
    error,
    notice,
    setError,
    setNotice,
    clearMessages,
    saveHabit,
    toggleProgress,
    adjustProgress,
    manageHabit,
  } = useHabits(showArchived);

  const availableTags = useMemo(
    () => [...new Set(habits.flatMap((habit) => habit.tags))].sort(),
    [habits],
  );

  const filteredHabits = useMemo(() => {
    const query = search.trim().toLowerCase();

    return habits.filter((habit) => {
      const matchesSearch = [
        habit.title,
        habit.description,
        ...habit.tags,
      ]
        .join(' ')
        .toLowerCase()
        .includes(query);

      const matchesTag =
        selectedTag === 'all' ||
        habit.tags.includes(selectedTag);

      return matchesSearch && matchesTag;
    });
  }, [habits, search, selectedTag]);

  function openCreateForm() {
    clearMessages();
    setEditingHabit(null);
    setIsFormOpen(true);
  }

  function openEditForm(habit: Habit) {
    clearMessages();
    setEditingHabit(habit);
    setIsFormOpen(true);
  }

  function openHistory(habit: Habit) {
    clearMessages();
    setHistoryHabit(habit);
  }

  function closeHistory() {
    setHistoryHabit(null);
  }

  function closeForm() {
    if (isSaving) return;

    setIsFormOpen(false);
    setEditingHabit(null);
  }

  async function handleSaveHabit(
    data: Parameters<typeof saveHabit>[1],
  ) {
    const succeeded = await saveHabit(editingHabit, data);

    if (succeeded) {
      setIsFormOpen(false);
      setEditingHabit(null);
    }

    return succeeded;
  }

  function toggleArchivedView() {
    clearMessages();
    setSearch('');
    setSelectedTag('all');
    setShowArchived((current) => !current);
  }

  return (
    <section className="mx-auto w-full max-w-6xl space-y-8 px-2 py-4 text-[#282828] sm:px-4">
      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#72726f]">
            {showArchived ? 'Your saved history' : 'Your daily practices'}
          </p>

          <h1 className="text-4xl font-normal tracking-tight sm:text-5xl">
            {showArchived ? 'Archived habits' : 'Habits'}
          </h1>

          <p className="mt-3 text-sm text-[#626260]">
            {showArchived
              ? 'Restore an old routine or permanently remove it.'
              : 'Build routines that support the life you want.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={toggleArchivedView}
            className={secondaryButtonClass}
          >
            <Archive size={16} />
            {showArchived ? 'Active habits' : 'Archived habits'}
          </button>

          {!showArchived && (
            <button
              type="button"
              onClick={openCreateForm}
              className={primaryButtonClass}
            >
              <Plus size={17} />
              New habit
            </button>
          )}
        </div>
      </header>

      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          <div className="flex items-start justify-between gap-3">
            <p>{error}</p>
            <button
              type="button"
              onClick={() => setError('')}
              aria-label="Dismiss error"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {notice && (
        <div
          role="status"
          className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
        >
          <div className="flex items-start justify-between gap-3">
            <p>{notice}</p>
            <button
              type="button"
              onClick={() => setNotice('')}
              aria-label="Dismiss notification"
            >
              ×
            </button>
          </div>
        </div>
    )}
      <ReminderSettings />

      {!showArchived && (
        <HabitOverview
          isLoading={isLoading}
          todayHabits={todayHabits}
          weeklySummary={weeklySummary}
        />
      )}

      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold">
              {showArchived ? 'Archived habits' : 'Your habits'}
            </h2>

            <p className="mt-1 text-sm text-[#72726f]">
              {showArchived
                ? 'Restore habits or delete them permanently.'
                : 'Track progress, view history, and manage your habits.'}
            </p>
          </div>

          <HabitFilters
            search={search}
            onSearchChange={setSearch}
            availableTags={availableTags}
            selectedTag={selectedTag}
            onTagChange={setSelectedTag}
          />
        </div>

        <HabitList
          habits={filteredHabits}
          todayHabits={todayHabits}
          isLoading={isLoading}
          showArchived={showArchived}
          search={search}
          selectedTag={selectedTag}
          totalHabits={habits.length}
          updatingId={updatingId}
          onEdit={openEditForm}
          onViewHistory={openHistory}
          onProgress={(item) => void toggleProgress(item)}
          onAdjustProgress={(item, change) =>
            void adjustProgress(item, change)
          }
          onManage={(habit, action) => {
            void manageHabit(habit, action);
          }}
          onCreate={openCreateForm}
        />
      </section>

      {isFormOpen && (
        <HabitFormModal
          key={editingHabit?._id ?? 'new-habit'}
          habit={editingHabit}
          isSaving={isSaving}
          onClose={closeForm}
          onSave={handleSaveHabit}
        />
      )}

      {historyHabit && (
        <HabitHistoryModal
          key={historyHabit._id}
          habit={historyHabit}
          onClose={closeHistory}
        />
      )}
    </section>
  );
}
