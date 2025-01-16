import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(request: NextRequest) {
  try {
    const { userPrompt } = await request.json();

    if (!userPrompt || userPrompt.trim().length < 6) {
      return NextResponse.json({ error: "❌ Please provide a valid prompt (minimum 6 characters)." }, { status: 400 });
    }

    const globalPrompt = process.env.NEXT_PUBLIC_GLOBAL_PROMPT;
    if (!globalPrompt) {
      return NextResponse.json({ error: "❌ Global prompt is not configured." }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(process.env.NEXT_GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const finalPrompt = `${globalPrompt} User Prompt => ${userPrompt}`;

    const result = await model.generateContent(finalPrompt);

    if (!result?.response?.candidates?.[0]?.content?.parts?.[0]?.text) {
      return NextResponse.json({ error: "❌ No valid content returned from the AI model." }, { status: 500 });
    }

    const output = result.response.candidates[0].content.parts[0].text;

    return NextResponse.json({ output });

  } catch (error) {
    console.error("Error in generating content:", error);
    return NextResponse.json({ error: "❌ An error occurred while processing the request." }, { status: 500 });
  }
}
