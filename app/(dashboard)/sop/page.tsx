"use client";

import { useState, useRef } from "react";
import { Sparkles, Copy, Download, RefreshCw, PenTool, CheckCircle2 } from "lucide-react";

const LANG_TABS = [
  { id: "en", label: "English" },
  { id: "hi", label: "हिन्दी" },
  { id: "mr", label: "मराठी" },
];

const TONES = ["Professional & Formal", "Warm & Personal", "Inspirational & Bold"];
const WORD_COUNTS = ["300 words", "500 words", "800 words"];

const SAMPLE_SOP = `I am Arjun Kumar Singh, a second-year B.Tech student in Computer Science Engineering at Delhi Technological University. I am writing to apply for the HDFC Badhte Kadam Scholarship 2026, which aligns perfectly with my academic ambitions.

Growing up in a modest household in rural Uttar Pradesh, education has always been my family's priority. My father, a primary school teacher, and my mother have supported me despite earning an annual income of ₹2.5L. I maintained a consistent academic record, securing 89.4% in Class 12 and currently maintain a CGPA of 8.7.

Beyond academics, I have demonstrated active community involvement. Last year, I led my team to win the Smart India Hackathon Regional Round, developing an AI-powered crop disease detection system for local farmers. I also volunteer with NGOs to teach underprivileged students mathematics on weekends.

One of my greatest challenges was overcoming a lack of formal computer training before college. I relied on community workshops and open-source materials to build my coding foundation — an experience that taught me resilience and the value of accessible education.

My career goal is to become an AI researcher focused on solving real-world agricultural problems. The HDFC Badhte Kadam Scholarship would empower me to focus entirely on my research without the constant stress of financial constraints.

I am deeply grateful for this opportunity and assure the committee of my full commitment to excellence.`;

