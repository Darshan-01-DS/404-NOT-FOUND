"use client";

import { useState, useEffect } from "react";
import { Edit2, Save, X, ShieldCheck, Landmark, Check } from "lucide-react";

const PROFILE_KEY = "sa_profile";

const DEFAULT_PROFILE = {
  name: "Arjun Kumar Singh",
  email: "arjun@example.com",
  phone: "+91 98765 43210",
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
  motherName: "Sunita Devi",
  fatherName: "Ramesh Kumar Singh",
  isFirstGen: true,
  isRural: false,
  isPwd: false,
  bankHolderName: "Arjun Kumar Singh",
  bankName: "State Bank of India",
  bankAccount: "XXXX XXXX 1234",
  bankIFSC: "SBIN0001234",
  bankBranch: "DTU Campus, Delhi",
  aadhaarId: "XXXX XXXX 8912",
  aadhaarLinked: true,
  panCard: "ABCDE1234F",
};

type Profile = typeof DEFAULT_PROFILE;

const INCOME_LABELS: Record<string, string> = {
  "<1L": "Below ₹1 Lakh",
  "1-2.5L": "₹1L – ₹2.5L",
  "2.5-5L": "₹2.5L – ₹5L",
  "5-8L": "₹5L – ₹8L",
  ">8L": "Above ₹8L",
};

const STATES_LIST = [
  "Andhra Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi", "Goa", "Gujarat", "Haryana",
  "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra",
  "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim",
  "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
];

const DOC_STATUS = [
  { name: "Aadhaar Card", ok: true },
  { name: "Class 10 Marksheet", ok: true },
  { name: "Class 12 Marksheet", ok: true },
  { name: "Income Certificate", ok: false },
  { name: "Bank Passbook", ok: true },
  { name: "College ID / Bonafide", ok: false },
  { name: "Passport Photo", ok: true },
];

function ProgressRing({ percent, size = 80, stroke = 6 }: { percent: number; size?: number; stroke?: number }) {
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (percent / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--border-light)" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--brand)" strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: "stroke-dashoffset .8s ease" }}
      />
      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central"
        style={{ transform: "rotate(90deg)", transformOrigin: "50% 50%", fill: "var(--brand)", fontSize: 18, fontWeight: 800 }}>
        {percent}%
      </text>
    </svg>
  );
}

