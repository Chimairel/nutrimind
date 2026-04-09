"use client";
import { useEffect, useState } from 'react';
import { MealPlan } from '@/types';
import { mockMealPlan } from '@/lib/mock-data/mealPlan';
import { mockUserProfile } from '@/lib/mock-data/userProfile';
import DailySummaryBar from '@/components/dashboard/DailySummaryBar';
import MealCard from '@/components/dashboard/MealCard';

export default function DashboardPage() {
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);

  useEffect(() => {
    try {
      const cachedPlan = localStorage.getItem('nutri_mealPlan');
      if (cachedPlan) {
        setMealPlan(JSON.parse(cachedPlan));
      } else {
        setMealPlan(mockMealPlan); // Fallback to mock data immediately
      }
    } catch {
      setMealPlan(mockMealPlan);
    }
  }, []);

  if (!mealPlan) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6 text-green-600 font-medium">
        <div className="flex flex-col items-center space-y-4 animate-pulse">
          <span className="text-3xl">🥑</span>
          <p>Processing your nutrition profile...</p>
        </div>
      </div>
    );
  }

  const currentCals = mealPlan.dailySummary.totalCalories;
  // Currently targetCals defaults to mock unless we natively save profile target cals.
  const targetCals = mockUserProfile.dailyCalories;

  return (
    <div className="px-4 pt-10 pb-24 space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Today's Plan</h1>
        <p className="text-sm text-gray-500">Track your daily nutrition and meals.</p>
      </header>

      <section>
        <DailySummaryBar currentCal={currentCals} targetCal={targetCals} />
      </section>

      <section className="space-y-4 pt-2">
        <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">Meals</h2>
        <div className="flex flex-col space-y-3">
          {mealPlan.meals.map((meal) => (
            <MealCard key={meal.id} meal={meal} />
          ))}
        </div>
      </section>
    </div>
  );
}
