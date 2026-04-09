"use client";

import { useState, useRef } from "react";
import { Sparkles, Copy, Download, Bold, Italic, Underline } from "lucide-react";

const LANG_TABS = [
  { id: "en", label: "EN" },
  { id: "hi", label: "हिं" },
  { id: "mr", label: "मराठी" },
];

const TONES = ["Formal", "Warm-Personal", "Motivational"];
const WORD_COUNTS = ["300 words", "500 words", "800 words"];

const SAMPLE_SOP = `I am Arjun Kumar Singh, a second-year B.Tech student in Computer Science Engineering at Delhi Technological University. I am writing to apply for the HDFC Badhte Kadam Scholarship 2025, which I believe aligns perfectly with my academic goals and financial circumstances.

Growing up in a modest household in Uttar Pradesh, education has always been my family's most treasured investment. My father, a school teacher, and my mother, a homemaker, have sacrificed immensely to support my education. Despite financial constraints, I maintained a consistent academic record, securing 89.4% in Class 12 and a current CGPA of 8.7.

I have consistently demonstrated academic excellence and leadership. Last year, I led my team to win the Smart India Hackathon 2024 Regional Round, developing an AI-powered crop disease detection system for farmers. I have also volunteered with the local NGO "Padhao Bharat" to teach underprivileged children on weekends.

<span style="background:#FEF08A;border-radius:2px;padding:0 2px">My career goal is to become an AI researcher</span> focused on solving real-world problems in healthcare and agriculture. The HDFC Badhte Kadam Scholarship would not merely ease my financial burden — it would empower me to dedicate more time to research, innovation, and community service without the anxiety of educational loans.

I am deeply grateful for this opportunity and assure the selection committee of my commitment to academic excellence and social impact. <span style="background:#FEF08A;border-radius:2px;padding:0 2px">I will strive to be a worthy ambassador of the ScholarArth mission</span> — turning eligibility into success.`;

