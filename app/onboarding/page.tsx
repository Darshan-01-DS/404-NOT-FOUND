"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, ChevronRight, Check } from "lucide-react";
import { saveOnboardingProfile } from "@/app/actions/auth";

const COURSE_LEVELS = ["Class 9", "Class 10", "Class 11", "Class 12", "UG", "PG", "PhD", "Diploma"];
const FIELDS = [
  "Engineering / Technology", "Medical / MBBS / BDS", "Pharmacy", "Nursing",
  "Commerce / MBA / CA", "Law / LLB", "Arts / Humanities", "Pure Sciences / BSc",
  "Architecture", "Agriculture", "Veterinary Science", "Social Work",
  "Education / B.Ed", "Hotel Management", "Fashion / Design",
  "Mass Communication / Journalism", "Computer Applications / BCA",
  "Physical Education", "Fine Arts", "Other",
];
const CATEGORIES = ["General", "OBC", "SC", "ST", "EWS", "PwD"];
const GENDERS = ["Male", "Female", "Transgender"];
const RELIGIONS = ["Hindu", "Muslim", "Christian", "Sikh", "Buddhist", "Jain", "Parsi", "Other"];
const STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat",
  "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh",
  "Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab",
  "Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh",
  "Uttarakhand","West Bengal","Andaman & Nicobar","Chandigarh","Dadra & Nagar Haveli",
  "Daman & Diu","Delhi","Jammu & Kashmir","Ladakh","Lakshadweep","Puducherry",
];
const INCOMES = [
  { value: "<1L", label: "Below ₹1 Lakh" },
  { value: "1-2.5L", label: "₹1L – ₹2.5L" },
  { value: "2.5-5L", label: "₹2.5L – ₹5L" },
  { value: "5-8L", label: "₹5L – ₹8L" },
  { value: ">8L", label: "Above ₹8L" },
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
  { title: "What's your name?", sub: "Let's personalize your scholarship journey" },
  { title: "Tell us about yourself", sub: "We use this to find scholarships you're eligible for" },
  { title: "Your background matters", sub: "India has scholarships for every community — we'll find yours" },
  { title: "Almost done! 🎉", sub: "Review your profile before we find your matches" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormData>({
    fullName: "", courseLevel: "", field: "", year: "",
    institution: "", percentage: "", category: "", gender: "",
    religion: "", state: "", incomeRange: "",
  });

  function update(key: keyof FormData, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

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
        religion: form.religion || undefined,
        state: form.state,
        incomeRange: form.incomeRange,
      });
    } catch {
      router.push("/home");
    }
  }

  const progressPct = ((step + 1) / 4) * 100;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>

      {/* Card */}
      <div style={{ width: "100%", maxWidth: 520, background: "#fff", border: "1px solid var(--bdr)", borderRadius: 20, boxShadow: "var(--sh2)", overflow: "hidden" }}>

        {/* Header */}
        <div style={{ padding: "24px 28px 0", borderBottom: "1px solid var(--bdr)", paddingBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <div style={{ width: 28, height: 28, background: "var(--brand)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <GraduationCap size={14} color="#fff" />
            </div>
            <span style={{ fontSize: 15, fontWeight: 800, color: "var(--ink)" }}>ScholarArth</span>
          </div>

          {/* Progress */}
          <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} style={{ flex: 1, height: 4, borderRadius: 100, background: i <= step ? "var(--brand)" : "var(--bdr)", transition: "background .3s" }} />
            ))}
          </div>

          <div style={{ fontSize: 11.5, color: "var(--ink3)", fontWeight: 600, marginBottom: 4 }}>
            Step {step + 1} of 4
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--ink)", letterSpacing: "-.4px", marginBottom: 4 }}>
            {STEP_TITLES[step].title}
          </h1>
          <p style={{ fontSize: 13.5, color: "var(--ink3)" }}>{STEP_TITLES[step].sub}</p>
        </div>

        {/* Body */}
        <div style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: 18 }} className="animate-fade-in-up">

          {/* Step 1 */}
          {step === 0 && (
            <div>
              <label style={{ display: "block", fontSize: 12.5, fontWeight: 700, color: "var(--ink2)", marginBottom: 7, textTransform: "uppercase", letterSpacing: ".5px" }}>
                Full Name
              </label>
              <input
                className="input"
                type="text"
                placeholder="e.g. Arjun Kumar Singh"
                value={form.fullName}
                onChange={(e) => update("fullName", e.target.value)}
                aria-label="Full name"
                autoFocus
              />
            </div>
          )}

          {/* Step 2 */}
          {step === 1 && (
            <>
              <div>
                <label style={{ display: "block", fontSize: 12.5, fontWeight: 700, color: "var(--ink2)", marginBottom: 7, textTransform: "uppercase", letterSpacing: ".5px" }}>Course Level</label>
                <select className="select" value={form.courseLevel} onChange={(e) => update("courseLevel", e.target.value)} aria-label="Course level">
                  <option value="">Select course level</option>
                  {COURSE_LEVELS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12.5, fontWeight: 700, color: "var(--ink2)", marginBottom: 7, textTransform: "uppercase", letterSpacing: ".5px" }}>Field of Study</label>
                <select className="select" value={form.field} onChange={(e) => update("field", e.target.value)} aria-label="Field of study">
                  <option value="">Select your field</option>
                  {FIELDS.map((f) => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
              {["UG", "PG"].includes(form.courseLevel) && (
                <div>
                  <label style={{ display: "block", fontSize: 12.5, fontWeight: 700, color: "var(--ink2)", marginBottom: 7, textTransform: "uppercase", letterSpacing: ".5px" }}>Year of Study</label>
                  <select className="select" value={form.year} onChange={(e) => update("year", e.target.value)} aria-label="Year of study">
                    <option value="">Select year</option>
                    {[1, 2, 3, 4].map((y) => <option key={y} value={y}>Year {y}</option>)}
                  </select>
                </div>
              )}
              <div>
                <label style={{ display: "block", fontSize: 12.5, fontWeight: 700, color: "var(--ink2)", marginBottom: 7, textTransform: "uppercase", letterSpacing: ".5px" }}>Institution Name</label>
                <input className="input" type="text" placeholder="e.g. Delhi University" value={form.institution} onChange={(e) => update("institution", e.target.value)} aria-label="Institution name" />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12.5, fontWeight: 700, color: "var(--ink2)", marginBottom: 7, textTransform: "uppercase", letterSpacing: ".5px" }}>Percentage / CGPA</label>
                <input className="input" type="number" placeholder="e.g. 78.5" min={0} max={100} step={0.1} value={form.percentage} onChange={(e) => update("percentage", e.target.value)} aria-label="Percentage or CGPA" />
              </div>
            </>
          )}

          {/* Step 3 */}
          {step === 2 && (
            <>
              <div>
                <label style={{ display: "block", fontSize: 12.5, fontWeight: 700, color: "var(--ink2)", marginBottom: 10, textTransform: "uppercase", letterSpacing: ".5px" }}>Category</label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                  {CATEGORIES.map((cat) => (
                    <button key={cat} onClick={() => update("category", cat)}
                      style={{
                        padding: "9px 4px", border: `1.5px solid ${form.category === cat ? "var(--brand)" : "var(--bdr)"}`,
                        background: form.category === cat ? "var(--brand-bg)" : "#fff",
                        borderRadius: 8, fontSize: 13, fontWeight: 700,
                        color: form.category === cat ? "var(--brand)" : "var(--ink2)",
                        cursor: "pointer", fontFamily: "inherit", transition: "all .15s",
                      }}
                      aria-label={`Category: ${cat}`}
                    >{cat}</button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12.5, fontWeight: 700, color: "var(--ink2)", marginBottom: 10, textTransform: "uppercase", letterSpacing: ".5px" }}>Gender</label>
                <div style={{ display: "flex", gap: 8 }}>
                  {GENDERS.map((g) => (
                    <button key={g} onClick={() => update("gender", g)}
                      style={{
                        flex: 1, padding: "9px 4px", border: `1.5px solid ${form.gender === g ? "var(--brand)" : "var(--bdr)"}`,
                        background: form.gender === g ? "var(--brand-bg)" : "#fff",
                        borderRadius: 8, fontSize: 13, fontWeight: 700,
                        color: form.gender === g ? "var(--brand)" : "var(--ink2)",
                        cursor: "pointer", fontFamily: "inherit", transition: "all .15s",
                      }}
                      aria-label={`Gender: ${g}`}
                    >{g}</button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12.5, fontWeight: 700, color: "var(--ink2)", marginBottom: 7, textTransform: "uppercase", letterSpacing: ".5px" }}>Religion (Optional)</label>
                <select className="select" value={form.religion} onChange={(e) => update("religion", e.target.value)} aria-label="Religion">
                  <option value="">Prefer not to say</option>
                  {RELIGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12.5, fontWeight: 700, color: "var(--ink2)", marginBottom: 7, textTransform: "uppercase", letterSpacing: ".5px" }}>State / UT</label>
                <select className="select" value={form.state} onChange={(e) => update("state", e.target.value)} aria-label="State">
                  <option value="">Select your state</option>
                  {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12.5, fontWeight: 700, color: "var(--ink2)", marginBottom: 7, textTransform: "uppercase", letterSpacing: ".5px" }}>Annual Family Income</label>
                <select className="select" value={form.incomeRange} onChange={(e) => update("incomeRange", e.target.value)} aria-label="Annual family income">
                  <option value="">Select income range</option>
                  {INCOMES.map((i) => <option key={i.value} value={i.value}>{i.label}</option>)}
                </select>
              </div>
            </>
          )}

          {/* Step 4 — Summary */}
          {step === 3 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ background: "var(--bg)", borderRadius: 12, padding: "16px 18px", border: "1px solid var(--bdr)" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 12 }}>Your Profile Summary</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {[
                    { label: "Name", value: form.fullName },
                    { label: "Course", value: form.courseLevel },
                    { label: "Field", value: form.field },
                    { label: "Institution", value: form.institution },
                    { label: "Category", value: form.category },
                    { label: "Gender", value: form.gender },
                    { label: "State", value: form.state },
                    { label: "Income", value: INCOMES.find(i => i.value === form.incomeRange)?.label },
                  ].map((item) => item.value && (
                    <div key={item.label} style={{ background: "#fff", borderRadius: 8, padding: "10px 12px", border: "1px solid var(--bdr)" }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".4px", marginBottom: 3 }}>{item.label}</div>
                      <div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--ink)" }}>{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "12px 14px", background: "var(--brand-bg)", borderRadius: 10, border: "1px solid var(--brand-soft)" }}>
                <span style={{ fontSize: 18 }}>🎯</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--brand2)", marginBottom: 2 }}>Ready to find your scholarships!</div>
                  <div style={{ fontSize: 12, color: "var(--ink2)", lineHeight: 1.5 }}>
                    Based on your profile, we've identified potential eligibility for multiple scholarships. Click &quot;Complete Setup&quot; to see your matches.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        <div style={{ padding: "0 28px 28px", display: "flex", gap: 10, alignItems: "center" }}>
          {step > 0 && (
            <button onClick={prevStep} className="btn btn-ghost btn-md" style={{ flex: "0 0 auto" }}>
              ← Back
            </button>
          )}
          {step < 3 ? (
            <button onClick={nextStep} className="btn btn-primary btn-md btn-fullwidth" disabled={step === 0 && !form.fullName.trim()}>
              Continue <ChevronRight size={15} />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={loading} className="btn btn-emerald btn-md btn-fullwidth">
              {loading ? "⟳ Setting up..." : <><Check size={16} /> Complete Setup</>}
            </button>
          )}
        </div>

        {step < 3 && (
          <div style={{ textAlign: "right", padding: "0 28px 20px" }}>
            <button onClick={() => setStep(s => Math.min(s + 1, 3))} style={{ background: "none", border: "none", fontSize: 12.5, color: "var(--ink3)", cursor: "pointer", fontFamily: "inherit" }}>
              Skip for now →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
