"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { Gender, Goal, ActivityLevel, MealCategory } from "@prisma/client";

// Mappers from String state to Prisma Enums
const mapGender = (g: string): Gender => g === "Male" ? "MALE" : "FEMALE";
const mapGoal = (g: string): Goal => {
  if (g === "Lose Weight") return "LOSE_WEIGHT";
  if (g === "Gain Weight") return "GAIN_WEIGHT";
  if (g === "Build Muscle") return "BUILD_MUSCLE";
  return "MAINTAIN_WEIGHT";
};
const mapActivity = (a: string): ActivityLevel => {
  if (a.includes("Lightly")) return "LIGHTLY_ACTIVE";
  if (a.includes("Moderately")) return "MODERATELY_ACTIVE";
  if (a.includes("Very")) return "VERY_ACTIVE";
  return "SEDENTARY";
};
const mapMealCategory = (c: string): MealCategory => {
  if (c === "BREAKFAST") return "BREAKFAST";
  if (c === "LUNCH") return "LUNCH";
  if (c === "DINNER") return "DINNER";
  return "SNACK";
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function saveOnboardingData(profileData: Record<string, any>, aiMealPlan: Record<string, any>) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const userId = session.user.id;

  // 1. Transaction to safely create profile and meals
  await db.$transaction(async (tx) => {
    // Upsert the profile (in case they somehow re-onboard)
    await tx.profile.upsert({
      where: { userId },
      update: {
        age: parseInt(profileData.age),
        weight: parseFloat(profileData.weight),
        height: parseFloat(profileData.height),
        gender: mapGender(profileData.sex),
        goal: mapGoal(profileData.goal),
        activityLevel: mapActivity(profileData.activityLevel),
        dailyCalories: profileData.targetCalories,
      },
      create: {
        userId,
        age: parseInt(profileData.age),
        weight: parseFloat(profileData.weight),
        height: parseFloat(profileData.height),
        gender: mapGender(profileData.sex),
        goal: mapGoal(profileData.goal),
        activityLevel: mapActivity(profileData.activityLevel),
        dailyCalories: profileData.targetCalories,
      }
    });

    // Delete existing standard meals if they are regenerating
    await tx.meal.deleteMany({
      where: { userId, isAiGenerated: true }
    });

    // Create new AI generated meals
    if (aiMealPlan && aiMealPlan.meals) {
      for (const meal of aiMealPlan.meals) {
        // Build JSON representation of ingredients and instructions for description field or raw usage
        // Note: The schema doesn't have an explicit table for Ingredients currently.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mealDesc = `${meal.description}\n\nIngredients: ${meal.ingredients.map((i:Record<string, any>)=>`${i.amount} ${i.unit} ${i.name}`).join(', ')}\n\nSteps: ${meal.instructions.join(' ')}`;

        await tx.meal.create({
          data: {
            userId,
            name: meal.name,
            description: mealDesc,
            calories: meal.calories,
            protein: meal.macros.protein,
            carbs: meal.macros.carbs,
            fat: meal.macros.fat,
            mealCategory: mapMealCategory(meal.type),
            isAiGenerated: true,
          }
        });
      }
    }

    // Mark user as officially onboarded
    await tx.user.update({
      where: { id: userId },
      data: { isOnboarded: true }
    });
  });

  return { success: true };
}
