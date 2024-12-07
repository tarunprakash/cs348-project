import { formatCurrency } from '@/utils/formatters';

interface WeeklyExpenseOverviewProps {
  totalSpent: number;
  totalBudget: number;
  totalRemaining: number;
}

export function WeeklyExpenseOverview({ 
  totalSpent, 
  totalBudget,
  totalRemaining 
}: WeeklyExpenseOverviewProps) {
  const isOverBudget = totalRemaining < 0;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">This Week's Spending</h2>
      <div className="space-y-4">
        <div className="flex justify-between items-baseline">
          <span className="text-3xl font-bold text-gray-900">
            {formatCurrency(totalSpent)}
          </span>
          <span className="text-gray-500">
            of {formatCurrency(totalBudget)}
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all ${isOverBudget ? 'bg-red-500' : 'bg-green-500'}`}
            style={{ 
              width: `${Math.min((totalSpent / totalBudget) * 100, 100)}%`
            }}
          />
        </div>

        {/* Remaining amount */}
        <div className={`text-right font-medium ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
          {isOverBudget ? (
            `${formatCurrency(Math.abs(totalRemaining))} over budget`
          ) : (
            `${formatCurrency(totalRemaining)} remaining`
          )}
        </div>
      </div>
    </div>
  );
} 