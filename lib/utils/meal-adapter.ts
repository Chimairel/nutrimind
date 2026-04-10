import { Meal, MealType } from "@/types";

interface DbMealRow {
  id: string;
  name: string;
  description: string | null;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  mealCategory: string | null;
  [key: string]: unknown;
}

/**
 * Converts a Prisma DB meal row into the client-side Meal interface
 * used by MealCard and RecipeModal components.
 */
export function dbMealToMeal(m: DbMealRow): Meal {
  return {
    id: m.id,
    name: m.name,
    type: (m.mealCategory as MealType) || "BREAKFAST",
    description: m.description || "",
    calories: m.calories,
    macros: { protein: m.protein, carbs: m.carbs, fat: m.fat },
    preparationTimeMin: 0,
    ingredients: [],
    instructions: [],
  };
}
