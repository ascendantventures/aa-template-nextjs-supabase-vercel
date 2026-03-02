"use client";

import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, info: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary — catches render-time errors in child components.
 * Usage:
 *   <ErrorBoundary fallback={<p>Something went wrong.</p>}>
 *     <YourComponent />
 *   </ErrorBoundary>
 *
 * SCAFFOLD: Wire onError to your error reporting service (Sentry, BetterStack, etc.)
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // SCAFFOLD: Send to error reporting
    // Sentry.captureException(error, { extra: info });
    console.error("[ErrorBoundary]", error, info);
    this.props.onError?.(error, info);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          minHeight: "200px", padding: "40px", textAlign: "center",
        }}>
          <div style={{
            fontSize: "24px", marginBottom: "16px",
          }}>⚠️</div>
          <h2 style={{
            fontSize: "16px", fontWeight: 600, color: "#FAFAFA", marginBottom: "8px",
          }}>
            Something went wrong
          </h2>
          <p style={{ fontSize: "13px", color: "#71717A", marginBottom: "20px", maxWidth: "360px" }}>
            {this.state.error?.message ?? "An unexpected error occurred."}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              padding: "8px 20px", borderRadius: "9999px", fontSize: "13px", fontWeight: 500,
              background: "none", border: "1px solid rgba(255,255,255,0.15)", color: "#A8A8A8", cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
