import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  console.log("=== API ROUTE HIT ===");
  console.log("GEMINI_API_KEY exists: ", !!process.env.GEMINI_API_KEY);

  try {
    const body = await req.json();
    const { goal, age, sex, height, weight, region, restrictions } = body;

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
    - First, calculate the user's TDEE (Total Daily Energy Expenditure) using the Mifflin-St Jeor equation based on the provided biometrics (age: ${age}, sex: ${sex}, height: ${height}cm, weight: ${weight}kg).
    - Adjust the target daily calories strictly based on their goal (${goal}): Weight loss = TDEE minus 300-500 kcal, Muscle gain = TDEE plus 200-300 kcal, Maintain / Eat healthier = exactly TDEE.
    - The sum of all meal calories combined MUST NOT exceed this calculated daily target. Ensure macros accurately align with the meal's calorie count.
    - Focus exclusively on accessible Filipino cuisine and ingredients readily found in the specified region (${region}).
    - Ensure ingredient categories are strictly typed (PRODUCE, PROTEIN, PANTRY, SPICES) with no variations.
    - The output must be exactly ONE top-level MealPlan JSON structure and NOTHING ELSE.`;

    const modelsToTry = [
      "gemini-2.0-flash",
      "gemini-2.5-flash",
      "gemini-2.5-flash-lite",
      "gemini-2.0-flash-lite",
      "gemini-2.5-pro"
    ];

    let lastError: any = null;

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

      } catch (err: any) {
        lastError = err;
        const errString = err.message || '';
        console.log(`[Model Fallback] FAILED with ${modelName}:`, errString.split('\n')[0]);
        continue;
      }
    }

    throw lastError || new Error("All Gemini models failed to generate content.");

  } catch (err: any) {
    console.log("=== FULL ERROR BEGIN ===");
    console.log(err);
    console.log("=== FULL ERROR END ===");
    return NextResponse.json({ error: err.message || "Failed to generate meal plan." }, { status: 500 });
  }
}
