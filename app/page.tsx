"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, Sparkles, Shield, ChevronRight } from "lucide-react";
import { sendOTP, verifyOTP } from "@/app/actions/auth";

// ── OTP Input Component ────────────────────────────────────────
function OTPInput({
  onComplete,
  error,
  onClearError,
}: {
  onComplete: (otp: string) => void;
  error: boolean;
  onClearError: () => void;
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
          aria-label={`OTP digit ${i + 1}`}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          style={{
            width: 48,
            height: 56,
            textAlign: "center",
            fontSize: 22,
            fontWeight: 800,
            border: `1.5px solid ${error ? "var(--rose)" : digit ? "var(--brand)" : "var(--bdr)"}`,
            borderRadius: 10,
            background: error ? "var(--rose-bg)" : digit ? "var(--brand-bg)" : "#fff",
            color: error ? "var(--rose)" : "var(--ink)",
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
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [otpError, setOtpError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

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
    // Validate phone
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setPhoneError("Enter a valid 10-digit Indian mobile number (starts with 6–9)");
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
    setStep("otp");
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
    if (result?.redirect) {
      router.push(result.redirect);
    }
  }

  async function handleResend() {
    setLoading(true);
    await sendOTP(phone);
    setLoading(false);
    startCountdown();
  }

  const FEATURES = [
    { icon: "🎯", title: "AI-Powered Matching", desc: "Get personalized scholarship recommendations based on your exact profile" },
    { icon: "📄", title: "SOP Generator", desc: "Write compelling Statements of Purpose in English, Hindi, or Marathi" },
    { icon: "📊", title: "Application Tracker", desc: "Track every application from draft to winner — all in one dashboard" },
    { icon: "🗄️", title: "Document Vault", desc: "Store, compress, and organize all your scholarship documents securely" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column" }}>

      {/* ── Hero / Auth Section ── */}
      <section style={{ background: "#fff", borderBottom: "1px solid var(--bdr)", padding: "0 24px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 420px", gap: 64, alignItems: "center", minHeight: "92vh" }}>

          {/* Left: Hero Text */}
          <div style={{ paddingRight: 32 }}>
            {/* Logo row */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }}>
              <div style={{ width: 38, height: 38, background: "var(--brand)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <GraduationCap size={20} color="#fff" strokeWidth={2.2} />
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "var(--ink)", letterSpacing: "-.4px" }}>ScholarArth</div>
                <div style={{ fontSize: 10, color: "var(--ink3)" }}>Turning Eligibility into Success</div>
              </div>
            </div>

            {/* Eyebrow pill */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--brand-bg)", border: "1px solid var(--brand-soft)", borderRadius: 100, padding: "5px 13px", marginBottom: 24 }}>
              <span className="animate-pulse-dot" style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--brand)", display: "inline-block", flexShrink: 0 }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: "var(--brand2)" }}>8,400+ Scholarships · AI-Powered · Free Forever</span>
            </div>

            {/* h1 */}
            <h1 style={{ fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-1.5px", color: "var(--ink)", marginBottom: 20 }}>
              Turning{" "}
              <span className="hero-keyword">Eligibility</span>
              <br />
              into Success
            </h1>

            <p style={{ fontSize: 16, color: "var(--ink2)", lineHeight: 1.75, maxWidth: 460, marginBottom: 32 }}>
              India's most intelligent scholarship platform. We don't just list scholarships — we analyze your profile, predict your probability, and build your personalized strategy to win.
            </p>

            {/* Stats */}
            <div style={{ display: "flex", gap: 32, marginBottom: 40 }}>
              {[
                { n: "8,400+", l: "Scholarships" },
                { n: "₹2,200Cr", l: "Total Value" },
                { n: "94%", l: "Match Accuracy" },
                { n: "1.4L+", l: "Students Helped" },
              ].map((s) => (
                <div key={s.n}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "var(--brand)" }}>{s.n}</div>
                  <div style={{ fontSize: 11, color: "var(--ink3)", marginTop: 2 }}>{s.l}</div>
                </div>
              ))}
            </div>

            {/* Features */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {FEATURES.map((f) => (
                <div key={f.title} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "12px 14px", background: "var(--bg)", borderRadius: 10, border: "1px solid var(--bdr)" }}>
                  <span style={{ fontSize: 20 }}>{f.icon}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)" }}>{f.title}</div>
                    <div style={{ fontSize: 11.5, color: "var(--ink3)", lineHeight: 1.5, marginTop: 2 }}>{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Auth Card */}
          <div style={{ padding: "32px 28px", background: "#fff", border: "1.5px solid var(--bdr2)", borderRadius: 18, boxShadow: "var(--sh2)", position: "sticky", top: 40 }}>

            {step === "phone" ? (
              <>
                <div style={{ textAlign: "center", marginBottom: 28 }}>
                  <div style={{ width: 48, height: 48, background: "var(--brand-bg)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                    <Sparkles size={22} color="var(--brand)" />
                  </div>
                  <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--ink)", letterSpacing: "-.4px", marginBottom: 6 }}>Get Started Free</h2>
                  <p style={{ fontSize: 13.5, color: "var(--ink3)", lineHeight: 1.5 }}>India's smartest scholarship platform awaits. No password needed.</p>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", fontSize: 12.5, fontWeight: 700, color: "var(--ink2)", marginBottom: 7, textTransform: "uppercase", letterSpacing: ".5px" }}>
                    Mobile Number
                  </label>
                  <div style={{ display: "flex", gap: 0 }}>
                    <div style={{ padding: "10px 12px", background: "var(--bg)", border: "1.5px solid var(--bdr)", borderRight: "none", borderRadius: "8px 0 0 8px", fontSize: 14, fontWeight: 700, color: "var(--ink3)", display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
                      🇮🇳 +91
                    </div>
                    <input
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      value={phone}
                      onChange={(e) => { setPhone(e.target.value.replace(/\D/g, "")); setPhoneError(""); }}
                      onKeyDown={(e) => e.key === "Enter" && handleSendOTP()}
                      placeholder="Enter 10-digit number"
                      aria-label="Mobile number input"
                      style={{
                        flex: 1,
                        border: `1.5px solid ${phoneError ? "var(--rose)" : "var(--bdr)"}`,
                        borderRadius: "0 8px 8px 0",
                        fontSize: 15,
                        padding: "10px 14px",
                        fontFamily: "inherit",
                        color: "var(--ink)",
                        outline: "none",
                      }}
                      onFocus={(e) => !phoneError && (e.target.style.borderColor = "var(--brand)")}
                      onBlur={(e) => !phoneError && (e.target.style.borderColor = "var(--bdr)")}
                    />
                  </div>
                  {phoneError && (
                    <p style={{ fontSize: 12, color: "var(--rose)", marginTop: 6 }}>{phoneError}</p>
                  )}
                  <p style={{ fontSize: 12, color: "var(--ink3)", marginTop: 7 }}>
                    We&apos;ll send a 6-digit OTP. No spam, ever.
                  </p>
                </div>

                <button
                  onClick={handleSendOTP}
                  disabled={loading || !phone}
                  className="btn btn-primary btn-lg btn-fullwidth"
                  style={{ marginBottom: 16 }}
                >
                  {loading ? "⟳ Sending OTP..." : <>Send OTP <ChevronRight size={16} /></>}
                </button>

                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11.5, color: "var(--ink3)", justifyContent: "center" }}>
                  <Shield size={13} />
                  Your data is encrypted & never sold
                </div>
              </>
            ) : (
              <>
                <div style={{ textAlign: "center", marginBottom: 24 }}>
                  <div style={{ fontSize: 36, marginBottom: 10 }}>📱</div>
                  <h2 style={{ fontSize: 20, fontWeight: 800, color: "var(--ink)", letterSpacing: "-.4px", marginBottom: 6 }}>Enter OTP</h2>
                  <p style={{ fontSize: 13, color: "var(--ink3)", lineHeight: 1.5 }}>
                    We sent a 6-digit code to <strong style={{ color: "var(--ink)" }}>+91 {phone}</strong>
                  </p>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <OTPInput
                    onComplete={handleVerifyOTP}
                    error={otpError}
                    onClearError={() => setOtpError(false)}
                  />
                  {otpError && (
                    <p style={{ textAlign: "center", fontSize: 12, color: "var(--rose)", marginTop: 10 }}>
                      Incorrect OTP. Please try again.
                    </p>
                  )}
                </div>

                {loading && (
                  <p style={{ textAlign: "center", fontSize: 13, color: "var(--ink3)", marginBottom: 12 }}>
                    ⟳ Verifying...
                  </p>
                )}

                <div style={{ textAlign: "center", fontSize: 13, color: "var(--ink3)" }}>
                  {countdown > 0 ? (
                    <span>Resend in 0:{String(countdown).padStart(2, "0")}</span>
                  ) : (
                    <button
                      onClick={handleResend}
                      disabled={loading}
                      style={{ background: "none", border: "none", color: "var(--brand)", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}
                    >
                      Resend OTP
                    </button>
                  )}
                </div>

                <button
                  onClick={() => { setStep("phone"); setOtpError(false); }}
                  style={{ background: "none", border: "none", color: "var(--ink3)", fontSize: 12.5, cursor: "pointer", display: "block", margin: "14px auto 0", fontFamily: "inherit" }}
                >
                  ← Change number
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── Trust Bar ── */}
      <section style={{ background: "#fff", borderTop: "1px solid var(--bdr)", padding: "20px 24px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", gap: 32, flexWrap: "wrap" }}>
          {["NSP Integrated", "Ministry of Education Partner", "1.4L+ Students", "GDPR Compliant", "Free Forever"].map((t) => (
            <span key={t} style={{ fontSize: 12.5, color: "var(--ink3)", fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ color: "var(--emerald)" }}>✓</span> {t}
            </span>
          ))}
        </div>
      </section>

      <style>{`
        @media (max-width: 1024px) {
          section > div[style*="grid-template-columns: 1fr 420px"] {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 480px) {
          section > div[style*="grid-template-columns: 1fr 420px"] > div:first-child {
            padding-right: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
