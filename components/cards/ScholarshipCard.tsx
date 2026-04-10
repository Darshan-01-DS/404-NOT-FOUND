"use client";

import Link from "next/link";
import { Calendar, TrendingUp, Bookmark, BookmarkCheck } from "lucide-react";
import { useWatchlist, WatchlistItem } from "@/contexts/WatchlistContext";
import { formatINRFull, getDeadlineInfo } from "@/lib/scholarships";

// Unified ScholarshipRow type used by both lib and API
export interface LiveScholarship {
  id: string;
  name: string;
  provider: string;
  provider_type: string;
  amount: number;
  deadline: string;
  course_levels: string[];
  categories: string[];
  genders: string[];
  states?: string[];
  religions?: string[];
  min_percentage?: number | null;
  description?: string;
  documents_required?: string[];
  apply_url?: string;
  is_featured?: boolean;
  field_tags?: string[];
  emoji?: string;
}

interface ScholarshipCardProps {
  scholarship: LiveScholarship;
  matchPercent?: number;
  isTopPick?: boolean;
  view?: "grid" | "list";
}

const PROVIDER_COLORS: Record<string, string> = {
  Government: "#1B3A6B",
  Corporate: "#E07B39",
  NGO: "#1A7A4A",
  International: "#5B21B6",
  University: "#9D174D",
};

function MatchPill({ percent }: { percent: number }) {
  const color =
    percent >= 80 ? { bg: "#EAF7F0", text: "#145E38" }
    : percent >= 50 ? { bg: "#FEF6EC", text: "#92400E" }
    : { bg: "#FEF0EF", text: "#991B1B" };
  return (
    <span style={{ background: color.bg, color: color.text, fontSize: 11, fontWeight: 800, padding: "3px 8px", borderRadius: 100 }}>
      {percent}% Match
    </span>
  );
}

export default function ScholarshipCard({
  scholarship,
  matchPercent,
  isTopPick = false,
}: ScholarshipCardProps) {
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const inWatchlist = isInWatchlist(scholarship.id);
  const deadlineInfo = getDeadlineInfo(scholarship.deadline);
  const accentColor = PROVIDER_COLORS[scholarship.provider_type ?? ""] ?? "var(--brand)";

  function toggleWatchlist(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (inWatchlist) {
      removeFromWatchlist(scholarship.id);
    } else {
      addToWatchlist(scholarship as WatchlistItem);
    }
  }

  return (
    <article
      aria-label={`${scholarship.name} by ${scholarship.provider}. Amount: ${formatINRFull(scholarship.amount)}. Deadline: ${deadlineInfo.label}`}
      style={{ position: "relative", display: "block" }}
    >
      <Link href={`/scholarship/${scholarship.id}`} style={{ textDecoration: "none", display: "block" }}>
        <div
          className="card card-hover"
          style={{
            padding: 20,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 12,
            borderLeft: `4px solid ${accentColor}`,
            transition: "transform 200ms ease-out, box-shadow 200ms ease-out",
          }}
        >
          {isTopPick && (
            <div style={{
              position: "absolute", top: 0, right: 0,
              background: "var(--accent)", color: "#fff",
              fontSize: 10, fontWeight: 800, padding: "3px 10px",
              borderRadius: "0 var(--radius-lg) 0 8px",
              letterSpacing: ".5px", textTransform: "uppercase",
            }}>
              TOP PICK
            </div>
          )}

          {/* Provider + Name */}
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start", marginTop: isTopPick ? 8 : 0 }}>
            <div style={{
              width: 38, height: 38, background: "var(--bg-sunken)", borderRadius: 10,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, flexShrink: 0, border: "1px solid var(--border-light)",
            }}>
              {scholarship.emoji ?? "🎓"}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", marginBottom: 3, textTransform: "uppercase", letterSpacing: 0.3 }}>
                {scholarship.provider}
              </div>
              <div style={{ fontSize: 14.5, fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.35 }}>
                {scholarship.name}
              </div>
            </div>
          </div>

          {/* Pills */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {scholarship.course_levels.slice(0, 2).map((l) => (
              <span key={l} className="pill pill-blue">{l}</span>
            ))}
            {scholarship.categories.length < 5 && scholarship.categories.slice(0, 2).map((c) => (
              <span key={c} className="pill pill-violet">{c}</span>
            ))}
            {scholarship.genders.includes("Female") && (
              <span className="pill pill-saffron">Girls Only</span>
            )}
            {deadlineInfo.isOpen && (
              <span className="pill pill-green">Open Now</span>
            )}
          </div>

          {/* Amount */}
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-.5px" }}>
              {formatINRFull(scholarship.amount)}
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
              per annum · Direct bank transfer
            </div>
          </div>

          {/* Footer */}
          <div style={{ borderTop: "1px solid var(--border-light)", paddingTop: 12, marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
            <div className={`pill ${deadlineInfo.pillClass}`} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <Calendar size={11} />
              {deadlineInfo.label}
            </div>
            {matchPercent !== undefined ? (
              <MatchPill percent={matchPercent} />
            ) : (
              scholarship.min_percentage != null && (
                <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11.5, color: "var(--text-muted)", fontWeight: 600 }}>
                  <TrendingUp size={12} />
                  {scholarship.min_percentage}% min
                </span>
              )
            )}
          </div>
        </div>
      </Link>

      {/* Watchlist button — ALWAYS visible, connected to global context */}
      <button
        onClick={toggleWatchlist}
        aria-label={inWatchlist ? `Remove ${scholarship.name} from watchlist` : `Add ${scholarship.name} to watchlist`}
        title={inWatchlist ? "Remove from watchlist" : "Save to watchlist"}
        style={{
          position: "absolute",
          top: 12,
          right: 12,
          background: inWatchlist ? "var(--brand)" : "rgba(255,255,255,0.9)",
          border: `1px solid ${inWatchlist ? "var(--brand)" : "var(--border-light)"}`,
          cursor: "pointer",
          color: inWatchlist ? "#fff" : "var(--text-muted)",
          padding: 6,
          borderRadius: 8,
          transition: "all .15s",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "var(--shadow-xs)",
          zIndex: 2,
        }}
        onMouseEnter={(e) => { if (!inWatchlist) { (e.currentTarget as HTMLElement).style.color = "var(--brand)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--brand)"; } }}
        onMouseLeave={(e) => { if (!inWatchlist) { (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--border-light)"; } }}
      >
        {inWatchlist ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
      </button>
    </article>
  );
}
