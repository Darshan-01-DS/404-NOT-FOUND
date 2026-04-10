"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { SlidersHorizontal, X, Search, ChevronDown, ChevronUp, RefreshCw, ChevronLeft, ChevronRight, Wifi, WifiOff } from "lucide-react";
import ScholarshipCard, { LiveScholarship } from "@/components/cards/ScholarshipCard";
import { SCHOLARSHIPS } from "@/lib/scholarships";

const COURSE_LEVELS = ["Class 9-12", "Class 11", "Class 12", "UG", "PG", "PhD", "Diploma"];
const CATEGORIES = ["General", "OBC", "SC", "ST", "EWS", "PwD"];
const GENDERS = ["Any", "Female Only"];
const PROVIDER_TYPES = ["Government", "Corporate", "NGO", "International"];

const SORT_OPTIONS = [
  { value: "best", label: "Best Match First" },
  { value: "amount_desc", label: "Highest Amount" },
  { value: "deadline_asc", label: "Deadline Soonest" },
  { value: "featured", label: "Featured First" },
];

const PAGE_SIZE = 9;

interface Filters {
  courseLevels: string[];
  categories: string[];
  genders: string[];
  providerTypes: string[];
  search: string;
}

const DEFAULT_FILTERS: Filters = {
  courseLevels: [],
  categories: [],
  genders: [],
  providerTypes: [],
  search: "",
};

function CheckRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13.5, fontWeight: 600, color: checked ? "var(--brand)" : "var(--text-secondary)", padding: "6px 0", cursor: "pointer" }}>
      <input type="checkbox" checked={checked} onChange={onChange} aria-label={label} style={{ accentColor: "var(--brand)", width: 16, height: 16 }} />
      {label}
    </label>
  );
}

function AccordionSection({ title, defaultOpen = false, children, count = 0 }: { title: string; defaultOpen?: boolean; children: React.ReactNode; count?: number }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ borderBottom: "1px solid var(--border-light)", padding: "12px 0" }}>
      <button onClick={() => setOpen(!open)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", background: "none", border: "none", cursor: "pointer", padding: "4px 0", fontFamily: "inherit" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", display: "flex", gap: 6, alignItems: "center" }}>
          {title} {count > 0 && <span style={{ background: "var(--brand)", color: "#fff", padding: "1px 6px", borderRadius: 100, fontSize: 10 }}>{count}</span>}
        </div>
        {open ? <ChevronUp size={16} color="var(--text-muted)" /> : <ChevronDown size={16} color="var(--text-muted)" />}
      </button>
      {open && <div style={{ paddingTop: 12, paddingBottom: 4 }}>{children}</div>}
    </div>
  );
}

// Convert hardcoded lib data to LiveScholarship format as fallback
const FALLBACK: LiveScholarship[] = SCHOLARSHIPS.map((s) => ({
  ...s,
  min_percentage: s.min_percentage ?? null,
}));

