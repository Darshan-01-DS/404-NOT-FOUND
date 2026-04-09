"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Bell, Calendar, TrendingUp } from "lucide-react";
import { SCHOLARSHIPS, formatINRFull, formatDeadline, daysUntil } from "@/lib/scholarships";

type AppStatus = "submitted" | "under_review" | "shortlisted" | "rejected" | "draft" | "won";

interface Application {
  id: string;
  name: string;
  provider: string;
  amount: number;
  deadline: string;
  status: AppStatus;
  match: number;
}

const MOCK_APPLICATIONS: Application[] = [
  { id: "1", name: "HDFC Badhte Kadam Scholarship 2025", provider: "HDFC Bank", amount: 75000, deadline: "2025-08-31", status: "shortlisted", match: 91 },
  { id: "2", name: "Tata Capital Pankh Scholarship", provider: "Tata Capital", amount: 50000, deadline: "2025-10-10", status: "submitted", match: 78 },
  { id: "3", name: "Central Sector Scholarship Scheme", provider: "Ministry of Education", amount: 20000, deadline: "2025-09-15", status: "under_review", match: 85 },
  { id: "4", name: "Post Matric Scholarship for OBC", provider: "Govt. of India", amount: 12000, deadline: "2025-09-30", status: "draft", match: 95 },
  { id: "5", name: "Reliance Foundation Scholarship", provider: "Reliance Foundation", amount: 200000, deadline: "2025-11-15", status: "won", match: 73 },
  { id: "6", name: "Swanath Scholarship Scheme", provider: "AICTE", amount: 50000, deadline: "2025-09-30", status: "rejected", match: 62 },
];

const WATCHLIST_IDS = ["sch-003", "sch-005", "sch-009", "sch-015"];
const watchlistItems = SCHOLARSHIPS.filter((s) => WATCHLIST_IDS.includes(s.id));

const STATUS_CONFIG: Record<AppStatus, { label: string; cls: string }> = {
  submitted:    { label: "Submitted",    cls: "status-submitted"    },
  under_review: { label: "Under Review", cls: "status-under-review" },
  shortlisted:  { label: "Shortlisted",  cls: "status-shortlisted"  },
  rejected:     { label: "Rejected",     cls: "status-rejected"     },
  draft:        { label: "Draft",        cls: "status-draft"        },
  won:          { label: "Won 🏆",       cls: "status-won"          },
};

const STAT_CARDS = [
  { n: 7, label: "Total Applied", color: "var(--ink)" },
  { n: 4, label: "Submitted", color: "var(--brand)" },
  { n: 2, label: "Shortlisted", color: "var(--emerald)" },
  { n: 1, label: "Won", color: "#D97706" },
];

