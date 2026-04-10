"use client";

import { useState } from "react";
import { Lightbulb, X, ChevronDown, ChevronRight, CheckCircle2, AlertTriangle } from "lucide-react";

const TIPS = [
  {
    category: "📋 Aadhaar & PAN",
    color: "#1B3A6B",
    bg: "#E8EDF8",
    items: [
      { warn: true, text: "Name on Aadhaar and PAN must be IDENTICAL — even one extra initial causes rejection. Use exactly the same spelling." },
      { warn: true, text: "Date of Birth on Aadhaar, PAN, and marksheets must all match. Any mismatch = instant disqualification." },
      { warn: false, text: "If name doesn't match, get a Gazette notification first — DO NOT submit mismatched documents." },
    ],
  },
  {
    category: "👩 Mother's Name Field",
    color: "#9D174D",
    bg: "#FEF0FE",
    items: [
      { warn: true, text: "Enter ONLY her given name — e.g., 'Sunita Devi' or 'Rekha Kumari'. Avoid prefix 'Shrimati', 'Smt.', 'Mrs.' — these cause data-entry mismatches in NSP." },
      { warn: false, text: "Match exactly with the name on your 10th marksheet's parent section." },
    ],
  },
  {
    category: "📄 Income Certificate",
    color: "#1A7A4A",
    bg: "#EAF7F0",
    items: [
      { warn: true, text: "Must be of CURRENT financial year (2025-26). A certificate from last year (2024-25) will be rejected." },
      { warn: true, text: "Must be issued by Tehsildar, SDO, or District Magistrate — panchayat-level certificates NOT accepted." },
      { warn: false, text: "Income limit varies: NSP schemes ≤ ₹2.5L, some CSR scholarships ≤ ₹6L. Match your certificate to the specific scheme." },
    ],
  },
  {
    category: "🏷️ OBC / Caste Certificate",
    color: "#B45309",
    bg: "#FEF6EC",
    items: [
      { warn: true, text: "OBC certificate MUST explicitly say 'Non-Creamy Layer (NCL)' — a plain OBC certificate without NCL notation is treated as General category." },
      { warn: true, text: "Family income must be below ₹8L/year to qualify for Non-Creamy Layer status." },
      { warn: false, text: "SC/ST certificate must be issued by District Magistrate or Sub-Divisional Officer — not village-level officers." },
      { warn: false, text: "Verify caste name in certificate matches the Central/State government list exactly." },
    ],
  },
  {
    category: "🏠 Domicile / Residence",
    color: "#5B21B6",
    bg: "#F5F3FF",
    items: [
      { warn: true, text: "Domicile must match your CURRENT state of study/residence — birth-state domicile is not accepted for state schemes." },
      { warn: false, text: "For Maharashtra MahaDBT: must be 15+ years resident of Maharashtra. Check MahaDBT site for exact eligibility." },
      { warn: false, text: "Keep electricity bill, ration card, or rental agreement as proof of current residence." },
    ],
  },
  {
    category: "🏦 Bank Account",
    color: "#1B5FA8",
    bg: "#EBF3FD",
    items: [
      { warn: true, text: "Bank account MUST be Aadhaar-linked (PFMS requirement). PFMS payment fails to unlinked accounts." },
      { warn: true, text: "Use nationalised bank (SBI, Bank of Baroda, etc.) — several government portals do NOT support private bank accounts." },
      { warn: false, text: "Account must be active and operational. Dormant accounts cause disbursal failures." },
      { warn: false, text: "Use your own account — not parents' — unless specifically permitted by the scholarship scheme." },
    ],
  },
  {
    category: "📸 Passport Photo & Files",
    color: "#C0392B",
    bg: "#FEF0EF",
    items: [
      { warn: false, text: "Photo: White background only, recent (within 6 months), resolution 150–200 DPI, size under 50KB." },
      { warn: true, text: "NSP file size limit is 200KB per document. Files over limit are auto-rejected without warning." },
      { warn: false, text: "Use iLovePDF.com (free) to compress PDFs and TinyPNG.com to compress JPG/PNG images." },
      { warn: false, text: "Scan colour documents in grayscale to reduce file size while keeping all information legible." },
    ],
  },
  {
    category: "🎓 Academic Documents",
    color: "#1A7A4A",
    bg: "#EAF7F0",
    items: [
      { warn: true, text: "Fee receipt must be of CURRENT academic year and stamped + signed by the institute office." },
      { warn: false, text: "Bonafide / enrollment certificate must show: student name, course name, year of study, and institute stamp." },
      { warn: false, text: "Consolidated marksheet should include all semesters/years, not just the latest semester." },
    ],
  },
];

