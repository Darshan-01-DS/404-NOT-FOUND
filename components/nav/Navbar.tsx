"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Sparkles, GraduationCap } from "lucide-react";

const NAV_LINKS = [
  { href: "/home", label: "Home" },
  { href: "/browse", label: "Browse" },
  { href: "/match", label: "AI Match ✦", highlight: true },
  { href: "/applications", label: "My Applications" },
  { href: "/documents", label: "Documents" },
  { href: "/sop", label: "SOP Generator" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* ── Sticky Top Nav ── */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 200,
          background: "#fff",
          borderBottom: "1px solid var(--bdr)",
          height: 62,
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          className="container-site"
          style={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            gap: 0,
          }}
        >
          {/* Logo */}
          <Link href="/home" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            <div
              style={{
                width: 34,
                height: 34,
                background: "var(--brand)",
                borderRadius: 9,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <GraduationCap size={18} color="#fff" strokeWidth={2.2} />
            </div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 800, color: "var(--ink)", letterSpacing: "-.4px", lineHeight: 1.2 }}>
                ScholarArth
              </div>
              <div style={{ fontSize: 10, color: "var(--ink3)", lineHeight: 1 }}>Turning Eligibility into Success</div>
            </div>
          </Link>

          {/* Center Links — desktop */}
          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              flex: 1,
              justifyContent: "center",
            }}
            className="nav-center-links"
          >
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    fontSize: 13.5,
                    fontWeight: 600,
                    padding: "7px 13px",
                    borderRadius: 8,
                    textDecoration: "none",
                    color: isActive ? "var(--brand)" : "var(--ink2)",
                    background: isActive ? "var(--brand-bg)" : "transparent",
                    transition: "all .15s",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      (e.target as HTMLElement).style.background = "var(--bg)";
                      (e.target as HTMLElement).style.color = "var(--ink)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      (e.target as HTMLElement).style.background = "transparent";
                      (e.target as HTMLElement).style.color = "var(--ink2)";
                    }
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }} className="nav-right-actions">
            <Link href="/profile" className="btn btn-ghost btn-sm">
              Profile
            </Link>
            <Link href="/match" className="btn btn-amber btn-sm" style={{ gap: 5 }}>
              <Sparkles size={13} />
              Get Matched
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="mobile-hamburger"
            style={{
              display: "none",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 6,
              marginLeft: "auto",
              color: "var(--ink)",
            }}
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation menu"
          >
            <Menu size={22} />
          </button>
        </div>
      </header>

      {/* ── Mobile Drawer ── */}
      {mobileOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 500,
            display: "flex",
          }}
        >
          {/* Overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(12,15,26,.5)",
            }}
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer */}
          <div
            className="animate-slide-in"
            style={{
              position: "relative",
              width: 280,
              height: "100%",
              background: "#fff",
              display: "flex",
              flexDirection: "column",
              padding: 20,
              gap: 4,
              overflowY: "auto",
            }}
          >
            {/* Drawer Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <div style={{ width: 30, height: 30, background: "var(--brand)", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <GraduationCap size={15} color="#fff" />
                </div>
                <span style={{ fontSize: 16, fontWeight: 800, color: "var(--ink)" }}>ScholarArth</span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "var(--ink3)" }}
                aria-label="Close navigation menu"
              >
                <X size={20} />
              </button>
            </div>

            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    padding: "10px 14px",
                    borderRadius: 8,
                    textDecoration: "none",
                    color: isActive ? "var(--brand)" : "var(--ink2)",
                    background: isActive ? "var(--brand-bg)" : "transparent",
                  }}
                >
                  {link.label}
                </Link>
              );
            })}

            <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
              <Link href="/profile" onClick={() => setMobileOpen(false)} className="btn btn-ghost btn-md btn-fullwidth">Profile</Link>
              <Link href="/match" onClick={() => setMobileOpen(false)} className="btn btn-amber btn-md btn-fullwidth" style={{ gap: 5 }}>
                <Sparkles size={14} /> Get Matched
              </Link>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-center-links { display: none !important; }
          .nav-right-actions { display: none !important; }
          .mobile-hamburger { display: flex !important; }
        }
      `}</style>
    </>
  );
}
