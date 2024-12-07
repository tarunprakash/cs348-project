'use client'

import { addCategory, updateCategory } from '@/app/actions';
import { useState } from 'react';

interface Category {
  id: number;
  name: string;
  budget: number;
}

interface AddCategoryFormProps {
  category?: Category;
  onClose?: () => void;
}

export default function AddCategoryForm({ category, onClose }: AddCategoryFormProps) {
  const [isOpen, setIsOpen] = useState(false);

  async function handleSubmit(formData: FormData) {
    const result = category 
      ? await updateCategory(category.id, {
          name: formData.get('name') as string,
          budget: parseFloat(formData.get('budget') as string),
        })
      : await addCategory(formData);

    if (result.success) {
      setIsOpen(false);
      if (onClose) onClose();
    } else {
      alert(`Error ${category ? 'updating' : 'adding'} category: ` + result.error);
    }
  }

  const modalContent = (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {category ? 'Edit Category' : 'Add New Category'}
        </h2>
        <form action={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Category Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              defaultValue={category?.name}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
              Monthly Budget
            </label>
            <input
              type="number"
              id="budget"
              name="budget"
              step="0.01"
              required
              defaultValue={category?.budget}
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
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {category ? 'Save Changes' : 'Add Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  if (category) {
    return modalContent;
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Add Category
      </button>

      {isOpen && modalContent}
    </>
  );
} 