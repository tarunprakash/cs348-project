'use client'

import { createClient } from '@/utils/supabase/client';
import AddExpenseForm from './add-expense-form';
import ActionMenu from '../components/action-menu';
import { deleteExpense } from '../actions';
import { useEffect, useState } from 'react';

interface Expense {
  id: number;
  name: string;
  amount: number;
  date: string;
  created_at: string;
  category: number;
  Categories: {
    name: string;
  } | null;
}

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const supabase = createClient();

  async function loadExpenses() {
    const { data, error: loadError } = await supabase
      .from('Expenses')
      .select(`
        *,
        Categories (
          name
        )
      `)
      .order('date', { ascending: false })
      .limit(10);

    if (loadError) {
      setError('Error loading expenses');
      console.error('Error fetching expenses:', loadError);
    } else {
      setExpenses(data || []);
    }
  }

  useEffect(() => {
    loadExpenses();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Expenses</h1>
      <div className="flex justify-end">
        <AddExpenseForm />
      </div>
      <div className="border rounded-lg">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Recent Expenses</h2>
        </div>
        <div className="p-4">
          {error && (
            <p className="text-center text-red-500">{error}</p>
          )}
          
          {!error && expenses.length === 0 && (
            <p className="text-center text-gray-500">No expense entries yet</p>
          )}

          {expenses.length > 0 && (
            <div className="divide-y">
              {expenses.map((expense) => (
                <div key={expense.id} className="py-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{expense.name}</h3>
                    <div className="flex gap-2 text-sm text-gray-500">
                      <span>{new Date(expense.date).toLocaleDateString()}</span>
                      {expense.Categories && (
                        <span>• {expense.Categories.name}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-red-600 font-medium">
                      -${expense.amount.toFixed(2)}
                    </span>
                    <ActionMenu
                      onEdit={() => setEditingExpense(expense)}
                      onDelete={async () => {
                        if (confirm('Are you sure you want to delete this expense?')) {
                          await deleteExpense(expense.id);
                          loadExpenses();
                        }
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {editingExpense && (
        <AddExpenseForm 
          expense={editingExpense} 
          onClose={() => {
            setEditingExpense(null);
            loadExpenses();
          }}
        />
      )}
    </div>
  );
} 