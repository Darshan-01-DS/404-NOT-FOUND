import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const LANG_CONTEXTS = {
  en: "Write the SOP in formal Indian English. Use clear, confident language.",
  hi: "Write the SOP entirely in Hindi (Devanagari script). Use formal Hindi suitable for scholarship applications.",
  mr: "Write the SOP entirely in Marathi (Devanagari script). Use formal Marathi suitable for scholarship applications.",
};

export async function POST(req: NextRequest) {
  try {
    const { scholarshipName, yourName, courseCollege, achievements, financialNeed, careerGoal, tone, wordCount, lang = "en" } = await req.json();

    const wordTarget = parseInt(wordCount) || 500;
    const langContext = LANG_CONTEXTS[lang as keyof typeof LANG_CONTEXTS] || LANG_CONTEXTS.en;

    const toneGuide = {
      "Formal": "Use formal, professional language. Maintain a dignified and respectful tone throughout.",
      "Warm-Personal": "Use warm, personal language. Share genuine emotions and personal stories. Balance professional and heartfelt.",
      "Motivational": "Use inspiring, ambitious language. Emphasize determination, goals, and potential impact on society.",
    }[tone] || "Use formal language.";

    const prompt = `You are an expert scholarship SOP writer for Indian students. Write a ${wordTarget}-word SOP.

${langContext}
Tone: ${toneGuide}

Student Details:
- Name: ${yourName}
- Course & College: ${courseCollege}
- Scholarship Applying For: ${scholarshipName}
- Key Achievements: ${achievements}
- Financial Need: ${financialNeed}
- Career Goal: ${careerGoal}

Requirements:
1. Start with a compelling opening that mentions the scholarship by name
2. Describe academic achievements with specific details
3. Explain financial need authentically, with empathy and dignity
4. Articulate a clear, specific career goal and how it connects to helping India
5. End with gratitude and commitment
6. ${wordTarget} words (±10%)
7. No generic phrases like "to whom it may concern"
8. Avoid clichés like "since childhood I dreamed"

Return ONLY the SOP text, no title or labels.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      max_tokens: wordTarget * 2,
    });

    const sop = completion.choices[0]?.message?.content || "";

    // Simple quality score
    const score = Math.min(100, Math.max(60,
      70 +
      (sop.includes(scholarshipName) ? 5 : 0) +
      (sop.includes(careerGoal.split(" ")[0]) ? 5 : 0) +
      (sop.length > 800 ? 10 : 5) +
      (achievements ? 5 : 0) +
      (financialNeed ? 5 : 0)
    ));

    return NextResponse.json({ sop, score });
  } catch (error) {
    console.error("SOP API error:", error);
    return NextResponse.json({ error: "Failed to generate SOP. Please check your OpenAI API key." }, { status: 500 });
  }
}
