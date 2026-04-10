"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, ArrowRight, CheckCircle2, ShieldCheck, Zap, Users, Search, PlayCircle } from "lucide-react";
import { sendOTP, verifyOTP } from "@/app/actions/auth";

// ── OTP Input Component ────────────────────────────────────────
function OTPInput({
  onComplete,
  error,
  onClearError,
  success
}: {
  onComplete: (otp: string) => void;
  error: boolean;
  onClearError: () => void;
  success: boolean;
}) {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    refs.current[0]?.focus();
  }, []);

  function handleChange(index: number, value: string) {
    if (!/^\d*$/.test(value)) return;
    onClearError();
    const newDigits = [...digits];
    newDigits[index] = value.slice(-1);
    setDigits(newDigits);

    if (value && index < 5) refs.current[index + 1]?.focus();

    if (newDigits.every((d) => d !== "")) {
      onComplete(newDigits.join(""));
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (text.length === 6) {
      const newDigits = text.split("");
      setDigits(newDigits);
      refs.current[5]?.focus();
      onComplete(text);
    }
  }

  return (
    <div
      style={{ display: "flex", gap: 8, justifyContent: "center" }}
      className={error ? "animate-shake" : ""}
    >
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          disabled={success}
          aria-label={`OTP digit ${i + 1}`}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          style={{
            width: 44,
            height: 52,
            textAlign: "center",
            fontSize: 20,
            fontWeight: 800,
            border: `1.5px solid ${error ? "var(--danger)" : success ? "var(--success)" : digit ? "var(--brand)" : "var(--border-medium)"}`,
            borderRadius: 10,
            background: error ? "var(--danger-bg)" : success ? "var(--success-bg)" : digit ? "var(--brand-light)" : "#fff",
            color: error ? "var(--danger)" : success ? "var(--success)" : "var(--text-primary)",
            outline: "none",
            fontFamily: "inherit",
            transition: "all .15s",
          }}
        />
      ))}
    </div>
  );
}

