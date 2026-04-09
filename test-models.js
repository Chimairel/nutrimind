const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: '.env.local' });

async function checkModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const modelsToTest = ['gemini-1.5-flash', 'gemini-1.5-flash-latest', 'gemini-1.5-pro', 'gemini-1.5-pro-latest', 'gemini-pro'];

  for (const m of modelsToTest) {
    try {
      const model = genAI.getGenerativeModel({ model: m });
      const result = await model.generateContent("Say hello");
      console.log(`[SUCCESS] ${m} works!`);
    } catch (e) {
      console.log(`[FAILED] ${m} - ${e.message}`);
    }
  }
}
checkModels();
