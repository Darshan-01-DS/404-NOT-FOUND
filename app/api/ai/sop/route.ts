import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    "X-Title": "ScholarArth SOP",
  },
});

const rateMap = new Map<string, { count: number; resetAt: number }>();
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.resetAt) { rateMap.set(ip, { count: 1, resetAt: now + 60_000 }); return true; }
  if (entry.count >= 8) return false;
  entry.count++;
  return true;
}

const SOP_TEMPLATE = (form: Record<string, string>) => `I am ${form.yourName}, currently pursuing ${form.courseCollege}. I am writing this Statement of Purpose to apply for the ${form.scholarshipName}.

Growing up, education has always been our family's highest priority despite financial constraints. ${form.financialNeed}. This reality made every academic achievement feel more meaningful and every opportunity like this scholarship feel like a true lifeline.

In terms of academic performance and extracurricular involvement, I have consistently strived to stand out. ${form.achievements}. These experiences have not only honed my technical and analytical skills but also deepened my sense of responsibility toward the community.

My journey has not been without hardship. ${form.challenges || "Navigating the gap between aspiration and opportunity has been my defining challenge."} These experiences have made me resilient, resourceful, and deeply motivated.

Looking ahead, my vision is clear: ${form.careerGoal}. The ${form.scholarshipName} would be transformative — enabling me to pursue my education with complete focus, free from financial uncertainty.

I humbly request the selection committee to consider my application. I assure you that your investment in my education will be reflected not only in my academic excellence but also in meaningful contributions to society. Thank you for this opportunity.`;

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Rate limit exceeded. Please wait before generating another SOP." }, { status: 429 });
  }

  let body: Record<string, string>;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 }); }

  const required = ["scholarshipName", "yourName", "courseCollege", "achievements", "financialNeed", "careerGoal"];
  const missing = required.filter((k) => !body[k]?.trim());
  if (missing.length > 0) {
    return NextResponse.json({ error: `Missing required fields: ${missing.join(", ")}` }, { status: 400 });
  }

  const wordCountMap: Record<string, number> = { "300 words": 300, "500 words": 500, "800 words": 800 };
  const targetWords = wordCountMap[body.wordCount ?? "500 words"] ?? 500;

  const systemPrompt = `You are an expert scholarship SOP writer for Indian students. Write warm, authentic, specific, and persuasive Statements of Purpose.

Rules:
- Exactly around ${targetWords} words
- Tone: ${body.tone ?? "Professional & Formal"}
- Language: ${body.lang === "hi" ? "Hindi (Devanagari script)" : body.lang === "mr" ? "Marathi (Devanagari script)" : "English"}
- Structure: Opening → Background & Need → Achievements → Challenges → Career Vision → Gratitude
- Use specifics — names, numbers, percentages from the details provided
- Avoid clichés — make it genuinely personal
- Never use placeholder text or [brackets]
- End with a confident, grateful closing`;

  const userPrompt = `Write a compelling SOP for this student:

Scholarship: ${body.scholarshipName}
Student Name: ${body.yourName}
Course & College: ${body.courseCollege}
Key Achievements: ${body.achievements}
Financial Background: ${body.financialNeed}
Personal Challenges: ${body.challenges || "Not specified"}
Career Goal: ${body.careerGoal}

Write the complete SOP now:`;

  try {
    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-001",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      max_tokens: 1200,
      temperature: 0.8,
    });

    const sopText = completion.choices[0]?.message?.content?.trim();
    if (!sopText) throw new Error("Empty response");

    const wordCount = sopText.split(/\s+/).filter(Boolean).length;
    const score = Math.min(99, 72 + Math.floor(Math.random() * 20) + (body.challenges ? 5 : 0) + (wordCount >= targetWords * 0.85 ? 5 : 0));

    return NextResponse.json({ sopText, score, wordCount }, { status: 200 });

  } catch (error: unknown) {
    console.error("SOP API error:", error);
    const fallback = SOP_TEMPLATE(body);
    return NextResponse.json({
      sopText: fallback,
      score: 78,
      wordCount: fallback.split(/\s+/).length,
      fallback: true,
    }, { status: 206 });
  }
}
