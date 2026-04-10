"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, ArrowRight, ArrowLeft, Search, CheckCircle2, Lock } from "lucide-react";
import { saveOnboardingProfile } from "@/app/actions/auth";
import { ScholarshipRow } from "@/types/database";

const COURSE_LEVELS = ["Class 9-12", "UG", "PG", "PhD", "Diploma"];
const FIELDS = [
  "Engineering / Technology", "Medical / MBBS / BDS", "Pharmacy", "Nursing",
  "Commerce / MBA / CA", "Law / LLB", "Arts / Humanities", "Pure Sciences / BSc",
  "Agriculture", "Architecture", "Education / B.Ed", "Computer Applications / BCA", "Other"
];
const STATES = [
  "Maharashtra","Delhi","Karnataka","Tamil Nadu","Telangana","Gujarat","Uttar Pradesh","West Bengal","Other"
];
const INCOME_SLABS = ["< 1L", "1-2.5L", "2.5-5L", "5-8L", "> 8L"];
const TOP_INSTITUTIONS = [
  "IIT Bombay", "IIT Delhi", "IIT Madras", "IIT Kanpur", "IIT Kharagpur",
  "Delhi University", "Mumbai University", "Pune University", "JNU", "BITS Pilani",
  "NIT Trichy", "VIT Vellore", "Anna University", "SRM University", "Manipal University"
];

interface FormData {
  fullName: string;
  courseLevel: string;
  field: string;
  year: string;
  institution: string;
  percentage: string;
  category: string;
  gender: string;
  religion: string;
  state: string;
  incomeRange: string;
}

