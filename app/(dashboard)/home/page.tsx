"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Sparkles,
  ArrowRight,
  Building2,
  Briefcase,
  GraduationCap,
  ShieldCheck,
  FlaskConical,
  Globe2,
  Bell,
  Clock,
  UserCircle,
  TrendingUp,
  FileText,
  Trophy,
  ExternalLink,
} from "lucide-react";
import ScholarshipCard from "@/components/cards/ScholarshipCard";
import { SCHOLARSHIPS, formatINRFull, daysUntil } from "@/lib/scholarships";

const CATEGORIES = [
  { icon: Building2, name: "Government", count: 2140, color: "#1B3A6B", bg: "#E8EDF8" },
  { icon: Briefcase, name: "Corporate", count: 1830, color: "#E07B39", bg: "#FDF3EC" },
  { icon: GraduationCap, name: "Girls / Women", count: 980, color: "#9D174D", bg: "#FEF0FE" },
  { icon: ShieldCheck, name: "SC / ST / OBC", count: 1420, color: "#1A7A4A", bg: "#EAF7F0" },
  { icon: FlaskConical, name: "STEM", count: 760, color: "#5B21B6", bg: "#F5F3FF" },
  { icon: Globe2, name: "International", count: 340, color: "#1B5FA8", bg: "#EBF3FD" },
];

// Animated counter hook
function useCounter(target: number, duration = 1500) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const steps = 40;
    const stepValue = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += stepValue;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

