"use client";

import { useState } from "react";
import { Edit2, Check, X } from "lucide-react";

const MOCK_PROFILE = {
  name: "Arjun Kumar Singh",
  courseLevel: "UG",
  field: "Engineering / Technology",
  year: "2",
  institution: "Delhi Technological University",
  percentage: "87.4",
  category: "OBC",
  gender: "Male",
  religion: "Hindu",
  state: "Delhi",
  incomeRange: "2.5-5L",
  phone: "+91 98765 43210",
};

const INCOME_LABELS: Record<string, string> = {
  "<1L": "Below ₹1 Lakh",
  "1-2.5L": "₹1L – ₹2.5L",
  "2.5-5L": "₹2.5L – ₹5L",
  "5-8L": "₹5L – ₹8L",
  ">8L": "Above ₹8L",
};

const DOC_STATUS = [
  { name: "Aadhaar Card", ok: true },
  { name: "Class 10 Marksheet", ok: true },
  { name: "Class 12 Marksheet", ok: true },
  { name: "Income Certificate", ok: false },
  { name: "Bank Passbook", ok: true },
  { name: "College ID", ok: false },
  { name: "Passport Photo", ok: true },
];

// SVG Progress Ring
function ProgressRing({ percent, size = 80, stroke = 6 }: { percent: number; size?: number; stroke?: number }) {
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (percent / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--bdr)" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--brand)" strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: "stroke-dashoffset .8s ease" }}
      />
      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle"
        style={{ transform: "rotate(90deg)", transformOrigin: "50% 50%", fill: "var(--brand)", fontSize: 18, fontWeight: 800, fontFamily: "Plus Jakarta Sans, sans-serif" }}>
        {percent}%
      </text>
    </svg>
  );
}

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  const [editing, setEditing] = useState(false);
  return (
    <div className="card" style={{ padding: 20, marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <h3 style={{ fontSize: 14.5, fontWeight: 800, color: "var(--ink)" }}>{title}</h3>
        <button className="btn btn-ghost btn-sm" style={{ gap: 4, fontSize: 12 }} onClick={() => setEditing(!editing)} aria-label={`Edit ${title}`}>
          {editing ? <><X size={12} /> Cancel</> : <><Edit2 size={12} /> Edit</>}
        </button>
      </div>
      {children}
    </div>
  );
}

function InfoGrid({ items }: { items: { label: string; value: string }[] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
      {items.map((item) => (
        <div key={item.label} style={{ background: "var(--bg)", borderRadius: 8, padding: "12px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".4px", marginBottom: 4 }}>{item.label}</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "var(--ink)" }}>{item.value || "—"}</div>
        </div>
      ))}
    </div>
  );
}

export default function ProfilePage() {
  const [profile] = useState(MOCK_PROFILE);
  const [notifDeadline, setNotifDeadline] = useState(true);
  const [notifMatch, setNotifMatch] = useState(true);
  const [notifNew, setNotifNew] = useState(false);

  const completeness = Math.round((DOC_STATUS.filter((d) => d.ok).length / DOC_STATUS.length) * 100);
  const initials = profile.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  function Toggle({ checked, onChange, id }: { checked: boolean; onChange: () => void; id: string }) {
    return (
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        style={{
          width: 40, height: 22, borderRadius: 100, border: "none", cursor: "pointer",
          background: checked ? "var(--brand)" : "var(--bdr)", transition: "background .2s", position: "relative",
        }}
      >
        <div style={{
          position: "absolute", top: 3, left: checked ? 21 : 3,
          width: 16, height: 16, background: "#fff", borderRadius: "50%", transition: "left .2s",
          boxShadow: "0 1px 3px rgba(0,0,0,.2)",
        }} />
      </button>
    );
  }

  return (
    <div className="container-site" style={{ padding: "28px 24px" }}>
      <div style={{ display: "flex", gap: 22, alignItems: "flex-start" }}>

        {/* ── Left Sidebar ── */}
        <div style={{ width: 260, flexShrink: 0 }}>
          <div className="card" style={{ padding: 24, textAlign: "center", position: "sticky", top: 74 }}>
            {/* Avatar */}
            <div style={{
              width: 76, height: 76, borderRadius: "50%", margin: "0 auto 12px",
              background: "linear-gradient(135deg, var(--brand), var(--violet))",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 26, fontWeight: 800, color: "#fff",
            }}>
              {initials}
            </div>

            <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--ink)", marginBottom: 4 }}>{profile.name}</h2>
            <p style={{ fontSize: 12.5, color: "var(--ink3)", marginBottom: 20 }}>{profile.courseLevel} · {profile.institution}</p>

            {/* Completeness Ring */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 20 }}>
              <ProgressRing percent={completeness} />
              <div style={{ fontSize: 11.5, color: "var(--ink3)", marginTop: 8 }}>Profile Complete</div>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 0, borderTop: "1px solid var(--bdr)", paddingTop: 16 }}>
              {[
                { n: "7", l: "Applied", c: "var(--ink)" },
                { n: "2", l: "Shortlisted", c: "var(--emerald)" },
                { n: "₹1.25L", l: "Potential", c: "var(--brand)" },
              ].map((s) => (
                <div key={s.l} style={{ textAlign: "center", padding: "6px 2px" }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: s.c }}>{s.n}</div>
                  <div style={{ fontSize: 10.5, color: "var(--ink3)", marginTop: 2 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right Sections ── */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Academic Info */}
          <InfoCard title="Academic Information">
            <InfoGrid items={[
              { label: "Course Level", value: profile.courseLevel },
              { label: "Field of Study", value: profile.field },
              { label: "Year", value: `Year ${profile.year}` },
              { label: "Institution", value: profile.institution },
              { label: "Percentage / CGPA", value: `${profile.percentage}%` },
              { label: "Mobile", value: profile.phone },
            ]} />
          </InfoCard>

          {/* Personal Details */}
          <InfoCard title="Personal Details">
            <InfoGrid items={[
              { label: "Category", value: profile.category },
              { label: "Gender", value: profile.gender },
              { label: "Religion", value: profile.religion },
              { label: "State", value: profile.state },
              { label: "Annual Family Income", value: INCOME_LABELS[profile.incomeRange] || profile.incomeRange },
              { label: "Country", value: "India" },
            ]} />
          </InfoCard>

          {/* Documents */}
          <InfoCard title="Documents">
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {DOC_STATUS.map((doc) => (
                <div key={doc.name} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", background: "var(--bg)", borderRadius: 8 }}>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", background: doc.ok ? "var(--emerald-bg)" : "var(--rose-bg)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {doc.ok ? <Check size={11} color="var(--emerald)" /> : <span style={{ fontSize: 11, color: "var(--rose)", fontWeight: 800 }}>!</span>}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)", flex: 1 }}>{doc.name}</span>
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: doc.ok ? "var(--emerald)" : "var(--rose)" }}>
                    {doc.ok ? "Uploaded ✓" : "Missing"}
                  </span>
                </div>
              ))}
            </div>
          </InfoCard>

          {/* Notification Preferences */}
          <InfoCard title="Notification Preferences">
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {[
                { label: "Deadline Reminders", sub: "Get alerts 7 days before scholarship deadlines", checked: notifDeadline, toggle: () => setNotifDeadline(!notifDeadline), id: "notif-deadline" },
                { label: "New Match Alerts", sub: "When new scholarships match your profile", checked: notifMatch, toggle: () => setNotifMatch(!notifMatch), id: "notif-match" },
                { label: "New Scholarships", sub: "Weekly digest of new scholarships added", checked: notifNew, toggle: () => setNotifNew(!notifNew), id: "notif-new" },
              ].map((pref, i) => (
                <div key={pref.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: i < 2 ? "1px solid var(--bdr)" : "none" }}>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--ink)", marginBottom: 2 }}>{pref.label}</div>
                    <div style={{ fontSize: 12, color: "var(--ink3)" }}>{pref.sub}</div>
                  </div>
                  <Toggle checked={pref.checked} onChange={pref.toggle} id={pref.id} />
                </div>
              ))}
            </div>
          </InfoCard>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          div[style*="width: 260px"] { width: 100% !important; position: static !important; }
          .container-site > div[style*="flex"] { flex-direction: column !important; }
        }
      `}</style>
    </div>
  );
}
