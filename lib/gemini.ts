import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const geminiModel = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

export async function analyzeMealFromText(mealDescription: string): Promise<{
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sodium?: number;
  servingSize?: string;
  servingGrams?: number;
  cuisine?: string;
  description?: string;
}> {
  const prompt = `
    You are a Filipino nutrition expert. Analyze the following meal and provide accurate nutritional information.
    Consider common Filipino cooking methods (e.g. sautéing in oil, using coconut milk, frying) when estimating nutrition.
    
    Meal: ${mealDescription}
    
    Respond in this exact JSON format with no extra text:
    {
      "name": "meal name",
      "calories": number,
      "protein": number in grams,
      "carbs": number in grams,
      "fat": number in grams,
      "fiber": number in grams or null,
      "sodium": number in mg or null,
      "servingSize": "e.g. 1 cup",
      "servingGrams": number in grams,
      "cuisine": "Filipino" or other cuisine,
      "description": "brief description"
    }
  `;

  const result = await geminiModel.generateContent(prompt);
  const response = result.response.text();

  const cleaned = response.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned);
}

export async function analyzeMealFromImage(imageBase64: string, mimeType: string): Promise<{
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sodium?: number;
  servingSize?: string;
  servingGrams?: number;
  cuisine?: string;
  description?: string;
}> {
  const prompt = `
    You are a Filipino nutrition expert. Analyze this food image and provide accurate nutritional information.
    Consider common Filipino dishes and cooking methods when identifying and estimating nutrition.
    
    Respond in this exact JSON format with no extra text:
    {
      "name": "meal name",
      "calories": number,
      "protein": number in grams,
      "carbs": number in grams,
      "fat": number in grams,
      "fiber": number in grams or null,
      "sodium": number in mg or null,
      "servingSize": "e.g. 1 cup",
      "servingGrams": number in grams,
      "cuisine": "Filipino" or other cuisine,
      "description": "brief description"
    }
  `;

  const result = await geminiModel.generateContent([
    prompt,
    {
      inlineData: {
        mimeType,
        data: imageBase64,
      },
    },
  ]);

  const response = result.response.text();
  const cleaned = response.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned);
}