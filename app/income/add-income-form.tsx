'use client'

import { addIncome, updateIncome } from '@/app/actions';
import { useState } from 'react';

interface Income {
  id: number;
  name: string;
  amount: number;
  date: string;
}

interface AddIncomeFormProps {
  income?: Income;
  onClose?: () => void;
}

export default function AddIncomeForm({ income, onClose }: AddIncomeFormProps) {
  const [isOpen, setIsOpen] = useState(false);

  async function handleSubmit(formData: FormData) {
    const result = income 
      ? await updateIncome(income.id, {
          name: formData.get('name') as string,
          amount: parseFloat(formData.get('amount') as string),
          date: new Date(formData.get('date') as string).toISOString(),
        })
      : await addIncome(formData);

    if (result.success) {
      setIsOpen(false);
      if (onClose) onClose();
    } else {
      alert(`Error ${income ? 'updating' : 'adding'} income: ` + result.error);
    }
  }

  const modalContent = (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {income ? 'Edit Income' : 'Add New Income'}
        </h2>
        <form action={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Income Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              defaultValue={income?.name}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
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
              defaultValue={income?.amount}
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
              defaultValue={income 
                ? new Date(income.date).toISOString().split('T')[0]
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
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              {income ? 'Save Changes' : 'Add Income'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  if (income) {
    return modalContent;
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
      >
        Add Income
      </button>

      {isOpen && modalContent}
    </>
  );
} 