function Field({ label, value, editing, name, onChange, type = "text", options }: {
  label: string;
  value: string | boolean;
  editing: boolean;
  name: string;
  onChange: (name: string, value: string | boolean) => void;
  type?: string;
  options?: string[];
}) {
  if (!editing) {
    return (
      <div style={{ background: "var(--bg-sunken)", border: "1px solid var(--border-light)", borderRadius: "var(--radius-md)", padding: "12px 16px" }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>{label}</div>
        <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>
          {typeof value === "boolean" ? (value ? "Yes ✓" : "No") : (value || "—")}
        </div>
      </div>
    );
  }

  if (type === "checkbox") {
    return (
      <div style={{ background: "var(--brand-light)", border: "1px solid var(--brand-border)", borderRadius: "var(--radius-md)", padding: "12px 16px" }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: "var(--brand)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>{label}</div>
        <label style={{ display: "flex", gap: 8, alignItems: "center", cursor: "pointer", fontSize: 14, fontWeight: 600 }}>
          <input type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(name, e.target.checked)} style={{ accentColor: "var(--brand)", width: 16, height: 16 }} />
          {value ? "Yes" : "No"}
        </label>
      </div>
    );
  }

  if (options) {
    return (
      <div style={{ background: "var(--brand-light)", border: "1px solid var(--brand-border)", borderRadius: "var(--radius-md)", padding: "12px 16px" }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: "var(--brand)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>{label}</div>
        <select className="input" value={String(value)} onChange={(e) => onChange(name, e.target.value)} style={{ padding: "6px 10px" }}>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
    );
  }

  return (
    <div style={{ background: "var(--brand-light)", border: "1px solid var(--brand-border)", borderRadius: "var(--radius-md)", padding: "12px 16px" }}>
      <div style={{ fontSize: 11, fontWeight: 800, color: "var(--brand)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>{label}</div>
      <input
        className="input"
        type={type}
        value={String(value)}
        onChange={(e) => onChange(name, e.target.value)}
        style={{ padding: "6px 10px" }}
      />
    </div>
  );
}

type SectionKey = "academic" | "personal" | "bank" | "identity" | "notifications";

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [editing, setEditing] = useState<Partial<Record<SectionKey, boolean>>>({});
  const [saved, setSaved] = useState(false);
  const [notifDeadline, setNotifDeadline] = useState(true);
  const [notifMatch, setNotifMatch] = useState(true);
  const [notifNew, setNotifNew] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(PROFILE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setProfile({ ...DEFAULT_PROFILE, ...parsed });
      }
    } catch {}

    try {
      const notifs = localStorage.getItem("sa_notifs");
      if (notifs) {
        const n = JSON.parse(notifs);
        setNotifDeadline(n.deadline ?? true);
        setNotifMatch(n.match ?? true);
        setNotifNew(n.new ?? false);
      }
    } catch {}
  }, []);

  function saveSection(section: SectionKey) {
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
      setSaved(true);
      setEditing(e => ({ ...e, [section]: false }));
      setTimeout(() => setSaved(false), 3000);
    } catch {}
  }

  function updateField(name: string, value: string | boolean) {
    setProfile(p => ({ ...p, [name]: value }));
  }

  function saveNotifs() {
    try {
      localStorage.setItem("sa_notifs", JSON.stringify({ deadline: notifDeadline, match: notifMatch, new: notifNew }));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {}
  }

  const docPercent = Math.round((DOC_STATUS.filter(d => d.ok).length / DOC_STATUS.length) * 30);
  const basePercent = [
    profile.name, profile.phone, profile.courseLevel, profile.institution,
    profile.percentage, profile.category, profile.state, profile.incomeRange,
    profile.bankAccount, profile.bankIFSC, profile.aadhaarId,
  ].filter(Boolean).length;
  const completeness = Math.min(100, Math.round((basePercent / 11) * 70) + docPercent);
  const initials = profile.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  function EditSaveBar({ section }: { section: SectionKey }) {
    const isEditing = editing[section];
    return (
      <div style={{ display: "flex", gap: 8 }}>
        {isEditing ? (
          <>
            <button className="btn btn-primary btn-sm" onClick={() => saveSection(section)} style={{ gap: 6 }}>
              <Save size={13} /> Save
            </button>
            <button className="btn btn-ghost btn-sm" onClick={() => setEditing(e => ({ ...e, [section]: false }))}>
              <X size={13} /> Cancel
            </button>
          </>
        ) : (
          <button className="btn btn-ghost btn-sm" onClick={() => setEditing(e => ({ ...e, [section]: true }))} style={{ gap: 6 }}>
            <Edit2 size={13} /> Edit
          </button>
        )}
      </div>
    );
  }

  function Section({ title, icon, children, sectionKey }: { title: string; icon?: React.ReactNode; children: React.ReactNode; sectionKey: SectionKey }) {
    return (
      <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-medium)", borderRadius: "var(--radius-xl)", padding: 24, marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: 8 }}>
            {icon} {title}
          </h3>
          <EditSaveBar section={sectionKey} />
        </div>
        {children}
      </div>
    );
  }

  function Grid({ children }: { children: React.ReactNode }) {
    return <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>{children}</div>;
  }

  function Toggle({ checked, onChange, id }: { checked: boolean; onChange: () => void; id: string }) {
    return (
      <button id={id} role="switch" aria-checked={checked} onClick={onChange}
        style={{ width: 44, height: 24, borderRadius: 100, border: "none", cursor: "pointer", background: checked ? "var(--brand)" : "var(--border-strong)", transition: "background .2s", position: "relative" }}>
        <div style={{ position: "absolute", top: 2, left: checked ? 22 : 2, width: 20, height: 20, background: "#fff", borderRadius: "50%", transition: "left .2s", boxShadow: "0 1px 3px rgba(0,0,0,0.15)" }} />
      </button>
    );
  }

  return (
    <div style={{ padding: "32px 24px" }} className="animate-fade-in-up">
      {/* Saved toast */}
      {saved && (
        <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999, background: "var(--success)", color: "#fff", padding: "12px 20px", borderRadius: "var(--radius-lg)", fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", gap: 8, boxShadow: "var(--shadow-lg)" }}>
          <Check size={16} /> Profile saved successfully!
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 28 }} className="profile-grid">
        {/* Left Sidebar */}
        <div>
          <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-medium)", borderRadius: "var(--radius-xl)", padding: 28, textAlign: "center", position: "sticky", top: 24 }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", margin: "0 auto 14px", background: "linear-gradient(135deg, var(--brand), var(--brand-mid))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 800, color: "#fff", boxShadow: "var(--shadow-sm)" }}>
              {initials}
            </div>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--text-primary)", marginBottom: 4 }}>{profile.name}</h2>
            <p style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 600, marginBottom: 20 }}>{profile.courseLevel} · {profile.state}</p>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 20 }}>
              <ProgressRing percent={completeness} size={88} />
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 10, fontWeight: 700 }}>Profile Completeness</div>
              <div style={{ fontSize: 11, color: "var(--text-disabled)", marginTop: 3 }}>Upload remaining docs to reach 100%</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, borderTop: "1px solid var(--border-light)", borderBottom: "1px solid var(--border-light)", padding: "14px 0", margin: "14px 0", textAlign: "center" }}>
              {[{ n: "7", l: "Applied", c: "var(--text-primary)" }, { n: "2", l: "Won", c: "var(--success)" }, { n: "₹1.25L", l: "Potential", c: "var(--brand)" }].map((s) => (
                <div key={s.l}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: s.c }}>{s.n}</div>
                  <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 3, fontWeight: 600, textTransform: "uppercase" }}>{s.l}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", background: "var(--warning-bg)", padding: "8px 12px", borderRadius: "var(--radius-sm)", lineHeight: 1.5 }}>
              ⚠️ Your Aadhaar name must match your bank account and college certificate exactly.
            </div>
          </div>
        </div>

        {/* Right Sections */}
        <div>
          {/* Academic */}
          <Section title="Academic Information" sectionKey="academic">
            <Grid>
              <Field label="Course Level" name="courseLevel" value={profile.courseLevel} editing={!!editing.academic} onChange={updateField} options={["Class 9", "Class 10", "Class 11", "Class 12", "UG", "PG", "PhD", "Diploma"]} />
              <Field label="Field / Stream" name="field" value={profile.field} editing={!!editing.academic} onChange={updateField} />
              <Field label="Year of Study" name="year" value={profile.year} editing={!!editing.academic} onChange={updateField} options={["1", "2", "3", "4", "5"]} />
              <Field label="Institution / College" name="institution" value={profile.institution} editing={!!editing.academic} onChange={updateField} />
              <Field label="Percentage / CGPA" name="percentage" value={profile.percentage} editing={!!editing.academic} onChange={updateField} type="number" />
              <Field label="Mobile Number" name="phone" value={profile.phone} editing={!!editing.academic} onChange={updateField} type="tel" />
            </Grid>
          </Section>

          {/* Personal */}
          <Section title="Personal Details" sectionKey="personal">
            <Grid>
              <Field label="Full Name (as on Aadhaar)" name="name" value={profile.name} editing={!!editing.personal} onChange={updateField} />
              <Field label="Mother's Name (given name only — no Smt./Mrs.)" name="motherName" value={profile.motherName} editing={!!editing.personal} onChange={updateField} />
              <Field label="Father's Name" name="fatherName" value={profile.fatherName} editing={!!editing.personal} onChange={updateField} />
              <Field label="Category" name="category" value={profile.category} editing={!!editing.personal} onChange={updateField} options={["General", "OBC", "SC", "ST", "EWS", "PwD"]} />
              <Field label="Gender" name="gender" value={profile.gender} editing={!!editing.personal} onChange={updateField} options={["Male", "Female", "Transgender"]} />
              <Field label="Religion" name="religion" value={profile.religion} editing={!!editing.personal} onChange={updateField} />
              <Field label="State of Residence" name="state" value={profile.state} editing={!!editing.personal} onChange={updateField} options={STATES_LIST} />
              <Field label="Annual Family Income" name="incomeRange" value={profile.incomeRange} editing={!!editing.personal} onChange={updateField} options={["<1L", "1-2.5L", "2.5-5L", "5-8L", ">8L"]} />
              <Field label="First-Generation Student?" name="isFirstGen" value={profile.isFirstGen} editing={!!editing.personal} onChange={updateField} type="checkbox" />
              <Field label="Rural / Village Address?" name="isRural" value={profile.isRural} editing={!!editing.personal} onChange={updateField} type="checkbox" />
              <Field label="Person with Disability (PwD)?" name="isPwd" value={profile.isPwd} editing={!!editing.personal} onChange={updateField} type="checkbox" />
            </Grid>
            {!!editing.personal && (
              <div style={{ marginTop: 12, background: "#FEF6EC", border: "1px solid #F9C784", borderRadius: "var(--radius-sm)", padding: "10px 14px", fontSize: 12, color: "#92400E", fontWeight: 600 }}>
                ⚠️ Mother&apos;s name: Enter only her given name (e.g., &quot;Sunita Devi&quot;) — never &quot;Smt.&quot; or &quot;Mrs.&quot;
              </div>
            )}
          </Section>

          {/* Identity Verification */}
          <Section title="Identity Verification" icon={<ShieldCheck size={16} color="var(--success)" />} sectionKey="identity">
            <Grid>
              <Field label="Aadhaar Number (last 4 digits)" name="aadhaarId" value={profile.aadhaarId} editing={!!editing.identity} onChange={updateField} />
              <Field label="PAN Card Number" name="panCard" value={profile.panCard} editing={!!editing.identity} onChange={updateField} />
              <Field label="Aadhaar Linked to Bank?" name="aadhaarLinked" value={profile.aadhaarLinked} editing={!!editing.identity} onChange={updateField} type="checkbox" />
            </Grid>
            <div style={{ marginTop: 12, background: "var(--warning-bg)", border: "1px solid var(--warning-border, #F9C784)", borderRadius: "var(--radius-sm)", padding: "10px 14px", fontSize: 12, color: "#92400E", fontWeight: 600, lineHeight: 1.6 }}>
              ⚠️ Name on Aadhaar and PAN must be IDENTICAL — even one different initial causes scholarship rejection. DOB must match across all documents.
            </div>
          </Section>

          {/* Bank Details */}
          <Section title="Bank Account Details" icon={<Landmark size={16} color="var(--brand)" />} sectionKey="bank">
            <Grid>
              <Field label="Account Holder Name" name="bankHolderName" value={profile.bankHolderName} editing={!!editing.bank} onChange={updateField} />
              <Field label="Bank Name" name="bankName" value={profile.bankName} editing={!!editing.bank} onChange={updateField} />
              <Field label="Account Number" name="bankAccount" value={profile.bankAccount} editing={!!editing.bank} onChange={updateField} />
              <Field label="IFSC Code" name="bankIFSC" value={profile.bankIFSC} editing={!!editing.bank} onChange={updateField} />
              <Field label="Branch" name="bankBranch" value={profile.bankBranch} editing={!!editing.bank} onChange={updateField} />
            </Grid>
            <div style={{ marginTop: 12, background: "var(--bg-sunken)", padding: "10px 14px", borderRadius: "var(--radius-sm)", fontSize: 12, color: "var(--text-secondary)", fontWeight: 600 }}>
              ℹ️ Use a nationalised bank (SBI, BOB, etc.) for government scholarship disbursement. Link Aadhaar to account for PFMS auto-payment.
            </div>
          </Section>

          {/* Documents */}
          <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-medium)", borderRadius: "var(--radius-xl)", padding: 24, marginBottom: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: "var(--text-primary)", marginBottom: 16 }}>Document Status</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {DOC_STATUS.map((doc) => (
                <div key={doc.name} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: "var(--bg-sunken)", borderRadius: "var(--radius-md)", border: `1px solid ${doc.ok ? "var(--success-bg)" : "var(--danger-bg)"}` }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: doc.ok ? "var(--success-bg)" : "var(--danger-bg)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {doc.ok ? <Check size={13} color="var(--success)" /> : <span style={{ fontSize: 12, color: "var(--danger)", fontWeight: 800 }}>!</span>}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", flex: 1 }}>{doc.name}</span>
                  <span style={{ fontSize: 12, fontWeight: 800, color: doc.ok ? "var(--success)" : "var(--danger)", background: doc.ok ? "var(--success-bg)" : "var(--danger-bg)", padding: "3px 10px", borderRadius: 100 }}>
                    {doc.ok ? "Uploaded ✓" : "Missing"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-medium)", borderRadius: "var(--radius-xl)", padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontSize: 15, fontWeight: 800, color: "var(--text-primary)" }}>Notification Preferences</h3>
              <button className="btn btn-primary btn-sm" onClick={saveNotifs} style={{ gap: 6 }}><Save size={13} /> Save</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {[
                { label: "Deadline Reminders", sub: "Get alerts 7 days before scholarship deadlines.", checked: notifDeadline, toggle: () => setNotifDeadline(!notifDeadline), id: "notif-deadline" },
                { label: "New Match Alerts", sub: "When new scholarships match your profile.", checked: notifMatch, toggle: () => setNotifMatch(!notifMatch), id: "notif-match" },
                { label: "Weekly Digest", sub: "New scholarships added across India every week.", checked: notifNew, toggle: () => setNotifNew(!notifNew), id: "notif-new" },
              ].map((pref, i) => (
                <div key={pref.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: i < 2 ? "1px solid var(--border-light)" : "none" }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 2 }}>{pref.label}</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{pref.sub}</div>
                  </div>
                  <Toggle checked={pref.checked} onChange={pref.toggle} id={pref.id} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .profile-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
