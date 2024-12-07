'use client'

import { createClient } from '@/utils/supabase/client';
import AddCategoryForm from './add-category-form';
import ActionMenu from '../components/action-menu';
import { deleteCategory } from '../actions';
import { useEffect, useState } from 'react';

interface Category {
  id: number;
  name: string;
  budget: number;
  created_at: string;
}

export default function BudgetsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const supabase = createClient();

  async function loadCategories() {
    const { data, error: loadError } = await supabase
      .from('Categories')
      .select('*')
      .order('name', { ascending: true });

    if (loadError) {
      setError('Error loading categories');
      console.error('Error fetching categories:', loadError);
    } else {
      setCategories(data || []);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Budget Categories</h1>
      <div className="flex justify-end">
        <AddCategoryForm />
      </div>
      <div className="border rounded-lg">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Monthly Budgets</h2>
        </div>
        <div className="p-4">
          {error && (
            <p className="text-center text-red-500">{error}</p>
          )}
          
          {!error && categories.length === 0 && (
            <p className="text-center text-gray-500">No budget categories yet</p>
          )}

          {categories.length > 0 && (
            <div className="divide-y">
              {categories.map((category) => (
                <div key={category.id} className="py-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{category.name}</h3>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-blue-600 font-medium">
                      ${category.budget.toFixed(2)}/week
                    </span>
                    <ActionMenu
                      onEdit={() => setEditingCategory(category)}
                      onDelete={async () => {
                        if (confirm('Are you sure you want to delete this category? This will remove the category from all related expenses and income.')) {
                          await deleteCategory(category.id);
                          loadCategories();
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

      {editingCategory && (
        <AddCategoryForm 
          category={editingCategory} 
          onClose={() => {
            setEditingCategory(null);
            loadCategories();
          }}
        />
      )}
    </div>
  );
} 