export default function ApplicationsPage() {
  const [apps, setApps] = useState(MOCK_APPLICATIONS);
  const [showModal, setShowModal] = useState(false);

  function getDotColor(deadline: string) {
    const days = daysUntil(deadline);
    if (days < 0) return "var(--rose)";
    if (days <= 7) return "var(--amber)";
    return "var(--emerald)";
  }

  return (
    <div className="container-site" style={{ padding: "28px 24px" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--ink)", marginBottom: 4 }}>My Applications</h1>
          <p style={{ fontSize: 13, color: "var(--ink3)" }}>Track your scholarship applications from draft to winner</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary btn-md" style={{ gap: 6 }}>
          <Plus size={15} /> Log New Application
        </button>
      </div>

      {/* Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 24 }}>
        {STAT_CARDS.map((s) => (
          <div key={s.label} className="card" style={{ padding: 18 }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.color, letterSpacing: "-.5px" }}>{s.n}</div>
            <div style={{ fontSize: 12, color: "var(--ink3)", marginTop: 4, fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* 2-col: Table + Watchlist */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20 }}>

        {/* Table */}
        <div className="card" style={{ overflow: "hidden", padding: 0 }}>
          {/* Col headers */}
          <div style={{ display: "grid", gridTemplateColumns: "2.2fr 1fr 1fr 1fr 80px 110px", gap: 0, background: "var(--bg)", padding: "10px 18px", borderBottom: "1px solid var(--bdr)" }}>
            {["Scholarship", "Amount", "Deadline", "Status", "Match", "Actions"].map((h) => (
              <div key={h} style={{ fontSize: 11, fontWeight: 800, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".5px" }}>{h}</div>
            ))}
          </div>

          {apps.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: "var(--ink)", marginBottom: 6 }}>No applications yet</h3>
              <p style={{ fontSize: 13, color: "var(--ink3)", marginBottom: 16 }}>Start tracking your scholarship applications here.</p>
              <button onClick={() => setShowModal(true)} className="btn btn-primary btn-md">Log First Application</button>
            </div>
          ) : apps.map((app, i) => (
            <div
              key={app.id}
              style={{
                display: "grid",
                gridTemplateColumns: "2.2fr 1fr 1fr 1fr 80px 110px",
                alignItems: "center",
                gap: 0,
                padding: "14px 18px",
                borderBottom: i < apps.length - 1 ? "1px solid var(--bdr)" : "none",
                transition: "background .15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
            >
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--ink)", lineHeight: 1.3 }}>{app.name}</div>
                <div style={{ fontSize: 11, color: "var(--ink3)", marginTop: 2 }}>{app.provider}</div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)" }}>{formatINRFull(app.amount)}</div>
              <div style={{ fontSize: 12, color: "var(--ink2)", fontWeight: 600 }}>{formatDeadline(app.deadline)}</div>
              <div><span className={STATUS_CONFIG[app.status].cls}>{STATUS_CONFIG[app.status].label}</span></div>
              <div>
                <span style={{
                  fontSize: 12, fontWeight: 800,
                  color: app.match >= 80 ? "var(--emerald)" : app.match >= 50 ? "var(--amber)" : "var(--rose)",
                }}>
                  {app.match}%
                </span>
              </div>
              <div style={{ display: "flex", gap: 5 }}>
                <Link href={`/scholarship/${app.id}`} className="btn btn-ghost btn-sm" style={{ fontSize: 11 }}>View</Link>
              </div>
            </div>
          ))}
        </div>

        {/* Watchlist */}
        <div className="card" style={{ padding: 22, height: "fit-content" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <h3 style={{ fontSize: 14.5, fontWeight: 800, color: "var(--ink)" }}>Want to Apply</h3>
            <button className="btn btn-ghost btn-sm" style={{ gap: 4, fontSize: 12 }}><Plus size={11} /> Add</button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {watchlistItems.map((s) => {
              const days = daysUntil(s.deadline);
              const dotColor = getDotColor(s.deadline);
              const showBell = days > 0 && days <= 7;
              return (
                <Link key={s.id} href={`/scholarship/${s.id}`}
                  style={{
                    display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
                    border: "1.5px solid var(--bdr)", borderRadius: 10, textDecoration: "none",
                    transition: "all .15s", background: "#fff",
                  }}
                  onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--brand)";
                    (e.currentTarget as HTMLElement).style.background = "var(--brand-bg)";
                  }}
                  onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--bdr)";
                    (e.currentTarget as HTMLElement).style.background = "#fff";
                  }}
                >
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: dotColor, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.name}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
                    <span style={{ fontSize: 11.5, color: "var(--ink3)" }}>{formatDeadline(s.deadline)}</span>
                    {showBell && (
                      <div style={{ width: 22, height: 22, background: "var(--amber-bg)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Bell size={11} color="var(--amber)" />
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Log Modal (simple) */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(12,15,26,.5)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 28, width: "100%", maxWidth: 440, boxShadow: "var(--sh2)" }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: "var(--ink)", marginBottom: 20 }}>Log New Application</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 }}>
              <input className="input" placeholder="Scholarship name" aria-label="Scholarship name" />
              <input className="input" placeholder="Provider / Organization" aria-label="Provider name" />
              <select className="select" aria-label="Application status">
                <option>Draft</option>
                <option>Submitted</option>
                <option>Under Review</option>
                <option>Shortlisted</option>
              </select>
              <input className="input" type="date" aria-label="Deadline date" />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setShowModal(false)} className="btn btn-ghost btn-md" style={{ flex: 1 }}>Cancel</button>
              <button onClick={() => setShowModal(false)} className="btn btn-primary btn-md" style={{ flex: 1 }}>Save Application</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 1024px) {
          div[style*="1fr 300px"] { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 768px) {
          div[style*="repeat(4,1fr)"] { grid-template-columns: repeat(2,1fr) !important; }
          div[style*="2.2fr 1fr 1fr 1fr 80px 110px"] { display: none !important; }
        }
      `}</style>
    </div>
  );
}
