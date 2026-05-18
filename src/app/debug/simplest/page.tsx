"use client";

import { useState } from "react";

export default function DebugSimplestPage() {
  const [count, setCount] = useState(0);
  return (
    <main style={{ padding: 20, fontFamily: "system-ui", minHeight: "100vh" }}>
      <h1 style={{ fontSize: 24, marginBottom: 16 }}>
        /debug/simplest — bare button test
      </h1>
      <p style={{ marginBottom: 12 }}>
        Count: <strong>{count}</strong>
      </p>
      <button
        type="button"
        onClick={() => setCount((c) => c + 1)}
        style={{
          padding: "16px 24px",
          background: "#1a3d1a",
          color: "white",
          fontSize: 18,
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
        }}
      >
        Tap me
      </button>
      <p style={{ marginTop: 24, fontSize: 14, color: "#666" }}>
        No Tailwind, no imports beyond React, no fancy components. If this
        button doesn&apos;t increment on tap, the issue is environmental
        (browser config, service worker, touch emulation setting). If it does
        increment but /debug/lineup-card&apos;s buttons don&apos;t, the issue
        is in the LineupCard primitive or the page&apos;s use of it.
      </p>
    </main>
  );
}
