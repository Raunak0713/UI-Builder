"use server"

import { GoogleGenerativeAI } from '@google/generative-ai'

const generateCode = async (userPrompt: string) => {
  try {
    if (!userPrompt || userPrompt.trim().length < 6) {
      return { error: "❌ Please provide a valid prompt (minimum 6 characters)." };
    }

    const globalPrompt = process.env.NEXT_PUBLIC_GLOBAL_PROMPT;
    if (!globalPrompt) {
      return { error: "❌ Global prompt is not configured." };
    }

    const genAI = new GoogleGenerativeAI(process.env.NEXT_GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const finalPrompt = `${globalPrompt} User Prompt => ${userPrompt}`;

    const result = await model.generateContent(finalPrompt);

    if (!result?.response?.candidates?.[0]?.content?.parts?.[0]?.text) {
      return { error: "❌ No valid content returned from the AI model." };
    }

    const output = result.response.candidates[0].content.parts[0].text;

    return { output };

  } catch (error) {
    console.error("Error in generating content:", error);
    return { error: "❌ An error occurred while processing the request." };
  }
}

export default generateCode;
