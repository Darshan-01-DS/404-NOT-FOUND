"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import ScholarshipCard from "@/components/cards/ScholarshipCard";
import { SCHOLARSHIPS } from "@/lib/scholarships";

const COURSE_LEVELS = ["Class 9", "Class 10", "Class 11", "Class 12", "UG", "PG", "PhD", "Diploma"];
const CATEGORIES = ["General", "OBC", "SC", "ST", "EWS", "PwD"];
const GENDERS = ["Any", "Female Only", "Male Only", "Transgender"];
const RELIGIONS = ["Any", "Hindu", "Muslim", "Christian", "Minority"];
const STATES_LIST = [
  "All India","Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh",
  "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala",
  "Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland",
  "Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura",
  "Uttar Pradesh","Uttarakhand","West Bengal","Delhi","Chandigarh",
];
const FIELDS = ["Engineering", "Medical/MBBS", "Commerce/MBA", "Arts/Humanities", "Law", "Pure Sciences"];
const PROVIDER_TYPES = ["Government", "Corporate/NGO", "International", "University"];

interface Filters {
  courseLevels: string[];
  categories: string[];
  genders: string[];
  state: string;
  fields: string[];
  providerTypes: string[];
  minAmount: number;
  maxAmount: number;
}

const DEFAULT_FILTERS: Filters = {
  courseLevels: [], categories: [], genders: [],
  state: "All India", fields: [], providerTypes: [],
  minAmount: 0, maxAmount: 200000,
};

const SORT_OPTIONS = [
  { value: "best", label: "Best Match" },
  { value: "amount_desc", label: "Highest Amount" },
  { value: "deadline_asc", label: "Deadline Soonest" },
  { value: "easy", label: "Easiest Docs" },
];

const PAGE_SIZE = 9;

function CheckRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 500, color: "var(--ink2)", padding: "4px 0", cursor: "pointer" }}>
      <input type="checkbox" checked={checked} onChange={onChange} aria-label={label} />
      {label}
    </label>
  );
}

