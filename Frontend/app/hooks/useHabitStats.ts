
import { useEffect, useState } from 'react';

import {
  getHabitStats,
  type HabitStats,
} from '~/lib/habits';

export type HabitStatsRange = 7 | 30 | 90;

function toDateString(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function useHabitStats(habitId: string) {
  const [stats, setStats] = useState<HabitStats | null>(null);
  const [range, setRange] = useState<HabitStatsRange>(30);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isActive = true;

    async function loadStats() {
      setIsLoading(true);
      setError('');
      setStats(null);

      const to = new Date();
      const from = new Date(to);
      from.setDate(from.getDate() - (range - 1));

      try {
        const result = await getHabitStats(
          habitId,
          toDateString(from),
          toDateString(to),
        );

        if (isActive) {
          setStats(result);
        }
      } catch (caught) {
        if (isActive) {
          setError(
            caught instanceof Error
              ? caught.message
              : 'Unable to load habit history.',
          );
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void loadStats();

    return () => {
      isActive = false;
    };
  }, [habitId, range]);

  return {
    stats,
    range,
    setRange,
    isLoading,
    error,
  };
}
