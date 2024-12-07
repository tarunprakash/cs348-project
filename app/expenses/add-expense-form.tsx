'use client'

import { addExpense, updateExpense } from '@/app/actions';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

interface Category {
  id: number;
  name: string;
}

interface Expense {
  id: number;
  name: string;
  amount: number;
  date: string;
  category: number;
}

interface AddExpenseFormProps {
  expense?: Expense;
  onClose?: () => void;
}

export default function AddExpenseForm({ expense, onClose }: AddExpenseFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const supabase = createClient();

  useEffect(() => {
    async function loadCategories() {
      const { data } = await supabase
        .from('Categories')
        .select('id, name')
        .order('name');
      if (data) setCategories(data);
    }
    loadCategories();
  }, []);

  async function handleSubmit(formData: FormData) {
    const result = expense 
      ? await updateExpense(expense.id, {
          name: formData.get('name') as string,
          amount: parseFloat(formData.get('amount') as string),
          date: new Date(formData.get('date') as string).toISOString(),
          category: parseInt(formData.get('category') as string),
        })
      : await addExpense(formData);

    if (result.success) {
      setIsOpen(false);
      if (onClose) onClose();
    } else {
      alert(`Error ${expense ? 'updating' : 'adding'} expense: ` + result.error);
    }
  }

  const modalContent = (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {expense ? 'Edit Expense' : 'Add New Expense'}
        </h2>
        <form action={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Expense Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              defaultValue={expense?.name}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              id="category"
              name="category"
              required
              defaultValue={expense?.category}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
              Amount
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              step="0.01"
              required
              defaultValue={expense?.amount}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              required
              defaultValue={expense 
                ? new Date(expense.date).toISOString().split('T')[0]
                : new Date().toISOString().split('T')[0]
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                if (onClose) onClose();
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              {expense ? 'Save Changes' : 'Add Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  if (expense) {
    return modalContent;
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
      >
        Add Expense
      </button>

      {isOpen && modalContent}
    </>
  );
} 