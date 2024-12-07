import { formatCurrency } from '@/utils/formatters';

interface WeeklyIncomeOverviewProps {
  totalIncome: number;
  totalExpenses: number;
}

export function WeeklyIncomeOverview({
  totalIncome,
  totalExpenses,
}: WeeklyIncomeOverviewProps) {
  const netChange = totalIncome - totalExpenses;
  const isPositive = netChange >= 0;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">This Week's Income</h2>
      <div className="space-y-4">
        <div className="flex flex-col">
          <span className="text-3xl font-bold text-gray-900">
            {formatCurrency(totalIncome)}
          </span>
          <div className={`text-sm font-medium mt-2 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            Income - Expenses: {formatCurrency(netChange)}
          </div>
        </div>
      </div>
    </div>
  );
} 