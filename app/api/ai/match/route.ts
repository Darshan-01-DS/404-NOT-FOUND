import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { SCHOLARSHIPS } from "@/lib/scholarships";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { profile } = await req.json();

    const scholarshipSummaries = SCHOLARSHIPS.map((s) => ({
      id: s.id,
      name: s.name,
      provider: s.provider,
      amount: s.amount,
      courseLevels: s.course_levels,
      categories: s.categories,
      genders: s.genders,
      states: s.states,
      minPercentage: s.min_percentage,
      deadline: s.deadline,
      providerType: s.provider_type,
    }));

    const prompt = `You are a scholarship matching AI for Indian students. 
    
Student Profile:
- Course Level: ${profile.courseLevel}
- Field: ${profile.field}
- Category: ${profile.category}
- State: ${profile.state}
- Gender: ${profile.gender}
- Annual Family Income: ₹${profile.income.toLocaleString("en-IN")}
- Marks/Percentage: ${profile.minMarks}%

Available Scholarships (JSON):
${JSON.stringify(scholarshipSummaries, null, 2)}

Task: Score each scholarship for this student's eligibility (0-100). Consider:
1. Category eligibility (SC/ST/OBC/EWS/General match = +25 points)
2. Gender eligibility (matches = +15 points)
3. Course level match (= +20 points)
4. State eligibility (All India or matching state = +15 points)
5. Marks above minimum_percentage (= +15 points)
6. Income-based need (lower income = higher score for need-based scholarships = +10 points)

Return a JSON array (sorted by score descending) in this exact format:
[
  {
    "id": "sch-001",
    "percent": 92,
    "reason": "One sentence explaining the match"
  }
]

Also include an "insight" field at the top level with 2-3 sentences summarizing the student's scholarship landscape.

Respond with valid JSON only, no markdown.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 2000,
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0]?.message?.content || "{}";
    const parsed = JSON.parse(raw);

    // Map results back to full scholarship objects
    const results = (parsed.results || parsed).map((r: { id: string; percent: number; reason: string }) => {
      const scholarship = SCHOLARSHIPS.find((s) => s.id === r.id);
      return scholarship ? { scholarship, percent: r.percent, reason: r.reason } : null;
    }).filter(Boolean);

    return NextResponse.json({ results, insight: parsed.insight });
  } catch (error) {
    console.error("Match API error:", error);

    // Fallback: local scoring
    const { profile } = await req.clone().json();
    const results = SCHOLARSHIPS.map((s) => {
      let score = 50;
      if (s.categories.length >= 5 || s.categories.includes(profile.category)) score += 20;
      if (s.genders.includes("Any") || s.genders.includes(profile.gender)) score += 10;
      if (!s.min_percentage || profile.minMarks >= s.min_percentage) score += 15;
      if (s.states.length === 0 || s.states.includes(profile.state)) score += 10;
      score = Math.min(99, Math.max(30, score));
      return { scholarship: s, percent: score, reason: `Eligible based on your ${profile.category} category and ${profile.courseLevel} level.` };
    }).sort((a, b) => b.percent - a.percent).slice(0, 15);

    return NextResponse.json({ results, insight: null });
  }
}
