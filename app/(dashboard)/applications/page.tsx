"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Plus, Bell, Trophy, Trash2, ExternalLink } from "lucide-react";
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

const INITIAL_APPS: Application[] = [
  { id: "app-1", name: "HDFC Badhte Kadam Scholarship", provider: "HDFC Bank", amount: 75000, deadline: "2026-08-31", status: "shortlisted", match: 91 },
  { id: "app-2", name: "Tata Capital Pankh Scholarship", provider: "Tata Capital", amount: 50000, deadline: "2026-10-10", status: "submitted", match: 78 },
  { id: "app-3", name: "Central Sector Scheme", provider: "Ministry of Education", amount: 20000, deadline: "2026-09-15", status: "under_review", match: 85 },
  { id: "app-4", name: "Reliance Foundation Scholarship", provider: "Reliance Foundation", amount: 200000, deadline: "2026-11-15", status: "won", match: 73 },
];

const INITIAL_WATCHLIST_IDS = ["sch-003", "sch-005", "sch-009", "sch-015"];

const STATUS_CONFIG: Record<AppStatus, { label: string; bg: string; color: string }> = {
  submitted:    { label: "Submitted",    bg: "var(--brand-light)", color: "var(--brand)" },
  under_review: { label: "Under Review", bg: "var(--warning-bg)", color: "var(--warning)" },
  shortlisted:  { label: "Shortlisted",  bg: "var(--success-bg)", color: "var(--success)" },
  rejected:     { label: "Rejected",     bg: "var(--danger-bg)", color: "var(--danger)" },
  draft:        { label: "Draft",        bg: "var(--bg-sunken)", color: "var(--text-muted)" },
  won:          { label: "Won 🏆",       bg: "var(--warning-bg)", color: "#D97706" }, // Amber
};

