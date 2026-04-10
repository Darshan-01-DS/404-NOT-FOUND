"use client";

import React, { Component, ReactNode, ErrorInfo } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div style={{
          padding: "40px 20px",
          textAlign: "center",
          background: "var(--danger-bg)",
          border: "1px solid var(--danger-border)",
          borderRadius: "var(--radius-lg)",
          color: "var(--danger)",
          margin: "20px 0"
        }}>
          <AlertTriangle size={32} style={{ margin: "0 auto 16px" }} />
          <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 8 }}>Something went wrong</h3>
          <p style={{ fontSize: 13, opacity: 0.8, marginBottom: 20 }}>
            {this.state.error?.message || "An unexpected error occurred loading this section."}
          </p>
          <button 
            onClick={() => this.setState({ hasError: false, error: null })}
            className="btn btn-ghost btn-sm"
            style={{ 
              borderColor: "var(--danger-border)", 
              color: "var(--danger)",
              background: "#fff"
            }}
          >
            <RefreshCw size={14} /> Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
