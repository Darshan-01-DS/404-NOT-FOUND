import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import ScholarshipCard from "@/components/cards/ScholarshipCard";
import { SCHOLARSHIPS } from "@/lib/scholarships";

export const metadata: Metadata = {
  title: "Home — ScholarArth",
  description: "Discover scholarships matched to your profile. Browse 8,400+ scholarships for Indian students.",
};

const CATEGORIES = [
  { emoji: "🏛️", name: "Government", count: 2140, color: "var(--brand-bg)", border: "var(--brand-soft)" },
  { emoji: "🏢", name: "Corporate", count: 1830, color: "var(--violet-bg)", border: "#DDD6FE" },
  { emoji: "👩", name: "Girls / Women", count: 980, color: "var(--saffron-bg)", border: "#FED7AA" },
  { emoji: "🎖️", name: "SC / ST / OBC", count: 1420, color: "var(--emerald-bg)", border: "#A7F3D0" },
  { emoji: "🔬", name: "STEM", count: 760, color: "var(--rose-bg)", border: "#FECACA" },
  { emoji: "🌍", name: "International", count: 340, color: "var(--amber-bg)", border: "#FDE68A" },
];

const STATS = [
  { n: "8,400+", l: "Active Scholarships" },
  { n: "₹2,200Cr", l: "Total Value" },
  { n: "94%", l: "Match Accuracy" },
  { n: "1.4L+", l: "Students Helped" },
];

const COURSE_LEVELS = ["Class 9", "Class 10", "Class 11", "Class 12", "UG", "PG", "PhD", "Diploma"];
const CATEGORIES_OPT = ["General", "OBC", "SC", "ST", "EWS", "PwD"];
const STATES = ["All States", "Maharashtra", "Delhi", "Karnataka", "Uttar Pradesh", "Tamil Nadu", "West Bengal", "Telangana"];

const featuredIds = ["sch-001", "sch-002", "sch-003", "sch-009"];
const featuredScholarships = SCHOLARSHIPS.filter((s) => featuredIds.includes(s.id));

