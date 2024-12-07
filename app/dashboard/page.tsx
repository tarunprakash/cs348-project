import { createClient } from '@/utils/supabase/server';
import { WeeklyExpenseOverview } from '../components/WeeklyExpenseOverview';
import { CategoryBreakdown } from '../components/CategoryBreakdown';
import { WeekSelectorWrapper } from '../components/WeekSelectorWrapper';
import { WeeklyIncomeOverview } from '../components/WeeklyIncomeOverview';

interface WeeklyExpense {
  total_amount: number;
  category_name: string;
  category_total: number;
}

interface BudgetInfo {
  total_budget: number;
  budget_by_category: Record<string, number>;
}

interface WeeklyIncome {
  total_amount: number;
}

export default async function Dashboard({
  searchParams,
}: {
  searchParams: { week?: string };
}) {
  const supabase = await createClient();
  
  const selectedDate = searchParams.week ? 
    new Date(searchParams.week) : 
    new Date();

  const weekStart = new Date(selectedDate);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  weekStart.setHours(0, 0, 0, 0);

  const nextWeek = new Date(weekStart);
  nextWeek.setDate(nextWeek.getDate() + 7);

  // Get weekly expenses
  const { data: weeklyExpenses, error: expensesError } = await supabase
    .rpc('get_weekly_expenses', {
      start_date: weekStart.toISOString(),
      end_date: nextWeek.toISOString()
    });

  // Get budget information
  const { data: budgetData, error: budgetError } = await supabase
    .rpc('get_budget_info');

  // Get weekly income
  const { data: weeklyIncome, error: incomeError } = await supabase
    .rpc('get_weekly_income', {
      start_date: weekStart.toISOString(),
      end_date: nextWeek.toISOString()
    });

  if (expensesError) {
    console.error('Error fetching weekly expenses:', expensesError);
  }
  if (budgetError) {
    console.error('Error fetching budget info:', budgetError);
  }
  if (incomeError) {
    console.error('Error fetching weekly income:', incomeError);
  }

  // Safely type cast and handle undefined cases
  const budgetInfo = budgetData?.[0] as BudgetInfo | null;
  
  // Expense calculations
  const totalSpent = weeklyExpenses?.[0]?.total_amount ?? 0;
  const totalBudget = budgetInfo?.total_budget ?? 0;
  const totalRemaining = totalBudget - totalSpent;

  const totalIncome = weeklyIncome?.[0]?.total_amount ?? 0;

  const categoryExpenses = weeklyExpenses?.map((expense: WeeklyExpense) => ({
    category: expense.category_name,
    amount: expense.category_total,
    budgetAmount: budgetInfo?.budget_by_category?.[expense.category_name] ?? 0,
    remainingAmount: (budgetInfo?.budget_by_category?.[expense.category_name] ?? 0) - expense.category_total
  })) ?? [];

  return (
    <main className="p-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <WeekSelectorWrapper selectedDate={selectedDate} />
      </div>
      <div className="grid gap-6">
        <div className="grid gap-6 md:grid-cols-2">
          <WeeklyExpenseOverview 
            totalSpent={totalSpent}
            totalBudget={totalBudget}
            totalRemaining={totalRemaining}
          />
          <WeeklyIncomeOverview 
            totalIncome={totalIncome}
            totalExpenses={totalSpent}
          />
        </div>
        <CategoryBreakdown expenses={categoryExpenses} />
      </div>
    </main>
  );
}
