import { MealPlan } from "@/types";

export const mockMealPlan: MealPlan = {
  id: "mp-001",
  date: new Date().toISOString().split('T')[0],
  dailySummary: {
    totalCalories: 1750,
    totalProtein: 140,
    totalCarbs: 170,
    totalFat: 55
  },
  meals: [
    {
      id: "meal-1",
      name: "Sinangag at Itlog (Garlic Fried Rice with Egg)",
      type: "BREAKFAST",
      description: "A classic Filipino breakfast. Uses less oil to save calories.",
      calories: 350,
      macros: { protein: 15, carbs: 45, fat: 12 },
      preparationTimeMin: 15,
      ingredients: [
        { id: "ing-1", name: "Leftover rice", amount: 1, unit: "cup", category: "PANTRY" },
        { id: "ing-2", name: "Eggs", amount: 2, unit: "pcs", category: "PROTEIN" },
        { id: "ing-3", name: "Garlic", amount: 3, unit: "cloves", category: "PRODUCE" },
        { id: "ing-4", name: "Olive oil", amount: 1, unit: "tsp", category: "PANTRY" }
      ],
      instructions: [
        "Mince the garlic finely.",
        "Heat pan with a teaspoon of oil and fry garlic until golden.",
        "Add leftover rice, completely breaking any lumps. Cook for 5 minutes.",
        "In a separate pan, cook eggs to your preference. Serve together."
      ]
    },
    {
      id: "meal-2",
      name: "Sinigang na Tilapia (Tilapia Sour Soup)",
      type: "LUNCH",
      description: "Comforting and sour soup filled with local greens and fish.",
      calories: 450,
      macros: { protein: 35, carbs: 50, fat: 10 },
      preparationTimeMin: 30,
      ingredients: [
        { id: "ing-5", name: "Tilapia (Cleaned)", amount: 1, unit: "pc", category: "PROTEIN" },
        { id: "ing-6", name: "Kangkong (Water Spinach)", amount: 1, unit: "bunch", category: "PRODUCE" },
        { id: "ing-7", name: "Tamarind mix (Sinigang mix)", amount: 1, unit: "tbsp", category: "SPICES" },
        { id: "ing-8", name: "Tomato", amount: 2, unit: "pcs", category: "PRODUCE" },
        { id: "ing-9", name: "White Rice", amount: 1, unit: "cup", category: "PANTRY" }
      ],
      instructions: [
        "Boil water in a pot. Add tomatoes and onions.",
        "Add the whole clean tilapia and simmer for 10 minutes.",
        "Stir in the tamarind soup mix until dissolved.",
        "Add kangkong right before turning off the heat to keep it crisp. Serve with rice."
      ]
    },
    {
      id: "meal-3",
      name: "Chicken Adobo (Less Oil)",
      type: "DINNER",
      description: "The national dish, made healthier with skinless chicken breast.",
      calories: 400,
      macros: { protein: 45, carbs: 35, fat: 8 },
      preparationTimeMin: 40,
      ingredients: [
        { id: "ing-10", name: "Chicken Breast", amount: 250, unit: "g", category: "PROTEIN" },
        { id: "ing-11", name: "Soy Sauce", amount: 3, unit: "tbsp", category: "PANTRY" },
        { id: "ing-12", name: "Vinegar", amount: 2, unit: "tbsp", category: "PANTRY" },
        { id: "ing-13", name: "Garlic", amount: 4, unit: "cloves", category: "PRODUCE" },
        { id: "ing-14", name: "Peppercorns", amount: 1, unit: "tsp", category: "SPICES" }
      ],
      instructions: [
        "Marinate chicken breast with soy sauce, vinegar, garlic, and peppercorns for 20 mins.",
        "In a heated pan, sear the chicken lightly without added oil.",
        "Pour the marinade and simmer until chicken is cooked and fully tender.",
        "Serve with half a cup of rice."
      ]
    }
  ]
};
