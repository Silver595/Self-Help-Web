
import { useEffect, useState } from 'react';

import {
  getHabitStats,
  type HabitStats,
} from '~/lib/habits';

export function useHabitStats(habitId: string) {
  const [stats, setStats] = useState<HabitStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isActive = true;

    async function loadStats() {
      setIsLoading(true);
      setError('');
      setStats(null);

      try {
        const result = await getHabitStats(habitId);

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
  }, [habitId]);

  return {
    stats,
    isLoading,
    error,
  };
}
