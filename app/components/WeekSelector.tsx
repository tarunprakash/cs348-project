'use client';

interface WeekSelectorProps {
  selectedDate: Date;
  onChange: (date: Date) => void;
}

export function WeekSelector({ selectedDate, onChange }: WeekSelectorProps) {
  // Get start and end of week
  const weekStart = new Date(selectedDate);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  const handlePreviousWeek = () => {
    const prevWeek = new Date(selectedDate);
    prevWeek.setDate(prevWeek.getDate() - 7);
    onChange(prevWeek);
  };

  const handleNextWeek = () => {
    const nextWeek = new Date(selectedDate);
    nextWeek.setDate(nextWeek.getDate() + 7);
    if (nextWeek <= new Date()) {
      onChange(nextWeek);
    }
  };

  // Format dates like "Jan 1 - Jan 7, 2024"
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short',
      day: 'numeric',
      year: weekEnd.getMonth() === date.getMonth() ? 'numeric' : undefined
    });
  };

  return (
    <div className="flex items-center gap-4 mb-6">
      <button
        onClick={handlePreviousWeek}
        className="p-2 hover:bg-gray-100 rounded-full"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <span className="text-lg">
        {formatDate(weekStart)} - {formatDate(weekEnd)}
      </span>

      <button
        onClick={handleNextWeek}
        disabled={new Date(selectedDate).setDate(selectedDate.getDate() + 7) > Date.now()}
        className="p-2 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:hover:bg-transparent"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
} 