export default function BrowsePage() {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [sort, setSort] = useState("best");
  const [page, setPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function toggleArr(arr: string[], val: string): string[] {
    return arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];
  }

  const filtered = useMemo(() => {
    let list = [...SCHOLARSHIPS];
    if (filters.courseLevels.length) list = list.filter((s) => s.course_levels.some((cl) => filters.courseLevels.includes(cl)));
    if (filters.categories.length) list = list.filter((s) => s.categories.some((c) => filters.categories.includes(c)));
    if (filters.genders.includes("Female Only")) list = list.filter((s) => s.genders.includes("Female"));
    list = list.filter((s) => s.amount >= filters.minAmount && s.amount <= filters.maxAmount);
    if (filters.providerTypes.length) list = list.filter((s) => {
      const pt = s.provider_type;
      return filters.providerTypes.some((f) => {
        if (f === "Government") return pt === "Government";
        if (f === "Corporate/NGO") return pt === "Corporate" || pt === "NGO";
        if (f === "International") return pt === "International";
        return false;
      });
    });
    if (sort === "amount_desc") list.sort((a, b) => b.amount - a.amount);
    else if (sort === "deadline_asc") list.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
    else if (sort === "easy") list.sort((a, b) => a.documents_required.length - b.documents_required.length);
    return list;
  }, [filters, sort]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function formatAmount(v: number) {
    if (v >= 100000) return `₹${(v / 100000).toFixed(0)}L`;
    if (v >= 1000) return `₹${(v / 1000).toFixed(0)}k`;
    return `₹${v}`;
  }

  const Sidebar = () => (
    <aside style={{ width: 230, flexShrink: 0 }}>
      <div className="card" style={{ padding: 20, position: "sticky", top: 74 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <span style={{ fontSize: 14, fontWeight: 800, color: "var(--ink)" }}>Filters</span>
          <button onClick={() => setFilters(DEFAULT_FILTERS)} className="btn btn-ghost btn-sm" style={{ fontSize: 11.5 }}>Reset</button>
        </div>

        {/* Course Level */}
        <div style={{ paddingBottom: 16, marginBottom: 16, borderBottom: "1px solid var(--bdr)" }}>
          <div style={{ fontSize: 11.5, fontWeight: 800, color: "var(--ink)", textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 10 }}>Course Level</div>
          {COURSE_LEVELS.map((l) => (
            <CheckRow key={l} label={l} checked={filters.courseLevels.includes(l)} onChange={() => setFilters((f) => ({ ...f, courseLevels: toggleArr(f.courseLevels, l) }))} />
          ))}
        </div>

        {/* Category */}
        <div style={{ paddingBottom: 16, marginBottom: 16, borderBottom: "1px solid var(--bdr)" }}>
          <div style={{ fontSize: 11.5, fontWeight: 800, color: "var(--ink)", textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 10 }}>Category</div>
          {CATEGORIES.map((c) => (
            <CheckRow key={c} label={c} checked={filters.categories.includes(c)} onChange={() => setFilters((f) => ({ ...f, categories: toggleArr(f.categories, c) }))} />
          ))}
        </div>

        {/* Gender */}
        <div style={{ paddingBottom: 16, marginBottom: 16, borderBottom: "1px solid var(--bdr)" }}>
          <div style={{ fontSize: 11.5, fontWeight: 800, color: "var(--ink)", textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 10 }}>Gender</div>
          {GENDERS.map((g) => (
            <CheckRow key={g} label={g} checked={filters.genders.includes(g)} onChange={() => setFilters((f) => ({ ...f, genders: toggleArr(f.genders, g) }))} />
          ))}
        </div>

        {/* State */}
        <div style={{ paddingBottom: 16, marginBottom: 16, borderBottom: "1px solid var(--bdr)" }}>
          <div style={{ fontSize: 11.5, fontWeight: 800, color: "var(--ink)", textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 10 }}>State</div>
          <select className="select" style={{ fontSize: 12.5 }} value={filters.state} onChange={(e) => setFilters((f) => ({ ...f, state: e.target.value }))} aria-label="Filter by state">
            {STATES_LIST.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>

        {/* Amount Range */}
        <div style={{ paddingBottom: 16, marginBottom: 16, borderBottom: "1px solid var(--bdr)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={{ fontSize: 11.5, fontWeight: 800, color: "var(--ink)", textTransform: "uppercase", letterSpacing: ".5px" }}>Amount (₹)</div>
            <span style={{ fontSize: 11.5, fontWeight: 700, color: "var(--brand)" }}>{formatAmount(filters.maxAmount)}{filters.maxAmount >= 200000 ? "+" : ""}</span>
          </div>
          <input type="range" min={0} max={200000} step={5000} value={filters.maxAmount}
            onChange={(e) => setFilters((f) => ({ ...f, maxAmount: parseInt(e.target.value) }))}
            aria-label="Maximum scholarship amount"
          />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--ink3)", marginTop: 4 }}>
            <span>₹0</span><span>₹2L+</span>
          </div>
        </div>

        {/* Provider Type */}
        <div>
          <div style={{ fontSize: 11.5, fontWeight: 800, color: "var(--ink)", textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 10 }}>Provider Type</div>
          {PROVIDER_TYPES.map((p) => (
            <CheckRow key={p} label={p} checked={filters.providerTypes.includes(p)} onChange={() => setFilters((f) => ({ ...f, providerTypes: toggleArr(f.providerTypes, p) }))} />
          ))}
        </div>
      </div>
    </aside>
  );

  return (
    <div className="container-site" style={{ padding: "28px 24px" }}>
      <div style={{ display: "flex", gap: 22, alignItems: "flex-start" }}>

        {/* Sidebar */}
        <div className="browse-sidebar"><Sidebar /></div>

        {/* Main */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Top Bar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 800, color: "var(--ink)" }}>Browse Scholarships</h1>
              <div style={{ fontSize: 12.5, color: "var(--ink3)", marginTop: 2 }}>Showing {filtered.length.toLocaleString("en-IN")} results</div>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="btn btn-ghost btn-sm filter-toggle" style={{ gap: 5 }}>
                <SlidersHorizontal size={13} /> Filters
              </button>
              <select className="select" style={{ width: "auto", fontSize: 13 }} value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort scholarships">
                {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>

          {/* Grid */}
          {paginated.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 28 }}>
              {paginated.map((s, i) => (
                <ScholarshipCard key={s.id} scholarship={s} isTopPick={s.is_featured} matchPercent={Math.max(40, 92 - i * 3)} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "80px 20px", background: "#fff", borderRadius: 14, border: "1px solid var(--bdr)" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--ink)", marginBottom: 8 }}>No scholarships found</h2>
              <p style={{ fontSize: 13.5, color: "var(--ink3)", marginBottom: 18 }}>Try adjusting your filters to see more results.</p>
              <button onClick={() => setFilters(DEFAULT_FILTERS)} className="btn btn-primary btn-md">Reset Filters</button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 8 }}>
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="btn btn-ghost btn-sm" aria-label="Previous page">
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pg = page <= 3 ? i + 1 : page - 2 + i;
                if (pg > totalPages) return null;
                return (
                  <button key={pg} onClick={() => setPage(pg)}
                    className={`btn btn-sm ${page === pg ? "btn-primary" : "btn-ghost"}`}
                    aria-label={`Page ${pg}`}
                    aria-current={page === pg ? "page" : undefined}
                  >{pg}</button>
                );
              })}
              {totalPages > 5 && <span style={{ fontSize: 13, color: "var(--ink3)" }}>... {totalPages}</span>}
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="btn btn-ghost btn-sm" aria-label="Next page">
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .filter-toggle { display: none !important; }
        @media (max-width: 1024px) {
          .browse-sidebar { display: none; }
          .filter-toggle { display: flex !important; }
          div[style*="repeat(3, 1fr)"] { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 640px) {
          div[style*="repeat(3, 1fr)"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
