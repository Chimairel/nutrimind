"use client";
import { useState, useEffect } from 'react';
import { mockGroceryList } from '@/lib/mock-data/groceryList';
import GroceryList from '@/components/grocery/GroceryList';
import { MealPlan, GroceryList as GroceryListType, GroceryItem } from '@/types';

export default function GroceryPage() {
  const [list, setList] = useState<GroceryListType | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('nutri_mealPlan');
      if (stored) {
        const mealPlan: MealPlan = JSON.parse(stored);
        
        const itemMap = new Map<string, GroceryItem>();
        
        mealPlan.meals.forEach(meal => {
          meal.ingredients.forEach((ing, index) => {
            const key = ing.name.toLowerCase().trim();
            if (itemMap.has(key)) {
              const existing = itemMap.get(key)!;
              if (existing.unit.toLowerCase() === ing.unit.toLowerCase()) {
                existing.amount += ing.amount;
              } else {
                itemMap.set(`${key}-${ing.unit}`, {
                  id: `ing-${meal.id}-${index}-${Date.now()}`,
                  name: ing.name,
                  amount: ing.amount,
                  unit: ing.unit,
                  category: ing.category,
                  availability: 'BOTH',
                  isChecked: false
                });
              }
            } else {
              itemMap.set(key, {
                id: `ing-${meal.id}-${index}`,
                name: ing.name,
                amount: ing.amount,
                unit: ing.unit,
                category: ing.category,
                availability: 'BOTH',
                isChecked: false
              });
            }
          });
        });

        // Round amounts to 2 decimal places to avoid floating point math errors
        const finalItems = Array.from(itemMap.values()).map(item => ({
          ...item,
          amount: Math.round(item.amount * 100) / 100
        }));

        setList({
          id: 'dynamic-list',
          weekOf: mealPlan.date || new Date().toISOString().split('T')[0],
          items: finalItems
        });
      } else {
        setList(mockGroceryList);
      }
    } catch {
      setList(mockGroceryList);
    }
  }, []);

  if (!list) return <div className="p-8 text-center text-gray-500 text-sm">Loading grocery list...</div>;

  return (
    <div className="px-4 pt-10 pb-24 space-y-6 animate-in fade-in duration-500">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Grocery List</h1>
        <p className="text-sm text-gray-500">Week of {new Date(list.weekOf).toLocaleDateString('en-US', { month: 'short', day: 'numeric'})}</p>
      </header>

      <div className="pt-2">
        <GroceryList list={list} />
      </div>
    </div>
  );
}
