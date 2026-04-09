import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, ArrowLeft, Sparkles, Bookmark, ExternalLink } from "lucide-react";
import { SCHOLARSHIPS, formatINRFull, formatDeadline, daysUntil } from "@/lib/scholarships";

interface PageProps {
  params: { id: string };
}

export async function generateStaticParams() {
  return SCHOLARSHIPS.map((s) => ({ id: s.id }));
}

export function generateMetadata({ params }: PageProps) {
  const scholarship = SCHOLARSHIPS.find((s) => s.id === params.id);
  if (!scholarship) return { title: "Scholarship Not Found — ScholarArth" };
  return {
    title: `${scholarship.name} — ScholarArth`,
    description: scholarship.description,
  };
}

// SVG Match Ring
function MatchRing({ percent }: { percent: number }) {
  const size = 90, stroke = 7;
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (percent / 100) * circ;
  const color = percent >= 80 ? "var(--emerald)" : percent >= 50 ? "#F59E0B" : "var(--rose)";
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--bdr)" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle"
        style={{ transform: "rotate(90deg)", transformOrigin: "50% 50%", fill: color, fontSize: 20, fontWeight: 800, fontFamily: "Plus Jakarta Sans, sans-serif" }}>
        {percent}%
      </text>
    </svg>
  );
}