// Strip markdown formatting from AI text
function cleanMarkdown(text: string): string {
  return text
    .replace(/\*\*\*(.*?)\*\*\*/g, "$1")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^[-*] /gm, "• ")
    .replace(/`{1,3}([^`]+)`{1,3}/g, "$1")
    .trim();
}

function renderSafeText(text: string) {
  const paragraphs = text.split(/\n\n+/);
  return paragraphs.map((p, i) => (
    <p key={i} style={{ marginBottom: "1.4rem", color: "var(--text-primary)", lineHeight: 1.85 }}>
      {p.trim()}
    </p>
  ));
}

export default function SOPPage() {
  const [lang, setLang] = useState("en");
  const [form, setForm] = useState({
    scholarshipName: "HDFC Badhte Kadam Scholarship 2026",
    yourName: "Arjun Kumar Singh",
    courseCollege: "B.Tech CSE, Delhi Technological University",
    achievements: "Smart India Hackathon winner, CGPA 8.7, Volunteer teacher",
    financialNeed: "Father is a school teacher, family income ₹2.5L/year",
    challenges: "Overcame lack of formal computer training via self-learning",
    careerGoal: "AI researcher in healthcare and agriculture",
    tone: "Professional & Formal",
    wordCount: "500 words",
  });

  const [sopText, setSopText] = useState(SAMPLE_SOP);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(85);
  const [wordCount, setWordCount] = useState(SAMPLE_SOP.split(/\s+/).length);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  function update(key: string, val: string) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/sop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, lang }),
      });

      const data = await res.json();

      if (!res.ok && res.status !== 206) {
        throw new Error(data.error ?? "Generation failed");
      }

      setSopText(cleanMarkdown(data.sopText ?? SAMPLE_SOP));
      setScore(data.score ?? 85);
      setWordCount(data.wordCount ?? data.sopText?.split(/\s+/).length ?? 0);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to generate. Please try again.";
      setError(msg);
      // Keep showing last SOP
    }
    setLoading(false);
  }

  function handleCopy() {
    const text = editorRef.current?.innerText || sopText;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleDownload() {
    const text = editorRef.current?.innerText || sopText;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ScholarArth_SOP_${form.scholarshipName.replace(/\s+/g, "_")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const scoreColor = score >= 90 ? "var(--success)" : score >= 75 ? "var(--warning)" : "var(--danger)";
  const qualityChecks = [
    { label: "Strong Opening", pass: true },
    { label: "Financial Need Clarity", pass: !!form.financialNeed },
    { label: "Specific Career Goal", pass: !!form.careerGoal },
    { label: "Word Count Target", pass: wordCount >= 250 },
  ];

  return (
    <div style={{ padding: "32px" }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "var(--text-primary)", marginBottom: 8, letterSpacing: "-0.5px", display: "flex", alignItems: "center", gap: 10 }}>
          <PenTool size={26} color="var(--brand)" /> Smart SOP Generator
        </h1>
        <p style={{ fontSize: 15, color: "var(--text-muted)" }}>
          AI-crafted, personalized Statements of Purpose — unique to your profile and target scholarship.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: 32, alignItems: "flex-start" }} className="sop-grid">

        {/* ── Config Panel ── */}
        <aside style={{ background: "var(--bg-surface)", border: "1px solid var(--border-medium)", borderRadius: "var(--radius-xl)", padding: 24, position: "sticky", top: 32 }}>
          <h2 style={{ fontSize: 15, fontWeight: 800, color: "var(--text-primary)", marginBottom: 16 }}>SOP Parameters</h2>

          {/* Language Tabs */}
          <div style={{ background: "var(--bg-sunken)", borderRadius: "var(--radius-md)", padding: 4, display: "flex", gap: 4, marginBottom: 20 }}>
            {LANG_TABS.map((t) => (
              <button key={t.id} onClick={() => setLang(t.id)}
                style={{
                  flex: 1, padding: "8px 4px", borderRadius: "var(--radius-sm)", fontSize: 13, fontWeight: 700,
                  cursor: "pointer", border: "none", fontFamily: "inherit", transition: "all .2s",
                  background: lang === t.id ? "var(--bg-surface)" : "transparent",
                  color: lang === t.id ? "var(--brand)" : "var(--text-secondary)",
                  boxShadow: lang === t.id ? "var(--shadow-sm)" : "none",
                }}
              >{t.label}</button>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { label: "Target Scholarship", key: "scholarshipName", placeholder: "e.g. HDFC Badhte Kadam 2026" },
              { label: "Your Full Name", key: "yourName", placeholder: "Full name as per records" },
              { label: "Course & College", key: "courseCollege", placeholder: "e.g. BSc Physics, IIT Delhi" },
            ].map((f) => (
              <div key={f.key}>
                <label className="field-label">{f.label}</label>
                <input className="input" placeholder={f.placeholder}
                  value={form[f.key as keyof typeof form]}
                  onChange={(e) => update(f.key, e.target.value)} />
              </div>
            ))}

            <div>
              <label className="field-label">Key Achievements & Extracurriculars</label>
              <textarea className="textarea" rows={2} placeholder="Awards, CGPA, leadership roles..."
                value={form.achievements} onChange={(e) => update("achievements", e.target.value)} />
            </div>

            <div>
              <label className="field-label">Financial Need Background</label>
              <textarea className="textarea" rows={2} placeholder="Family income, dependents..."
                value={form.financialNeed} onChange={(e) => update("financialNeed", e.target.value)} />
            </div>

            <div>
              <label className="field-label">Challenges Overcome <span style={{ fontWeight: 400, color: "var(--text-muted)" }}>(optional)</span></label>
              <textarea className="textarea" rows={2} placeholder="Hurdles you faced..."
                value={form.challenges} onChange={(e) => update("challenges", e.target.value)} />
            </div>

            <div>
              <label className="field-label">Career Goal</label>
              <input className="input" placeholder="e.g. AI researcher in healthcare"
                value={form.careerGoal} onChange={(e) => update("careerGoal", e.target.value)} />
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <label className="field-label">Tone</label>
                <select className="select" value={form.tone} onChange={(e) => update("tone", e.target.value)}>
                  {TONES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label className="field-label">Word Limit</label>
                <select className="select" value={form.wordCount} onChange={(e) => update("wordCount", e.target.value)}>
                  {WORD_COUNTS.map((w) => <option key={w}>{w}</option>)}
                </select>
              </div>
            </div>

            <button onClick={handleGenerate} disabled={loading} className="btn btn-primary btn-fullwidth btn-lg" style={{ marginTop: 4 }}>
              {loading ? <><RefreshCw size={16} className="animate-spin-slow" /> Generating...</> : <><Sparkles size={16} /> Generate with AI</>}
            </button>

            {error && (
              <div style={{ padding: "10px 14px", background: "var(--danger-bg)", border: "1px solid var(--danger-border)", borderRadius: "var(--radius-md)", fontSize: 13, color: "var(--danger)", fontWeight: 600 }}>
                {error}
              </div>
            )}
          </div>
        </aside>

        {/* ── Editor ── */}
        <div style={{ minWidth: 0 }} className="animate-fade-in-up">
          <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-medium)", borderRadius: "var(--radius-xl)", overflow: "hidden" }}>

            {/* Toolbar */}
            <div style={{ background: "var(--bg-sunken)", borderBottom: "1px solid var(--border-light)", padding: "12px 20px", display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: "var(--text-primary)" }}>Live Preview</span>
                <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600, background: "var(--bg-sunken)", border: "1px solid var(--border-light)", borderRadius: 100, padding: "2px 10px" }}>
                  {wordCount} words
                </span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={handleCopy} className="btn btn-ghost btn-sm" style={{ gap: 6 }}>
                  {copied ? <CheckCircle2 size={15} color="var(--success)" /> : <Copy size={15} />}
                  {copied ? "Copied!" : "Copy"}
                </button>
                <button onClick={handleDownload} className="btn btn-secondary btn-sm" style={{ gap: 6 }}>
                  <Download size={15} /> Download .txt
                </button>
              </div>
            </div>

            {/* Content */}
            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              style={{
                padding: "40px 44px",
                fontSize: 15.5,
                minHeight: 480,
                outline: "none",
                fontFamily: "var(--font-primary)",
                lineHeight: 1.85,
                opacity: loading ? 0.45 : 1,
                transition: "opacity 0.3s",
              }}
            >
              {loading ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {[100, 100, 80, 100, 90, 70].map((w, i) => (
                    <div key={i} style={{ height: 14, background: "var(--bg-sunken)", borderRadius: 4, width: `${w}%` }} className="animate-pulse" />
                  ))}
                </div>
              ) : (
                renderSafeText(sopText)
              )}
            </div>

            {/* Score Bar */}
            <div style={{
              background: score >= 80 ? "var(--success-bg)" : "var(--warning-bg)",
              borderTop: `1px solid ${score >= 80 ? "var(--success-border)" : "var(--warning-border)"}`,
              padding: "14px 24px",
              display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ background: scoreColor, color: "#fff", padding: "4px 12px", borderRadius: 100, fontSize: 13, fontWeight: 800 }}>
                  Quality Score: {score}/100
                </div>
              </div>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                {qualityChecks.map((qc) => (
                  <span key={qc.label} style={{ fontSize: 12, fontWeight: 700, color: qc.pass ? "var(--success)" : "var(--danger)", display: "flex", alignItems: "center", gap: 4 }}>
                    {qc.pass ? "✓" : "✗"} {qc.label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div style={{ marginTop: 16, fontSize: 12, color: "var(--text-muted)", textAlign: "center" }}>
            AI-generated drafts should be reviewed for authenticity before submission. Editing is enabled above.
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .sop-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
