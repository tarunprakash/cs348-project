import { formatCurrency } from '@/utils/formatters';

interface CategoryExpense {
  category: string;
  amount: number;
  budgetAmount: number;
  remainingAmount: number;
}

interface Props {
  expenses: CategoryExpense[];
}

export function CategoryBreakdown({ expenses }: Props) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Category Breakdown</h2>
      <div className="space-y-4">
        {expenses.map((expense) => (
          <div key={expense.category} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">{expense.category}</span>
              <div className="text-right">
                <div className="font-medium">
                  ${expense.amount.toFixed(2)} / ${expense.budgetAmount.toFixed(2)}
                </div>
                <div className={`text-sm ${expense.remainingAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {expense.remainingAmount >= 0 ? 'Remaining: ' : 'Over by: '}
                  ${Math.abs(expense.remainingAmount).toFixed(2)}
                </div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full ${
                  expense.remainingAmount >= 0 ? 'bg-blue-600' : 'bg-red-600'
                }`}
                style={{
                  width: `${Math.min((expense.amount / expense.budgetAmount) * 100, 100)}%`
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 