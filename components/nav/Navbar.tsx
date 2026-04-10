"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Sparkles, GraduationCap, Home, Search, FileText, FolderOpen, User, Bookmark } from "lucide-react";
import KeepInMindPanel from "@/components/nav/KeepInMindPanel";
import { useWatchlist } from "@/contexts/WatchlistContext";

const NAV_LINKS = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/browse", label: "Browse", icon: Search },
  { href: "/match", label: "AI Match", icon: Sparkles, highlight: true },
  { href: "/applications", label: "My Applications", icon: FileText },
  { href: "/documents", label: "Documents", icon: FolderOpen },
  { href: "/sop", label: "SOP Generator", icon: null },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { count: watchlistCount, watchlist, removeFromWatchlist } = useWatchlist();
  const [watchlistOpen, setWatchlistOpen] = useState(false);

  return (
    <>
      {/* ── Sticky Top Nav ── */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: "var(--z-sticky)" as any,
          background: "rgba(255,255,255,0.95)",
          borderBottom: "1px solid var(--border-light)",
          height: 64,
          display: "flex",
          alignItems: "center",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
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
          <Link
            href="/home"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                background: "linear-gradient(135deg, var(--brand) 0%, var(--brand-mid) 100%)",
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                boxShadow: "0 2px 8px rgba(27,58,107,0.25)",
              }}
            >
              <GraduationCap size={20} color="#fff" strokeWidth={2.2} />
            </div>
            <div>
              <div
                style={{
                  fontSize: 17,
                  fontWeight: 800,
                  color: "var(--text-primary)",
                  letterSpacing: "-.5px",
                  lineHeight: 1.2,
                }}
              >
                ScholarArth
              </div>
              <div style={{ fontSize: 10, color: "var(--text-muted)", lineHeight: 1 }}>
                Turning Eligibility into Success
              </div>
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
              const isActive =
                pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`nav-link${isActive ? " active" : ""}`}
                  style={
                    link.highlight && !isActive
                      ? {
                          color: "var(--accent)",
                          fontWeight: 700,
                        }
                      : {}
                  }
                >
                  {link.highlight && (
                    <Sparkles
                      size={12}
                      style={{
                        display: "inline",
                        verticalAlign: "middle",
                        marginRight: 4,
                        marginTop: -2,
                      }}
                    />
                  )}
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div
            style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}
            className="nav-right-actions"
          >
            <KeepInMindPanel />

            {/* Watchlist Badge */}
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setWatchlistOpen(true)}
                className="btn btn-ghost btn-sm"
                style={{ gap: 6, position: "relative" }}
                aria-label="View watchlist"
              >
                <Bookmark size={14} />
                Watchlist
                {watchlistCount > 0 && (
                  <span style={{
                    position: "absolute", top: -6, right: -6,
                    background: "var(--danger)", color: "#fff",
                    borderRadius: "50%", width: 18, height: 18,
                    fontSize: 10, fontWeight: 800,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    border: "2px solid var(--bg-surface)",
                  }}>
                    {watchlistCount}
                  </span>
                )}
              </button>
            </div>

            <Link href="/profile" className="btn btn-ghost btn-sm">
              <User size={13} />
              Profile
            </Link>
            <Link href="/match" className="btn btn-primary btn-sm" style={{ gap: 5 }}>
              <Sparkles size={13} />
              Get Matched
            </Link>
          </div>

          {/* Mobile Hamburger — 44×44 touch target */}
          <button
            className="mobile-hamburger"
            style={{
              display: "none",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 10,
              marginLeft: "auto",
              color: "var(--text-primary)",
              minWidth: 44,
              minHeight: 44,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 8,
            }}
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={mobileOpen}
          >
            <Menu size={22} />
          </button>
        </div>
      </header>

      {/* ── Mobile Drawer — slides from LEFT ── */}
      {mobileOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 500,
            display: "flex",
          }}
        >
          {/* Backdrop */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(13,27,42,0.5)",
              backdropFilter: "blur(2px)",
            }}
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation"
          />

          {/* Drawer — slides from LEFT */}
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
              boxShadow: "4px 0 24px rgba(13,27,42,0.12)",
            }}
          >
            {/* Drawer Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 20,
                paddingBottom: 16,
                borderBottom: "1px solid var(--border-light)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    background: "linear-gradient(135deg, var(--brand) 0%, var(--brand-mid) 100%)",
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <GraduationCap size={16} color="#fff" />
                </div>
                <span
                  style={{ fontSize: 16, fontWeight: 800, color: "var(--text-primary)" }}
                >
                  ScholarArth
                </span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 8,
                  color: "var(--text-muted)",
                  minWidth: 44,
                  minHeight: 44,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 8,
                }}
                aria-label="Close navigation menu"
              >
                <X size={20} />
              </button>
            </div>

            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    padding: "12px 14px",
                    borderRadius: 10,
                    textDecoration: "none",
                    color: isActive
                      ? "var(--brand)"
                      : link.highlight
                      ? "var(--accent)"
                      : "var(--text-secondary)",
                    background: isActive ? "var(--brand-light)" : "transparent",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  {Icon && <Icon size={16} />}
                  {link.label}
                </Link>
              );
            })}

            <div
              style={{
                marginTop: "auto",
                display: "flex",
                flexDirection: "column",
                gap: 8,
                paddingTop: 16,
                borderTop: "1px solid var(--border-light)",
              }}
            >
              <Link
                href="/profile"
                onClick={() => setMobileOpen(false)}
                className="btn btn-ghost btn-md btn-fullwidth"
                style={{ gap: 8 }}
              >
                <User size={15} />
                Profile
              </Link>
              <Link
                href="/match"
                onClick={() => setMobileOpen(false)}
                className="btn btn-primary btn-md btn-fullwidth"
                style={{ gap: 6 }}
              >
                <Sparkles size={14} />
                Get AI Matched
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ── Watchlist Drawer ── */}
      {watchlistOpen && (
        <div onClick={() => setWatchlistOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(13,27,42,0.45)", zIndex: 1000, backdropFilter: "blur(2px)" }} />
      )}
      <div style={{
        position: "fixed", top: 0, right: 0, width: "min(400px, 95vw)",
        height: "100vh", background: "var(--bg-surface)",
        boxShadow: "-8px 0 32px rgba(13,27,42,0.15)",
        zIndex: 1001, display: "flex", flexDirection: "column",
        transform: watchlistOpen ? "translateX(0)" : "translateX(100%)",
        transition: "transform .35s cubic-bezier(0.16,1,0.3,1)",
      }}>
        <div style={{ background: "var(--brand)", padding: "20px 24px", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
          <Bookmark size={20} color="#fff" />
          <div style={{ flex: 1, color: "#fff" }}>
            <div style={{ fontSize: 16, fontWeight: 800 }}>Watchlist</div>
            <div style={{ fontSize: 12, opacity: 0.8 }}>{watchlistCount} scholarship{watchlistCount !== 1 ? "s" : ""} saved</div>
          </div>
          <button onClick={() => setWatchlistOpen(false)} style={{ background: "rgba(255,255,255,0.15)", border: "none", cursor: "pointer", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
          {watchlistCount === 0 ? (
            <div style={{ textAlign: "center", padding: "64px 24px" }}>
              <Bookmark size={48} color="var(--border-medium)" style={{ margin: "0 auto 16px" }} />
              <div style={{ fontSize: 16, fontWeight: 800, color: "var(--text-primary)", marginBottom: 8 }}>No scholarships saved</div>
              <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6 }}>Browse scholarships and click the bookmark icon to save them for later.</p>
              <Link href="/browse" className="btn btn-primary" style={{ marginTop: 20 }} onClick={() => setWatchlistOpen(false)}>Browse Scholarships</Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {watchlist.map((s) => (
                <div key={s.id} style={{ background: "var(--bg-surface)", border: "1px solid var(--border-light)", borderRadius: "var(--radius-md)", padding: 16 }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 12 }}>
                    <div style={{ width: 40, height: 40, background: "var(--bg-sunken)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{s.emoji}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.3, marginBottom: 2 }}>{s.name}</div>
                      <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{s.provider}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <Link href={`/scholarship/${s.id}`} className="btn btn-secondary btn-sm" style={{ flex: 1, justifyContent: "center" }} onClick={() => setWatchlistOpen(false)}>View Details</Link>
                    <button onClick={() => removeFromWatchlist(s.id)} className="btn btn-ghost btn-sm" style={{ color: "var(--danger)", padding: "0 12px" }} aria-label="Remove from watchlist">✕</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

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
