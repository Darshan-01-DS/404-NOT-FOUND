"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, Calendar, CheckCircle2 } from "lucide-react";
import { SCHOLARSHIPS, formatINRFull, formatDeadline } from "@/lib/scholarships";
import type { ScholarshipRow } from "@/lib/scholarships";

interface MatchResult {
  scholarship: ScholarshipRow;
  percent: number;
  reason: string;
  breakdown: { category: number; marks: number; location: number };
}

const COURSE_LEVELS = ["Class 9-12", "UG", "PG", "PhD", "Diploma"];
const FIELDS = ["Engineering", "Medical", "Commerce / MBA", "Arts / Humanities", "Pure Sciences", "Law", "Other"];
const CATEGORIES = ["General", "OBC", "SC", "ST", "EWS", "PwD"];
const STATES = ["Maharashtra", "Delhi", "Karnataka", "Uttar Pradesh", "Tamil Nadu", "Rajasthan", "Gujarat", "Other"];
const GENDERS = ["Male", "Female", "Transgender"];

function StackedBar({ breakdown }: { breakdown: { category: number; marks: number; location: number } }) {
  const total = breakdown.category + breakdown.marks + breakdown.location;
  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 700, color: "var(--text-muted)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.5px" }}>
        <span>Score Breakdown</span>
        <span style={{ color: total >= 80 ? "var(--success)" : total >= 50 ? "var(--warning)" : "var(--danger)" }}>{total}%</span>
      </div>
      <div style={{ display: "flex", height: 10, background: "var(--bg-sunken)", borderRadius: 100, overflow: "hidden" }}>
        <div style={{ width: `${breakdown.category}%`, background: "var(--brand)", transition: "width .8s cubic-bezier(0.16,1,0.3,1)" }} title={`Demographics: ${breakdown.category}%`} />
        <div style={{ width: `${breakdown.marks}%`, background: "var(--success)", transition: "width .8s cubic-bezier(0.16,1,0.3,1) .1s", borderLeft: "1px solid #fff" }} title={`Academics: ${breakdown.marks}%`} />
        <div style={{ width: `${breakdown.location}%`, background: "var(--warning)", transition: "width .8s cubic-bezier(0.16,1,0.3,1) .2s", borderLeft: "1px solid #fff" }} title={`Requirements: ${breakdown.location}%`} />
      </div>
      <div style={{ display: "flex", gap: 12, fontSize: 10, fontWeight: 700, color: "var(--text-muted)", marginTop: 6 }}>
        <span style={{ display: "flex", alignItems: "center", gap: 3 }}><div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--brand)" }}/> Demographics</span>
        <span style={{ display: "flex", alignItems: "center", gap: 3 }}><div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--success)" }}/> Academics</span>
        <span style={{ display: "flex", alignItems: "center", gap: 3 }}><div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--warning)" }}/> Requirements</span>
      </div>
    </div>
  );
}

