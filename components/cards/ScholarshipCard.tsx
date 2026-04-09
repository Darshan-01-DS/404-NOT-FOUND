"use client";

import Link from "next/link";
import { Calendar, TrendingUp } from "lucide-react";
import { ScholarshipRow, formatINRFull, formatDeadline, daysUntil } from "@/lib/scholarships";

interface ScholarshipCardProps {
  scholarship: ScholarshipRow;
  matchPercent?: number;
  isTopPick?: boolean;
  view?: "grid" | "list";
}

function MatchPill({ percent }: { percent: number }) {
  const color =
    percent >= 80
      ? { bg: "var(--emerald-bg)", text: "#065F46" }
      : percent >= 50
      ? { bg: "var(--amber-bg)", text: "#92400E" }
      : { bg: "var(--rose-bg)", text: "#991B1B" };
  return (
    <span
      style={{
        background: color.bg,
        color: color.text,
        fontSize: 11,
        fontWeight: 800,
        padding: "3px 8px",
        borderRadius: 100,
      }}
    >
      {percent}% Match
    </span>
  );
}

export default function ScholarshipCard({
  scholarship,
  matchPercent,
  isTopPick = false,
  view = "grid",
}: ScholarshipCardProps) {
  const days = daysUntil(scholarship.deadline);
  const deadlineLabel =
    days < 0
      ? "Deadline passed"
      : days === 0
      ? "Closes today!"
      : days <= 7
      ? `${days}d left`
      : formatDeadline(scholarship.deadline);
  const deadlineColor = days < 0 ? "var(--rose)" : days <= 7 ? "var(--amber)" : "var(--ink2)";

  return (
    <Link
      href={`/scholarship/${scholarship.id}`}
      style={{ textDecoration: "none", display: "block", position: "relative" }}
    >
      <div
        className="card card-hover"
        style={{
          padding: 20,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {/* TOP PICK Ribbon */}
        {isTopPick && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              background: "var(--brand)",
              color: "#fff",
              fontSize: 10,
              fontWeight: 800,
              padding: "3px 10px",
              borderRadius: "0 0 8px 0",
              letterSpacing: ".3px",
            }}
          >
            TOP PICK
          </div>
        )}

        {/* Top Row: Logo + Provider + Name */}
        <div style={{ display: "flex", gap: 10, alignItems: "flex-start", marginTop: isTopPick ? 8 : 0 }}>
          <div
            style={{
              width: 36,
              height: 36,
              background: "var(--brand-bg)",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              flexShrink: 0,
            }}
          >
            {scholarship.emoji}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11.5, fontWeight: 600, color: "var(--ink3)", marginBottom: 2 }}>
              {scholarship.provider}
            </div>
            <div
              style={{
                fontSize: 14.5,
                fontWeight: 700,
                color: "var(--ink)",
                lineHeight: 1.35,
              }}
            >
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
          <span className="pill pill-green">Open Now</span>
        </div>

        {/* Amount */}
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "var(--ink)", letterSpacing: "-.5px" }}>
            {formatINRFull(scholarship.amount)}
          </div>
          <div style={{ fontSize: 11, color: "var(--ink3)", marginTop: 2 }}>
            per annum · Direct transfer
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            borderTop: "1px solid var(--bdr)",
            paddingTop: 12,
            marginTop: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 8,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, color: deadlineColor }}>
            <Calendar size={13} />
            {deadlineLabel}
          </div>
          {matchPercent !== undefined ? (
            <MatchPill percent={matchPercent} />
          ) : (
            scholarship.min_percentage && (
              <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11.5, color: "var(--ink3)", fontWeight: 600 }}>
                <TrendingUp size={12} />
                {scholarship.min_percentage}% min
              </span>
            )
          )}
        </div>
      </div>
    </Link>
  );
}
