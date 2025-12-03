import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
}

function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { noteText, choices } = body;

    if (!noteText) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    const prompt = `
      You are a strict teacher. Generate ${
        choices || 5
      } multiple choice questions from the text below.
      
      CRITICAL INSTRUCTIONS:
      1. Return ONLY a JSON array. No markdown, no "Here is the quiz".
      2. Keep all options CONCISE (under 10 words each).
      3. Format: [{ "question": "...", "options": ["Option1", "Option2", "Option3", "Option4"], "answer": "Exact String of Correct Option" }]
      
      Text: ${noteText.substring(0, 3000)}
    `;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: prompt }],
      model: "gpt-4o-mini",
    });

    const rawContent = completion.choices[0].message.content || "[]";
    const quizData = JSON.parse(rawContent) as QuizQuestion[];

    quizData.forEach((q) => {
      shuffleArray(q.options);
    });

    return NextResponse.json({ success: true, quiz: quizData });
  } catch (error) {
    console.error("OpenAI Error:", error);
    return NextResponse.json(
      { error: "Failed to generate quiz" },
      { status: 500 }
    );
  }
}
