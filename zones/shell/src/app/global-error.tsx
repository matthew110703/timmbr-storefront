"use client";

import { strings } from "./strings";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          backgroundColor: "#0a0c10",
          color: "#f8fafc",
          fontFamily: "sans-serif",
          padding: "4rem 2rem",
          textAlign: "center",
        }}
      >
        <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
          {strings.globalError.title}
        </h2>
        <p style={{ color: "#94a3b8", marginBottom: "2rem" }}>
          {error.message || strings.globalError.fallbackMessage}
        </p>
        <button
          onClick={() => reset()}
          style={{
            padding: "0.75rem 1.5rem",
            borderRadius: "8px",
            backgroundColor: "#38bdf8",
            color: "#0a0c10",
            fontWeight: "bold",
            border: "none",
            cursor: "pointer",
          }}
        >
          {strings.globalError.retryButton}
        </button>
      </body>
    </html>
  );
}