export default function KeepInMindPanel() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(true)}
        style={{
          display: "inline-flex", alignItems: "center", gap: 7,
          padding: "6px 14px", borderRadius: 100, fontSize: 13, fontWeight: 700,
          background: "#FEF6EC", color: "#92400E", border: "1px solid #F9C784",
          cursor: "pointer", transition: "all .2s",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "#FDE68A"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "#FEF6EC"; }}
        aria-label="Keep in Mind — Application Tips"
      >
        <Lightbulb size={15} />
        Keep in Mind
      </button>

      {/* Backdrop */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed", inset: 0, background: "rgba(13,27,42,0.45)",
            zIndex: 1000, backdropFilter: "blur(2px)",
          }}
        />
      )}

      {/* Drawer */}
      <div style={{
        position: "fixed", top: 0, right: 0, width: "min(520px, 95vw)",
        height: "100vh", background: "var(--bg-surface)",
        boxShadow: "-8px 0 32px rgba(13,27,42,0.15)",
        zIndex: 1001, display: "flex", flexDirection: "column",
        transform: open ? "translateX(0)" : "translateX(100%)",
        transition: "transform .35s cubic-bezier(0.16,1,0.3,1)",
        overflow: "hidden",
      }}>
        {/* Drawer Header */}
        <div style={{ background: "linear-gradient(135deg, #B45309 0%, #92400E 100%)", padding: "20px 24px", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Lightbulb size={22} color="#fff" />
          </div>
          <div style={{ flex: 1, color: "#fff" }}>
            <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: "-0.3px" }}>Keep in Mind</div>
            <div style={{ fontSize: 12, opacity: 0.8, fontWeight: 600, marginTop: 2 }}>Critical checklist before submitting any scholarship application</div>
          </div>
          <button onClick={() => setOpen(false)} style={{ background: "rgba(255,255,255,0.15)", border: "none", cursor: "pointer", borderRadius: "50%", width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* Alert Banner */}
        <div style={{ background: "#FEF6EC", borderBottom: "1px solid #F9C784", padding: "12px 24px", display: "flex", gap: 10, alignItems: "flex-start", flexShrink: 0 }}>
          <AlertTriangle size={16} color="#92400E" style={{ flexShrink: 0, marginTop: 1 }} />
          <p style={{ fontSize: 12.5, color: "#92400E", fontWeight: 600, lineHeight: 1.5 }}>
            These are the most common reasons for scholarship rejection in India. Review every point before clicking Submit.
          </p>
        </div>

        {/* Tips List */}
        <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px 32px" }}>
          {TIPS.map((section) => {
            const isExpanded = expanded === section.category;
            return (
              <div key={section.category} style={{ marginBottom: 8, border: "1px solid var(--border-light)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
                <button
                  onClick={() => setExpanded(isExpanded ? null : section.category)}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 12,
                    padding: "14px 16px", background: isExpanded ? section.bg : "var(--bg-surface)",
                    border: "none", cursor: "pointer", fontFamily: "inherit",
                    borderBottom: isExpanded ? `1px solid ${section.color}22` : "none",
                    transition: "background .2s",
                  }}
                >
                  <span style={{ fontSize: 14, fontWeight: 800, color: section.color, flex: 1, textAlign: "left" }}>{section.category}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: section.color, background: `${section.color}18`, padding: "2px 8px", borderRadius: 100 }}>
                    {section.items.length} tips
                  </span>
                  {isExpanded ? <ChevronDown size={16} color="var(--text-muted)" /> : <ChevronRight size={16} color="var(--text-muted)" />}
                </button>

                {isExpanded && (
                  <div style={{ padding: "10px 16px 14px" }}>
                    {section.items.map((item, i) => (
                      <div key={i} style={{
                        display: "flex", gap: 10, alignItems: "flex-start",
                        padding: "10px 12px", marginBottom: 6,
                        background: item.warn ? "#FEF0EF" : "var(--bg-sunken)",
                        borderRadius: "var(--radius-sm)",
                        borderLeft: `3px solid ${item.warn ? "var(--danger)" : section.color}`,
                      }}>
                        {item.warn
                          ? <AlertTriangle size={14} color="var(--danger)" style={{ flexShrink: 0, marginTop: 2 }} />
                          : <CheckCircle2 size={14} color={section.color} style={{ flexShrink: 0, marginTop: 2 }} />
                        }
                        <p style={{ fontSize: 13, color: item.warn ? "var(--danger)" : "var(--text-secondary)", lineHeight: 1.55, fontWeight: item.warn ? 700 : 500 }}>
                          {item.text}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
