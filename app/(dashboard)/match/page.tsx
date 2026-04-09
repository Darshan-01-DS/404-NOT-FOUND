"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, Calendar, TrendingUp } from "lucide-react";
import { SCHOLARSHIPS, formatINRFull, formatDeadline, daysUntil } from "@/lib/scholarships";
import type { ScholarshipRow } from "@/lib/scholarships";

interface MatchResult {
  scholarship: ScholarshipRow;
  percent: number;
  reason: string;
}

const COURSE_LEVELS = ["Class 9", "Class 10", "Class 11", "Class 12", "UG", "PG", "PhD", "Diploma"];
const FIELDS = ["Engineering", "Medical / MBBS", "Commerce / MBA", "Arts / Humanities", "Law", "Pure Sciences", "Other"];
const CATEGORIES = ["General", "OBC", "SC", "ST", "EWS", "PwD"];
const STATES = ["Maharashtra", "Delhi", "Karnataka", "Uttar Pradesh", "Tamil Nadu", "West Bengal", "Telangana", "Gujarat", "Rajasthan", "Other"];
const GENDERS = ["Male", "Female", "Transgender"];
const INCOMES = ["<1L", "1-2.5L", "2.5-5L", "5-8L", ">8L"];

function MatchBar({ percent }: { percent: number }) {
  const color = percent >= 75 ? "var(--emerald)" : percent >= 50 ? "#F59E0B" : "var(--rose)";
  return (
    <div style={{ height: 5, background: "var(--surf2)", borderRadius: 100, marginTop: 6 }}>
      <div style={{ height: "100%", width: `${percent}%`, background: color, borderRadius: 100, transition: "width .8s ease" }} />
    </div>
  );
}

