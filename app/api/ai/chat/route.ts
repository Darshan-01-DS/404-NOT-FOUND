import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// OpenRouter: OpenAI-compatible, uses the OPENROUTER_API_KEY — no quota issues
const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    "X-Title": "ScholarArth AI",
  },
});

// In-memory rate limiter
const rateMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 20;
const RATE_WINDOW = 60_000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

const SYSTEM_PROMPT = `You are ScholarArth AI — India's most knowledgeable scholarship assistant.

EXPERTISE AREAS:
- All NSP (National Scholarship Portal) schemes: PM Scholarship, Post-Matric SC/ST/OBC, Merit-cum-Means, INSPIRE
- MahaDBT scholarships for Maharashtra students — all scheme codes, eligibility, documents
- Buddy4Study aggregated scholarships — corporate CSR, foundations, state govt
- AICTE schemes: Swanath, Pragati, Saksham
- UGC schemes: MANF, Ishan Uday, Post-Doctoral Fellowship
- Private/CSR: HDFC Badhte Kadam, Tata Capital Pankh, Reliance Foundation, Kotak Kanya, Aditya Birla, Sitaram Jindal
- Document requirements per scheme — format (PDF/JPG), max size (NSP: 200KB), naming, validity
- Income certificate: validity 6 months, Tehsildar/SDO/MRO issuing authority
- Aadhaar seeding for PFMS bank accounts (mandatory for government scholarships)
- Common application mistakes and how to avoid them

RESPONSE RULES:
1. Always give specific, actionable advice
2. For documents: state format (PDF/JPG), max size, and validity period
3. If unsure of a deadline, say "Check scholarships.gov.in for current deadlines"
4. NEVER invent amounts, deadlines, or eligibility criteria
5. Always end scholarship-specific responses with: "Verify on the official portal before applying"
6. Keep responses under 150 words unless user asks for detail
7. Be warm, encouraging — many users are first-generation scholarship applicants
8. For OBC students, always mention non-creamy layer certificate requirement

CONTEXT: You are embedded in ScholarArth — India's free scholarship platform for Class 9 to PhD students.`;

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a minute and try again." },
      { status: 429 }
    );
  }

  let body: { messages?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { messages } = body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "Invalid messages format." }, { status: 400 });
  }
  if (messages.length > 50) {
    return NextResponse.json({ error: "Conversation too long. Please start a new chat." }, { status: 400 });
  }

  const validMessages = (messages as unknown[]).filter(
    (m): m is { role: string; content: string } =>
      typeof m === "object" &&
      m !== null &&
      "role" in m &&
      "content" in m &&
      typeof (m as { role: unknown }).role === "string" &&
      typeof (m as { content: unknown }).content === "string"
  );

  if (validMessages.length === 0) {
    return NextResponse.json({ error: "No valid messages provided." }, { status: 400 });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-001",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...validMessages.slice(-12).map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const reply =
      completion.choices[0]?.message?.content?.trim() ||
      "I couldn't generate a response. Please try again.";

    return NextResponse.json({ reply }, { status: 200 });
  } catch (error: unknown) {
    console.error("Chat API error:", error);

    // Provide a rich static fallback so chat never feels broken
    const lastMsg = validMessages[validMessages.length - 1]?.content?.toLowerCase() ?? "";
    let fallbackReply = "I'm here to help with your scholarship queries! Ask me about eligibility, documents, NSP portal, MahaDBT, or anything scholarship-related.";

    if (lastMsg.includes("nsp") || lastMsg.includes("document")) {
      fallbackReply = "For NSP, you need: ✓ Aadhaar Card (PDF, under 200KB) ✓ Income Certificate (6-month validity, Tehsildar-issued) ✓ Previous year marksheet ✓ Bank passbook (Aadhaar-linked account) ✓ Caste certificate (if SC/ST/OBC) ✓ Institute verification letter. Verify at scholarships.gov.in before applying.";
    } else if (lastMsg.includes("obc") || lastMsg.includes("non-creamy")) {
      fallbackReply = "OBC students need a Non-Creamy Layer (NCL) certificate — mandatory for most government scholarships. It must be issued by Tehsildar/SDO within the last 6 months. Family income must be below ₹8L/year. Without NCL, you'll only qualify as General category. Verify at scholarships.gov.in.";
    } else if (lastMsg.includes("mahadbt")) {
      fallbackReply = "MahaDBT is Maharashtra's scholarship portal at mahadbt.maharashtra.gov.in. It covers MainiScholars, Post-SSC, Post-HSC, and Professional schemes. Key documents: Aadhaar, income certificate (district-issued), domicile certificate (Maharashtra), and marksheets. Applications typically open August–October each year.";
    } else if (lastMsg.includes("compress") || lastMsg.includes("pdf") || lastMsg.includes("200kb")) {
      fallbackReply = "To compress PDFs for NSP (200KB limit): Use iLovePDF.com (free) → select 'Compress PDF' → upload → download. For photos, use TinyPNG.com. Alternatively, scan at 150 DPI in grayscale mode. Never submit files over the size limit — they get auto-rejected.";
    }

    return NextResponse.json({ reply: fallbackReply }, { status: 200 });
  }
}
