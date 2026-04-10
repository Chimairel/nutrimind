import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import DailySummaryBar from "@/components/dashboard/DailySummaryBar";
import MealCard from "@/components/dashboard/MealCard";
import UpdateWeightModal from "@/components/dashboard/UpdateWeightModal";
import { dbMealToMeal } from "@/lib/utils/meal-adapter";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const profile = await db.profile.findUnique({
    where: { userId: session.user.id }
  });

  if (!profile || !profile.dailyCalories) redirect("/onboarding");

  const meals = await db.meal.findMany({
    where: { userId: session.user.id, isAiGenerated: true }
  });

  const currentCals = meals.reduce((sum, meal) => sum + meal.calories, 0);
  const targetCals = profile.dailyCalories;

  return (
    <div className="px-4 pt-10 pb-24 space-y-6 animate-in fade-in duration-500">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Today&apos;s Plan</h1>
        <p className="text-sm text-gray-500">Track your daily nutrition and meals.</p>
      </header>

      <section className="space-y-4">
        <DailySummaryBar currentCal={currentCals} targetCal={targetCals} />
        <UpdateWeightModal />
      </section>

      <section className="space-y-4 pt-2">
        <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">Meals</h2>
        <div className="flex flex-col space-y-3">
          {meals.map((m) => (
             <MealCard key={m.id} meal={dbMealToMeal(m)} />
          ))}
        </div>
      </section>
    </div>
  );
}