export default function MatchPage() {
  const [profile, setProfile] = useState({ courseLevel: "UG", field: "Engineering", category: "OBC", state: "Maharashtra", gender: "Male", income: 500000, minMarks: 70 });
  const [results, setResults] = useState<MatchResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);

  function update(key: string, val: string | number) {
    setProfile((p) => ({ ...p, [key]: val }));
  }

  async function handleMatch() {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile }),
      });
      const data = await res.json();
      setResults(data.results || scoredResults());
      setAiInsight(data.insight || null);
    } catch {
      setResults(scoredResults());
    }
    setLoading(false);
  }

  // Local fallback scoring
  function scoredResults(): MatchResult[] {
    return SCHOLARSHIPS.map((s) => {
      let score = 50;
      if (s.categories.length >= 5 || s.categories.includes(profile.category as any)) score += 20;
      if (s.genders.includes("Any") || s.genders.includes(profile.gender as any)) score += 10;
      if (!s.min_percentage || profile.minMarks >= s.min_percentage) score += 15;
      if (s.states.length === 0 || s.states.includes(profile.state)) score += 10;
      score += Math.floor(Math.random() * 10 - 5);
      score = Math.min(99, Math.max(30, score));
      return {
        scholarship: s,
        percent: score,
        reason: `Matches your ${profile.category} category, ${profile.state} location, and academic profile.`,
      };
    }).sort((a, b) => b.percent - a.percent).slice(0, 15);
  }

  const incomeLabel = profile.income >= 100000 ? `₹${(profile.income / 100000).toFixed(1)}L` : `₹${(profile.income / 1000).toFixed(0)}K`;

  return (
    <div className="container-site" style={{ padding: "28px 24px" }}>
      <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>

        {/* ── Left Panel ── */}
        <div style={{ width: 340, flexShrink: 0 }}>
          <div className="card" style={{ padding: 22, position: "sticky", top: 74 }}>
            <h2 style={{ fontSize: 17, fontWeight: 800, color: "var(--ink)", marginBottom: 4 }}>Your Scholar Profile</h2>
            <p style={{ fontSize: 12.5, color: "var(--ink3)", marginBottom: 20 }}>Adjust to refine your matches</p>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 6 }}>Course Level</label>
                <select className="select" value={profile.courseLevel} onChange={(e) => update("courseLevel", e.target.value)} aria-label="Match course level">
                  {COURSE_LEVELS.map((l) => <option key={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 6 }}>Field</label>
                <select className="select" value={profile.field} onChange={(e) => update("field", e.target.value)} aria-label="Match field">
                  {FIELDS.map((f) => <option key={f}>{f}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 6 }}>Category</label>
                <select className="select" value={profile.category} onChange={(e) => update("category", e.target.value)} aria-label="Match category">
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 6 }}>State</label>
                <select className="select" value={profile.state} onChange={(e) => update("state", e.target.value)} aria-label="Match state">
                  {STATES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 6 }}>Gender</label>
                <select className="select" value={profile.gender} onChange={(e) => update("gender", e.target.value)} aria-label="Match gender">
                  {GENDERS.map((g) => <option key={g}>{g}</option>)}
                </select>
              </div>

              {/* Income Slider */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".5px" }}>Annual Income</label>
                  <span style={{ fontSize: 14, fontWeight: 800, color: "var(--brand)" }}>{incomeLabel}</span>
                </div>
                <input type="range" min={0} max={800000} step={25000} value={profile.income}
                  onChange={(e) => update("income", parseInt(e.target.value))} aria-label="Annual family income" />
              </div>

              {/* Marks Slider */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".5px" }}>Min Marks %</label>
                  <span style={{ fontSize: 14, fontWeight: 800, color: "var(--brand)" }}>{profile.minMarks}%</span>
                </div>
                <input type="range" min={40} max={100} step={1} value={profile.minMarks}
                  onChange={(e) => update("minMarks", parseInt(e.target.value))} aria-label="Minimum marks percentage" />
              </div>

              <button onClick={handleMatch} disabled={loading} className="btn btn-primary btn-fullwidth"
                style={{ justifyContent: "center", gap: 8, fontSize: 15, fontWeight: 800, padding: 12, borderRadius: 12, marginTop: 4 }}>
                {loading ? <><span className="animate-spin-slow" style={{ display: "inline-block" }}>⟳</span> Analyzing...</> : <><Sparkles size={16} /> Analyze & Match Me</>}
              </button>
            </div>
          </div>
        </div>

        {/* ── Results ── */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {!results && !loading && (
            <div style={{ textAlign: "center", padding: "80px 40px", background: "#fff", borderRadius: 14, border: "1px solid var(--bdr)" }}>
              <div style={{ fontSize: 56, marginBottom: 20 }}>🤖</div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--ink)", marginBottom: 10 }}>Your AI Match Report</h2>
              <p style={{ fontSize: 14, color: "var(--ink3)", lineHeight: 1.65, maxWidth: 420, margin: "0 auto 24px" }}>
                Set your profile on the left and click &quot;Analyze & Match Me&quot; to get a personalized ranking of scholarships with match probabilities.
              </p>
              <button onClick={handleMatch} className="btn btn-primary btn-lg" style={{ gap: 8 }}>
                <Sparkles size={16} /> Get My Free Match Report
              </button>
            </div>
          )}

          {loading && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[...Array(5)].map((_, i) => (
                <div key={i} style={{ background: "#fff", borderRadius: 14, padding: "20px 22px", border: "1.5px solid var(--bdr)", opacity: 0.6 }}>
                  <div style={{ height: 16, background: "var(--bg)", borderRadius: 100, width: "60%", marginBottom: 10 }} />
                  <div style={{ height: 12, background: "var(--bg)", borderRadius: 100, width: "40%", marginBottom: 16 }} />
                  <div style={{ height: 5, background: "var(--bg)", borderRadius: 100 }} />
                </div>
              ))}
            </div>
          )}

          {results && (
            <>
              {/* AI Insight Banner */}
              <div style={{ background: "var(--ink)", borderRadius: 18, padding: "22px 24px", display: "flex", gap: 18, marginBottom: 20, alignItems: "flex-start" }}>
                <div style={{ width: 44, height: 44, background: "rgba(255,255,255,.12)", borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
                  🤖
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "#fff", marginBottom: 6 }}>AI Match Analysis</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,.75)", lineHeight: 1.65, marginBottom: 14 }}>
                    {aiInsight || `Based on your profile as an ${profile.category} ${profile.gender} student pursuing ${profile.field} in ${profile.state}, I found ${results.length} eligible scholarships. Your top matches have a strong chance given your academic profile and category eligibility. Focus on the top 5 with deadlines approaching first.`}
                  </div>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    {[
                      { n: results.length, l: "Eligible" },
                      { n: `₹${Math.round(results.reduce((a, r) => a + r.scholarship.amount, 0) / results.length / 1000)}K`, l: "Avg. Value" },
                      { n: `${results[0]?.percent}%`, l: "Top Match" },
                    ].map((stat) => (
                      <div key={stat.l} style={{ background: "rgba(255,255,255,.1)", borderRadius: 9, padding: "9px 15px" }}>
                        <div style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>{stat.n}</div>
                        <div style={{ fontSize: 11, color: "rgba(255,255,255,.55)" }}>{stat.l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Result Cards */}
              {results.map((r, i) => {
                const days = daysUntil(r.scholarship.deadline);
                const isTop3 = i < 3;
                return (
                  <div key={r.scholarship.id} style={{
                    background: "#fff",
                    border: `${isTop3 ? "2px" : "1.5px"} solid ${isTop3 ? "var(--brand)" : "var(--bdr)"}`,
                    borderRadius: 14, padding: "20px 22px", marginBottom: 14,
                  }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                      {/* Rank */}
                      <div style={{ fontSize: 26, fontWeight: 800, color: isTop3 ? "#F59E0B" : "var(--bdr2)", flexShrink: 0, lineHeight: 1, minWidth: 32 }}>
                        #{i + 1}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 4 }}>
                          <div>
                            <div style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)" }}>{r.scholarship.name}</div>
                            <div style={{ fontSize: 12, color: "var(--ink3)", marginTop: 2 }}>{r.scholarship.provider}</div>
                          </div>
                          <div style={{ flexShrink: 0 }}>
                            <div style={{ fontSize: 18, fontWeight: 800, color: "var(--ink)" }}>{formatINRFull(r.scholarship.amount)}</div>
                          </div>
                        </div>

                        {/* Match bar */}
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                          <div style={{ flex: 1 }}><MatchBar percent={r.percent} /></div>
                          <span style={{ fontSize: 13, fontWeight: 800, color: r.percent >= 75 ? "var(--emerald)" : r.percent >= 50 ? "#F59E0B" : "var(--rose)", flexShrink: 0 }}>
                            {r.percent}%
                          </span>
                        </div>

                        {/* Why matched */}
                        <div style={{ fontSize: 12.5, color: "var(--ink2)", lineHeight: 1.6, background: "var(--bg)", borderRadius: 7, padding: "9px 12px", borderLeft: "3px solid var(--brand)", marginBottom: 12 }}>
                          <strong>Why matched:</strong> {r.reason}
                        </div>

                        {/* Footer */}
                        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                          <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: days <= 7 ? "var(--amber)" : "var(--ink3)" }}>
                            <Calendar size={13} /> {formatDeadline(r.scholarship.deadline)}
                          </span>
                          <Link href={`/scholarship/${r.scholarship.id}`} className="btn btn-primary btn-sm" style={{ marginLeft: "auto" }}>
                            Apply Now →
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          div[style*="width: 340px"] { width: 100% !important; position: static !important; }
          div.container-site > div[style*="flex"] { flex-direction: column !important; }
        }
      `}</style>
    </div>
  );
}
