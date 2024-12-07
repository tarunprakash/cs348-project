'use client'

import { createClient } from '@/utils/supabase/client';
import AddIncomeForm from './add-income-form';
import ActionMenu from '../components/action-menu';
import { deleteIncome } from '../actions';
import { useEffect, useState } from 'react';

interface Income {
  id: number;
  name: string;
  amount: number;
  date: string;
  created_at: string;
}

export default function IncomePage() {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);
  const supabase = createClient();

  async function loadIncomes() {
    const { data, error: loadError } = await supabase
      .from('Income')
      .select('*')
      .order('date', { ascending: false })
      .limit(10);

    if (loadError) {
      setError('Error loading income entries');
      console.error('Error fetching income:', loadError);
    } else {
      setIncomes(data || []);
    }
  }

  useEffect(() => {
    loadIncomes();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Income</h1>
      <div className="flex justify-end">
        <AddIncomeForm />
      </div>
      <div className="border rounded-lg">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Recent Income</h2>
        </div>
        <div className="p-4">
          {error && (
            <p className="text-center text-red-500">{error}</p>
          )}
          
          {!error && incomes.length === 0 && (
            <p className="text-center text-gray-500">No income entries yet</p>
          )}

          {incomes.length > 0 && (
            <div className="divide-y">
              {incomes.map((income) => (
                <div key={income.id} className="py-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{income.name}</h3>
                    <div className="flex gap-2 text-sm text-gray-500">
                      <span>{new Date(income.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-green-600 font-medium">
                      +${income.amount.toFixed(2)}
                    </span>
                    <ActionMenu
                      onEdit={() => setEditingIncome(income)}
                      onDelete={async () => {
                        if (confirm('Are you sure you want to delete this income entry?')) {
                          await deleteIncome(income.id);
                          loadIncomes();
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

      {editingIncome && (
        <AddIncomeForm 
          income={editingIncome} 
          onClose={() => {
            setEditingIncome(null);
            loadIncomes();
          }}
        />
      )}
    </div>
  );
} 