
import { useCallback, useEffect, useState } from 'react';

import {
  archiveHabit as archiveHabitRequest,
  createHabit,
  deleteHabit,
  getArchivedHabits,
  getHabits,
  getHabitWeeklySummary,
  getTodayHabits,
  removeHabitProgress,
  restoreHabit as restoreHabitRequest,
  setHabitProgress,
  updateHabit,
  type CreateHabitInput,
  type Habit,
  type HabitWeeklySummary,
  type TodayHabit,
} from '~/lib/habits';

export type HabitManagementAction = 'archive' | 'restore' | 'delete';

export function useHabits(showArchived: boolean) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [todayHabits, setTodayHabits] = useState<TodayHabit[]>([]);
  const [weeklySummary, setWeeklySummary] =
    useState<HabitWeeklySummary | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const loadData = useCallback(
    async (showLoading = true) => {
      if (showLoading) setIsLoading(true);

      setError('');

      try {
        const today = new Date();
        const monday = new Date(today);

        monday.setDate(
          today.getDate() - ((today.getDay() + 6) % 7),
        );

        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);

        const toDateString = (date: Date) => {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');

          return `${year}-${month}-${day}`;
        };

        const [habitData, todayData] = await Promise.all([
          showArchived ? getArchivedHabits() : getHabits(),
          getTodayHabits(),
        ]);

        setHabits(habitData);
        setTodayHabits(todayData);

        try {
          const summary = await getHabitWeeklySummary(
            toDateString(monday),
            toDateString(sunday),
          );

          setWeeklySummary(summary);
        } catch {
          // The habit list should remain usable if the optional
          // weekly-summary endpoint is unavailable.
          setWeeklySummary(null);
        }
      } catch (caught) {
        setError(
          caught instanceof Error
            ? caught.message
            : 'Unable to load habits.',
        );
      } finally {
        setIsLoading(false);
      }
    },
    [showArchived],
  );

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const saveHabit = useCallback(
    async (existingHabit: Habit | null, data: CreateHabitInput) => {
      setError('');
      setNotice('');
      setIsSaving(true);

      try {
        if (existingHabit) {
          await updateHabit(existingHabit._id, data);
          setNotice('Habit updated successfully.');
        } else {
          await createHabit(data);
          setNotice('Habit created successfully.');
        }

        await loadData(false);
        return true;
      } catch (caught) {
        setError(
          caught instanceof Error
            ? caught.message
            : 'Unable to save habit.',
        );

        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [loadData],
  );

  const toggleProgress = useCallback(
    async (item: TodayHabit) => {
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
            : 'Unable to update progress.',
        );
      } finally {
        setUpdatingId(null);
      }
    },
    [loadData],
  );

  const manageHabit = useCallback(
    async (habit: Habit, action: HabitManagementAction) => {
      setError('');
      setNotice('');
      setUpdatingId(habit._id);

      try {
        if (action === 'archive') {
          await archiveHabitRequest(habit._id);
          setNotice(`"${habit.title}" archived.`);
        } else if (action === 'restore') {
          await restoreHabitRequest(habit._id);
          setNotice(`"${habit.title}" restored.`);
        } else {
          await deleteHabit(habit._id);
          setNotice(`"${habit.title}" and its history deleted.`);
        }

        await loadData(false);
      } catch (caught) {
        setError(
          caught instanceof Error
            ? caught.message
            : 'Unable to manage this habit.',
        );
      } finally {
        setUpdatingId(null);
      }
    },
    [loadData],
  );

  const clearMessages = useCallback(() => {
    setError('');
    setNotice('');
  }, []);

  return {
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
    loadData,
    saveHabit,
    toggleProgress,
    manageHabit,
  };
}