export default function BrowsePage() {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [sort, setSort] = useState("best");
  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Live data state
  const [allScholarships, setAllScholarships] = useState<LiveScholarship[]>(FALLBACK);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const searchDebounce = useRef<NodeJS.Timeout | null>(null);

  // Fetch scholarships from Supabase API
  async function fetchScholarships() {
    setLoading(true);
    try {
      const res = await fetch("/api/scholarships?limit=200");
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      if (data.scholarships && data.scholarships.length > 0) {
        setAllScholarships(data.scholarships);
        setIsLive(true);
        setLastUpdated(new Date());
      }
    } catch (err) {
      console.error("Using fallback scholarship data:", err);
      setAllScholarships(FALLBACK);
      setIsLive(false);
    } finally {
      setLoading(false);
    }
  }

  // Trigger Firecrawl sync then refresh
  async function triggerSync() {
    setSyncing(true);
    try {
      const res = await fetch("/api/scholarships/sync", { method: "POST" });
      const data = await res.json();
      console.log("Sync result:", data);
      await fetchScholarships(); // Refresh after sync
    } catch (err) {
      console.error("Sync error:", err);
    } finally {
      setSyncing(false);
    }
  }

  useEffect(() => {
    fetchScholarships();
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchScholarships, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleArr = useCallback((arr: string[], val: string): string[] =>
    arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val],
    []
  );

  // Client-side filtering
  const filtered = useMemo(() => {
    let list = [...allScholarships];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (s) => s.name?.toLowerCase().includes(q) || s.provider?.toLowerCase().includes(q) || s.description?.toLowerCase().includes(q)
      );
    }
    if (filters.courseLevels.length) {
      list = list.filter((s) => s.course_levels?.some((cl) => filters.courseLevels.some(f => cl.includes(f) || f.includes(cl))));
    }
    if (filters.categories.length) {
      list = list.filter((s) => s.categories?.some((c) => filters.categories.includes(c)) || s.categories?.includes("General"));
    }
    if (filters.genders.includes("Female Only")) {
      list = list.filter((s) => s.genders?.includes("Female") || s.genders?.includes("Any"));
    }
    if (filters.providerTypes.length) {
      list = list.filter((s) => filters.providerTypes.includes(s.provider_type));
    }

    // Sort
    list.sort((a, b) => {
      if (sort === "amount_desc") return (b.amount ?? 0) - (a.amount ?? 0);
      if (sort === "deadline_asc") return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      if (sort === "featured") return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0);
      // "best" = featured first, then by amount
      const featScore = (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0);
      return featScore !== 0 ? featScore : (b.amount ?? 0) - (a.amount ?? 0);
    });

    return list;
  }, [allScholarships, filters, sort]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const activeFilterCount = filters.courseLevels.length + filters.categories.length + filters.genders.length + filters.providerTypes.length + (filters.search ? 1 : 0);

  const FilterPanel = () => (
    <aside style={{ background: "var(--bg-surface)", border: "1px solid var(--border-light)", borderRadius: "var(--radius-xl)", padding: "20px 20px 12px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <h2 style={{ fontSize: 15, fontWeight: 800, color: "var(--text-primary)" }}>Filters</h2>
        {activeFilterCount > 0 && (
          <button onClick={() => { setFilters(DEFAULT_FILTERS); setPage(1); }} className="btn btn-ghost btn-sm" style={{ fontSize: 12 }}>
            <X size={12} /> Clear all ({activeFilterCount})
          </button>
        )}
      </div>

      <AccordionSection title="Course Level" defaultOpen count={filters.courseLevels.length}>
        {COURSE_LEVELS.map((l) => <CheckRow key={l} label={l} checked={filters.courseLevels.includes(l)} onChange={() => { setFilters(f => ({ ...f, courseLevels: toggleArr(f.courseLevels, l) })); setPage(1); }} />)}
      </AccordionSection>

      <AccordionSection title="Category" defaultOpen count={filters.categories.length}>
        {CATEGORIES.map((c) => <CheckRow key={c} label={c} checked={filters.categories.includes(c)} onChange={() => { setFilters(f => ({ ...f, categories: toggleArr(f.categories, c) })); setPage(1); }} />)}
      </AccordionSection>

      <AccordionSection title="Gender" count={filters.genders.length}>
        {GENDERS.map((g) => <CheckRow key={g} label={g} checked={filters.genders.includes(g)} onChange={() => { setFilters(f => ({ ...f, genders: toggleArr(f.genders, g) })); setPage(1); }} />)}
      </AccordionSection>

      <AccordionSection title="Provider Type" count={filters.providerTypes.length}>
        {PROVIDER_TYPES.map((p) => <CheckRow key={p} label={p} checked={filters.providerTypes.includes(p)} onChange={() => { setFilters(f => ({ ...f, providerTypes: toggleArr(f.providerTypes, p) })); setPage(1); }} />)}
      </AccordionSection>
    </aside>
  );

  return (
    <div style={{ padding: "24px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.5px", marginBottom: 4 }}>
            Browse Scholarships
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
            {isLive ? (
              <span style={{ display: "flex", alignItems: "center", gap: 5, color: "var(--success)", fontWeight: 700 }}>
                <Wifi size={13} /> Live from database
                {lastUpdated && <span style={{ color: "var(--text-muted)", fontWeight: 500 }}>· Updated {lastUpdated.toLocaleTimeString()}</span>}
              </span>
            ) : (
              <span style={{ display: "flex", alignItems: "center", gap: 5, color: "var(--text-muted)" }}>
                <WifiOff size={13} /> Using cached data
              </span>
            )}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          {/* Sync button */}
          <button
            onClick={triggerSync}
            disabled={syncing}
            className="btn btn-secondary btn-sm"
            style={{ gap: 6 }}
            title="Fetch latest scholarships from the web using Firecrawl"
          >
            <RefreshCw size={13} className={syncing ? "animate-spin-slow" : ""} />
            {syncing ? "Syncing..." : "Sync Live Data"}
          </button>

          {/* Sort dropdown */}
          <select
            className="input"
            style={{ width: "auto", padding: "8px 12px", fontSize: 13 }}
            value={sort}
            onChange={(e) => { setSort(e.target.value); setPage(1); }}
          >
            {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>

          {/* Mobile filter toggle */}
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setMobileFiltersOpen(true)}
            style={{ display: "none", gap: 6 }}
            id="mobile-filter-btn"
          >
            <SlidersHorizontal size={14} /> Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </button>
        </div>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 20, position: "relative" }}>
        <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
        <input
          className="input"
          type="search"
          placeholder="Search by name, provider, scholarship type..."
          style={{ paddingLeft: 36 }}
          value={filters.search}
          onChange={(e) => {
            const val = e.target.value;
            if (searchDebounce.current) clearTimeout(searchDebounce.current);
            searchDebounce.current = setTimeout(() => {
              setFilters(f => ({ ...f, search: val }));
              setPage(1);
            }, 200);
          }}
          defaultValue={filters.search}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 24 }} className="browse-grid">
        {/* Filters Sidebar — desktop */}
        <div className="browse-filter-sidebar">
          <FilterPanel />
        </div>

        {/* Results */}
        <div>
          {/* Result count */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
              {loading ? "Loading scholarships..." : `Showing ${paginated.length} of ${filtered.length} scholarships`}
            </p>
            {loading && <RefreshCw size={14} color="var(--brand)" className="animate-spin-slow" />}
          </div>

          {loading ? (
            // Skeleton loading
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
              {[...Array(6)].map((_, i) => (
                <div key={i} style={{ background: "var(--bg-surface)", borderRadius: "var(--radius-lg)", padding: 20, height: 220, border: "1px solid var(--border-light)" }}>
                  <div style={{ height: 12, background: "var(--border-light)", borderRadius: 6, marginBottom: 12, width: "60%" }} className="skeleton-pulse" />
                  <div style={{ height: 16, background: "var(--border-light)", borderRadius: 6, marginBottom: 8, width: "90%" }} className="skeleton-pulse" />
                  <div style={{ height: 12, background: "var(--border-light)", borderRadius: 6, marginBottom: 20, width: "40%" }} className="skeleton-pulse" />
                  <div style={{ height: 24, background: "var(--border-light)", borderRadius: 6, width: "50%" }} className="skeleton-pulse" />
                </div>
              ))}
            </div>
          ) : filtered.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20, marginBottom: 32 }}>
              {paginated.map((s) => (
                <ScholarshipCard key={s.id} scholarship={s} isTopPick={s.is_featured} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "64px 20px", background: "var(--bg-surface)", borderRadius: "var(--radius-xl)", border: "1px dashed var(--border-medium)" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: "var(--text-primary)", marginBottom: 8 }}>No scholarships found</h3>
              <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 20 }}>Try clearing some filters or broadening your search.</p>
              <button className="btn btn-secondary" onClick={() => { setFilters(DEFAULT_FILTERS); setPage(1); }}>Clear all filters</button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center", marginTop: 8 }}>
              <button className="btn btn-secondary btn-sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                const pg = i + Math.max(1, page - 3);
                if (pg > totalPages) return null;
                return (
                  <button key={pg} className={`btn btn-sm ${pg === page ? "btn-primary" : "btn-ghost"}`} onClick={() => setPage(pg)} style={{ minWidth: 36 }}>
                    {pg}
                  </button>
                );
              })}
              <button className="btn btn-secondary btn-sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {mobileFiltersOpen && (
        <>
          <div onClick={() => setMobileFiltersOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(13,27,42,0.5)", zIndex: 500 }} />
          <div style={{ position: "fixed", left: 0, top: 0, width: "min(320px, 90vw)", height: "100vh", background: "var(--bg-surface)", zIndex: 501, overflowY: "auto", padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <h2 style={{ fontSize: 16, fontWeight: 800 }}>Filters</h2>
              <button onClick={() => setMobileFiltersOpen(false)} className="btn btn-ghost btn-sm"><X size={16} /></button>
            </div>
            <FilterPanel />
          </div>
        </>
      )}

      <style>{`
        @keyframes skeleton-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .skeleton-pulse { animation: skeleton-pulse 1.5s ease-in-out infinite; }
        @media (max-width: 900px) {
          .browse-grid { grid-template-columns: 1fr !important; }
          .browse-filter-sidebar { display: none !important; }
          #mobile-filter-btn { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