export default function MatchPage() {
  const [profile, setProfile] = useState({
    courseLevel: "UG", field: "Engineering", category: "OBC", state: "Maharashtra",
    gender: "Male", income: 250000, minMarks: 75,
    isFirstGen: false, disabled: false, rural: false
  });

  const [results, setResults] = useState<MatchResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  function update(key: string, val: string | number | boolean) {
    setProfile((p) => ({ ...p, [key]: val }));
  }

  // Local scoring engine using correct ScholarshipRow fields
  function scoredResults(): MatchResult[] {
    return SCHOLARSHIPS.map((s) => {
      let b_cat = 20, b_marks = 15, b_loc = 10;

      // Category match — uses s.categories (string[])
      const profileCat = profile.category;
      if (s.categories.includes(profileCat as never)) b_cat += 20;
      else if (s.categories.length >= 5) b_cat += 8; // open to all

      // Course level match — uses s.course_levels
      const courseLevelMap: Record<string, string[]> = {
        "Class 9-12": ["Class 9", "Class 10", "Class 11", "Class 12"],
        "UG": ["UG"], "PG": ["PG"], "PhD": ["PhD"], "Diploma": ["Diploma"]
      };
      const mappedLevels = courseLevelMap[profile.courseLevel] ?? [profile.courseLevel];
      if (s.course_levels.some((cl) => mappedLevels.includes(cl))) b_marks += 15;

      // Marks-based scoring
      if (profile.minMarks >= 85) b_marks += 15;
      else if (profile.minMarks >= 75) b_marks += 10;
      else if (profile.minMarks >= 60) b_marks += 5;

      // Min percentage requirement — uses s.min_percentage
      if (s.min_percentage && profile.minMarks < s.min_percentage) {
        b_marks = Math.max(0, b_marks - 15);
      }

      // Income scoring
      if (profile.income <= 100000) b_loc += 20;
      else if (profile.income <= 250000) b_loc += 15;
      else if (profile.income <= 500000) b_loc += 5;

      // State match — uses s.states
      if (s.states.length === 0 || s.states.includes(profile.state)) b_loc += 10;

      // Gender match — uses s.genders
      if (s.genders.includes("Any") || s.genders.includes(profile.gender as never)) {
        b_cat += 5;
      } else {
        b_cat = Math.max(0, b_cat - 20); // penalize mismatch
      }

      // Field match — uses s.field_tags
      if (s.field_tags.some((ft) => ft.toLowerCase().includes(profile.field.split("/")[0].toLowerCase().trim()))) {
        b_marks += 5;
      }

      // Special flags bonus
      if (profile.isFirstGen) b_cat += 5;
      if (profile.disabled && s.categories.includes("PwD" as never)) b_cat += 10;
      if (profile.rural) b_loc += 5;

      // Slight variation per scholarship ID
      const mod = (s.id.charCodeAt(s.id.length - 1) % 8);
      b_cat = Math.min(45, b_cat + mod);
      b_marks = Math.min(35, b_marks + (mod % 4));
      b_loc = Math.min(30, b_loc + (mod % 3));

      const total = Math.min(99, b_cat + b_marks + b_loc);
      const reasons = [];
      if (s.categories.includes(profileCat as never)) reasons.push(`${profileCat} category eligible`);
      if (profile.income <= 250000) reasons.push("income within limit");
      if (profile.minMarks >= (s.min_percentage ?? 0)) reasons.push(`${profile.minMarks}% meets requirement`);

      return {
        scholarship: s,
        percent: total,
        breakdown: { category: b_cat, marks: b_marks, location: b_loc },
        reason: reasons.length > 0 ? `Your profile qualifies: ${reasons.join(", ")}.` : "Your overall profile is a strong match for this scheme.",
      };
    })
    .filter((r) => r.percent >= 40) // Only show meaningful matches
    .sort((a, b) => b.percent - a.percent)
    .slice(0, 12);
  }

  async function handleMatch() {
    setLoading(true);
    setResults(null);
    setAiInsight(null);

    // Compute scores locally first
    await new Promise((resolve) => setTimeout(resolve, 800));
    const scored = scoredResults();
    setResults(scored);
    setLoading(false);

    // Then fetch AI insight
    setAiLoading(true);
    try {
      const res = await fetch("/api/ai/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile,
          topMatches: scored.slice(0, 3).map((r) => ({
            name: r.scholarship.name,
            provider: r.scholarship.provider,
            amount: r.scholarship.amount,
            percent: r.percent,
          })),
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setAiInsight(data.insight ?? data.reply ?? "Analysis complete. Review your matches below.");
      } else {
        setAiInsight(`Based on your profile as ${profile.category} ${profile.gender} student in ${profile.field}, found ${scored.length} eligible scholarships. Top match: ${scored[0]?.scholarship.name} at ${scored[0]?.percent}% compatibility.`);
      }
    } catch {
      setAiInsight(`Found ${scored.length} scholarships matching your profile. Your top opportunity is ${scored[0]?.scholarship.name} (${scored[0]?.percent}% match). Tap ‛Review & Apply‛ on any card to proceed.`);
    }
    setAiLoading(false);
  }

  const incomeLabel = profile.income >= 100000 ? `₹${(profile.income / 100000).toFixed(1)}L` : `₹${(profile.income / 1000).toFixed(0)}K`;

  return (
    <div style={{ padding: "32px 32px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: 32, alignItems: "flex-start" }} className="match-grid">

        {/* ── Left Panel ── */}
        <aside style={{ background: "var(--bg-surface)", border: "1px solid var(--border-medium)", borderRadius: "var(--radius-xl)", padding: 24, position: "sticky", top: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--text-primary)", marginBottom: 4 }}>Your Profile Matrix</h2>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 24 }}>Tune parameters for live AI scoring</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label className="field-label">Course Level</label>
              <select className="select" value={profile.courseLevel} onChange={(e) => update("courseLevel", e.target.value)}>
                {COURSE_LEVELS.map((l) => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="field-label">Field of Study</label>
              <select className="select" value={profile.field} onChange={(e) => update("field", e.target.value)}>
                {FIELDS.map((f) => <option key={f}>{f}</option>)}
              </select>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <label className="field-label">Category</label>
                <select className="select" value={profile.category} onChange={(e) => update("category", e.target.value)}>
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label className="field-label">Gender</label>
                <select className="select" value={profile.gender} onChange={(e) => update("gender", e.target.value)}>
                  {GENDERS.map((g) => <option key={g}>{g}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="field-label">State</label>
              <select className="select" value={profile.state} onChange={(e) => update("state", e.target.value)}>
                {STATES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>

            {/* Income Slider */}
            <div style={{ background: "var(--bg-sunken)", padding: "16px", borderRadius: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <label className="field-label" style={{ marginBottom: 0 }}>Annual Family Income</label>
                <span style={{ fontSize: 14, fontWeight: 800, color: "var(--brand)" }}>{incomeLabel}</span>
              </div>
              <input type="range" min={0} max={1000000} step={25000} value={profile.income}
                onChange={(e) => update("income", parseInt(e.target.value))} style={{ width: "100%" }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--text-muted)", fontWeight: 600, marginTop: 4 }}>
                <span>₹0</span><span>₹10L</span>
              </div>
            </div>

            {/* Marks Slider */}
            <div style={{ background: "var(--bg-sunken)", padding: "16px", borderRadius: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <label className="field-label" style={{ marginBottom: 0 }}>Previous Year Marks</label>
                <span style={{ fontSize: 14, fontWeight: 800, color: "var(--success)" }}>{profile.minMarks}%</span>
              </div>
              <input type="range" min={40} max={100} step={1} value={profile.minMarks}
                onChange={(e) => update("minMarks", parseInt(e.target.value))} style={{ width: "100%", accentColor: "var(--success)" }} />
            </div>

            {/* Special Flags */}
            <div style={{ borderTop: "1px solid var(--border-light)", paddingTop: 16, marginTop: 4, display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { key: "isFirstGen", label: "First Generation Learner", checked: profile.isFirstGen },
                { key: "disabled", label: "Disability Status (PwD)", checked: profile.disabled },
                { key: "rural", label: "Rural Area Resident", checked: profile.rural },
              ].map((flag) => (
                <label key={flag.key} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13.5, fontWeight: 600, color: "var(--text-secondary)", cursor: "pointer" }}>
                  <input type="checkbox" checked={flag.checked}
                    onChange={(e) => update(flag.key, e.target.checked)}
                    style={{ width: 16, height: 16, accentColor: "var(--brand)" }} />
                  {flag.label}
                </label>
              ))}
            </div>

            <button onClick={handleMatch} disabled={loading || aiLoading} className="btn btn-primary btn-fullwidth btn-lg" style={{ marginTop: 8 }}>
              {loading ? "Analyzing..." : <><Sparkles size={18} /> Generate Match Report</>}
            </button>
          </div>
        </aside>

        {/* ── Results ── */}
        <div style={{ minWidth: 0 }}>
          {!results && !loading && (
            <div style={{ textAlign: "center", padding: "100px 40px", background: "var(--bg-surface)", borderRadius: "var(--radius-xl)", border: "1px dashed var(--border-medium)" }}>
              <Sparkles size={48} color="var(--brand)" style={{ margin: "0 auto 20px" }} />
              <h2 style={{ fontSize: 24, fontWeight: 800, color: "var(--text-primary)", marginBottom: 12 }}>Run your AI Match Analysis</h2>
              <p style={{ fontSize: 15, color: "var(--text-muted)", lineHeight: 1.6, maxWidth: 400, margin: "0 auto 32px" }}>
                Adjust your exact parameters on the left — our AI engine will rank every scholarship by your unique eligibility score.
              </p>
              <button onClick={handleMatch} className="btn btn-primary btn-lg">
                Run Analysis Now
              </button>
            </div>
          )}

          {loading && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[1, 2, 3].map((i) => (
                <div key={i} style={{ background: "var(--bg-surface)", borderRadius: "var(--radius-lg)", padding: 24, border: "1px solid var(--border-light)", opacity: 1 - (i * 0.2) }} className="animate-pulse">
                  <div style={{ height: 20, background: "var(--bg-sunken)", borderRadius: 4, width: "55%", marginBottom: 12 }} />
                  <div style={{ height: 14, background: "var(--bg-sunken)", borderRadius: 4, width: "35%", marginBottom: 24 }} />
                  <div style={{ height: 10, background: "var(--bg-sunken)", borderRadius: 100, width: "100%" }} />
                </div>
              ))}
            </div>
          )}

          {results && !loading && (
            <div className="animate-fade-in-up">
              {/* Insight Panel */}
              <div style={{ background: "linear-gradient(135deg, var(--brand) 0%, var(--brand-dark,#5a1fcf) 100%)", borderRadius: "var(--radius-lg)", padding: 28, color: "#fff", marginBottom: 28, display: "flex", gap: 20, alignItems: "flex-start" }}>
                <Sparkles size={24} style={{ flexShrink: 0, marginTop: 2 }} />
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 8 }}>AI Match Insight</h3>
                  {aiLoading ? (
                    <div style={{ opacity: 0.7, fontSize: 14 }}>Generating personalized insight...</div>
                  ) : (
                    <p style={{ fontSize: 14, lineHeight: 1.6, opacity: 0.95 }}>{aiInsight}</p>
                  )}
                </div>
                <div style={{ background: "rgba(255,255,255,0.18)", borderRadius: "var(--radius-md)", padding: "12px 20px", textAlign: "center", flexShrink: 0 }}>
                  <div style={{ fontSize: 32, fontWeight: 800, lineHeight: 1 }}>{results.length}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.8, textTransform: "uppercase", letterSpacing: "0.5px", marginTop: 6 }}>Eligible</div>
                </div>
              </div>

              {/* Match Cards */}
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {results.map((r, i) => {
                  const isTop = i === 0;
                  return (
                    <div key={r.scholarship.id} style={{
                      background: "var(--bg-surface)",
                      border: `2px solid ${isTop ? "var(--brand)" : "var(--border-medium)"}`,
                      borderRadius: "var(--radius-lg)", padding: "24px",
                      position: "relative", transition: "box-shadow 0.2s", boxShadow: isTop ? "0 0 0 4px var(--brand-light)" : "none"
                    }}>
                      {isTop && (
                        <div style={{ position: "absolute", top: -14, left: 24, background: "var(--brand)", color: "#fff", padding: "4px 16px", borderRadius: 100, fontSize: 11, fontWeight: 800, letterSpacing: 0.5 }}>
                          ★ HIGHEST PROBABILITY MATCH
                        </div>
                      )}

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                        <div style={{ display: "flex", gap: 12, alignItems: "flex-start", flex: 1, minWidth: 0 }}>
                          <div style={{ width: 44, height: 44, background: "var(--bg-sunken)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
                            {r.scholarship.emoji}
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <h3 style={{ fontSize: 17, fontWeight: 800, color: "var(--text-primary)", marginBottom: 3, lineHeight: 1.3 }}>{r.scholarship.name}</h3>
                            <div style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 600 }}>{r.scholarship.provider}</div>
                          </div>
                        </div>
                        <div style={{ textAlign: "right", flexShrink: 0, paddingLeft: 12 }}>
                          <div style={{ fontSize: 22, fontWeight: 800, color: r.percent >= 80 ? "var(--success)" : r.percent >= 60 ? "var(--warning)" : "var(--danger)" }}>
                            {r.percent}%
                          </div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--brand)" }}>{formatINRFull(r.scholarship.amount)}</div>
                        </div>
                      </div>

                      <StackedBar breakdown={r.breakdown} />

                      <div style={{ marginTop: 16, padding: "12px 16px", background: "var(--brand-light)", borderRadius: "var(--radius-md)", fontSize: 13, color: "var(--brand)", display: "flex", gap: 8, alignItems: "flex-start" }}>
                        <CheckCircle2 size={16} style={{ flexShrink: 0, marginTop: 2 }} />
                        <span style={{ lineHeight: 1.5 }}><strong>Why you match:</strong> {r.reason}</span>
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 20, paddingTop: 16, borderTop: "1px solid var(--border-light)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, color: "var(--danger)" }}>
                          <Calendar size={14} /> Deadline: {formatDeadline(r.scholarship.deadline)}
                        </div>
                        <Link href={`/scholarship/${r.scholarship.id}`} className="btn btn-primary">
                          Review &amp; Apply
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 1100px) {
          .match-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
