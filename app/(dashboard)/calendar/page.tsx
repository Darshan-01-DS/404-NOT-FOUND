"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Download, Calendar as CalendarIcon, Clock } from "lucide-react";
import { SCHOLARSHIPS } from "@/lib/scholarships";

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date("2026-08-01")); // Default to Aug 2026 for mock data

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const firstDay = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  // Determine deadlines for current month view
  const deadlines = useMemo(() => {
    return SCHOLARSHIPS.filter(s => {
      if (!s.deadline) return false;
      const d = new Date(s.deadline);
      return d.getFullYear() === currentDate.getFullYear() && d.getMonth() === currentDate.getMonth();
    });
  }, [currentDate]);

  function exportICS() {
    let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//ScholarArth//Calendar//EN\n";
    SCHOLARSHIPS.forEach(s => {
       if (!s.deadline) return;
       const d = new Date(s.deadline).toISOString().replace(/-|:|\.\d+/g, "").substring(0, 8);
       icsContent += `BEGIN:VEVENT\nSUMMARY:${s.name} Deadline\nDTSTART;VALUE=DATE:${d}\nDTEND;VALUE=DATE:${d}\nDESCRIPTION:Scholarship provider: ${s.provider}\nEND:VEVENT\n`;
    });
    icsContent += "END:VCALENDAR";

    const blob = new Blob([icsContent], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "scholararth_deadlines.ics";
    a.click();
    URL.revokeObjectURL(url);
  }

  const blanks = Array.from({ length: firstDay }).map((_, i) => <div key={`b-${i}`} className="cal-day empty" />);
  const days = Array.from({ length: daysInMonth }).map((_, i) => {
    const day = i + 1;
    const dayDeadlines = deadlines.filter(d => new Date(d.deadline!).getDate() === day);
    
    return (
      <div key={`d-${day}`} className={`cal-day ${dayDeadlines.length > 0 ? "has-events" : ""}`} style={{ minHeight: 90, padding: 8, border: "1px solid var(--border-light)", background: "var(--bg-surface)", overflow: "hidden" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-muted)", marginBottom: 4 }}>{day}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {dayDeadlines.map(d => (
            <div key={d.id} className="text-truncate" style={{ background: "var(--warning-bg)", color: "var(--warning)", fontSize: 10.5, fontWeight: 800, padding: "4px 6px", borderRadius: "4px", borderLeft: "3px solid var(--warning)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} title={d.name}>
              {d.name}
            </div>
          ))}
        </div>
      </div>
    );
  });

  return (
    <div style={{ padding: "32px 24px" }} className="animate-fade-in-up">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
         <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: 10 }}>
              <CalendarIcon className="text-brand" /> Deadline Calendar
            </h1>
            <p style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 4 }}>Track all upcoming scholarship deadlines visually.</p>
         </div>
         <button onClick={exportICS} className="btn btn-secondary btn-md" style={{ gap: 8 }}>
            <Download size={16} /> Sync to Google Calendar
         </button>
      </div>

      <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-medium)", borderRadius: "var(--radius-xl)", overflow: "hidden", boxShadow: "var(--shadow-sm)" }}>
          {/* Calendar Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", borderBottom: "1px solid var(--border-medium)", background: "var(--bg-sunken)" }}>
              <button onClick={prevMonth} className="btn btn-ghost" style={{ padding: 8 }} aria-label="Previous Month"><ChevronLeft size={20} /></button>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--text-primary)" }}>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
              <button onClick={nextMonth} className="btn btn-ghost" style={{ padding: 8 }} aria-label="Next Month"><ChevronRight size={20} /></button>
          </div>

          {/* Weekday Labels */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", borderBottom: "1px solid var(--border-light)", background: "var(--bg-surface)" }}>
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
              <div key={day} style={{ padding: "12px", textAlign: "center", fontSize: 13, fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase" }}>{day}</div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
            {blanks}
            {days}
          </div>
      </div>
      
      <div style={{ marginTop: 32 }}>
         <h3 style={{ fontSize: 16, fontWeight: 800, color: "var(--text-primary)", marginBottom: 16, display: "flex", gap: 8, alignItems: "center" }}>
           <Clock size={16} className="text-warning" /> Upcoming In Next 30 Days
         </h3>
         <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
           {SCHOLARSHIPS.slice(0, 3).map(s => (
             <div key={s.id} style={{ border: "1px solid var(--border-light)", background: "var(--bg-surface)", padding: 16, borderRadius: "var(--radius-md)" }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>{s.name}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600 }}>{s.provider}</div>
                <div style={{ fontSize: 13, color: "var(--warning)", fontWeight: 800, marginTop: 8 }}>Deadline: {s.deadline}</div>
             </div>
           ))}
         </div>
      </div>
    </div>
  );
}
