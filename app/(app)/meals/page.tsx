import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import MealCard from "@/components/dashboard/MealCard";
import { Utensils } from "lucide-react";
import { dbMealToMeal } from "@/lib/utils/meal-adapter";

export default async function MealsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const meals = await db.meal.findMany({
    where: { userId: session.user.id, isAiGenerated: true }
  });

  if (meals.length === 0) return (
    <div className="flex flex-col items-center justify-center pt-32 px-4 space-y-4">
      <div className="bg-gray-100 p-4 rounded-full"><Utensils size={32} className="text-gray-400"/></div>
      <p className="text-gray-500 font-medium text-center">No meals found.<br/>Please generate a plan under Dashboard.</p>
    </div>
  );

  const getMealsByType = (type: string) => meals.filter(m => m.mealCategory === type);

  const mealTypes = [
    { type: 'BREAKFAST', label: 'Breakfast' },
    { type: 'LUNCH', label: 'Lunch' },
    { type: 'DINNER', label: 'Dinner' },
    { type: 'SNACK', label: 'Snacks' }
  ];

  return (
    <div className="px-4 pt-10 pb-24 space-y-8 animate-in fade-in duration-500">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Your Meals</h1>
        <p className="text-sm text-gray-500">All planned meals for today</p>
      </header>

      <div className="space-y-8">
        {mealTypes.map(({ type, label }) => {
          const catMeals = getMealsByType(type);
          if (catMeals.length === 0) return null;

          return (
            <div key={type} className="space-y-3">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">{label}</h2>
              <div className="space-y-3">
                {catMeals.map(m => (
                  <MealCard key={m.id} meal={dbMealToMeal(m)} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