export default function DashboardHome() {
  const user = { name: "Arjun", profileComplete: 85, matches: 34, pending: 3, processing: 2 };
  const recommendedSchols = SCHOLARSHIPS.filter(s => s.is_featured).slice(0, 3);
  const closingSoonSchols = SCHOLARSHIPS
    .filter(s => { const d = daysUntil(s.deadline); return d > 0 && d <= 90; })
    .sort((a, b) => daysUntil(a.deadline) - daysUntil(b.deadline))
    .slice(0, 3);

  const totalPotential = SCHOLARSHIPS.slice(0, 34).reduce((sum, s) => sum + (s.amount ?? 0), 0);

  const scholarshipsCount = useCounter(8400);
  const studentsCount = useCounter(140000);

  return (
    <div style={{ paddingBottom: 64 }}>

      {/* ── Welcome Banner ── */}
      <section style={{
        background: "linear-gradient(135deg, var(--brand) 0%, #0D2347 100%)",
        padding: "40px 32px 48px",
        borderRadius: "var(--radius-xl)",
        margin: "24px 24px 0",
        color: "#fff",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Decorative pattern */}
        <div style={{ position: "absolute", top: -80, right: -40, opacity: 0.06, transform: "rotate(-15deg)" }}>
          <GraduationCap size={320} />
        </div>
        <div style={{ position: "absolute", bottom: -60, left: -20, opacity: 0.04, transform: "rotate(10deg)" }}>
          <Trophy size={200} />
        </div>

        {/* Live badge */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.12)", borderRadius: 100, padding: "4px 12px", marginBottom: 16, fontSize: 12, fontWeight: 700 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ADE80", display: "inline-block" }} className="animate-pulse-dot" />
          {scholarshipsCount.toLocaleString("en-IN")}+ scholarships updated today
        </div>

        <div style={{ position: "relative", zIndex: 10, display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 20 }}>
          <div>
            <h1 style={{ fontSize: "clamp(24px,4vw,34px)", fontWeight: 800, letterSpacing: "-0.5px", marginBottom: 8, lineHeight: 1.2 }}>
              Welcome back, {user.name}! 👋
            </h1>
            <p style={{ fontSize: 15, opacity: 0.85, lineHeight: 1.6, maxWidth: 520 }}>
              You&apos;ve unlocked <strong>{user.matches} new scholarships</strong> this week. Your profile is <strong>{user.profileComplete}% complete</strong> — add bank details to unlock government schemes.
            </p>
          </div>

          {/* Quick stats row */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {[
              { n: user.matches, label: "Matched", icon: "🎯" },
              { n: user.pending, label: "Urgent", icon: "⚡" },
              { n: user.processing, label: "In Review", icon: "📋" },
            ].map((stat) => (
              <div key={stat.label} style={{ background: "rgba(255,255,255,0.12)", borderRadius: "var(--radius-md)", padding: "14px 20px", textAlign: "center", minWidth: 80, backdropFilter: "blur(8px)" }}>
                <div style={{ fontSize: 24, marginBottom: 2 }}>{stat.icon}</div>
                <div style={{ fontSize: 20, fontWeight: 800, lineHeight: 1 }}>{stat.n}</div>
                <div style={{ fontSize: 11, fontWeight: 600, opacity: 0.75, marginTop: 4, textTransform: "uppercase", letterSpacing: "0.5px" }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA row */}
        <div style={{ display: "flex", gap: 12, marginTop: 28, position: "relative", zIndex: 10, flexWrap: "wrap" }}>
          <Link href="/match" className="btn btn-primary btn-lg" style={{ gap: 8 }}>
            <Sparkles size={16} /> View My {user.matches} Matches
          </Link>
          <Link href="/profile" className="btn btn-ghost btn-lg" style={{ background: "rgba(255,255,255,0.12)", color: "#fff", border: "1px solid rgba(255,255,255,0.25)", gap: 8 }}>
            Complete Profile <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ── Stats Row ── */}
      <section style={{ padding: "24px 24px 0" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {[
            { label: "Scholarships Available", value: `${scholarshipsCount.toLocaleString("en-IN")}+`, icon: <FileText size={22} />, color: "var(--brand)", bg: "var(--brand-light)" },
            { label: "Students Helped", value: `${Math.floor(studentsCount / 1000)}K+`, icon: <GraduationCap size={22} />, color: "var(--success)", bg: "var(--success-bg)" },
            { label: "Potential Scholarship ₹", value: formatINRFull(totalPotential), icon: <TrendingUp size={22} />, color: "#E07B39", bg: "#FDF3EC" },
            { label: "Active Deadlines", value: `${closingSoonSchols.length} This Week`, icon: <Bell size={22} />, color: "var(--danger)", bg: "var(--danger-bg)" },
          ].map((s) => (
            <div key={s.label} style={{ background: "var(--bg-surface)", border: "1px solid var(--border-light)", borderRadius: "var(--radius-lg)", padding: "20px 24px", display: "flex", gap: 16, alignItems: "center" }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: s.bg, color: s.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {s.icon}
              </div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, color: s.color, letterSpacing: "-0.5px", lineHeight: 1.2 }}>{s.value}</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", marginTop: 4 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Scholarship Roadmap ── */}
      <section style={{ padding: "32px 24px 0" }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--text-primary)", marginBottom: 16, letterSpacing: "-0.3px" }}>Your Scholarship Roadmap</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>

          <Link href="/profile" style={{ display: "block", textDecoration: "none" }} className="hover-lift">
            <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-medium)", borderRadius: "var(--radius-lg)", padding: 24, height: "100%" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--brand-light)", color: "var(--brand)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <UserCircle size={22} />
                </div>
                <div style={{ fontSize: 13, fontWeight: 800, color: "var(--brand)", background: "var(--brand-light)", padding: "3px 10px", borderRadius: 100 }}>{user.profileComplete}%</div>
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 800, color: "var(--text-primary)", marginBottom: 6 }}>Complete Your Profile</h3>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>Add Aadhaar & bank details to unlock all government schemes.</p>
              <div style={{ marginTop: 16, height: 4, background: "var(--bg-sunken)", borderRadius: 100 }}>
                <div style={{ height: "100%", width: `${user.profileComplete}%`, background: "var(--brand)", borderRadius: 100, transition: "width 1s ease" }} />
              </div>
            </div>
          </Link>

          <Link href="/match" style={{ display: "block", textDecoration: "none" }} className="hover-lift">
            <div style={{ background: "var(--bg-surface)", border: "1px solid var(--danger-border)", borderRadius: "var(--radius-lg)", padding: 24, height: "100%" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--danger-bg)", color: "var(--danger)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Bell size={22} />
                </div>
                <div style={{ fontSize: 13, fontWeight: 800, color: "var(--danger)", background: "var(--danger-bg)", padding: "3px 10px", borderRadius: 100 }}>{user.pending} Urgent</div>
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 800, color: "var(--text-primary)", marginBottom: 6 }}>Apply to Your Matches</h3>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>{user.pending} matched scholarships have deadlines within 7 days.</p>
            </div>
          </Link>

          <Link href="/applications" style={{ display: "block", textDecoration: "none" }} className="hover-lift">
            <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-medium)", borderRadius: "var(--radius-lg)", padding: 24, height: "100%" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--warning-bg)", color: "var(--warning)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Clock size={22} />
                </div>
                <div style={{ fontSize: 13, fontWeight: 800, color: "var(--warning)", background: "var(--warning-bg)", padding: "3px 10px", borderRadius: 100 }}>{user.processing} Active</div>
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 800, color: "var(--text-primary)", marginBottom: 6 }}>Track Application Status</h3>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>{user.processing} submitted applications are currently under review.</p>
            </div>
          </Link>
        </div>
      </section>

      {/* ── Main Grid ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 28, padding: "28px 24px 0" }}>

        {/* Top Recommendations */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.3px" }}>Top Recommendations</h2>
            <Link href="/match" style={{ fontSize: 13, fontWeight: 700, color: "var(--brand)", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
              See all {user.matches} <ArrowRight size={14} />
            </Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 36 }}>
            {recommendedSchols.map((s) => (
              <ScholarshipCard key={s.id} scholarship={s} isTopPick={s.id === "sch-001"} />
            ))}
          </div>

          {/* Browse by Category */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.3px" }}>Browse by Category</h2>
            <Link href="/browse" style={{ fontSize: 13, fontWeight: 700, color: "var(--brand)", textDecoration: "none" }}>View all →</Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {CATEGORIES.map((cat) => (
              <Link href={`/browse?category=${cat.name}`} key={cat.name} style={{ textDecoration: "none" }}>
                <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-light)", borderRadius: "var(--radius-md)", padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, transition: "all .2s" }} className="hover-lift">
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: cat.bg, display: "flex", alignItems: "center", justifyContent: "center", color: cat.color, flexShrink: 0 }}>
                    <cat.icon size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>{cat.name}</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{cat.count.toLocaleString()} schemes</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ── Sidebar ── */}
        <div>
          {/* Profile Card */}
          <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-medium)", borderRadius: "var(--radius-lg)", padding: 24, marginBottom: 20 }}>
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <div style={{ width: 60, height: 60, borderRadius: "50%", background: "linear-gradient(135deg, var(--brand), #5B21B6)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 800, margin: "0 auto 12px" }}>
                {user.name[0]}
              </div>
              <div style={{ fontSize: 15, fontWeight: 800, color: "var(--text-primary)" }}>{user.name}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>BTech · Maharashtra · OBC</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, borderTop: "1px solid var(--border-light)", borderBottom: "1px solid var(--border-light)", padding: "14px 0", margin: "14px 0", textAlign: "center" }}>
              <div>
                <div style={{ fontSize: 22, fontWeight: 800, color: "var(--brand)" }}>{user.matches}</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 700 }}>Eligible</div>
              </div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 800, color: "var(--success)" }}>₹2.4L</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 700 }}>Potential</div>
              </div>
            </div>
            <Link href="/match" className="btn btn-primary btn-fullwidth" style={{ justifyContent: "center", gap: 8 }}>
              <Sparkles size={15} /> View AI Matches
            </Link>
          </div>

          {/* Deadlines Widget */}
          <div style={{ background: "var(--bg-surface)", border: "1px solid var(--danger-border)", borderRadius: "var(--radius-lg)", padding: 20, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 3, background: "var(--danger)" }} />
            <h3 style={{ fontSize: 14, fontWeight: 800, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: 8, marginBottom: 14, marginTop: 4 }}>
              <Clock size={15} color="var(--danger)" /> Closing Soon
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {closingSoonSchols.map((s) => {
                const days = daysUntil(s.deadline);
                return (
                  <Link key={s.id} href={`/scholarship/${s.id}`} style={{ textDecoration: "none" }}>
                    <div style={{ display: "flex", gap: 12, alignItems: "center", padding: 12, background: "var(--bg-sunken)", borderRadius: "var(--radius-md)", transition: "all .15s" }} className="hover-lift">
                      <div style={{ width: 40, height: 40, background: days <= 14 ? "var(--danger-bg)" : "var(--warning-bg)", color: days <= 14 ? "var(--danger)" : "var(--warning)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 18 }}>
                        {s.emoji}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.name.split(" ").slice(0, 3).join(" ")}</div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: days <= 14 ? "var(--danger)" : "var(--warning)", marginTop: 2 }}>{days} days left</div>
                      </div>
                      <ExternalLink size={14} color="var(--text-muted)" />
                    </div>
                  </Link>
                );
              })}
            </div>
            <Link href="/calendar" style={{ display: "block", textAlign: "center", marginTop: 16, fontSize: 13, fontWeight: 700, color: "var(--brand)", textDecoration: "none" }}>
              View Full Calendar →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
