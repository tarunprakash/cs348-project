'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { WeekSelector } from './WeekSelector';

export function WeekSelectorWrapper({ selectedDate }: { selectedDate: Date }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleWeekChange = (newDate: Date) => {
    const params = new URLSearchParams(searchParams);
    params.set('week', newDate.toISOString());
    router.push(`/dashboard?${params.toString()}`);
  };

  return (
    <WeekSelector 
      selectedDate={selectedDate} 
      onChange={handleWeekChange} 
    />
  );
} 