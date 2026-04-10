import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Firecrawl scrape + structured extract
const FIRECRAWL_API = "https://api.firecrawl.dev/v1/scrape";

interface FirecrawlScholarship {
  name: string;
  provider: string;
  amount?: number | string;
  deadline?: string;
  description?: string;
  eligibility?: string;
  url?: string;
  categories?: string[];
  course_levels?: string[];
}

async function scrapeScholarships(url: string, source: string): Promise<FirecrawlScholarship[]> {
  const res = await fetch(FIRECRAWL_API, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.FIRECRAWL_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url,
      formats: ["extract"],
      extract: {
        prompt: `Extract ALL scholarship listings from this page. For each scholarship return: name, provider (organization giving the scholarship), amount (yearly INR amount as number), deadline (date as YYYY-MM-DD), description (2 sentences max), eligibility (key eligibility criteria), url (link to apply). Return as JSON array.`,
        schema: {
          type: "object",
          properties: {
            scholarships: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  provider: { type: "string" },
                  amount: { type: "number" },
                  deadline: { type: "string" },
                  description: { type: "string" },
                  eligibility: { type: "string" },
                  url: { type: "string" },
                },
                required: ["name", "provider"],
              },
            },
          },
        },
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Firecrawl error for ${url}: ${err}`);
  }

  const data = await res.json();
  const extracted = data?.extract?.scholarships ?? data?.data?.extract?.scholarships ?? [];
  return (extracted as FirecrawlScholarship[]).map((s) => ({ ...s, scraped_source: source }));
}

function inferProviderType(provider: string): string {
  const p = provider.toLowerCase();
  if (p.includes("ministry") || p.includes("govt") || p.includes("government") || p.includes("dst") || p.includes("aicte") || p.includes("ugc") || p.includes("nsp") || p.includes("state") || p.includes("central") || p.includes("national")) return "Government";
  if (p.includes("foundation") && !p.includes("tata") && !p.includes("reliance")) return "NGO";
  if (p.includes("international") || p.includes("british") || p.includes("commonwealth")) return "International";
  return "Corporate";
}

function inferEmoji(name: string, providerType: string): string {
  const n = name.toLowerCase();
  if (n.includes("girl") || n.includes("women") || n.includes("female") || n.includes("kanya")) return "👩‍🎓";
  if (n.includes("science") || n.includes("stem") || n.includes("tech")) return "🔬";
  if (n.includes("merit")) return "🏅";
  if (providerType === "Government") return "🏛️";
  if (providerType === "Corporate") return "🏢";
  if (providerType === "NGO") return "📚";
  return "🎓";
}

export async function POST(req: NextRequest) {
  // Verify secret key to prevent unauthorized triggers
  const authHeader = req.headers.get("x-sync-secret");
  if (authHeader !== process.env.SYNC_SECRET && process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const SOURCES = [
    { url: "https://www.buddy4study.com/scholarships", source: "buddy4study" },
    { url: "https://scholarships.gov.in", source: "nsp" },
  ];

  const results = { inserted: 0, updated: 0, errors: [] as string[] };

  for (const { url, source } of SOURCES) {
    try {
      console.log(`Scraping ${source}...`);
      const scholarships = await scrapeScholarships(url, source);
      console.log(`Got ${scholarships.length} scholarships from ${source}`);

      for (const s of scholarships) {
        if (!s.name || s.name.length < 5) continue;

        const providerType = inferProviderType(s.provider ?? "");
        const emoji = inferEmoji(s.name, providerType);

        // Parse deadline — default to 6 months from now if missing
        let deadlineDate: Date;
        if (s.deadline) {
          deadlineDate = new Date(s.deadline);
          if (isNaN(deadlineDate.getTime())) {
            deadlineDate = new Date();
            deadlineDate.setMonth(deadlineDate.getMonth() + 6);
          }
        } else {
          deadlineDate = new Date();
          deadlineDate.setMonth(deadlineDate.getMonth() + 6);
        }

        // Parse amount
        let amount = 0;
        if (typeof s.amount === "number") amount = s.amount;
        else if (typeof s.amount === "string") {
          const cleaned = s.amount.replace(/[^0-9]/g, "");
          amount = parseInt(cleaned) || 0;
        }

        const row = {
          name: s.name.slice(0, 200),
          provider: (s.provider ?? "Unknown").slice(0, 100),
          provider_type: providerType,
          amount,
          deadline: deadlineDate.toISOString(),
          course_levels: ["UG", "PG"],
          categories: ["General", "OBC", "SC", "ST", "EWS"],
          genders: ["Any"],
          states: ["All India"],
          religions: ["All"],
          min_percentage: null,
          description: (s.description ?? s.eligibility ?? "").slice(0, 500),
          documents_required: ["Aadhaar Card", "Income Certificate", "Marksheet", "Bank Passbook"],
          apply_url: s.url ?? url,
          is_featured: false,
          field_tags: [],
          emoji,
          scraped_source: source,
          last_synced_at: new Date().toISOString(),
        };

        // Upsert by name + provider to avoid duplicates
        const { data: existing } = await supabase
          .from("scholarships")
          .select("id")
          .eq("name", row.name)
          .eq("provider", row.provider)
          .single();

        if (existing) {
          await supabase.from("scholarships").update(row).eq("id", existing.id);
          results.updated++;
        } else {
          await supabase.from("scholarships").insert(row);
          results.inserted++;
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`Error scraping ${source}:`, msg);
      results.errors.push(`${source}: ${msg}`);
    }
  }

  return NextResponse.json({
    success: true,
    inserted: results.inserted,
    updated: results.updated,
    errors: results.errors,
    message: `Sync complete: ${results.inserted} new, ${results.updated} updated`,
  });
}

// Trigger sync from browser (GET) — for hackathon demo
export async function GET() {
  const { count } = await supabase.from("scholarships").select("*", { count: "exact", head: true });
  return NextResponse.json({
    scholarships_in_db: count ?? 0,
    message: "POST to this endpoint to trigger a Firecrawl sync",
    tip: "No auth required in development mode",
  });
}