export default function ApplicationsPage() {
  const [apps, setApps] = useState<Application[]>(INITIAL_APPS);
  const [watchlistIds, setWatchlistIds] = useState<string[]>(INITIAL_WATCHLIST_IDS);
  const [showModal, setShowModal] = useState(false);
  const [newApp, setNewApp] = useState({ name: "", provider: "", status: "draft" as AppStatus, deadline: "", amount: 0 });
  const [sortCol, setSortCol] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  // Computed state
  const watchlistItems = useMemo(() => SCHOLARSHIPS.filter(s => watchlistIds.includes(s.id)), [watchlistIds]);
  
  const stats = useMemo(() => ({
    total: apps.length,
    submitted: apps.filter((a) => ["submitted", "under_review", "shortlisted"].includes(a.status)).length,
    shortlisted: apps.filter((a) => a.status === "shortlisted").length,
    won: apps.filter((a) => a.status === "won").length,
  }), [apps]);

  function handleSort(col: string) {
    if (sortCol === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortCol(col); setSortDir("asc"); }
  }

  const sortedApps = useMemo(() => {
    if (!sortCol) return apps;
    return [...apps].sort((a, b) => {
      let aVal: string | number = "";
      let bVal: string | number = "";
      if (sortCol === "amount") { aVal = a.amount; bVal = b.amount; }
      else if (sortCol === "deadline") { aVal = new Date(a.deadline).getTime(); bVal = new Date(b.deadline).getTime(); }
      else if (sortCol === "match") { aVal = a.match; bVal = b.match; }
      else if (sortCol === "status") { aVal = a.status; bVal = b.status; }
      const dir = sortDir === "asc" ? 1 : -1;
      return typeof aVal === "number" ? (aVal - (bVal as number)) * dir : String(aVal).localeCompare(String(bVal)) * dir;
    });
  }, [apps, sortCol, sortDir]);

  function handleAddApp() {
    if (!newApp.name || !newApp.provider) return;
    const id = `app-${Date.now()}`;
    setApps(prev => [...prev, { id, ...newApp, match: Math.floor(Math.random() * 20 + 80) }]);
    setNewApp({ name: "", provider: "", status: "draft", deadline: "", amount: 0 });
    setShowModal(false);
  }

  function deleteApp(id: string) {
    setApps(prev => prev.filter(a => a.id !== id));
  }

  function removeFromWatchlist(id: string) {
    setWatchlistIds(prev => prev.filter(wId => wId !== id));
  }

  const SortChevron = ({ col }: { col: string }) =>
    sortCol === col ? <span style={{ marginLeft: 4 }}>{sortDir === "asc" ? "↑" : "↓"}</span> : null;

  return (
    <div style={{ padding: "32px 24px" }} className="animate-fade-in-up">
      
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 32, gap: 16, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "var(--text-primary)", marginBottom: 8, letterSpacing: "-0.5px" }}>Tracker Board</h1>
          <p style={{ fontSize: 15, color: "var(--text-muted)" }}>Manage your applications and track strict deadlines seamlessly.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary btn-lg" style={{ gap: 8 }}>
          <Plus size={16} /> Log Application
        </button>
      </div>

      {/* Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20, marginBottom: 32 }}>
        {[
          { n: stats.total, label: "Total Applications tracked", color: "var(--text-primary)", bg: "var(--bg-surface)", border: "var(--border-medium)" },
          { n: stats.submitted, label: "Active & Under Review", color: "var(--brand)", bg: "var(--brand-light)", border: "var(--brand)" },
          { n: stats.shortlisted, label: "Currently Shortlisted", color: "var(--success)", bg: "var(--success-bg)", border: "var(--success)" },
          { n: stats.won, label: "Scholarships Won 🏆", color: "#D97706", bg: "var(--warning-bg)", border: "var(--warning)" },
        ].map((s) => (
          <div key={s.label} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: "var(--radius-lg)", padding: "20px 24px" }}>
            <div style={{ fontSize: 36, fontWeight: 800, color: s.color, letterSpacing: "-1px", lineHeight: 1 }}>{s.n}</div>
            <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 32 }} className="tracker-grid">
        
        {/* Detailed Application Table */}
        <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-medium)", borderRadius: "var(--radius-xl)", overflow: "hidden" }}>
           <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--border-medium)", background: "var(--bg-sunken)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
             <h2 style={{ fontSize: 16, fontWeight: 800, color: "var(--text-primary)" }}>Active Pipeline</h2>
           </div>

           <div style={{ overflowX: "auto" }}>
             <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
                <thead>
                   <tr style={{ background: "var(--bg-sunken)", borderBottom: "1px solid var(--border-light)" }}>
                     {[{key: null, label: "Program"}, {key: "amount", label: "Amount"}, {key: "deadline", label: "Deadline"}, {key: "status", label: "Status"}, {key: "match", label: "Match"}, {key: null, label: ""}].map(h => (
                       <th key={h.label} onClick={() => h.key && handleSort(h.key)} style={{ padding: "12px 24px", textAlign: "left", fontSize: 12, fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", cursor: h.key ? "pointer" : "default" }}>
                         {h.label} {h.key && <SortChevron col={h.key} />}
                       </th>
                     ))}
                   </tr>
                </thead>
                <tbody>
                  {sortedApps.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: "64px 24px", textAlign: "center" }}>
                        <Trophy size={48} color="var(--border-medium)" style={{ margin: "0 auto 12px" }} />
                        <div style={{ fontSize: 16, fontWeight: 800, color: "var(--text-primary)", marginBottom: 8 }}>Empty Pipeline</div>
                        <div style={{ fontSize: 14, color: "var(--text-muted)" }}>You haven&apos;t logged any applications yet.</div>
                      </td>
                    </tr>
                  ) : sortedApps.map((app) => {
                     const days = daysUntil(app.deadline);
                     const isUrgent = days >= 0 && days <= 7;
                     const config = STATUS_CONFIG[app.status];
                     
                     return (
                       <tr key={app.id} style={{ borderBottom: "1px solid var(--border-light)", background: isUrgent ? "var(--warning-bg)" : "transparent", transition: "background 0.2s" }} className="hover-row">
                          <td style={{ padding: "16px 24px" }}>
                            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>{app.name}</div>
                            <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600 }}>{app.provider}</div>
                          </td>
                          <td style={{ padding: "16px 24px", fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>
                            {app.amount > 0 ? formatINRFull(app.amount) : "—"}
                          </td>
                          <td style={{ padding: "16px 24px" }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: isUrgent ? "var(--danger)" : "var(--text-secondary)" }}>{app.deadline ? formatDeadline(app.deadline) : "—"}</div>
                            {isUrgent && <div style={{ fontSize: 11, fontWeight: 800, color: "var(--danger)", marginTop: 4 }}>{days === 0 ? "Due Today" : `In ${days} days`}</div>}
                          </td>
                          <td style={{ padding: "16px 24px" }}>
                             <span style={{ background: config.bg, color: config.color, padding: "4px 10px", borderRadius: 100, fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.3px", whiteSpace: "nowrap" }}>
                               {config.label}
                             </span>
                          </td>
                          <td style={{ padding: "16px 24px" }}>
                            {app.match > 0 ? <span style={{ fontSize: 14, fontWeight: 800, color: app.match >= 80 ? "var(--success)" : "var(--warning)" }}>{app.match}%</span> : <span style={{ color: "var(--text-disabled)" }}>—</span>}
                          </td>
                          <td style={{ padding: "16px 20px", textAlign: "right", whiteSpace: "nowrap" }}>
                             <button onClick={() => deleteApp(app.id)} className="btn btn-ghost" style={{ padding: "8px", color: "var(--danger)" }} aria-label="Delete Application">
                               <Trash2 size={16} />
                             </button>
                          </td>
                       </tr>
                     );
                  })}
                </tbody>
             </table>
           </div>
        </div>

        {/* Watchlist Panel */}
        <aside>
          <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-medium)", borderRadius: "var(--radius-xl)", padding: 24, position: "sticky", top: 32 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: "var(--text-primary)" }}>Saved Watchlist</h3>
              <span style={{ background: "var(--brand-light)", color: "var(--brand)", padding: "2px 8px", borderRadius: 100, fontSize: 12, fontWeight: 800 }}>{watchlistItems.length}</span>
            </div>

            {watchlistItems.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-muted)", fontSize: 13 }}>No scholarships saved yet. Browse and bookmark them to appear here.</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {watchlistItems.map((s) => {
                  const days = daysUntil(s.deadline);
                  const isUrgent = days > 0 && days <= 14;
                  return (
                    <div key={s.id} style={{ border: "1px solid var(--border-light)", borderRadius: "var(--radius-md)", padding: "16px", position: "relative" }}>
                       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                         <div style={{ flex: 1, paddingRight: 24 }}>
                           <h4 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>{s.name}</h4>
                           <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{days > 0 ? `Closes in ${days} days` : "Deadline passed"}</div>
                         </div>
                         {isUrgent && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--warning)", position: "absolute", top: 18, right: 16 }} />}
                       </div>
                       
                       <div style={{ display: "flex", gap: 8 }}>
                          <Link href={`/scholarship/${s.id}`} className="btn btn-secondary btn-sm" style={{ flex: 1, justifyContent: "center" }}>
                            View <ExternalLink size={12} />
                          </Link>
                          <button onClick={() => removeFromWatchlist(s.id)} className="btn btn-secondary btn-sm" style={{ color: "var(--danger)", padding: "0 12px" }}>
                            <Trash2 size={14} />
                          </button>
                       </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Log Application Modal */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
           <div className="animate-scale-in" style={{ background: "var(--bg-base)", width: "100%", maxWidth: 480, borderRadius: "var(--radius-xl)", padding: 32, border: "1px solid var(--border-medium)" }}>
             <h2 style={{ fontSize: 20, fontWeight: 800, color: "var(--text-primary)", marginBottom: 8 }}>Log External Application</h2>
             <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 24 }}>Adding a scholarship here will let you track strict portal deadlines.</p>

             <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
                <div>
                   <label className="field-label">Scholarship/Scheme Name</label>
                   <input className="input" placeholder="e.g. Tata Pankh Scholarship" value={newApp.name} onChange={e => setNewApp(p => ({...p, name: e.target.value}))} />
                </div>
                <div>
                   <label className="field-label">Provider Name</label>
                   <input className="input" placeholder="e.g. Tata Capital" value={newApp.provider} onChange={e => setNewApp(p => ({...p, provider: e.target.value}))} />
                </div>
                <div style={{ display: "flex", gap: 16 }}>
                   <div style={{ flex: 1 }}>
                     <label className="field-label">Reward Amount (₹)</label>
                     <input type="number" className="input" placeholder="Amount" value={newApp.amount || ""} onChange={e => setNewApp(p => ({...p, amount: parseInt(e.target.value) || 0}))} />
                   </div>
                   <div style={{ flex: 1 }}>
                     <label className="field-label">Official Deadline</label>
                     <input type="date" className="input" value={newApp.deadline} onChange={e => setNewApp(p => ({...p, deadline: e.target.value}))} />
                   </div>
                </div>
                <div>
                  <label className="field-label">Current Pipeline Status</label>
                  <select className="select" value={newApp.status} onChange={e => setNewApp(p => ({...p, status: e.target.value as AppStatus}))}>
                    <option value="draft">Draft (Preparing Docs)</option>
                    <option value="submitted">Submitted (Waiting)</option>
                    <option value="under_review">Under Review / Verification</option>
                    <option value="shortlisted">Shortlisted for Interview</option>
                    <option value="won">Application Won 🏆</option>
                  </select>
                </div>
             </div>

             <div style={{ display: "flex", gap: 12 }}>
                <button className="btn btn-secondary btn-lg" onClick={() => setShowModal(false)} style={{ flex: 1, justifyContent: "center" }}>Cancel</button>
                <button className="btn btn-primary btn-lg" onClick={handleAddApp} disabled={!newApp.name || !newApp.provider} style={{ flex: 1, justifyContent: "center" }}>Save Record</button>
             </div>
           </div>
        </div>
      )}

      <style>{`
        .hover-row:hover { background: var(--bg-sunken) !important; }
        @media (max-width: 1024px) {
          .tracker-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