export default function SOPPage() {
  const [lang, setLang] = useState("en");
  const [form, setForm] = useState({ scholarshipName: "HDFC Badhte Kadam Scholarship 2025", yourName: "Arjun Kumar Singh", courseCollege: "B.Tech CSE, Delhi Technological University", achievements: "Smart India Hackathon winner, CGPA 8.7, Volunteer teacher at NGO", financialNeed: "Father is a school teacher, family income ₹4.2L/year, no other scholarship", careerGoal: "AI researcher in healthcare and agriculture", tone: "Formal", wordCount: "500 words" });
  const [sopText, setSopText] = useState(SAMPLE_SOP);
  const [loading, setLoading] = useState(false);
  const [score] = useState(84);
  const editorRef = useRef<HTMLDivElement>(null);

  function update(key: string, val: string) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  async function handleGenerate() {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/sop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, lang }),
      });
      const data = await res.json();
      if (data.sop) setSopText(data.sop);
    } catch {
      // keep sample
    }
    setLoading(false);
  }

  function handleCopy() {
    const text = editorRef.current?.innerText || sopText.replace(/<[^>]+>/g, "");
    navigator.clipboard.writeText(text);
  }

  function handleDownload() {
    const text = editorRef.current?.innerText || sopText.replace(/<[^>]+>/g, "");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "ScholarArth_SOP.txt"; a.click();
  }

  return (
    <div className="container-site" style={{ padding: "28px 24px" }}>
      <div style={{ display: "flex", gap: 22, alignItems: "flex-start" }}>

        {/* ── Config Panel ── */}
        <div style={{ width: 300, flexShrink: 0 }}>
          <div className="card" style={{ padding: 20, position: "sticky", top: 74 }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: "var(--ink)", marginBottom: 4 }}>SOP Generator</h2>
            <p style={{ fontSize: 12.5, color: "var(--ink3)", marginBottom: 16 }}>AI-powered in 3 languages</p>

            {/* Language Tabs */}
            <div style={{ background: "var(--bg)", borderRadius: 8, padding: 3, display: "flex", gap: 2, marginBottom: 18 }}>
              {LANG_TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setLang(t.id)}
                  aria-label={`Language: ${t.label}`}
                  style={{
                    flex: 1, padding: "7px 4px", borderRadius: 6, fontSize: 13, fontWeight: 700,
                    cursor: "pointer", border: "none", fontFamily: "inherit", transition: "all .15s",
                    background: lang === t.id ? "#fff" : "transparent",
                    color: lang === t.id ? "var(--brand)" : "var(--ink3)",
                    boxShadow: lang === t.id ? "0 1px 3px rgba(0,0,0,.08)" : "none",
                  }}
                >{t.label}</button>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
              {[
                { label: "Scholarship Name", key: "scholarshipName", type: "text", placeholder: "e.g. HDFC Badhte Kadam" },
                { label: "Your Name", key: "yourName", type: "text", placeholder: "Full name" },
                { label: "Course & College", key: "courseCollege", type: "text", placeholder: "e.g. BSc Physics, IIT Delhi" },
              ].map((f) => (
                <div key={f.key}>
                  <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 5 }}>{f.label}</label>
                  <input className="input" type={f.type} placeholder={f.placeholder} value={form[f.key as keyof typeof form]} onChange={(e) => update(f.key, e.target.value)} aria-label={f.label} style={{ fontSize: 13 }} />
                </div>
              ))}

              <div>
                <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 5 }}>Key Achievements</label>
                <textarea className="textarea" rows={3} placeholder="Awards, CGPA, extracurriculars..." value={form.achievements} onChange={(e) => update("achievements", e.target.value)} aria-label="Key achievements" style={{ fontSize: 13 }} />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 5 }}>Financial Need</label>
                <textarea className="textarea" rows={3} placeholder="Family income, dependents, challenges..." value={form.financialNeed} onChange={(e) => update("financialNeed", e.target.value)} aria-label="Financial need description" style={{ fontSize: 13 }} />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 5 }}>Career Goal</label>
                <input className="input" type="text" placeholder="e.g. AI researcher in healthcare" value={form.careerGoal} onChange={(e) => update("careerGoal", e.target.value)} aria-label="Career goal" style={{ fontSize: 13 }} />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 5 }}>Tone</label>
                <select className="select" value={form.tone} onChange={(e) => update("tone", e.target.value)} aria-label="SOP tone">
                  {TONES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 5 }}>Word Count</label>
                <select className="select" value={form.wordCount} onChange={(e) => update("wordCount", e.target.value)} aria-label="Word count">
                  {WORD_COUNTS.map((w) => <option key={w}>{w}</option>)}
                </select>
              </div>

              <button onClick={handleGenerate} disabled={loading} className="btn btn-primary btn-fullwidth"
                style={{ marginTop: 4, gap: 8, fontSize: 15, fontWeight: 800, padding: 12, borderRadius: 12, justifyContent: "center" }}>
                {loading ? <><span className="animate-spin-slow" style={{ display: "inline-block" }}>⟳</span> Generating...</> : <><Sparkles size={16} /> Generate SOP</>}
              </button>
            </div>
          </div>
        </div>

        {/* ── Editor ── */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ background: "#fff", border: "1.5px solid var(--bdr2)", borderRadius: 14, overflow: "hidden" }}>
            {/* Toolbar */}
            <div style={{ background: "var(--bg)", borderBottom: "1px solid var(--bdr)", padding: "10px 16px", display: "flex", flexWrap: "wrap", gap: 4, alignItems: "center" }}>
              {[
                { icon: <Bold size={14} />, label: "Bold" },
                { icon: <Italic size={14} />, label: "Italic" },
                { icon: <Underline size={14} />, label: "Underline" },
                { icon: <span style={{ fontSize: 13, fontWeight: 800 }}>H1</span>, label: "Heading 1" },
                { icon: <span style={{ fontSize: 13, fontWeight: 800 }}>H2</span>, label: "Heading 2" },
                { icon: <span style={{ fontSize: 13 }}>¶</span>, label: "Paragraph" },
                { icon: <span style={{ fontSize: 13 }}>—</span>, label: "Divider" },
              ].map((btn) => (
                <button key={btn.label} aria-label={btn.label}
                  style={{ width: 28, height: 26, border: "1px solid var(--bdr)", borderRadius: 5, background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ink2)", transition: "all .15s" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--brand-bg)"; (e.currentTarget as HTMLElement).style.color = "var(--brand)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#fff"; (e.currentTarget as HTMLElement).style.color = "var(--ink2)"; }}
                >{btn.icon}</button>
              ))}
              <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
                <button onClick={handleCopy} className="btn btn-ghost btn-sm" style={{ gap: 4, fontSize: 12 }}>
                  <Copy size={12} /> Copy
                </button>
                <button onClick={handleDownload} className="btn btn-ghost btn-sm" style={{ gap: 4, fontSize: 12 }}>
                  <Download size={12} /> Download
                </button>
              </div>
            </div>

            {/* Editor Body */}
            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              style={{ padding: "28px 32px", fontSize: 14.5, lineHeight: 1.9, minHeight: 360, color: "var(--ink)", outline: "none" }}
              dangerouslySetInnerHTML={{ __html: sopText.replace(/\n\n/g, "<br/><br/>") }}
            />

            {/* Score Bar */}
            <div style={{ background: "var(--emerald-bg)", borderTop: "1px solid #BBF7D0", padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#065F46" }}>Quality Score: {score}/100</div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {["Strong opening", "Specific need ✓", "Career link ✓", "500 words"].map((tag) => (
                  <span key={tag} style={{ fontSize: 12, fontWeight: 600, color: "#065F46" }}>{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          div[style*="width: 300px"] { width: 100% !important; position: static !important; }
          .container-site > div[style*="flex"] { flex-direction: column !important; }
        }
      `}</style>
    </div>
  );
}
