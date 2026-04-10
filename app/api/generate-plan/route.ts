import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  console.log("=== API ROUTE HIT ===");
  console.log("GEMINI_API_KEY exists: ", !!process.env.GEMINI_API_KEY);

  try {
    const body = await req.json();
    const { goal, age, sex, height, weight, region, restrictions, targetCalories } = body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is not configured.");

    const genAI = new GoogleGenerativeAI(apiKey);

    const prompt = `You are a professional Filipino nutritionist and dietician.
    Generate a highly realistic, heavily tailored 1-day MealPlan object matching the provided Next.js TypeScript interfaces.
    Return ONLY a valid JSON object. Do not include markdown tags.
    
    interface MealPlan {
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
    
    interface Meal {
      id: string; 
      name: string; 
      type: "BREAKFAST" | "LUNCH" | "DINNER" | "SNACK";
      description: string; 
      calories: number;
      macros: { protein: number; carbs: number; fat: number; }; 
      preparationTimeMin: number;
      ingredients: Ingredient[];
      instructions: string[]; 
    }
    
    interface Ingredient {
      id: string; 
      name: string;
      amount: number;
      unit: string; 
      category: "PRODUCE" | "PROTEIN" | "PANTRY" | "SPICES"; 
    }

    Client Constraints:
    - User Biometrics: ${age} years old ${sex}, ${weight}kg, ${height}cm. 
    - Fitness Goal: ${goal || 'Healthy Living'}. 
    - Location Parameter: ${region}.
    - Dietary restrictions/allergies: ${restrictions || 'None'}
    
    Instructions for Generation:
    - The user's EXACT mathematically calculated daily target is ${targetCalories} kcal.
    - CRITICAL CALORIE ENFORCEMENT: The exact mathematical sum of all individual meal calories MUST EXACTLY EQUAL dailySummary.totalCalories, and MUST NOT EXCEED the strict ${targetCalories} kcal limit. If your generated meals surpass this (like 600+ kcal individual meals), you MUST swap them for lighter options!
    - Ensure macros accurately align mathematically with each meal's calorie count (Protein=4kcal/g, Carbs=4kcal/g, Fat=9kcal/g).
    - Include a realistic mix of accessible Filipino cuisine AND universally common, practical everyday meals (e.g., scrambled eggs, oatmeal, grilled chicken, side salads) using ingredients readily found in the specified region (${region}). Do not aggressively force heavy local dishes if it breaks the calorie bank.
    - Ensure ingredient categories are strictly typed (PRODUCE, PROTEIN, PANTRY, SPICES) with no variations.
    - The output must be exactly ONE top-level MealPlan JSON structure and NOTHING ELSE.`;

    const modelsToTry = [
      "gemini-2.0-flash",
      "gemini-2.5-flash",
      "gemini-2.5-flash-lite",
      "gemini-2.0-flash-lite",
      "gemini-2.5-pro"
    ];

    let lastError: unknown = null;

    for (const modelName of modelsToTry) {
      try {
        console.log(`[Model Fallback] Attempting generation with: ${modelName}`);
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: { responseMimeType: "application/json" }
        });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Safety cleanse
        const cleanText = text.replace(/```json/gi, '').replace(/```/g, '').trim();
        const plan = JSON.parse(cleanText);

        console.log(`[Model Fallback] SUCCESS! Generated using: ${modelName}`);
        return NextResponse.json(plan);

      } catch (err: unknown) {
        lastError = err;
        const errString = err instanceof Error ? err.message : String(err);
        console.log(`[Model Fallback] FAILED with ${modelName}:`, errString.split('\n')[0]);
        continue;
      }
    }

    throw lastError || new Error("All Gemini models failed to generate content.");

  } catch (err: unknown) {
    console.log("=== FULL ERROR BEGIN ===");
    console.log(err);
    console.log("=== FULL ERROR END ===");
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to generate meal plan." }, 
      { status: 500 }
    );
  }
}
