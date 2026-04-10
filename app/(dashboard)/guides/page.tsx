"use client";

import { BookOpen, Search, ArrowRight, ShieldAlert, GraduationCap, Banknote, ScrollText } from "lucide-react";
import Link from "next/link";

const GUIDES = [
  { id: "nsp-guide", title: "How to apply for NSP — complete step by step guide", category: "Portals", icon: <ShieldAlert size={20} className="text-brand" />, time: "6 min read" },
  { id: "mahadbt-errors", title: "MahaDBT portal — common errors and fixes", category: "Portals", icon: <ShieldAlert size={20} className="text-brand" />, time: "5 min read" },
  { id: "income-cert", title: "Income Certificate — Where to get it & format required", category: "Documents", icon: <ScrollText size={20} className="text-success" />, time: "4 min read" },
  { id: "non-creamy-layer", title: "Non-Creamy Layer (NCL) Certificate Guide", category: "Documents", icon: <ScrollText size={20} className="text-success" />, time: "7 min read" },
  { id: "aadhaar-pfms", title: "Aadhaar Seeding for PFMS Bank Accounts (Mandatory)", category: "Compliance", icon: <Banknote size={20} className="text-warning" />, time: "5 min read" },
  { id: "first-gen", title: "Scholarship Tips for First-Generation College Students", category: "Strategy", icon: <GraduationCap size={20} className="text-info" />, time: "8 min read" },
];

export default function GuidesPage() {
  return (
    <div style={{ padding: "40px 24px", maxWidth: 1000, margin: "0 auto" }} className="animate-fade-in-up">
      {/* Hero */}
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 56, height: 56, borderRadius: "50%", background: "var(--brand-light)", marginBottom: 16 }}>
           <BookOpen size={28} className="text-brand" />
        </div>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-1px", marginBottom: 12 }}>
          Scholarship Knowledge Base
        </h1>
        <p style={{ fontSize: 16, color: "var(--text-muted)", maxWidth: 500, margin: "0 auto", lineHeight: 1.6 }}>
          Expert guides to navigate government portals, prepare the right documents, and avoid common rejection reasons.
        </p>

        <div style={{ maxWidth: 480, margin: "32px auto 0", position: "relative" }}>
          <Search size={18} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "var(--text-disabled)" }} />
          <input 
            type="text" 
            placeholder="Search for NSP, Income Certificate, etc..." 
            className="input" 
            style={{ width: "100%", paddingLeft: 46, paddingRight: 16, height: 52, fontSize: 15, borderRadius: "var(--radius-xl)", boxShadow: "var(--shadow-sm)" }} 
          />
        </div>
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
        {GUIDES.map(g => (
          <div key={g.id} style={{ background: "var(--bg-surface)", border: "1px solid var(--border-medium)", borderRadius: "var(--radius-lg)", padding: 24, transition: "transform 0.2s, box-shadow 0.2s", cursor: "pointer", display: "flex", flexDirection: "column" }} className="hover:shadow-md hover:-translate-y-1">
             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div style={{ background: "var(--bg-sunken)", padding: 12, borderRadius: "var(--radius-md)" }}>
                   {g.icon}
                </div>
                <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", color: "var(--text-muted)", letterSpacing: "0.5px" }}>
                  {g.category}
                </div>
             </div>
             
             <h3 style={{ fontSize: 18, fontWeight: 800, color: "var(--text-primary)", lineHeight: 1.4, marginBottom: 12, flex: 1 }}>
               {g.title}
             </h3>
             
             <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid var(--border-light)", paddingTop: 16, marginTop: "auto" }}>
               <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600 }}>{g.time}</span>
               <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, fontWeight: 700, color: "var(--brand)" }}>
                 Read Guide <ArrowRight size={14} />
               </span>
             </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 64, background: "linear-gradient(135deg, var(--brand) 0%, var(--brand-dark) 100%)", borderRadius: "var(--radius-xl)", padding: 40, textAlign: "center", color: "#fff", boxShadow: "var(--shadow-md)" }}>
         <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Need personal assistance?</h2>
         <p style={{ fontSize: 15, color: "rgba(255,255,255,0.8)", marginBottom: 24, maxWidth: 500, margin: "0 auto 24px" }}>
           Our AI Scholarship Assistant is trained on all national and state scholarship guidelines. Ask it anything!
         </p>
         <button className="btn" style={{ background: "#fff", color: "var(--brand)", fontWeight: 800, fontSize: 15, height: 48, padding: "0 28px", borderRadius: "var(--radius-lg)" }}>
           Open AI Assistant
         </button>
      </div>
    </div>
  );
}
