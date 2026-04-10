export type ActivityLevel = 'SEDENTARY' | 'LIGHTLY_ACTIVE' | 'MODERATELY_ACTIVE' | 'VERY_ACTIVE' | 'EXTRA_ACTIVE';
export type Goal = 'LOSE_WEIGHT' | 'MAINTAIN_WEIGHT' | 'GAIN_WEIGHT' | 'BUILD_MUSCLE';
export type MealType = 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK';

export interface Macros {
  protein: number;
  carbs: number;
  fat: number;
}

export interface UserProfile {
  id: string;
  name: string;
  goal: Goal;
  activityLevel: ActivityLevel;
  dietaryPreferences: string[];
  allergies: string[];
  region: string;
  dailyCalories: number;
  macros: Macros;
}

export interface Ingredient {
  id: string;
  name: string;
  amount: number;
  unit: string;
  category: string;
}

export interface Meal {
  id: string;
  name: string;
  type: MealType;
  description: string;
  calories: number;
  macros: Macros;
  preparationTimeMin: number;
  ingredients: Ingredient[];
  instructions: string[];
}

export interface MealPlan {
  id: string;
  date: string;
  dailySummary: {
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
  };
  meals: Meal[];
}

export type Availability = 'WET_MARKET' | 'SUPERMARKET' | 'BOTH';

export interface GroceryItem {
  id: string;
  name: string;
  amount: number;
  unit: string;
  category: 'PRODUCE' | 'PROTEIN' | 'PANTRY' | 'SPICES' | string;
  availability: Availability;
  isChecked: boolean;
}

export interface GroceryList {
  id: string;
  weekOf: string;
  items: GroceryItem[];
}

// Represents a Meal row from Prisma DB (different shape from AI-generated Meal)
export interface DbMeal {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number | null;
  sodium: number | null;
  cuisine: string | null;
  mealCategory: string | null;
  servingSize: string | null;
  servingGrams: number | null;
  isAiGenerated: boolean;
  createdAt: Date;
  updatedAt: Date;
}
