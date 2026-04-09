"use client";

import { useState } from "react";
import { Upload, Eye, Trash2, RefreshCw } from "lucide-react";

interface Document {
  id: string;
  name: string;
  emoji: string;
  category: "identity" | "academic" | "financial" | "other";
  uploaded: boolean;
  uploadDate?: string;
  fileSizeBytes?: number;
  required: boolean;
}

const DOCUMENTS: Document[] = [
  { id: "aadhaar", name: "Aadhaar Card", emoji: "🪪", category: "identity", uploaded: true, uploadDate: "Mar 12, 2025", fileSizeBytes: 180000, required: true },
  { id: "class10", name: "Class 10 Marksheet", emoji: "📄", category: "academic", uploaded: true, uploadDate: "Mar 14, 2025", fileSizeBytes: 420000, required: true },
  { id: "class12", name: "Class 12 Marksheet", emoji: "📄", category: "academic", uploaded: true, uploadDate: "Mar 14, 2025", fileSizeBytes: 2400000, required: true },
  { id: "income", name: "Income Certificate", emoji: "💰", category: "financial", uploaded: false, required: true },
  { id: "caste", name: "Caste Certificate", emoji: "📋", category: "identity", uploaded: false, required: false },
  { id: "bank", name: "Bank Passbook", emoji: "🏦", category: "financial", uploaded: true, uploadDate: "Mar 15, 2025", fileSizeBytes: 95000, required: true },
  { id: "college", name: "College ID", emoji: "🎓", category: "identity", uploaded: false, required: true },
  { id: "disability", name: "Disability Certificate (PwD)", emoji: "♿", category: "identity", uploaded: false, required: false },
  { id: "photo", name: "Passport Photo", emoji: "🖼️", category: "other", uploaded: true, uploadDate: "Mar 12, 2025", fileSizeBytes: 45000, required: true },
  { id: "sop", name: "SOP / Essay", emoji: "📝", category: "other", uploaded: false, required: false },
];

const COMPRESS_THRESHOLD = 500 * 1024; // 500KB

function formatSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.round(bytes / 1024)} KB`;
}

export default function DocumentsPage() {
  const [docs, setDocs] = useState(DOCUMENTS);

  const oversized = docs.filter((d) => d.uploaded && d.fileSizeBytes && d.fileSizeBytes > COMPRESS_THRESHOLD);
  const uploadedCount = docs.filter((d) => d.uploaded).length;

  function SizeBadge({ doc }: { doc: Document }) {
    if (!doc.uploaded) {
      return <span style={{ background: "var(--rose-bg)", color: "#991B1B", fontSize: 11.5, fontWeight: 700, padding: "2px 8px", borderRadius: 6 }}>Not Uploaded</span>;
    }
    if (doc.fileSizeBytes && doc.fileSizeBytes > COMPRESS_THRESHOLD) {
      return <span style={{ background: "var(--amber-bg)", color: "#92400E", fontSize: 11.5, fontWeight: 700, padding: "2px 8px", borderRadius: 6 }}>{formatSize(doc.fileSizeBytes)} ⚠️</span>;
    }
    return <span style={{ background: "var(--emerald-bg)", color: "#065F46", fontSize: 11.5, fontWeight: 700, padding: "2px 8px", borderRadius: 6 }}>{doc.fileSizeBytes ? formatSize(doc.fileSizeBytes) : "—"} ✓</span>;
  }

  return (
    <div className="container-site" style={{ padding: "28px 24px" }}>
      <div style={{ maxWidth: 860 }}>

        {/* Page Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--ink)", marginBottom: 4 }}>Document Vault</h1>
            <p style={{ fontSize: 13, color: "var(--ink3)" }}>{uploadedCount}/{docs.length} documents uploaded</p>
          </div>
          <button className="btn btn-primary btn-md" style={{ gap: 6 }}>
            <Upload size={15} /> Upload All
          </button>
        </div>

        {/* Progress */}
        <div style={{ background: "#fff", border: "1px solid var(--bdr)", borderRadius: 12, padding: "16px 20px", marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)" }}>Vault Completeness</span>
            <span style={{ fontSize: 13, fontWeight: 800, color: "var(--brand)" }}>{Math.round((uploadedCount / docs.length) * 100)}%</span>
          </div>
          <div style={{ height: 8, background: "var(--bg)", borderRadius: 100, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${(uploadedCount / docs.length) * 100}%`, background: "var(--brand)", borderRadius: 100, transition: "width .5s ease" }} />
          </div>
        </div>

        {/* Compress Tip */}
        {oversized.length > 0 && (
          <div style={{ background: "var(--amber-bg)", border: "1px solid #FCD34D", borderRadius: 10, padding: "12px 14px", marginBottom: 20 }}>
            <div style={{ fontSize: 12.5, color: "#92400E", marginBottom: 8 }}>
              ⚠️ {oversized.map((d) => d.name).join(", ")} {oversized.length === 1 ? "is" : "are"} over 500KB. NSP portal accepts max 200KB. Compress free:
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["iLovePDF", "Smallpdf", "Adobe Compress"].map((tool) => (
                <a key={tool} href="#" style={{ background: "#fff", border: "1.5px solid #FCD34D", color: "#92400E", borderRadius: 100, padding: "4px 12px", fontSize: 12.5, fontWeight: 700, textDecoration: "none" }}>
                  {tool}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Document List */}
        <div className="card" style={{ overflow: "hidden", padding: 0 }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--bdr)", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 13.5, fontWeight: 800, color: "var(--ink)" }}>All Documents</span>
            <span style={{ fontSize: 12, color: "var(--ink3)" }}>Required ({docs.filter((d) => d.required).length}) · Optional ({docs.filter((d) => !d.required).length})</span>
          </div>

          {docs.map((doc, i) => (
            <div
              key={doc.id}
              style={{
                display: "flex", alignItems: "center", gap: 12, padding: "13px 20px",
                borderBottom: i < docs.length - 1 ? "1px solid var(--bdr)" : "none",
                transition: "background .15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
            >
              {/* Icon */}
              <div style={{ width: 34, height: 34, borderRadius: 8, background: doc.uploaded ? "var(--brand-bg)" : "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0, border: "1px solid var(--bdr)" }}>
                {doc.emoji}
              </div>

              {/* Name + meta */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--ink)", display: "flex", alignItems: "center", gap: 7 }}>
                  {doc.name}
                  {!doc.required && <span className="pill pill-gray">Optional</span>}
                </div>
                {doc.uploaded && doc.uploadDate && (
                  <div style={{ fontSize: 11.5, color: "var(--ink3)", marginTop: 2 }}>Uploaded {doc.uploadDate}{doc.fileSizeBytes ? ` · ${formatSize(doc.fileSizeBytes)}` : ""}</div>
                )}
              </div>

              {/* Size badge */}
              <SizeBadge doc={doc} />

              {/* Actions */}
              <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                {doc.uploaded ? (
                  <>
                    <button className="btn btn-ghost btn-sm" style={{ gap: 4, fontSize: 11.5 }} aria-label={`Preview ${doc.name}`}><Eye size={12} /> Preview</button>
                    <button className="btn btn-ghost btn-sm" style={{ gap: 4, fontSize: 11.5 }} aria-label={`Re-upload ${doc.name}`}><RefreshCw size={12} /> Replace</button>
                    <button className="btn btn-ghost btn-sm" style={{ color: "var(--rose)", borderColor: "var(--rose-bg)" }} aria-label={`Delete ${doc.name}`}><Trash2 size={12} /></button>
                  </>
                ) : (
                  <button className="btn btn-primary btn-sm" style={{ gap: 4 }} aria-label={`Upload ${doc.name}`}><Upload size={12} /> Upload</button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Tips */}
        <div style={{ background: "var(--brand-bg)", border: "1px solid var(--brand-soft)", borderRadius: 12, padding: "16px 18px", marginTop: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--brand2)", marginBottom: 8 }}>💡 Document Tips</div>
          <ul style={{ fontSize: 12.5, color: "var(--ink2)", lineHeight: 1.8, paddingLeft: 18 }}>
            <li>Most portals accept PDF, JPG, PNG — keep files under 200KB for NSP</li>
            <li>Aadhaar must be self-attested — sign across the photo</li>
            <li>Income certificate should be from Tehsildar or equivalent (not older than 6 months)</li>
            <li>Bank passbook first page must show your name, account number, and IFSC code</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
