import { ShieldCheck, Lock, EyeOff, Server } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | ScholarArth",
  description: "Learn how ScholarArth protects your data, securely stores your documents, and maintains strict privacy standards for student information.",
};

export default function PrivacyPolicy() {
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "64px 24px", fontFamily: "var(--font-primary)" }}>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <ShieldCheck size={48} color="var(--brand)" style={{ margin: "0 auto 16px" }} />
        <h1 style={{ fontSize: 32, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-1px", marginBottom: 12 }}>
          Privacy Policy
        </h1>
        <p style={{ fontSize: 16, color: "var(--text-muted)", lineHeight: 1.6 }}>
          Last Updated: March 2026<br/>
          Your trust is our priority. We treat your academic and financial data with government-grade security.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 48 }}>
        {[
          { icon: <Lock className="text-brand" />, title: "256-bit Encryption", desc: "All data transfers are secured via SSL. Your document copies physically reside in ISO 27001 compliant Tier III data centers." },
          { icon: <EyeOff className="text-success" />, title: "No Data Selling", desc: "We are a free platform. We do not sell, rent, or trade your personal information, income data, or contact details to third parties or marketing agencies." },
        ].map(f => (
           <div key={f.title} style={{ padding: 24, border: "1px solid var(--border-medium)", background: "var(--bg-surface)", borderRadius: "var(--radius-lg)" }}>
             <div style={{ marginBottom: 12, display: "inline-block", background: "var(--bg-sunken)", padding: 12, borderRadius: "var(--radius-md)" }}>
               {f.icon}
             </div>
             <h3 style={{ fontSize: 16, fontWeight: 800, color: "var(--text-primary)", marginBottom: 8 }}>{f.title}</h3>
             <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.6 }}>{f.desc}</p>
           </div>
        ))}
      </div>

      <div style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.8 }}>
         <h2 style={{ fontSize: 24, fontWeight: 800, color: "var(--text-primary)", marginTop: 40, marginBottom: 16 }}>1. Information We Collect</h2>
         <p style={{ marginBottom: 16 }}>
           To provide accurate scholarship matching, we collect academic history, demographic details (category, religion, state), and self-declared financial data. When you use the Document Vault, you may upload sensitive identity documents like Aadhaar, PAN, and Income Certificates.
         </p>

         <h2 style={{ fontSize: 24, fontWeight: 800, color: "var(--text-primary)", marginTop: 40, marginBottom: 16 }}>2. How We Use Information</h2>
         <p style={{ marginBottom: 16 }}>
           Your data is exclusively used to:
         </p>
         <ul style={{ paddingLeft: 24, marginBottom: 16, listStyleType: "disc" }}>
           <li>Match you precisely against complex state and central scholarship eligibility criteria.</li>
           <li>Generate tailored Statement of Purpose (SOP) drafts via our AI pipelines.</li>
           <li>Verify document sizes and formats for portal upload readiness (e.g., NSP 200KB limit).</li>
         </ul>

         <h2 style={{ fontSize: 24, fontWeight: 800, color: "var(--text-primary)", marginTop: 40, marginBottom: 16 }}>3. Your Rights & Control</h2>
         <p style={{ marginBottom: 16 }}>
           You retain full ownership of your data. You may at any time:
         </p>
         <ul style={{ paddingLeft: 24, marginBottom: 16, listStyleType: "disc" }}>
           <li>Export all documents and application tracking data from your dashboard.</li>
           <li>Trigger a complete account anonymization via your Profile settings, which permanently wipes all uploaded documents and cleartext identifiers from our servers within 72 hours.</li>
         </ul>
         
         <div style={{ background: "var(--bg-sunken)", border: "1px solid var(--border-light)", padding: 24, borderRadius: "var(--radius-lg)", marginTop: 40, textAlign: "center" }}>
            <Server size={24} color="var(--text-muted)" style={{ margin: "0 auto 12px" }} />
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>Data Hosting & Infrastructure</div>
            <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
              Hosted legally within Indian data jurisdictions. ScholarArth infrastructure complies strictly with the Digital Personal Data Protection Act, 2023 (DPDP).
            </div>
         </div>
      </div>
      
      <div style={{ marginTop: 64, textAlign: "center" }}>
        <Link href="/" className="btn btn-secondary btn-md">
           Return to Home
        </Link>
      </div>
    </div>
  );
}
