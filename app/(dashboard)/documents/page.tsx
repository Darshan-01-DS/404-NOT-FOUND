"use client";

import { useState, useRef } from "react";
import { Upload, Eye, Trash2, RefreshCw, FileText, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";

interface Document {
  id: string;
  name: string;
  category: "identity" | "academic" | "financial" | "other";
  uploaded: boolean;
  uploadDate?: string;
  fileSizeBytes?: number;
  required: boolean;
  imgUrl?: string; // ImageKit URL mock
}

const INITIAL_DOCS: Document[] = [
  { id: "aadhaar", name: "Aadhaar Card", category: "identity", uploaded: true, uploadDate: "Mar 12, 2026", fileSizeBytes: 180000, required: true },
  { id: "class10", name: "Class 10 Marksheet", category: "academic", uploaded: true, uploadDate: "Mar 14, 2026", fileSizeBytes: 420000, required: true },
  { id: "class12", name: "Class 12 Marksheet", category: "academic", uploaded: true, uploadDate: "Mar 14, 2026", fileSizeBytes: 2400000, required: true },
  { id: "income", name: "Income Certificate", category: "financial", uploaded: false, required: true },
  { id: "bank", name: "Bank Passbook", category: "financial", uploaded: true, uploadDate: "Mar 15, 2026", fileSizeBytes: 95000, required: true },
  { id: "college", name: "College ID", category: "identity", uploaded: false, required: true },
  { id: "caste", name: "Caste Certificate", category: "identity", uploaded: false, required: false },
  { id: "disability", name: "Disability Certificate (PwD)", category: "identity", uploaded: false, required: false },
  { id: "photo", name: "Passport Photo", category: "other", uploaded: true, uploadDate: "Mar 12, 2026", fileSizeBytes: 45000, required: false },
  { id: "sop", name: "SOP / Essay", category: "other", uploaded: false, required: false },
];

const MAX_FILE_SIZE = 200 * 1024; // 200KB for NSP compliance

function formatSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.round(bytes / 1024)} KB`;
}

export default function DocumentsPage() {
  const [docs, setDocs] = useState<Document[]>(INITIAL_DOCS);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  
  // Hidden text input ref for mock uploads
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [targetUploadId, setTargetUploadId] = useState<string | null>(null);

  const requiredDocs = docs.filter(d => d.required);
  const optionalDocs = docs.filter(d => !d.required);
  
  const uploadedRequired = requiredDocs.filter(d => d.uploaded).length;
  const progressPercent = Math.round((uploadedRequired / requiredDocs.length) * 100);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !targetUploadId) return;

    // Simulate ImageKit Upload Process
    setUploadingId(targetUploadId);
    
    setTimeout(() => {
      setDocs(prev => prev.map(d => {
        if (d.id === targetUploadId) {
          return {
            ...d,
            uploaded: true,
            uploadDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            fileSizeBytes: file.size,
          };
        }
        return d;
      }));
      setUploadingId(null);
      setTargetUploadId(null);
    }, 1500);
  }

  function triggerUpload(id: string) {
    setTargetUploadId(id);
    fileInputRef.current?.click();
  }

  function deleteDoc(id: string) {
    setDocs(prev => prev.map(d => d.id === id ? { ...d, uploaded: false, uploadDate: undefined, fileSizeBytes: undefined } : d));
  }

  const DocumentCard = ({ doc }: { doc: Document }) => {
    const isOverSize = doc.fileSizeBytes ? doc.fileSizeBytes > MAX_FILE_SIZE : false;
    const isUploading = uploadingId === doc.id;

    return (
      <div style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border-medium)",
        borderRadius: "var(--radius-lg)",
        padding: "20px",
        marginBottom: 16,
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Loading Overlay */}
        {isUploading && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.8)", backdropFilter: "blur(2px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 700, color: "var(--brand)" }}>
              <RefreshCw className="animate-spin-slow" size={18} /> Uploading to Secure Vault...
            </div>
          </div>
        )}

        <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
           <div style={{ width: 44, height: 44, background: doc.uploaded ? "var(--brand-light)" : "var(--bg-sunken)", border: `1px solid ${doc.uploaded ? "var(--brand)" : "var(--border-light)"}`, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", color: doc.uploaded ? "var(--brand)" : "var(--text-muted)", flexShrink: 0 }}>
             <FileText size={24} />
           </div>
           
           <div style={{ flex: 1, minWidth: 0 }}>
             <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 2 }}>
               <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>{doc.name}</h3>
               {doc.uploaded && !isOverSize && <CheckCircle2 size={16} color="var(--success)" />}
               {doc.uploaded && isOverSize && <AlertTriangle size={16} color="var(--danger)" />}
             </div>
             
             {doc.uploaded ? (
               <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 10, display: "flex", gap: 12, flexWrap: "wrap" }}>
                 <span>Uploaded {doc.uploadDate}</span>
                 <span style={{ color: isOverSize ? "var(--danger)" : "var(--success)", fontWeight: 700 }}>
                   {formatSize(doc.fileSizeBytes || 0)} {isOverSize ? "⚠ Over limit" : "✓ Within limit"}
                 </span>
               </div>
             ) : (
               <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8 }}>
                 Accepted: <strong>PDF, JPG, JPEG</strong> · Max size: <strong style={{ color: "var(--danger)" }}>200KB</strong> (NSP), 500KB (others)
               </div>
             )}

             {doc.uploaded && isOverSize && (
               <div style={{ background: "var(--danger-bg)", border: "1px solid var(--danger-border)", borderRadius: "var(--radius-md)", padding: "12px 14px", marginBottom: 12 }}>
                 <div style={{ fontSize: 13, fontWeight: 800, color: "var(--danger)", marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
                   <AlertTriangle size={14} /> File Too Large for NSP ({formatSize(doc.fileSizeBytes || 0)} / 200KB limit)
                 </div>
                 <div style={{ fontSize: 12, color: "var(--danger)", lineHeight: 1.6 }}>
                   Compress this file before re-uploading:
                   <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                     <a href="https://www.ilovepdf.com/compress_pdf" target="_blank" rel="noopener noreferrer"
                       style={{ background: "#fff", border: "1px solid var(--danger-border)", color: "var(--danger)", padding: "4px 12px", borderRadius: 100, fontSize: 12, fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}>
                       📄 iLovePDF — Compress PDF
                     </a>
                     <a href="https://tinypng.com" target="_blank" rel="noopener noreferrer"
                       style={{ background: "#fff", border: "1px solid var(--danger-border)", color: "var(--danger)", padding: "4px 12px", borderRadius: 100, fontSize: 12, fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}>
                       🖼️ TinyPNG — Compress JPG/PNG
                     </a>
                   </div>
                 </div>
               </div>
             )}

             <div style={{ display: "flex", gap: 8 }}>
               {doc.uploaded ? (
                 <>
                   <button className="btn btn-secondary btn-sm" style={{ flex: 1, justifyContent: "center" }}><Eye size={14} /> View</button>
                   <button className="btn btn-secondary btn-sm" onClick={() => triggerUpload(doc.id)} style={{ flex: 1, justifyContent: "center" }}><RefreshCw size={14} /> Replace</button>
                   <button className="btn btn-secondary btn-sm" onClick={() => deleteDoc(doc.id)} style={{ color: "var(--danger)", padding: "8px" }} aria-label="Delete"><Trash2 size={14} /></button>
                 </>
               ) : (
                 <button className="btn btn-primary btn-sm btn-fullwidth" onClick={() => triggerUpload(doc.id)} style={{ justifyContent: "center" }}>
                   <Upload size={14} /> Select File
                 </button>
               )}
             </div>
           </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding: "32px" }} className="animate-fade-in-up">
      <input type="file" ref={fileInputRef} onChange={handleFileSelect} style={{ display: "none" }} accept="image/*,.pdf" />

      {/* Page Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "var(--text-primary)", marginBottom: 8, letterSpacing: "-0.5px" }}>Secure Document Vault</h1>
          <p style={{ fontSize: 15, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 6 }}>
            <ShieldCheck size={16} className="text-success" /> Powered by ImageKit AES-256 Encryption
          </p>
        </div>
        
        {/* Progress Card */}
        <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-medium)", borderRadius: "var(--radius-lg)", padding: "16px 24px", minWidth: 280 }}>
           <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 800, color: "var(--text-primary)", marginBottom: 8 }}>
             <span>Required Documents</span>
             <span>{progressPercent}% Complete</span>
           </div>
           <div style={{ height: 8, background: "var(--bg-sunken)", borderRadius: 100, overflow: "hidden" }}>
             <div style={{ height: "100%", width: `${progressPercent}%`, background: "var(--brand)", transition: "width 0.5s ease" }} />
           </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }} className="vault-grid">
        {/* Column 1: Required */}
        <div>
           <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
             <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--text-primary)" }}>Required Documents</h2>
             <span style={{ background: "var(--danger-bg)", color: "var(--danger)", padding: "2px 8px", borderRadius: 100, fontSize: 11, fontWeight: 800 }}>Mandatory</span>
           </div>
           
           <div>
             {requiredDocs.map(doc => <DocumentCard key={doc.id} doc={doc} />)}
           </div>
        </div>

        {/* Column 2: Optional */}
        <div>
           <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
             <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--text-primary)" }}>Optional Documents</h2>
             <span style={{ background: "var(--bg-sunken)", color: "var(--text-muted)", padding: "2px 8px", borderRadius: 100, fontSize: 11, fontWeight: 800 }}>If Applicable</span>
           </div>
           
           <div>
             {optionalDocs.map(doc => <DocumentCard key={doc.id} doc={doc} />)}
           </div>

           {/* Compression & Format Guide */}
           <div style={{ background: "var(--brand-light)", border: "1px solid var(--brand-border)", borderRadius: "var(--radius-lg)", padding: 24, marginTop: 24 }}>
             <h3 style={{ fontSize: 15, fontWeight: 800, color: "var(--brand)", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
               <AlertTriangle size={16} /> Document Best Practices
             </h3>
             <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
               {[
                 { emoji: "📄", text: "Format: PDF preferred. Images in JPG/JPEG only. No Word (.docx), no ZIP files." },
                 { emoji: "⚖️", text: "Size: 200KB max per file for NSP. 500KB for others. Passport photo: max 50KB." },
                 { emoji: "🖼️", text: "Photo: white background, recent (within 6 months), 35×45mm size, under 50KB." },
                 { emoji: "📝", text: "Self-attest every photocopy — sign across the page with your name and date." },
                 { emoji: "📅", text: "Income certificate must be from current financial year (2025-26), Tehsildar-issued." },
               ].map((tip, i) => (
                 <div key={i} style={{ display: "flex", gap: 10, fontSize: 13, color: "var(--brand)", lineHeight: 1.5 }}>
                   <span style={{ flexShrink: 0 }}>{tip.emoji}</span>
                   <span>{tip.text}</span>
                 </div>
               ))}
             </div>
             <div style={{ marginTop: 16, borderTop: "1px solid var(--brand-border)", paddingTop: 14 }}>
               <div style={{ fontSize: 11, fontWeight: 800, color: "var(--brand)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>Free Compression Tools</div>
               <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                 <a href="https://www.ilovepdf.com/compress_pdf" target="_blank" rel="noopener noreferrer" style={{ background: "var(--brand)", color: "#fff", padding: "6px 14px", borderRadius: 100, fontSize: 12, fontWeight: 700, textDecoration: "none" }}>📄 Compress PDF</a>
                 <a href="https://tinypng.com" target="_blank" rel="noopener noreferrer" style={{ background: "var(--brand)", color: "#fff", padding: "6px 14px", borderRadius: 100, fontSize: 12, fontWeight: 700, textDecoration: "none" }}>🖼️ Compress JPG</a>
                 <a href="https://www.ilovepdf.com/jpg_to_pdf" target="_blank" rel="noopener noreferrer" style={{ background: "var(--brand)", color: "#fff", padding: "6px 14px", borderRadius: 100, fontSize: 12, fontWeight: 700, textDecoration: "none" }}>📑 JPG → PDF</a>
               </div>
             </div>
           </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .vault-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
