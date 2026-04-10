"use client";

import { LucideIcon } from "lucide-react";
import React from "react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export default function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "64px 24px",
        background: "var(--bg-sunken)",
        border: "1px dashed var(--border-medium)",
        borderRadius: "var(--radius-xl)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
      }}
    >
      <div 
        style={{ 
          width: 64, height: 64, 
          background: "#fff", 
          borderRadius: "50%", 
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "var(--shadow-sm)",
          marginBottom: 20
        }}
      >
        <Icon size={32} color="var(--text-disabled)" strokeWidth={1.5} />
      </div>
      <h3 style={{ fontSize: 16, fontWeight: 800, color: "var(--text-primary)", marginBottom: 8 }}>
        {title}
      </h3>
      <p style={{ fontSize: 13.5, color: "var(--text-muted)", maxWidth: 360, lineHeight: 1.6, marginBottom: action ? 24 : 0 }}>
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
}
