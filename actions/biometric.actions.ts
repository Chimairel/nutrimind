"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateBiometricWeight(newWeightKg: number) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const userId = session.user.id;

  try {
    const profile = await db.profile.findUnique({ where: { userId } });
    if (!profile) return { error: "Profile not found" };

    // Native Re-calculation Engine (Mifflin-St Jeor)
    let bmr = 0;
    const w = newWeightKg;
    const h = profile.height || 160;
    const a = profile.age || 25;
    
    if(profile.gender === 'MALE') {
       bmr = (10 * w) + (6.25 * h) - (5 * a) + 5;
    } else {
       bmr = (10 * w) + (6.25 * h) - (5 * a) - 161;
    }
    
    let multiplier = 1.2;
    if(profile.activityLevel === 'LIGHTLY_ACTIVE') multiplier = 1.375;
    else if(profile.activityLevel === 'MODERATELY_ACTIVE') multiplier = 1.55;
    else if(profile.activityLevel === 'VERY_ACTIVE') multiplier = 1.725;
    else if(profile.activityLevel === 'EXTRA_ACTIVE') multiplier = 1.9;
    
    let tdee = bmr * multiplier;
    if(profile.goal === 'LOSE_WEIGHT') tdee -= 500;
    else if(profile.goal === 'GAIN_WEIGHT' || profile.goal === 'BUILD_MUSCLE') tdee += 300;
    
    const newTargetCalories = Math.round(tdee);

    // Update Profile Record
    await db.profile.update({
      where: { userId },
      data: {
        weight: newWeightKg,
        dailyCalories: newTargetCalories
      }
    });

    // Optionally: We could log this to a Historical biometric table if added to the Prisma Schema later,
    // but the DB already updates accurately natively!

    revalidatePath("/dashboard");
    revalidatePath("/profile");

    return { success: true, targetCalories: newTargetCalories };

  } catch (error: unknown) {
    console.error("Biometric Update Error", error);
    return { error: error instanceof Error ? error.message : "Failed to recalculate biometrics" };
  }
}
