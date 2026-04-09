import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const systemPrompt = `You are ScholarArth AI — India's most helpful scholarship assistant. 
You specialize in:
- Finding scholarships for Indian students (Class 9 through PhD)
- Categories: OBC, SC, ST, EWS, General, PwD
- Government schemes: NSP, INSPIRE, Central Sector, AICTE schemes
- Corporate scholarships: HDFC, Tata, Reliance, Kotak, Aditya Birla
- SOP/essay writing tips
- Document guidance (Aadhaar, income certificate, caste certificate, etc.)
- PDF compression tips for NSP portal (max 200KB usually)
- Deadline tracking and application strategy

Always give concise, actionable advice. Use Indian English. 
Format responses clearly — use bullet points for lists.
Always mention that ScholarArth can help track applications and generate SOPs.
Keep responses under 200 words unless the user asks for detailed info.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.slice(-10), // Keep last 10 messages for context
      ],
      max_tokens: 400,
    });

    return NextResponse.json({
      reply: completion.choices[0]?.message?.content || "I couldn't generate a response. Please try again.",
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { reply: "I'm having trouble connecting right now. Please check your OpenAI API key configuration." },
      { status: 200 }
    );
  }
}