export default function HomePage() {
  return (
    <div>
      {/* ── HERO ── */}
      <section style={{ background: "#fff", borderBottom: "1px solid var(--bdr)", padding: "52px 24px 56px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 380px", gap: 48, alignItems: "center" }}>

          {/* Left */}
          <div>
            {/* Eyebrow */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--brand-bg)", border: "1px solid var(--brand-soft)", borderRadius: 100, padding: "5px 13px", marginBottom: 20 }}>
              <span className="animate-pulse-dot" style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--brand)", display: "inline-block" }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: "var(--brand2)" }}>8,400+ Scholarships · AI-Powered · Free Forever</span>
            </div>

            <h1 style={{ fontSize: "clamp(32px, 4vw, 46px)", fontWeight: 800, lineHeight: 1.12, letterSpacing: "-1.5px", color: "var(--ink)", marginBottom: 18 }}>
              Turning <span className="hero-keyword">Eligibility</span><br />
              into Success
            </h1>

            <p style={{ fontSize: 16, color: "var(--ink2)", lineHeight: 1.75, maxWidth: 460, marginBottom: 28 }}>
              India&apos;s most intelligent scholarship platform. We don&apos;t just list scholarships — we analyze your profile, predict your probability, and build your personalized strategy to win.
            </p>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link href="/match" className="btn btn-primary btn-lg" style={{ gap: 7 }}>
                <Sparkles size={16} /> Get My AI Match
              </Link>
              <Link href="/browse" className="btn btn-ghost btn-lg" style={{ gap: 7 }}>
                Browse All <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* Right — Quick Search Card */}
          <div style={{ background: "#fff", border: "1.5px solid var(--bdr2)", borderRadius: 18, padding: 22, boxShadow: "var(--sh2)" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".8px", marginBottom: 16 }}>Quick Search</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
              <div>
                <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: "var(--ink3)", marginBottom: 5 }}>Course Level</label>
                <select className="select" style={{ fontSize: 13 }} aria-label="Course level filter">
                  <option>Any Level</option>
                  {COURSE_LEVELS.map((l) => <option key={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: "var(--ink3)", marginBottom: 5 }}>Category</label>
                <select className="select" style={{ fontSize: 13 }} aria-label="Category filter">
                  <option>Any Category</option>
                  {CATEGORIES_OPT.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: "var(--ink3)", marginBottom: 5 }}>State</label>
                <select className="select" style={{ fontSize: 13 }} aria-label="State filter">
                  {STATES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: "var(--ink3)", marginBottom: 5 }}>Gender</label>
                <select className="select" style={{ fontSize: 13 }} aria-label="Gender filter">
                  <option>Any</option>
                  <option>Female Only</option>
                  <option>Male Only</option>
                </select>
              </div>
            </div>
            <input className="input" type="text" placeholder="Search by name, provider..." style={{ marginBottom: 12, fontSize: 14 }} aria-label="Scholarship search" />
            <Link href="/browse" className="btn btn-primary btn-md btn-fullwidth" style={{ gap: 6 }}>
              Search → 
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section style={{ background: "#fff", borderBottom: "1px solid var(--bdr)" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)" }}>
          {STATS.map((s, i) => (
            <div
              key={s.n}
              style={{
                padding: "22px 0",
                textAlign: "center",
                borderRight: i < 3 ? "1px solid var(--bdr)" : "none",
              }}
            >
              <div style={{ fontSize: 26, fontWeight: 800, color: "var(--brand)", letterSpacing: "-.5px" }}>{s.n}</div>
              <div style={{ fontSize: 12, color: "var(--ink3)", marginTop: 4, fontWeight: 600 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── BROWSE BY CATEGORY ── */}
      <section className="section">
        <div className="container-site">
          <div className="section-header">
            <div>
              <div className="section-title">Browse by Category</div>
              <div className="section-sub">Find scholarships tailored to your background</div>
            </div>
            <Link href="/browse" className="btn btn-ghost btn-sm">View All →</Link>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12 }}>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                href={`/browse?category=${encodeURIComponent(cat.name)}`}
                className="card card-hover"
                style={{
                  padding: "18px 10px",
                  textAlign: "center",
                  textDecoration: "none",
                  background: cat.color,
                  border: `1px solid ${cat.border}`,
                }}
              >
                <div style={{ fontSize: 26, marginBottom: 8 }}>{cat.emoji}</div>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: "var(--ink)", marginBottom: 4 }}>{cat.name}</div>
                <div style={{ fontSize: 11, color: "var(--ink3)" }}>{cat.count.toLocaleString("en-IN")} scholarships</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED SCHOLARSHIPS ── */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container-site">
          <div className="section-header">
            <div>
              <div className="section-title">Featured Scholarships</div>
              <div className="section-sub">High-value, actively accepting applications</div>
            </div>
            <Link href="/browse" className="btn btn-ghost btn-sm">View All →</Link>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {featuredScholarships.slice(0, 3).map((s, i) => (
              <ScholarshipCard
                key={s.id}
                scholarship={s}
                isTopPick={i === 0}
                matchPercent={[91, 78, 65][i]}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="section" style={{ background: "var(--ink)", marginBottom: 0 }}>
        <div className="container-site">
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,.4)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 10 }}>How It Works</div>
            <h2 style={{ fontSize: 30, fontWeight: 800, color: "#fff", letterSpacing: "-.5px" }}>From Profile to Scholarship in 3 Steps</h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {[
              { step: "01", icon: "🧠", title: "Build Your Profile", desc: "Tell us about your course, category, state, and income. Takes 2 minutes." },
              { step: "02", icon: "🎯", title: "Get AI Matches", desc: "Our AI scores 8,400+ scholarships against your profile with match probabilities." },
              { step: "03", icon: "🏆", title: "Track & Win", desc: "Manage applications, get deadline alerts, and generate winning SOPs." },
            ].map((item) => (
              <div key={item.step} style={{ background: "rgba(255,255,255,.06)", borderRadius: 16, padding: "28px 24px", border: "1px solid rgba(255,255,255,.1)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: "rgba(255,255,255,.3)", letterSpacing: "1px" }}>{item.step}</span>
                  <span style={{ fontSize: 28 }}>{item.icon}</span>
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: "#fff", marginBottom: 8 }}>{item.title}</h3>
                <p style={{ fontSize: 13.5, color: "rgba(255,255,255,.6)", lineHeight: 1.65 }}>{item.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: 36 }}>
            <Link href="/match" className="btn btn-amber btn-lg" style={{ gap: 8 }}>
              <Sparkles size={16} /> Get My Free AI Match Report
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 1024px) {
          section:first-child > div { grid-template-columns: 1fr !important; }
          section:first-child > div > div:last-child { display: none; }
        }
        @media (max-width: 768px) {
          section > div > div[style*="repeat(6"] { grid-template-columns: repeat(3, 1fr) !important; }
          section > div > div[style*="repeat(3, 1fr)"] { grid-template-columns: 1fr !important; }
          section > div > div[style*="repeat(4"] { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          h1[style*="46px"] { font-size: 32px !important; }
        }
      `}</style>
    </div>
  );
}
