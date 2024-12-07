'use server'

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function addExpense(formData: FormData) {
  const supabase = await createClient();
  
  const expense = {
    name: formData.get('name') as string,
    amount: parseFloat(formData.get('amount') as string),
    date: new Date(formData.get('date') as string).toISOString(),
    category: parseInt(formData.get('category') as string),
  };

  const { error } = await supabase
    .from('Expenses')
    .insert([expense]);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/expenses');
  return { success: true };
}

export async function addIncome(formData: FormData) {
  const supabase = await createClient();
  
  const income = {
    name: formData.get('name') as string,
    amount: parseFloat(formData.get('amount') as string),
    date: new Date(formData.get('date') as string).toISOString(),
  };

  const { error } = await supabase
    .from('Income')
    .insert([income]);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/income');
  return { success: true };
}

export async function addCategory(formData: FormData) {
  const supabase = await createClient();
  
  const category = {
    name: formData.get('name') as string,
    budget: parseFloat(formData.get('budget') as string),
  };

  const { error } = await supabase
    .from('Categories')
    .insert([category]);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/budgets');
  return { success: true };
}

export async function deleteExpense(id: number) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('Expenses')
    .delete()
    .eq('id', id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/expenses');
  return { success: true };
}

export async function deleteIncome(id: number) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('Income')
    .delete()
    .eq('id', id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/income');
  return { success: true };
}

export async function deleteCategory(id: number) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('Categories')
    .delete()
    .eq('id', id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/budgets');
  return { success: true };
}

export async function updateExpense(id: number, data: {
  name: string;
  amount: number;
  date: string;
  category: number;
}) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('Expenses')
    .update(data)
    .eq('id', id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/expenses');
  return { success: true };
}

export async function updateIncome(id: number, data: {
  name: string;
  amount: number;
  date: string;
}) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('Income')
    .update(data)
    .eq('id', id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/income');
  return { success: true };
}

export async function updateCategory(id: number, data: {
  name: string;
  budget: number;
}) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('Categories')
    .update(data)
    .eq('id', id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/budgets');
  return { success: true };
} 