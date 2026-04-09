import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCalories(calories: number): string {
  return Math.round(calories).toLocaleString();
}

export function formatMacro(grams: number): string {
  return `${Math.round(grams)}g`;
}

export function calculateBMR(
  weight: number,
  height: number,
  age: number,
  gender: "MALE" | "FEMALE"
): number {
  // Mifflin-St Jeor formula
  if (gender === "MALE") {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  }
  return 10 * weight + 6.25 * height - 5 * age - 161;
}

export function calculateTDEE(
  bmr: number,
  activityLevel: string
): number {
  const multipliers: Record<string, number> = {
    SEDENTARY: 1.2,
    LIGHTLY_ACTIVE: 1.375,
    MODERATELY_ACTIVE: 1.55,
    VERY_ACTIVE: 1.725,
    EXTRA_ACTIVE: 1.9,
  };
  return Math.round(bmr * (multipliers[activityLevel] ?? 1.2));
}

export function calculateMacros(
  calories: number,
  goal: string
): { protein: number; carbs: number; fat: number } {
  const macroRatios: Record<string, { protein: number; carbs: number; fat: number }> = {
    LOSE_WEIGHT:     { protein: 0.35, carbs: 0.40, fat: 0.25 },
    MAINTAIN_WEIGHT: { protein: 0.25, carbs: 0.50, fat: 0.25 },
    GAIN_WEIGHT:     { protein: 0.25, carbs: 0.55, fat: 0.20 },
    BUILD_MUSCLE:    { protein: 0.40, carbs: 0.40, fat: 0.20 },
  };

  const ratio = macroRatios[goal] ?? macroRatios.MAINTAIN_WEIGHT;

  return {
    protein: Math.round((calories * ratio.protein) / 4), // 4 cal per gram
    carbs:   Math.round((calories * ratio.carbs) / 4),   // 4 cal per gram
    fat:     Math.round((calories * ratio.fat) / 9),     // 9 cal per gram
  };
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Magandang umaga";
  if (hour < 18) return "Magandang hapon";
  return "Magandang gabi";
}