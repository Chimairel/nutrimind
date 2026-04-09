import { UserProfile } from "@/types";

export const mockUserProfile: UserProfile = {
  id: "user-001",
  name: "Juan Dela Cruz",
  goal: "LOSE_WEIGHT",
  activityLevel: "LIGHTLY_ACTIVE",
  dietaryPreferences: [],
  allergies: ["Shrimp"],
  region: "Metro Manila",
  dailyCalories: 1800,
  macros: {
    protein: 135,
    carbs: 180,
    fat: 60
  }
};