export default function ScholarshipDetailPage({ params }: PageProps) {
  const scholarship = SCHOLARSHIPS.find((s) => s.id === params.id);
  if (!scholarship) notFound();

  const mockPercent = 87;
  const days = daysUntil(scholarship.deadline);

  const TABS = ["Overview", "Eligibility", "Documents", "How to Apply", "FAQs"];
  const FAQ_DATA = [
    { q: "Can I apply to multiple scholarships simultaneously?", a: "Yes, you can apply to multiple scholarships at the same time. There is no restriction on applying to multiple schemes." },
    { q: "When will I receive the scholarship amount?", a: "Upon selection and verification, the amount is directly transferred to your bank account via PFMS within 30–60 days." },
    { q: "What happens if my income crosses the limit mid-year?", a: "Eligibility is determined at the time of application. You need to submit a fresh income certificate for renewal each year." },
    { q: "Is renewal automatic?", a: "No. You must apply for renewal each academic year and submit fresh documents including your marksheet and income certificate." },
  ];

  return (
    <div className="container-site" style={{ padding: "28px 24px" }}>
      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, fontSize: 12, color: "var(--ink3)" }}>
        <Link href="/browse" style={{ textDecoration: "none", color: "var(--ink3)", display: "flex", alignItems: "center", gap: 4 }}>
          <ArrowLeft size={12} /> Browse
        </Link>
        <span>→</span>
        <span style={{ color: "var(--ink2)", fontWeight: 600 }}>{scholarship.name}</span>
      </div>

      <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
        {/* ── Main Content ── */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Header Card */}
          <div className="card" style={{ padding: 24, marginBottom: 16 }}>
            <div style={{ display: "flex", gap: 16, alignItems: "flex-start", marginBottom: 16 }}>
              <div style={{ width: 48, height: 48, background: "var(--brand-bg)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
                {scholarship.emoji}
              </div>
              <div>
                <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--ink)", lineHeight: 1.25, marginBottom: 4 }}>{scholarship.name}</h1>
                <div style={{ fontSize: 13, color: "var(--ink3)", marginBottom: 10 }}>{scholarship.provider} · {scholarship.provider_type}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {scholarship.course_levels.map((l) => <span key={l} className="pill pill-blue">{l}</span>)}
                  {scholarship.categories.length < 5 && scholarship.categories.map((c) => <span key={c} className="pill pill-violet">{c}</span>)}
                  {scholarship.genders.includes("Female") && <span className="pill pill-saffron">Girls Only</span>}
                  <span className="pill pill-green">Open Now</span>
                </div>
              </div>
              <div style={{ marginLeft: "auto", textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: "var(--brand)", letterSpacing: "-.5px" }}>{formatINRFull(scholarship.amount)}</div>
                <div style={{ fontSize: 12, color: "var(--ink3)" }}>per annum · Direct bank transfer</div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 0, borderBottom: "1px solid var(--bdr)", marginBottom: 20, overflowX: "auto" }}>
            {TABS.map((tab, i) => (
              <button key={tab} aria-label={tab}
                style={{
                  padding: "12px 18px", fontSize: 13.5, fontWeight: 600, background: "none", border: "none",
                  cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap",
                  color: i === 0 ? "var(--brand)" : "var(--ink2)",
                  borderBottom: i === 0 ? "2px solid var(--brand)" : "2px solid transparent",
                  marginBottom: -1, transition: "all .15s",
                }}
              >{tab}</button>
            ))}
          </div>

          {/* Overview */}
          <div className="card" style={{ padding: 22, marginBottom: 16 }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: "var(--ink)", marginBottom: 12 }}>About This Scholarship</h2>
            <p style={{ fontSize: 14.5, color: "var(--ink2)", lineHeight: 1.75 }}>{scholarship.description}</p>
          </div>

          {/* Eligibility */}
          <div className="card" style={{ padding: 22, marginBottom: 16 }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: "var(--ink)", marginBottom: 14 }}>Eligibility Criteria</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { label: "Course Level", value: scholarship.course_levels.join(", ") || "All levels" },
                { label: "Category", value: scholarship.categories.length >= 5 ? "All categories" : scholarship.categories.join(", ") },
                { label: "Gender", value: scholarship.genders.includes("Any") ? "All genders" : scholarship.genders.join(", ") },
                { label: "Minimum Marks", value: scholarship.min_percentage ? `${scholarship.min_percentage}% in last qualifying exam` : "No minimum marks required" },
                { label: "State Eligibility", value: scholarship.states.length === 0 ? "All India" : scholarship.states.join(", ") },
                { label: "Religion", value: scholarship.religions.length === 0 ? "All religions" : scholarship.religions.join(", ") },
              ].map((item) => (
                <div key={item.label} style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: "10px 14px", background: "var(--bg)", borderRadius: 8 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".4px", minWidth: 140, marginTop: 1 }}>{item.label}</div>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--ink)" }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Documents */}
          <div className="card" style={{ padding: 22, marginBottom: 16 }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: "var(--ink)", marginBottom: 14 }}>Required Documents</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {scholarship.documents_required.map((doc) => (
                <div key={doc} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, color: "var(--ink2)", padding: "8px 12px", background: "var(--bg)", borderRadius: 8 }}>
                  <span style={{ color: "var(--emerald)", fontWeight: 800 }}>✓</span> {doc}
                </div>
              ))}
            </div>
            <div style={{ marginTop: 14, padding: "12px 14px", background: "var(--brand-bg)", borderRadius: 9, border: "1px solid var(--brand-soft)", fontSize: 12.5, color: "var(--brand2)" }}>
              💡 <strong>Pro Tip:</strong> Keep all documents under 200KB for NSP portal. Use ScholarArth's Document Vault to store and compress them.
            </div>
          </div>

          {/* FAQs */}
          <div className="card" style={{ padding: 22 }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: "var(--ink)", marginBottom: 16 }}>Frequently Asked Questions</h2>
            {FAQ_DATA.map((faq, i) => (
              <div key={i} style={{ paddingBottom: 16, marginBottom: 16, borderBottom: i < FAQ_DATA.length - 1 ? "1px solid var(--bdr)" : "none" }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--ink)", marginBottom: 6 }}>Q: {faq.q}</div>
                <div style={{ fontSize: 13.5, color: "var(--ink2)", lineHeight: 1.65 }}>{faq.a}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Sidebar ── */}
        <div style={{ width: 340, flexShrink: 0, position: "sticky", top: 74 }}>
          {/* Match Score */}
          <div className="card" style={{ padding: 22, marginBottom: 16, textAlign: "center" }}>
            <MatchRing percent={mockPercent} />
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--ink)", marginTop: 10, marginBottom: 4 }}>Your Match Score</div>
            <div style={{ fontSize: 12, color: "var(--ink3)" }}>Based on your current profile</div>
          </div>

          {/* Key Stats */}
          <div className="card" style={{ padding: 20, marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 14 }}>Key Details</div>
            {[
              { label: "Deadline", value: formatDeadline(scholarship.deadline), color: days <= 7 ? "var(--rose)" : "var(--ink)" },
              { label: "Award Amount", value: formatINRFull(scholarship.amount), color: "var(--brand)" },
              { label: "Students Selected/Year", value: "~500", color: "var(--ink)" },
              { label: "Provider Type", value: scholarship.provider_type, color: "var(--ink)" },
            ].map((item) => (
              <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--bdr)" }}>
                <span style={{ fontSize: 12.5, color: "var(--ink3)", fontWeight: 600 }}>{item.label}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: item.color }}>{item.value}</span>
              </div>
            ))}
            {days > 0 && (
              <div style={{ marginTop: 12, textAlign: "center", fontSize: 11.5, color: days <= 14 ? "var(--rose)" : "var(--ink3)", fontWeight: 700 }}>
                <Calendar size={12} style={{ display: "inline", marginRight: 4 }} />
                {days} days remaining
              </div>
            )}
          </div>

          {/* CTAs */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <a href={scholarship.apply_url} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg btn-fullwidth">
              Apply Now <ExternalLink size={14} />
            </a>
            <Link href="/match" className="btn btn-amber btn-lg btn-fullwidth" style={{ gap: 7 }}>
              <Sparkles size={15} /> View AI Strategy
            </Link>
            <button className="btn btn-ghost btn-lg btn-fullwidth" style={{ gap: 7 }}>
              <Bookmark size={15} /> Save to Watchlist
            </button>
          </div>

          {/* AI Tip */}
          <div style={{ marginTop: 16, background: "var(--ink)", borderRadius: 12, padding: "16px 18px" }}>
            <div style={{ fontSize: 13.5, fontWeight: 800, color: "#fff", marginBottom: 7 }}>💡 AI Tip</div>
            <div style={{ fontSize: 12.5, color: "rgba(255,255,255,.75)", lineHeight: 1.65 }}>
              Students with {scholarship.min_percentage || 60}%+ marks and {scholarship.categories.length < 5 ? scholarship.categories[0] : "any"} category have a high chance. Submit your application atleast 5 days before the deadline to avoid last-minute portal issues.
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          div[style*="width: 340px"] { display: none; }
        }
      `}</style>
    </div>
  );
}
