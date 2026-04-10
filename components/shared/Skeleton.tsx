"use client";

import { usePathname } from "next/navigation";

interface SkeletonProps {
  type: "card" | "text" | "title" | "profile" | "stat";
  count?: number;
  className?: string;
}

export default function Skeleton({ type, count = 1, className = "" }: SkeletonProps) {
  const items = Array.from({ length: count }, (_, i) => i);

  if (type === "card") {
    return (
      <>
        {items.map((i) => (
          <div key={i} className={`card ${className}`} style={{ padding: 20 }}>
            {/* Header row */}
            <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
              <div className="skeleton" style={{ width: 44, height: 44, borderRadius: 10, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div className="skeleton skeleton-text" style={{ width: "30%", marginBottom: 8 }} />
                <div className="skeleton skeleton-title" style={{ width: "85%" }} />
              </div>
            </div>
            {/* Pills */}
            <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
              <div className="skeleton skeleton-text" style={{ width: 60, borderRadius: 100 }} />
              <div className="skeleton skeleton-text" style={{ width: 80, borderRadius: 100 }} />
              <div className="skeleton skeleton-text" style={{ width: 70, borderRadius: 100 }} />
            </div>
            {/* Amount */}
            <div className="skeleton skeleton-title" style={{ width: 120, height: 28, marginBottom: 16 }} />
            {/* Footer */}
            <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid var(--border-light)", paddingTop: 16, marginTop: "auto" }}>
              <div className="skeleton skeleton-text" style={{ width: 90 }} />
              <div className="skeleton skeleton-text" style={{ width: 60 }} />
            </div>
          </div>
        ))}
      </>
    );
  }

  if (type === "stat") {
    return (
      <>
        {items.map((i) => (
          <div key={i} className={`card ${className}`} style={{ padding: "24px 0", textAlign: "center" }}>
            <div className="skeleton skeleton-title" style={{ width: 60, height: 32, margin: "0 auto 8px" }} />
            <div className="skeleton skeleton-text" style={{ width: 80, margin: "0 auto" }} />
          </div>
        ))}
      </>
    );
  }

  if (type === "profile") {
    return (
      <div className={`card ${className}`} style={{ padding: 24, display: "flex", gap: 16, alignItems: "center" }}>
        <div className="skeleton skeleton-avatar" style={{ width: 64, height: 64 }} />
        <div style={{ flex: 1 }}>
          <div className="skeleton skeleton-title" style={{ width: 150, marginBottom: 8 }} />
          <div className="skeleton skeleton-text" style={{ width: 200 }} />
        </div>
      </div>
    );
  }

  // default text/title
  return (
    <>
      {items.map((i) => (
        <div
          key={i}
          className={`skeleton ${type === "title" ? "skeleton-title" : "skeleton-text"} ${className}`}
          style={{ marginBottom: i < items.length - 1 ? 8 : 0 }}
        />
      ))}
    </>
  );
}
