
import { LoaderCircle, Target } from 'lucide-react';

import type { Habit, TodayHabit } from '~/lib/habits';
import HabitRow from './HabitRow';

interface HabitListProps {
  habits: Habit[];
  todayHabits: TodayHabit[];
  isLoading: boolean;
  showArchived: boolean;
  search: string;
  selectedTag: string;
  totalHabits: number;
  updatingId: string | null;
  onEdit: (habit: Habit) => void;
  onProgress: (item: TodayHabit) => void;
  onManage: (
    habit: Habit,
    action: 'archive' | 'restore' | 'delete',
  ) => void;
  onCreate: () => void;
}

const primaryButtonClass =
  'inline-flex items-center justify-center gap-2 rounded-lg bg-[#fa3600] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#d92f00]';

export default function HabitList({
  habits,
  todayHabits,
  isLoading,
  showArchived,
  search,
  selectedTag,
  totalHabits,
  updatingId,
  onEdit,
  onProgress,
  onManage,
  onCreate,
}: HabitListProps) {
  const todayById = new Map(
    todayHabits.map((item) => [item.habit._id, item]),
  );

  const noFilters = !search.trim() && selectedTag === 'all';

  return (
    <>
      {isLoading ? (
        <div className="flex items-center justify-center gap-2 rounded-xl border border-[#e7e7e2] bg-white p-10 text-sm text-[#72726f]">
          <LoaderCircle size={18} className="animate-spin" />
          Loading habits...
        </div>
      ) : habits.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#d8d8d3] bg-white px-6 py-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#fff0eb] text-[#fa3600]">
            <Target size={23} />
          </div>

          <h3 className="mt-4 text-lg font-medium">
            {!noFilters
              ? 'No matching habits'
              : showArchived
                ? 'No archived habits'
                : 'Start with one small habit'}
          </h3>

          <p className="mx-auto mt-2 max-w-sm text-sm text-[#72726f]">
            {!noFilters
              ? 'Try changing your search or tag filter.'
              : showArchived
                ? 'Habits you archive will appear here.'
                : 'Create your first habit and begin building a routine that works for you.'}
          </p>

          {!showArchived && noFilters && (
            <button
              type="button"
              onClick={onCreate}
              className={`${primaryButtonClass} mt-5`}
            >
              Create your first habit
            </button>
          )}
        </div>
      ) : (
        <div className="divide-y divide-[#ededE8] overflow-hidden rounded-xl border border-[#e7e7e2] bg-white">
          {habits.map((habit) => (
            <HabitRow
              key={habit._id}
              habit={habit}
              todayRecord={
                showArchived ? undefined : todayById.get(habit._id)
              }
              showArchived={showArchived}
              isUpdating={updatingId === habit._id}
              onEdit={onEdit}
              onProgress={onProgress}
              onManage={onManage}
            />
          ))}
        </div>
      )}

      {!isLoading && totalHabits > 0 && (
        <p className="text-right text-xs text-[#858580]">
          Showing {habits.length} of {totalHabits}{' '}
          {showArchived ? 'archived habits' : 'habits'}
        </p>
      )}
    </>
  );
}
