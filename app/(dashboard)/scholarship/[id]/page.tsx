"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { Calendar, ArrowLeft, Sparkles, Bookmark, ExternalLink, CheckCircle2, XCircle, Clock } from "lucide-react";
import { SCHOLARSHIPS, formatINRFull, formatDeadline, daysUntil } from "@/lib/scholarships";

// SVG Match Ring Component
function MatchRing({ percent }: { percent: number }) {
  const size = 90, stroke = 7;
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (percent / 100) * circ;
  const color = percent >= 80 ? "var(--success)" : percent >= 50 ? "var(--warning)" : "var(--danger)";
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--border-medium)" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle"
        style={{ transform: "rotate(90deg)", transformOrigin: "50% 50%", fill: color, fontSize: 20, fontWeight: 800 }}>
        {percent}%
      </text>
    </svg>
  );
}

const PROVIDER_COLORS: Record<string, string> = {
  Government: "#1B3A6B",
  Corporate: "#E07B39",
  NGO: "#1A7A4A",
  International: "#5B21B6",
};

export default function ScholarshipDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const scholarship = SCHOLARSHIPS.find((s) => s.id === id);
  const [activeTab, setActiveTab] = useState("Overview");
  const [saved, setSaved] = useState(false);

  if (!scholarship) {
    return (
      <div style={{ padding: 64, textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", marginBottom: 12 }}>Scholarship Not Found</h2>
        <p style={{ color: "var(--text-muted)", marginBottom: 24 }}>This scholarship may have been removed or the link is incorrect.</p>
        <Link href="/browse" className="btn btn-primary">Browse All Scholarships</Link>
      </div>
    );
  }

  const mockPercent = 87;
  const days = daysUntil(scholarship.deadline);
  const accentColor = PROVIDER_COLORS[scholarship.provider_type ?? ""] ?? "var(--brand)";

  const TABS = ["Overview", "Eligibility", "Documents", "Timeline", "FAQs"];

  const FAQ_DATA = [
    { q: "Can I apply to multiple scholarships simultaneously?", a: "Yes, there is no restriction on applying to multiple schemes. Each application is evaluated independently." },
    { q: "When will I receive the scholarship amount?", a: "Upon selection, the amount is transferred via PFMS within 30–60 days to the student's Aadhaar-linked bank account." },
    { q: "What happens if my income crosses the limit mid-year?", a: "Eligibility is determined at the time of application. You need a fresh certificate for renewal next academic year." },
    { q: "Is renewal automatic?", a: "No. You must apply for renewal each academic year with fresh documents, maintain required marks, and file a fresh application." },
    { q: "Is there an age limit for applying?", a: "Age limits vary by scheme. Most scholarships don't impose age restrictions but require enrollment in a qualifying program." },
  ];

  return (
    <div style={{ padding: "32px 24px" }}>
      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24, fontSize: 13, color: "var(--text-muted)" }}>
        <Link href="/browse" style={{ textDecoration: "none", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4, fontWeight: 600 }}>
          <ArrowLeft size={14} /> Browse
        </Link>
        <span>/</span>
        <span style={{ color: "var(--text-primary)", fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 400 }}>{scholarship.name}</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 32, alignItems: "flex-start" }} className="detail-grid">

        {/* ── Main Content ── */}
        <div style={{ minWidth: 0 }}>
          {/* Header Card */}
          <div style={{ background: "var(--bg-surface)", border: `1px solid var(--border-medium)`, borderLeft: `4px solid ${accentColor}`, borderRadius: "var(--radius-xl)", padding: 32, marginBottom: 24 }}>
            <div style={{ display: "flex", gap: 20, alignItems: "flex-start", marginBottom: 20 }}>
              <div style={{ width: 64, height: 64, background: "var(--bg-sunken)", border: "1px solid var(--border-light)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, flexShrink: 0 }}>
                {scholarship.emoji}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h1 style={{ fontSize: "clamp(18px,2.5vw,26px)", fontWeight: 800, color: "var(--text-primary)", lineHeight: 1.25, marginBottom: 6, letterSpacing: "-0.5px" }}>{scholarship.name}</h1>
                <div style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600 }}>{scholarship.provider} · {scholarship.provider_type}</div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: accentColor, letterSpacing: "-1px" }}>{formatINRFull(scholarship.amount)}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600 }}>per annum · bank transfer</div>
              </div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {scholarship.course_levels.slice(0, 4).map((l) => (
                <span key={l} style={{ background: "var(--brand-light)", color: "var(--brand)", padding: "4px 12px", borderRadius: 100, fontSize: 12, fontWeight: 700 }}>{l}</span>
              ))}
              {scholarship.categories.length < 5 && scholarship.categories.slice(0, 3).map((c) => (
                <span key={c} style={{ background: "var(--bg-sunken)", color: "var(--text-secondary)", padding: "4px 12px", borderRadius: 100, fontSize: 12, fontWeight: 700, border: "1px solid var(--border-light)" }}>{c}</span>
              ))}
              {scholarship.genders.includes("Female") && (
                <span style={{ background: "#FEF0FE", color: "#9D174D", padding: "4px 12px", borderRadius: 100, fontSize: 12, fontWeight: 700 }}>Girls Only</span>
              )}
              <span style={{ background: "var(--success-bg)", color: "var(--success)", padding: "4px 12px", borderRadius: 100, fontSize: 12, fontWeight: 700 }}>Open Now</span>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 4, borderBottom: "1px solid var(--border-light)", marginBottom: 32, overflowX: "auto" }} className="hide-scrollbar">
            {TABS.map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                style={{
                  padding: "12px 18px", fontSize: 14, fontWeight: 700, background: "none", border: "none",
                  cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap",
                  color: activeTab === tab ? "var(--brand)" : "var(--text-secondary)",
                  borderBottom: activeTab === tab ? "3px solid var(--brand)" : "3px solid transparent",
                  marginBottom: -1, transition: "all .2s",
                }}
              >{tab}</button>
            ))}
          </div>

          {/* Panels */}
          <div style={{ minHeight: "50vh" }}>

            {/* Overview */}
            {activeTab === "Overview" && (
              <div className="animate-fade-in-up">
                <h2 style={{ fontSize: 20, fontWeight: 800, color: "var(--text-primary)", marginBottom: 16 }}>About This Scholarship</h2>
                <div style={{ background: "var(--bg-surface)", padding: 24, borderRadius: "var(--radius-lg)", border: "1px solid var(--border-light)", marginBottom: 24 }}>
                  <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.8 }}>{scholarship.description}</p>
                </div>

                {/* Key Facts Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  {[
                    { label: "Scholarship Year", value: scholarship.year ?? "2026-27" },
                    { label: "Min. Marks Required", value: scholarship.min_percentage ? `${scholarship.min_percentage}%` : "No minimum" },
                    { label: "Eligible Courses", value: scholarship.course_levels.join(", ") },
                    { label: "Fields of Study", value: scholarship.field_tags.slice(0, 3).join(", ") },
                  ].map((f) => (
                    <div key={f.label} style={{ padding: "16px 20px", background: "var(--bg-surface)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-light)" }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>{f.label}</div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>{f.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Eligibility */}
            {activeTab === "Eligibility" && (
              <div className="animate-fade-in-up">
                <h2 style={{ fontSize: 20, fontWeight: 800, color: "var(--text-primary)", marginBottom: 16 }}>Live Eligibility Checklist</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {[
                    { label: "Course Level", value: scholarship.course_levels.join(", "), match: true },
                    { label: "Category Eligible", value: scholarship.categories.length >= 5 ? "Open to all categories" : scholarship.categories.join(", "), match: true },
                    { label: "Minimum Marks", value: scholarship.min_percentage ? `${scholarship.min_percentage}% in last exam` : "No minimum required", match: !scholarship.min_percentage || 75 >= (scholarship.min_percentage ?? 0) },
                    { label: "Gender Requirement", value: scholarship.genders.includes("Any") ? "Open to all genders" : scholarship.genders.join(", "), match: true },
                    { label: "State Restriction", value: scholarship.states.length === 0 ? "All India – No restriction" : scholarship.states.join(", "), match: true },
                  ].map((item) => (
                    <div key={item.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", background: "var(--bg-surface)", borderRadius: "var(--radius-md)", border: `1px solid ${item.match ? "var(--border-light)" : "var(--danger-border)"}` }}>
                      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                        {item.match ? <CheckCircle2 size={22} color="var(--success)" /> : <XCircle size={22} color="var(--danger)" />}
                        <div>
                          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>{item.label}</div>
                          <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)", marginTop: 2 }}>{item.value}</div>
                        </div>
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: item.match ? "var(--success)" : "var(--danger)", flexShrink: 0 }}>
                        {item.match ? "✓ Eligible" : "✗ Not Met"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Documents */}
            {activeTab === "Documents" && (
              <div className="animate-fade-in-up">
                <h2 style={{ fontSize: 20, fontWeight: 800, color: "var(--text-primary)", marginBottom: 16 }}>Required Documents</h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
                  {scholarship.documents_required.map((doc) => (
                    <div key={doc} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 14, fontWeight: 600, color: "var(--text-secondary)", padding: "12px 16px", background: "var(--bg-surface)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-light)" }}>
                      <CheckCircle2 color="var(--success)" size={18} style={{ flexShrink: 0 }} /> {doc}
                    </div>
                  ))}
                </div>
                <div style={{ padding: "16px 20px", background: "var(--brand-light)", borderRadius: "var(--radius-lg)", border: "1px solid var(--brand)", fontSize: 14, color: "var(--brand)", display: "flex", alignItems: "center", gap: 12 }}>
                  <Sparkles size={22} style={{ flexShrink: 0 }} />
                  <div><strong>Pro Tip:</strong> NSP portal requires all documents under 200KB. Use ScholarArth&apos;s Document Vault to store pre-compressed files.</div>
                </div>
              </div>
            )}

            {/* Timeline */}
            {activeTab === "Timeline" && (
              <div className="animate-fade-in-up">
                <h2 style={{ fontSize: 20, fontWeight: 800, color: "var(--text-primary)", marginBottom: 24 }}>Application Timeline</h2>
                <div style={{ padding: 32, background: "var(--bg-surface)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-medium)" }}>
                  {[
                    { step: "Portal Opens for Applications", date: "January 2026", active: true },
                    { step: "Submission Deadline", date: formatDeadline(scholarship.deadline), active: true, isNext: true },
                    { step: "Institute Verification", date: "Within 30 days of deadline", active: false },
                    { step: "Final Merit List Published", date: "Mid 2026", active: false },
                    { step: "Disbursement via PFMS", date: "Late 2026", active: false }
                  ].map((t, i) => (
                    <div key={i} style={{ display: "flex", gap: 24, position: "relative", marginBottom: i < 4 ? 32 : 0 }}>
                      {i < 4 && <div style={{ position: "absolute", top: 24, left: 11, width: 2, height: "calc(100% + 8px)", background: t.active ? "var(--brand)" : "var(--border-medium)" }} />}
                      <div style={{ position: "relative", zIndex: 2, width: 24, height: 24, borderRadius: "50%", background: t.active ? "var(--brand)" : "var(--bg-sunken)", border: `2px solid ${t.active ? "var(--brand)" : "var(--border-medium)"}`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", flexShrink: 0 }}>
                        {t.active && <CheckCircle2 size={14} />}
                      </div>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: t.active ? "var(--text-primary)" : "var(--text-muted)" }}>{t.step}</div>
                        <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4 }}>{t.date}</div>
                        {t.isNext && <div style={{ marginTop: 8, fontSize: 12, fontWeight: 700, padding: "3px 10px", background: "var(--warning-bg)", color: "var(--warning)", borderRadius: 100, display: "inline-block" }}>Active Deadline</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FAQs */}
            {activeTab === "FAQs" && (
              <div className="animate-fade-in-up">
                <h2 style={{ fontSize: 20, fontWeight: 800, color: "var(--text-primary)", marginBottom: 16 }}>Frequently Asked Questions</h2>
                <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-medium)", borderRadius: "var(--radius-lg)" }}>
                  {FAQ_DATA.map((faq, i) => (
                    <div key={i} style={{ padding: "20px 24px", borderBottom: i < FAQ_DATA.length - 1 ? "1px solid var(--border-light)" : "none" }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8, display: "flex", gap: 8 }}>
                        <span style={{ color: "var(--brand)", flexShrink: 0 }}>Q.</span> {faq.q}
                      </div>
                      <div style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6, paddingLeft: 22 }}>{faq.a}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* ── Sidebar ── */}
        <aside style={{ position: "sticky", top: 32 }}>
          {/* Match Score */}
          <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-medium)", padding: 24, borderRadius: "var(--radius-lg)", marginBottom: 20, textAlign: "center" }}>
            <MatchRing percent={mockPercent} />
            <div style={{ fontSize: 16, fontWeight: 800, color: "var(--text-primary)", marginTop: 12, marginBottom: 4 }}>Your Match Score</div>
            <div style={{ fontSize: 13, color: "var(--text-muted)" }}>Based on your current profile</div>
          </div>

          {/* Key Stats */}
          <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-medium)", padding: 24, borderRadius: "var(--radius-lg)", marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 16 }}>Important Details</div>
            {[
              { label: "Award Amount", value: formatINRFull(scholarship.amount), color: accentColor },
              { label: "Deadline", value: formatDeadline(scholarship.deadline), color: days <= 14 ? "var(--danger)" : "var(--text-primary)" },
              { label: "Provider Type", value: scholarship.provider_type, color: "var(--text-primary)" },
              { label: "Min. Marks", value: scholarship.min_percentage ? `${scholarship.min_percentage}%` : "No minimum", color: "var(--text-primary)" },
            ].map((item) => (
              <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid var(--border-light)" }}>
                <span style={{ fontSize: 13, color: "var(--text-secondary)", fontWeight: 600 }}>{item.label}</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: item.color }}>{item.value}</span>
              </div>
            ))}
            {days > 0 && (
              <div style={{ marginTop: 16, textAlign: "center", fontSize: 14, color: days <= 14 ? "var(--danger)" : "var(--success)", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                <Clock size={16} /> {days} days remaining
              </div>
            )}
          </div>

          {/* CTAs */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <a href={scholarship.apply_url} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg btn-fullwidth" style={{ justifyContent: "center" }}>
              Apply on Official Portal <ExternalLink size={16} />
            </a>
            <Link href="/sop" className="btn btn-secondary btn-lg btn-fullwidth" style={{ justifyContent: "center", gap: 8 }}>
              <Sparkles size={16} /> Generate SOP
            </Link>
            <button
              onClick={() => setSaved(!saved)}
              className="btn btn-ghost btn-lg btn-fullwidth"
              style={{ justifyContent: "center", gap: 8, color: saved ? "var(--success)" : "var(--text-secondary)" }}
            >
              <Bookmark size={16} fill={saved ? "var(--success)" : "none"} />
              {saved ? "Saved to Watchlist ✓" : "Save to Watchlist"}
            </button>
          </div>
        </aside>

      </div>

      <style>{`
        @media (max-width: 1024px) {
          .detail-grid { grid-template-columns: 1fr !important; }
        }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