// ── Main Landing Page ──────────────────────────────────────────
export default function LandingPage() {
  const router = useRouter();
  
  // Profile Builder State
  const [profileStep, setProfileStep] = useState<1 | 2 | 3 | "auth">(1);
  const [course, setCourse] = useState("");
  const [category, setCategory] = useState("");
  const [stateName, setStateName] = useState("");
  const [income, setIncome] = useState(0);

  // Auth State
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [otpError, setOtpError] = useState(false);
  const [otpSuccess, setOtpSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Stats Counters
  function useCounter(end: number, duration: number = 2000) {
    const [count, setCount] = useState(0);
    useEffect(() => {
      let startTimestamp: number | null = null;
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        setCount(Math.floor(progress * end));
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    }, [end, duration]);
    return count;
  }

  const actSchols = useCounter(8400);
  const actVal = useCounter(2200);
  const actAcc = useCounter(94);
  const actSecs = useCounter(47);

  function startCountdown() {
    setCountdown(45);
    timerRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) { clearInterval(timerRef.current!); return 0; }
        return c - 1;
      });
    }, 1000);
  }

  async function handleSendOTP() {
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setPhoneError("Enter a valid 10-digit Indian mobile number");
      return;
    }
    setPhoneError("");
    setLoading(true);
    const result = await sendOTP(phone);
    setLoading(false);
    if (result?.error) {
      setPhoneError(result.error);
      return;
    }
    setProfileStep("auth");
    startCountdown();
  }

  async function handleVerifyOTP(otp: string) {
    setLoading(true);
    const result = await verifyOTP(phone, otp);
    setLoading(false);
    if (result?.error) {
      setOtpError(true);
      return;
    }
    setOtpError(false);
    setOtpSuccess(true);
    setTimeout(() => {
      if (result?.redirect) {
        router.push(result.redirect);
      }
    }, 800);
  }

  async function handleResend() {
    setLoading(true);
    await sendOTP(phone);
    setLoading(false);
    startCountdown();
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* ── Hero Section ── */}
      <section style={{ background: "var(--bg-base)", padding: "0 24px", position: "relative", overflow: "hidden" }}>
        
        {/* Navbar-like branding for hero */}
        <div style={{ maxWidth: 1180, margin: "24px auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 38, height: 38, background: "var(--brand)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <GraduationCap size={20} color="#fff" strokeWidth={2.2} />
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-.4px" }}>ScholarArth</div>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 1180, margin: "40px auto 100px", display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 64, alignItems: "center", minHeight: "75vh" }}>

          {/* Left: Hero Text */}
          <div style={{ paddingRight: 32 }}>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: "var(--text-muted)", marginBottom: 24, display: "flex", alignItems: "center", gap: 8, letterSpacing: ".5px" }}>
               Used by students applying to NSP · MahaDBT · Buddy4Study
            </div>

            {/* Eyebrow pill */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--success-bg)", border: "1px solid var(--success-border)", borderRadius: 100, padding: "5px 13px", marginBottom: 24 }}>
              <span className="animate-pulse-dot" style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--success)", display: "inline-block", flexShrink: 0 }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: "var(--success)" }}>Live: 8,400+ scholarships updated daily</span>
            </div>

            {/* h1 */}
            <h1 style={{ fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 800, lineHeight: 1.15, letterSpacing: "-1.5px", color: "var(--text-primary)", marginBottom: 20 }}>
              Discover every scholarship you&apos;re eligible for — <span className="hero-keyword">instantly</span>
            </h1>

            <p style={{ fontSize: 16, color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: 500, marginBottom: 32 }}>
              India&apos;s only platform that matches you to scholarships using your exact profile — category, income, state, marks — and helps you apply without confusion.
            </p>

            {/* Social Proof */}
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 40 }}>
              <div style={{ display: "flex", marginLeft: 10 }}>
                {[1,2,3].map((i) => (
                  <div key={i} style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--brand-light)", border: "2px solid #fff", marginLeft: -10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Users size={14} color="var(--brand)" />
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)" }}>
                Join 1.4L+ students who found their match
              </div>
            </div>

            {/* CTAs */}
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <button 
                onClick={() => document.getElementById("profile-builder")?.scrollIntoView({ behavior: "smooth" })}
                className="btn btn-primary btn-lg"
              >
                Get My Free Matches <ArrowRight size={18} />
              </button>
              <button 
                onClick={() => router.push("/browse")}
                className="btn btn-ghost btn-lg"
              >
                Browse All Scholarships
              </button>
            </div>
          </div>

          {/* Right: Scholar Profile Builder */}
          <div id="profile-builder" style={{ padding: "32px 32px", background: "var(--bg-surface)", border: "1px solid var(--border-light)", borderRadius: "var(--radius-xl)", boxShadow: "var(--shadow-md)" }}>
            
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-.4px", marginBottom: 6 }}>Find scholarships in 60s</h2>
              {profileStep !== "auth" && (
                <div style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 600 }}>Step {profileStep} of 3</div>
              )}
            </div>

            {profileStep === 1 && (
              <div className="animate-fade-in-up">
                <label className="field-label">What is your course level?</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 24 }}>
                  {["Class 9-12", "UG (Bachelors)", "PG (Masters)", "PhD"].map(level => (
                    <button 
                      key={level}
                      onClick={() => { setCourse(level); setTimeout(() => setProfileStep(2), 150); }}
                      style={{
                        padding: "12px", background: "var(--bg-sunken)", border: "1.5px solid var(--border-medium)", 
                        borderRadius: "var(--radius-md)", fontSize: 13.5, fontWeight: 600, color: "var(--text-secondary)",
                        cursor: "pointer", transition: "all .15s",
                        ...(course === level ? { background: "var(--brand-light)", borderColor: "var(--brand)", color: "var(--brand)" } : {})
                      }}
                      className="category-chip"
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {profileStep === 2 && (
              <div className="animate-slide-in">
                <label className="field-label">Select your category</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
                  {["General", "OBC", "SC", "ST", "EWS", "PwD"].map(cat => (
                    <button 
                      key={cat}
                      onClick={() => { setCategory(cat); setTimeout(() => setProfileStep(3), 150); }}
                      style={{
                        padding: "10px 16px", background: "var(--bg-sunken)", border: "1.5px solid var(--border-medium)", 
                        borderRadius: 100, fontSize: 13, fontWeight: 600, color: "var(--text-secondary)",
                        cursor: "pointer", transition: "all .15s",
                        ...(category === cat ? { background: "var(--brand-light)", borderColor: "var(--brand)", color: "var(--brand)" } : {})
                      }}
                      className="category-chip"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <button onClick={() => setProfileStep(1)} className="btn btn-link" style={{ fontSize: 13 }}>← Back</button>
              </div>
            )}

            {profileStep === 3 && (
              <div className="animate-slide-in">
                <div style={{ marginBottom: 16 }}>
                  <label className="field-label">Home State</label>
                  <select 
                    value={stateName} 
                    onChange={e => setStateName(e.target.value)}
                    className="select"
                  >
                    <option value="">Select State</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Other">Other State</option>
                  </select>
                </div>

                <div style={{ marginBottom: 24 }}>
                  <label className="field-label">Annual Family Income</label>
                  <input 
                    type="range" min="0" max="1500000" step="50000" 
                    value={income} 
                    onChange={e => setIncome(parseInt(e.target.value))} 
                    style={{ width: "100%", marginBottom: 8 }}
                  />
                  <div style={{ fontSize: 14, fontWeight: 700, color: "var(--brand)", textAlign: "center" }}>
                    {income < 100000 ? "Below ₹1,000" : `₹${(income/100000).toFixed(1)} Lakhs`}
                  </div>
                </div>

                <button 
                  onClick={() => setProfileStep("auth")}
                  disabled={!stateName}
                  className="btn btn-secondary btn-lg btn-fullwidth"
                >
                  Show My Matches <ArrowRight size={18} />
                </button>
                <div style={{ marginTop: 12, textAlign: "center" }}>
                  <button onClick={() => setProfileStep(2)} className="btn btn-link" style={{ fontSize: 13 }}>← Back</button>
                </div>
              </div>
            )}

            {profileStep === "auth" && (
              <div className="animate-slide-in">
                <div style={{ textAlign: "center", marginBottom: 16 }}>
                  <div style={{ display: "inline-flex", background: "var(--success-bg)", color: "var(--success)", padding: "4px 12px", borderRadius: 100, fontSize: 12, fontWeight: 700, marginBottom: 12 }}>
                    Profiles saved! Please verify phone.
                  </div>
                </div>

                {countdown === 0 && !otpSuccess && !loading && (
                   <div style={{ marginBottom: 16 }}>
                   <label className="field-label">Mobile Number</label>
                   <div style={{ display: "flex", gap: 0 }}>
                     <div style={{ padding: "10px 12px", background: "var(--bg-sunken)", border: "1.5px solid var(--border-medium)", borderRight: "none", borderRadius: "var(--radius-md) 0 0 var(--radius-md)", fontSize: 14, fontWeight: 700, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 5 }}>
                       🇮🇳 +91
                     </div>
                     <input
                       type="tel"
                       maxLength={10}
                       value={phone}
                       onChange={(e) => { setPhone(e.target.value.replace(/\D/g, "")); setPhoneError(""); }}
                       className={`input ${phoneError ? "error" : ""}`}
                       style={{ borderRadius: "0 var(--radius-md) var(--radius-md) 0" }}
                       placeholder="Enter 10 digit number"
                     />
                   </div>
                   {phoneError && <p className="field-error">{phoneError}</p>}
                   {phone.length === 10 && !phoneError && (
                     <div style={{ color: "var(--success)", fontSize: 12, fontWeight: 700, marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
                       <CheckCircle2 size={14} /> Valid number
                     </div>
                   )}
                 </div>
                )}

                {countdown > 0 && !otpSuccess && (
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ textAlign: "center", fontSize: 13, color: "var(--text-muted)", marginBottom: 16 }}>
                      Sent 6-digit code to <strong style={{ color: "var(--text-primary)" }}>+91 {phone}</strong>
                    </div>
                    <OTPInput
                      onComplete={handleVerifyOTP}
                      error={otpError}
                      onClearError={() => setOtpError(false)}
                      success={otpSuccess}
                    />
                    {otpError && <p className="field-error" style={{ textAlign: "center", marginTop: 10 }}>Wrong OTP. Try again or resend.</p>}
                  </div>
                )}

                {otpSuccess && (
                  <div style={{ textAlign: "center", padding: "20px 0", color: "var(--success)" }}>
                    <CheckCircle2 size={48} style={{ margin: "0 auto 12px" }} />
                    <div style={{ fontSize: 18, fontWeight: 800 }}>Verified!</div>
                    <div style={{ fontSize: 14, color: "var(--success)", opacity: 0.8 }}>Redirecting to your matches...</div>
                  </div>
                )}

                {countdown === 0 && !otpSuccess && (
                  <button 
                    onClick={handleSendOTP}
                    disabled={loading || phone.length !== 10}
                    className="btn btn-primary btn-lg btn-fullwidth"
                  >
                    {loading ? "Sending..." : "Verify Mobile"}
                  </button>
                )}

                {countdown > 0 && !otpSuccess && (
                  <div style={{ textAlign: "center", marginTop: 16 }}>
                    <button onClick={handleResend} disabled={loading} style={{ background: "none", border: "none", color: "var(--brand)", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                      Resend in 0:{String(countdown).padStart(2, "0")}
                    </button>
                  </div>
                )}

                <div style={{ textAlign: "center", marginTop: 24, paddingBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11.5, color: "var(--text-muted)", justifyContent: "center" }}>
                    <ShieldCheck size={14} /> 🔒 Your data stays private. We never sell your info.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section style={{ background: "#fff", borderTop: "1px solid var(--border-light)", borderBottom: "1px solid var(--border-light)" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "32px 24px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, textAlign: "center" }}>
          <div>
            <div style={{ fontSize: 28, fontWeight: 800, color: "var(--brand)" }}>{actSchols.toLocaleString("en-IN")}+</div>
            <div style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginTop: 4 }}>Active Scholarships</div>
          </div>
          <div style={{ borderLeft: "1px solid var(--border-light)" }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: "var(--brand)" }}>₹{actVal}Cr+</div>
            <div style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginTop: 4 }}>Total Value Tracked</div>
          </div>
          <div style={{ borderLeft: "1px solid var(--border-light)" }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: "var(--brand)" }}>{actAcc}%</div>
            <div style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginTop: 4 }}>Match Accuracy</div>
          </div>
          <div style={{ borderLeft: "1px solid var(--border-light)" }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: "var(--brand)" }}>{actSecs}s</div>
            <div style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginTop: 4 }}>Avg. Time to Match</div>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section style={{ background: "var(--bg-base)", padding: "100px 24px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.8px" }}>Your Scholarship Roadmap</h2>
            <p style={{ fontSize: 16, color: "var(--text-muted)", maxWidth: 600, margin: "16px auto 0" }}>Three simple steps from discovery to disbursement.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32 }}>
            {[
              { id: "01", icon: <Search size={28} />, title: "Build Your Smart Profile", desc: "Enter your background details securely. We check over 50 data points per scholarship.", ex: "e.g., General category BTech in Karnataka with 85% marks." },
              { id: "02", icon: <Zap size={28} />, title: "Get Instant AI Matches", desc: "Our engine maps you to exact schemes you qualify for. No more reading 50-page guidelines.", ex: "e.g., We found 34 active scholarships for your exact profile." },
              { id: "03", icon: <CheckCircle2 size={28} />, title: "Apply with 1-Click Vault", desc: "Store certificates securely. We auto-verify format and size for portals like NSP/MahaDBT.", ex: "e.g., Your income certificate is ready. Apply to HDFC Bank." },
            ].map(step => (
              <div key={step.id} style={{ background: "#fff", padding: 32, borderRadius: "var(--radius-xl)", border: "1px solid var(--border-light)", position: "relative" }}>
                <div style={{ position: "absolute", top: 24, right: 32, fontSize: 48, fontWeight: 800, color: "var(--bg-sunken)", lineHeight: 1 }}>{step.id}</div>
                <div style={{ width: 56, height: 56, background: "var(--brand-light)", color: "var(--brand)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
                  {step.icon}
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.4px", marginBottom: 12 }}>{step.title}</h3>
                <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 20 }}>{step.desc}</p>
                <div style={{ background: "var(--bg-sunken)", padding: "12px 16px", borderRadius: 8, fontSize: 12.5, color: "var(--text-muted)", fontStyle: "italic", borderLeft: "3px solid var(--brand-border)" }}>
                  {step.ex}
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: 64 }}>
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="btn btn-secondary btn-lg">
              Start your profile — takes 2 minutes <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* ── Trust Section ── */}
      <section style={{ background: "#fff", padding: "64px 24px", borderTop: "1px solid var(--border-light)" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 32 }}>
            ScholarArth is trusted by students applying to
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 40, alignItems: "center", opacity: 0.6, "filter": "grayscale(100%)", transition: "all .3s" }} className="trust-logos">
             {/* Mock SVGs for Trust Logos */}
             <div style={{ fontSize: 24, fontWeight: 800, display: "flex", alignItems: "center", gap: 8 }}>🏛️ NSP Portal</div>
             <div style={{ fontSize: 22, fontWeight: 800, fontFamily: "serif" }}>MahaDBT</div>
             <div style={{ fontSize: 24, fontWeight: 800 }}>Buddy4Study</div>
             <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: 2 }}>AICTE</div>
          </div>
          <div style={{ marginTop: 40, display: "flex", justifyContent: "center", gap: 24, fontSize: 13, color: "var(--text-muted)" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}><ShieldCheck size={16} color="var(--success)" /> SSL Encrypted</span>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}><CheckCircle2 size={16} color="var(--success)" /> GDPR Compliant</span>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}><CheckCircle2 size={16} color="var(--success)" /> No Ads · Free Forever</span>
          </div>
        </div>
      </section>

      <style>{`
        .trust-logos:hover {
          opacity: 1; filter: grayscale(0%);
        }
        @media (max-width: 1024px) {
          section > div[style*="grid-template-columns: 1.2fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
          .trust-logos {
            flex-direction: column;
            gap: 24px !important;
          }
        }
        @media (max-width: 768px) {
          section > div[style*="grid-template-columns: repeat(4, 1fr)"] {
            grid-template-columns: 1fr 1fr !important;
            gap: 32px 0 !important;
          }
          section > div[style*="grid-template-columns: repeat(4, 1fr)"] > div:nth-child(even) {
            border-left: 1px solid var(--border-light) !important;
          }
          section > div[style*="grid-template-columns: repeat(4, 1fr)"] > div:nth-child(odd) {
            border-left: none !important;
          }
          section > div[style*="grid-template-columns: repeat(3, 1fr)"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
