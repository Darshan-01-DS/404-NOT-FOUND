import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    "X-Title": "ScholarArth Match",
  },
});

const rateMap = new Map<string, { count: number; resetAt: number }>();
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.resetAt) { rateMap.set(ip, { count: 1, resetAt: now + 60_000 }); return true; }
  if (entry.count >= 15) return false;
  entry.count++;
  return true;
}

const MATCH_SYSTEM_PROMPT = `You are ScholarArth's Match Intelligence Engine.
Given a student's profile and their top scholarship matches, generate a SHORT (2-3 sentences) personalized insight:
1. Why they are a strong candidate based on their specific profile
2. Which scholarship is their best opportunity and why
3. One actionable tip to improve their chances

Rules: Be human and encouraging. Use their actual category/marks/income. Under 70 words. Mention the top scholarship by name. Simple Indian English.`;

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Too many requests. Please wait." }, { status: 429 });
  }

  let body: { profile?: Record<string, unknown>; topMatches?: unknown[] };
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid request body." }, { status: 400 }); }

  const { profile, topMatches } = body;
  if (!profile || !topMatches) {
    return NextResponse.json({ error: "Missing profile or matches data." }, { status: 400 });
  }

  const prompt = `Student profile:
- Category: ${profile.category}, Gender: ${profile.gender}
- Course: ${profile.courseLevel} in ${profile.field}, State: ${profile.state}
- Annual Income: ₹${Number(profile.income).toLocaleString("en-IN")}, Marks: ${profile.minMarks}%
- First Gen: ${profile.isFirstGen ? "Yes" : "No"}, PwD: ${profile.disabled ? "Yes" : "No"}, Rural: ${profile.rural ? "Yes" : "No"}

Top 3 matches:
${(topMatches as Array<{name: string; provider: string; amount: number; percent: number}>)
  .map((m, i) => `${i + 1}. ${m.name} by ${m.provider} (${m.percent}% match, ₹${m.amount.toLocaleString("en-IN")}/yr)`)
  .join("\n")}

Generate a personalized 2-3 sentence match insight:`;

  try {
    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-001",
      messages: [
        { role: "system", content: MATCH_SYSTEM_PROMPT },
        { role: "user", content: prompt }
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    const insight = completion.choices[0]?.message?.content?.trim() ?? null;
    return NextResponse.json({ insight }, { status: 200 });

  } catch (error: unknown) {
    console.error("Match API error:", error);
    const top = (topMatches as Array<{name: string; percent: number}>)[0];
    const fallback = `Based on your ${profile.category} category and ${profile.minMarks}% marks, you have ${(topMatches as unknown[]).length} strong scholarship matches. Your best opportunity is ${top?.name} at ${top?.percent}% compatibility — ensure your income certificate and marksheets are ready to apply immediately.`;
    return NextResponse.json({ insight: fallback }, { status: 200 });
  }
}