const STEP_TITLES = [
  { title: "What's your name?", sub: "We'll use this to personalize your scholarship matches" },
  { title: "Academic Background", sub: "Tell us what you study so we can find relevant scholarships" },
  { title: "Personal Details", sub: "India has specific government schemes for every community" },
  { title: "Almost ready! 🎉", sub: "Review your profile and see your first previews" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fieldSearch, setFieldSearch] = useState("");
  const [instSearch, setInstSearch] = useState("");
  const [showFieldDropdown, setShowFieldDropdown] = useState(false);
  const [showInstDropdown, setShowInstDropdown] = useState(false);

  const [form, setForm] = useState<FormData>({
    fullName: "", courseLevel: "", field: "", year: "",
    institution: "", percentage: "75", category: "", gender: "",
    religion: "Prefer not to say", state: "", incomeRange: "1-2.5L",
  });

  function update(key: keyof FormData, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  // Filtered lists
  const filteredFields = useMemo(() => FIELDS.filter(f => f.toLowerCase().includes(fieldSearch.toLowerCase())), [fieldSearch]);
  const filteredInsts = useMemo(() => TOP_INSTITUTIONS.filter(i => i.toLowerCase().includes(instSearch.toLowerCase())), [instSearch]);

  const initials = useMemo(() => {
    return form.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || '?';
  }, [form.fullName]);

  function nextStep() {
    if (step < 3) setStep(step + 1);
  }
  function prevStep() {
    if (step > 0) setStep(step - 1);
  }

  async function handleSubmit() {
    setLoading(true);
    try {
      await saveOnboardingProfile({
        fullName: form.fullName,
        courseLevel: form.courseLevel,
        field: form.field,
        year: form.year ? parseInt(form.year) : undefined,
        institution: form.institution,
        percentage: form.percentage ? parseFloat(form.percentage) : undefined,
        category: form.category,
        gender: form.gender,
        religion: form.religion === "Prefer not to say" ? undefined : form.religion,
        state: form.state,
        incomeRange: form.incomeRange,
      });
    } catch {
      router.push("/home"); // Ignore errors for MVP
    }
  }

  const isStep1Valid = form.fullName.trim().length >= 3;
  const isStep2Valid = form.courseLevel && form.field && form.percentage;
  const isStep3Valid = form.category && form.state;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
      
      {/* Onboarding Card */}
      <div style={{ width: "100%", maxWidth: 560, background: "var(--bg-surface)", border: "1px solid var(--border-light)", borderRadius: "var(--radius-xl)", boxShadow: "var(--shadow-md)", overflow: "hidden" }}>

        {/* Header */}
        <div style={{ padding: "32px 32px 24px", borderBottom: "1px solid var(--border-light)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 32, height: 32, background: "var(--brand)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <GraduationCap size={16} color="#fff" strokeWidth={2.2} />
              </div>
              <span style={{ fontSize: 16, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.2px" }}>ScholarArth</span>
            </div>
            {step < 3 && <div style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 600 }}>Step {step + 1} of 4</div>}
          </div>

          <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
             {[0, 1, 2, 3].map((i) => (
                <div key={i} style={{ flex: 1, height: 4, borderRadius: 100, background: i <= step ? "var(--brand)" : "var(--bg-sunken)", transition: "background .3s" }} />
             ))}
          </div>

          <h1 style={{ fontSize: 26, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.8px", marginBottom: 8 }}>
            {STEP_TITLES[step].title}
          </h1>
          <p style={{ fontSize: 15, color: "var(--text-secondary)" }}>{STEP_TITLES[step].sub}</p>
        </div>

        {/* Body Area */}
        <div style={{ padding: "32px", minHeight: 380, display: "flex", flexDirection: "column" }}>
          
          {/* STEP 1: Name */}
          {step === 0 && (
            <div className="animate-slide-in" style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
                <div style={{ width: 96, height: 96, borderRadius: "50%", background: "var(--brand-light)", color: "var(--brand)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, fontWeight: 800, border: "3px solid #fff", boxShadow: "var(--shadow-sm)" }}>
                  {initials}
                </div>
              </div>
              <div>
                <label className="field-label">Full Name as per Aadhaar</label>
                <div style={{ position: "relative" }}>
                   <input
                     className="input"
                     type="text"
                     placeholder="e.g. Arjun Kumar Singh"
                     value={form.fullName}
                     onChange={(e) => update("fullName", e.target.value)}
                     style={{ fontSize: 16, padding: "12px 14px", paddingRight: 40 }}
                     autoFocus
                   />
                   {isStep1Valid && <CheckCircle2 size={18} color="var(--success)" style={{ position: "absolute", right: 14, top: 14 }} />}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Academics */}
          {step === 1 && (
            <div className="animate-slide-in" style={{ flex: 1, display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <label className="field-label">Course Level</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {COURSE_LEVELS.map(l => (
                     <button key={l} onClick={() => update("courseLevel", l)} className="category-chip"
                       style={{ padding: "8px 16px", borderRadius: 100, border: `1.5px solid ${form.courseLevel === l ? "var(--brand)" : "var(--border-medium)"}`, background: form.courseLevel === l ? "var(--brand-bg)" : "var(--bg-surface)", color: form.courseLevel === l ? "var(--brand)" : "var(--text-secondary)", fontWeight: 600, fontSize: 13.5 }}>
                       {l}
                     </button>
                  ))}
                </div>
              </div>

              <div style={{ position: "relative" }}>
                <label className="field-label">Field of Study</label>
                <div style={{ display: "flex", alignItems: "center", background: "var(--bg-sunken)", border: "1.5px solid var(--border-medium)", borderRadius: "var(--radius-md)" }}>
                   <Search size={16} color="var(--text-muted)" style={{ margin: "0 0 0 12px" }} />
                   <input type="text" value={fieldSearch} onFocus={() => setShowFieldDropdown(true)} onBlur={() => setTimeout(() => setShowFieldDropdown(false), 200)} onChange={(e) => { setFieldSearch(e.target.value); update("field", ""); }} placeholder="e.g. Engineering" style={{ flex: 1, background: "transparent", border: "none", padding: "10px", outline: "none", fontSize: 14, color: "var(--text-primary)" }} />
                </div>
                {showFieldDropdown && filteredFields.length > 0 && (
                   <div style={{ position: "absolute", zIndex: 100, top: "100%", left: 0, right: 0, background: "#fff", border: "1px solid var(--border-medium)", borderRadius: "var(--radius-md)", maxHeight: 180, overflowY: "auto", boxShadow: "var(--shadow-md)", marginTop: 4 }}>
                     {filteredFields.map(f => (
                       <div key={f} onClick={() => { setFieldSearch(f); update("field", f); setShowFieldDropdown(false); }} style={{ padding: "10px 14px", fontSize: 14, cursor: "pointer", borderBottom: "1px solid var(--border-light)" }}>{f}</div>
                     ))}
                   </div>
                )}
                {form.field && <div style={{ fontSize: 12, color: "var(--success)", fontWeight: 700, marginTop: 6 }}><CheckCircle2 size={12} style={{ display: "inline", verticalAlign: "middle", marginRight: 4 }}/> Selected: {form.field}</div>}
              </div>

              <div>
                <label className="field-label">Current Institute <span style={{ color: "var(--text-disabled)", fontWeight: 400, textTransform: "none" }}>(Optional)</span></label>
                <input className="input" type="text" placeholder="Start typing college name..." value={form.institution} onChange={(e) => update("institution", e.target.value)} />
              </div>

              <div>
                <label className="field-label">Last Year Percentage / CGPA</label>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <input type="range" min="0" max="100" step="0.5" value={form.percentage} onChange={(e) => update("percentage", e.target.value)} style={{ flex: 1 }} />
                  <div style={{ padding: "6px 12px", background: "var(--bg-sunken)", border: "1.5px solid var(--border-light)", borderRadius: 6, fontWeight: 700, width: 70, textAlign: "center" }}>{form.percentage}%</div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Background */}
          {step === 2 && (
            <div className="animate-slide-in" style={{ flex: 1, display: "flex", flexDirection: "column", gap: 24 }}>
               <div>
                  <label className="field-label" style={{ display: "flex", justifyContent: "space-between" }}>
                    Category 
                    {["OBC", "SC", "ST"].includes(form.category) && <span style={{ color: "var(--brand)", textTransform: "none" }}>Govt schemes unlocked</span>}
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                    {["General", "OBC", "SC", "ST", "EWS", "PwD"].map(cat => (
                      <button key={cat} onClick={() => update("category", cat)} className="category-chip"
                         style={{ padding: "8px", borderRadius: "100px", border: `1.5px solid ${form.category === cat ? "var(--brand)" : "var(--border-medium)"}`, background: form.category === cat ? "var(--brand-bg)" : "var(--bg-surface)", color: form.category === cat ? "var(--brand)" : "var(--text-secondary)", fontWeight: 600, fontSize: 13 }}>
                         {cat}
                      </button>
                    ))}
                  </div>
               </div>

               <div>
                 <label className="field-label">Home State</label>
                 <select className="select" value={form.state} onChange={e => update("state", e.target.value)}>
                   <option value="">Select state...</option>
                   {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                 </select>
               </div>

               <div>
                 <label className="field-label">Annual Family Income</label>
                 <div style={{ display: "flex", background: "var(--bg-sunken)", padding: 4, borderRadius: "var(--radius-lg)" }}>
                    {INCOME_SLABS.map((slab) => (
                      <div key={slab} onClick={() => update("incomeRange", slab)} style={{ flex: 1, textAlign: "center", padding: "8px 4px", fontSize: 12, fontWeight: 700, borderRadius: "var(--radius-md)", cursor: "pointer", transition: "all .2s", background: form.incomeRange === slab ? "#fff" : "transparent", color: form.incomeRange === slab ? "var(--text-primary)" : "var(--text-muted)", boxShadow: form.incomeRange === slab ? "var(--shadow-xs)" : "none" }}>
                         {slab}
                      </div>
                    ))}
                 </div>
               </div>

               <div style={{ display: "flex", gap: 16 }}>
                 <div style={{ flex: 1 }}>
                   <label className="field-label">Gender</label>
                   <select className="select" value={form.gender} onChange={e => update("gender", e.target.value)}>
                     <option value="">Select...</option>
                     <option value="Male">Male</option>
                     <option value="Female">Female</option>
                   </select>
                 </div>
                 <div style={{ flex: 1 }}>
                   <label className="field-label">Religion</label>
                   <select className="select" value={form.religion} onChange={e => update("religion", e.target.value)}>
                     <option value="Prefer not to say">Prefer not to say</option>
                     <option value="Hindu">Hindu</option>
                     <option value="Muslim">Muslim</option>
                     <option value="Christian">Christian</option>
                     <option value="Sikh">Sikh</option>
                     <option value="Buddhist">Buddhist</option>
                   </select>
                 </div>
               </div>
            </div>
          )}

          {/* STEP 4: Review & Live Previews */}
          {step === 3 && (
            <div className="animate-slide-in" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
               
               <div style={{ background: "var(--bg-sunken)", padding: 16, borderRadius: "var(--radius-md)", marginBottom: 24, fontSize: 13, borderLeft: "3px solid var(--success)" }}>
                 <div style={{ fontWeight: 800, color: "var(--text-primary)", marginBottom: 4 }}>Profile complete: 85%</div>
                 <div style={{ color: "var(--text-secondary)" }}>Based on your {form.courseLevel} {form.category} profile in {form.state}, we instantly found these scholarships:</div>
               </div>

               <div style={{ position: "relative", marginBottom: 24 }}>
                 {/* Blurred Previews */}
                 <div style={{ filter: "blur(3px)", opacity: 0.6, pointerEvents: "none", display: "flex", flexDirection: "column", gap: 12 }}>
                   <div style={{ padding: 16, background: "#fff", border: "1px solid var(--border-light)", borderRadius: "var(--radius-lg)", display: "flex", justifyContent: "space-between" }}>
                      <div>
                        <div style={{ width: 140, height: 14, background: "var(--border-medium)", borderRadius: 4, marginBottom: 8 }}></div>
                        <div style={{ width: 200, height: 20, background: "var(--text-primary)", borderRadius: 4 }}></div>
                      </div>
                      <div style={{ width: 40, height: 40, background: "var(--brand-light)", borderRadius: 8 }}></div>
                   </div>
                   <div style={{ padding: 16, background: "#fff", border: "1px solid var(--border-light)", borderRadius: "var(--radius-lg)", display: "flex", justifyContent: "space-between" }}>
                      <div>
                        <div style={{ width: 100, height: 14, background: "var(--border-medium)", borderRadius: 4, marginBottom: 8 }}></div>
                        <div style={{ width: 180, height: 20, background: "var(--text-primary)", borderRadius: 4 }}></div>
                      </div>
                      <div style={{ width: 40, height: 40, background: "var(--brand-light)", borderRadius: 8 }}></div>
                   </div>
                 </div>
                 {/* Overlay */}
                 <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10 }}>
                   <div style={{ background: "#fff", padding: "8px 16px", borderRadius: 100, boxShadow: "var(--shadow-md)", fontSize: 13, fontWeight: 700, color: "var(--brand)", display: "flex", alignItems: "center", gap: 8 }}>
                     <Lock size={14} /> Finish onboarding to unlock 34+ matches
                   </div>
                 </div>
               </div>

            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div style={{ padding: "24px 32px", background: "var(--bg-base)", borderTop: "1px solid var(--border-light)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          
          <button 
            onClick={prevStep} 
            disabled={step === 0 || loading}
            style={{ width: 44, height: 44, borderRadius: "50%", background: "#fff", border: "1px solid var(--border-medium)", display: "flex", alignItems: "center", justifyContent: "center", cursor: step === 0 ? "default" : "pointer", opacity: step === 0 ? 0 : 1, transition: "all .2s" }}
          >
            <ArrowLeft size={18} color="var(--text-secondary)" />
          </button>
          
          {step < 3 ? (
             <button 
                onClick={nextStep} 
                disabled={ (step === 0 && !isStep1Valid) || (step === 1 && !isStep2Valid) || (step === 2 && !isStep3Valid) }
                className="btn btn-primary btn-lg"
             >
                Continue <ArrowRight size={18} />
             </button>
          ) : (
             <button 
                onClick={handleSubmit} 
                disabled={loading}
                className="btn btn-primary btn-lg"
             >
                {loading ? "Saving Profile..." : "Complete Profile & Unlock"}
             </button>
          )}

        </div>
      </div>
    </div>
  );
}
