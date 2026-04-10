import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") ?? "";
  const category = searchParams.get("category") ?? "";
  const gender = searchParams.get("gender") ?? "";
  const level = searchParams.get("level") ?? "";
  const provider_type = searchParams.get("provider_type") ?? "";
  const featured = searchParams.get("featured") ?? "";
  const limit = parseInt(searchParams.get("limit") ?? "100");

  let query = supabase
    .from("scholarships")
    .select("*")
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit);

  if (search) {
    query = query.or(`name.ilike.%${search}%,provider.ilike.%${search}%,description.ilike.%${search}%`);
  }
  if (category) {
    query = query.contains("categories", [category]);
  }
  if (gender && gender !== "Any") {
    query = query.or(`genders.cs.{${gender}},genders.cs.{Any}`);
  }
  if (level) {
    query = query.contains("course_levels", [level]);
  }
  if (provider_type) {
    query = query.eq("provider_type", provider_type);
  }
  if (featured === "true") {
    query = query.eq("is_featured", true);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error("Scholarships API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Map DB rows to the format expected by components
  const scholarships = (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    provider: row.provider,
    provider_type: row.provider_type,
    amount: Number(row.amount ?? 0),
    deadline: row.deadline,
    course_levels: row.course_levels ?? [],
    categories: row.categories ?? [],
    genders: row.genders ?? [],
    states: row.states ?? [],
    religions: row.religions ?? [],
    min_percentage: row.min_percentage ? Number(row.min_percentage) : null,
    description: row.description ?? "",
    documents_required: row.documents_required ?? [],
    apply_url: row.apply_url ?? "",
    is_featured: Boolean(row.is_featured),
    field_tags: row.field_tags ?? [],
    emoji: row.emoji ?? "🎓",
    created_at: row.created_at,
    scraped_source: row.scraped_source,
    last_synced_at: row.last_synced_at,
  }));

  return NextResponse.json({
    scholarships,
    total: count ?? scholarships.length,
    timestamp: new Date().toISOString(),
  });
}
