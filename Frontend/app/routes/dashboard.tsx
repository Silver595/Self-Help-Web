import React, { useState } from 'react';
import {
  Edit2,
  ArrowRight,
  ChevronRight,
  BookOpen,
  FileText,
  CheckCircle2,
} from 'lucide-react';
import MetricProgressCard from '~/components/common/MetricCard';
import PromptReflectionCard from '~/components/common/PromptReflectionCard';

interface Practice {
  id: string;
  title: string;
  category: string;
  duration: string;
  completed: boolean;
}

export default function TodayPage() {
  // State for tracking today's practices completion
  const [practices, setPractices] = useState<Practice[]>([
    {
      id: '1',
      title: 'Reading',
      category: 'Learning · Every day',
      duration: '20 min',
      completed: false,
    },
    {
      id: '2',
      title: 'Morning walk',
      category: 'Wellbeing · 4 days / week',
      duration: '30 min',
      completed: false,
    },
    {
      id: '3',
      title: 'Daily reflection',
      category: 'Reflection · Every day',
      duration: '1 entry',
      completed: false,
    },
    {
      id: '4',
      title: 'Focused study',
      category: 'Learning · 3 days / week',
      duration: '45 min',
      completed: false,
    },
  ]);

  const completedCount = practices.filter((p) => p.completed).length;

  const togglePractice = (id: string) => {
    setPractices(
      practices.map((p) =>
        p.id === id ? { ...p, completed: !p.completed } : p,
      ),
    );
  };

  return (
    <div className='space-y-8 font-mono text-[12px] text-neutral-600'>
      <PromptReflectionCard />
    </div>
  );
}
