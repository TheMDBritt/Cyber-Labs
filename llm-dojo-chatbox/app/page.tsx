"use client";

import { FormEvent, useMemo, useState } from "react";
import { ChatMessage, ChatResponse, DefenseToggles, SecurityMode, Telemetry } from "../types";

const defaultTelemetry: Telemetry = {
  injection_detected: false,
  jailbreak_detected: false,
  tool_call_attempted: false,
  secret_exposure_attempted: false,
  blocked_by: "",
  risk_score: 0,
  event_log: []
};

const makeDefaultDefenses = (mode: SecurityMode): DefenseToggles => {
  const on = mode === "defense";
  return {
    instruction_hierarchy_enforced: on,
    prompt_injection_filter: on,
    tool_allowlist_enabled: on,
    tool_argument_validation: on,
    output_secret_redaction: on,
    rate_limit_simulation: on
  };
};

export default function Home() {
  const [mode, setMode] = useState<SecurityMode>("attack");
  const [defenses, setDefenses] = useState<DefenseToggles>(makeDefaultDefenses("attack"));
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [telemetry, setTelemetry] = useState<Telemetry>(defaultTelemetry);
  const [sessionId] = useState(() => crypto.randomUUID());
  const [error, setError] = useState("");

  const toggleEntries = useMemo(() => Object.entries(defenses) as [keyof DefenseToggles, boolean][], [defenses]);

  const send = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: input.trim(),
      timestamp: new Date().toISOString()
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      setError("");
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          userMessage: input.trim(),
          mode,
          defenses
        })
      });

      const data = (await res.json()) as ChatResponse | { error: string };
      if (!res.ok || "error" in data) {
        throw new Error("error" in data ? data.error : "Request failed");
      }

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.assistantMessage,
        timestamp: new Date().toISOString()
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setTelemetry(data.telemetry);
    } catch {
      setError("Sandbox error: unable to process this turn safely.");
    } finally {
      setInput("");
    }
  };

  const resetSandbox = async () => {
    try {
      setError("");
      await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          userMessage: "reset",
          mode,
          defenses,
          reset: true
        })
      });
      setMessages([]);
      setTelemetry(defaultTelemetry);
    } catch {
      setError("Sandbox reset failed.");
    }
  };

  return (
    <main style={{ minHeight: "100vh", padding: 20, background: "radial-gradient(circle at top, #1f2937 0%, #0b1020 45%)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gap: 16 }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#111827", border: "1px solid #374151", borderRadius: 12, padding: "14px 18px" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 22 }}>LLM Dojo Chatbox</h1>
            <p style={{ margin: "4px 0 0", color: "#9ca3af" }}>Mock-only attack/defense sandbox</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => {
              setMode("attack");
              setDefenses(makeDefaultDefenses("attack"));
            }} style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #f97316", background: mode === "attack" ? "#7c2d12" : "#111827", color: "#fed7aa" }}>Attack Mode</button>
            <button onClick={() => {
              setMode("defense");
              setDefenses(makeDefaultDefenses("defense"));
            }} style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #10b981", background: mode === "defense" ? "#064e3b" : "#111827", color: "#a7f3d0" }}>Defense Mode</button>
          </div>
        </header>

        <section style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
          <div style={{ background: "#111827", border: "1px solid #374151", borderRadius: 12, padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <h2 style={{ margin: 0, fontSize: 18 }}>Chat Window</h2>
              <button onClick={resetSandbox} style={{ border: "1px solid #4b5563", borderRadius: 8, padding: "6px 10px", background: "#1f2937", color: "#e5e7eb" }}>Reset Sandbox</button>
            </div>
            <div style={{ minHeight: 320, maxHeight: 420, overflowY: "auto", border: "1px solid #1f2937", borderRadius: 10, padding: 12, background: "#0f172a" }}>
              {messages.length === 0 && <p style={{ color: "#94a3b8" }}>No messages yet. Try a prompt injection or a defense question.</p>}
              {messages.map((m) => (
                <div key={m.id} style={{ marginBottom: 10, textAlign: m.role === "user" ? "right" : "left" }}>
                  <div style={{ display: "inline-block", maxWidth: "80%", padding: "8px 10px", borderRadius: 10, background: m.role === "user" ? "#1d4ed8" : "#374151" }}>
                    <strong style={{ fontSize: 12, opacity: 0.85 }}>{m.role === "user" ? "You" : "Assistant"}</strong>
                    <p style={{ margin: "4px 0 0", whiteSpace: "pre-wrap" }}>{m.content}</p>
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={send} style={{ marginTop: 12, display: "flex", gap: 8 }}>
              <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a safe mock attack or defense request..." style={{ flex: 1, borderRadius: 8, border: "1px solid #4b5563", background: "#0f172a", color: "#e5e7eb", padding: "10px 12px" }} />
              <button type="submit" style={{ borderRadius: 8, border: "1px solid #2563eb", padding: "10px 14px", background: "#1d4ed8", color: "white" }}>Send</button>
            </form>
            {error && <p style={{ color: "#fca5a5" }}>{error}</p>}
          </div>

          <aside style={{ background: "#111827", border: "1px solid #374151", borderRadius: 12, padding: 16 }}>
            <h2 style={{ marginTop: 0, fontSize: 18 }}>Defense Toggles</h2>
            {toggleEntries.map(([key, value]) => (
              <label key={key} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: 14 }}>
                <span>{key}</span>
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => setDefenses((prev) => ({ ...prev, [key]: e.target.checked }))}
                />
              </label>
            ))}
          </aside>
        </section>

        <section style={{ background: "#111827", border: "1px solid #374151", borderRadius: 12, padding: 16 }}>
          <h2 style={{ marginTop: 0, fontSize: 18 }}>Telemetry Panel</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 12 }}>
            <Metric label="injection_detected" value={String(telemetry.injection_detected)} />
            <Metric label="jailbreak_detected" value={String(telemetry.jailbreak_detected)} />
            <Metric label="tool_call_attempted" value={String(telemetry.tool_call_attempted)} />
            <Metric label="secret_exposure_attempted" value={String(telemetry.secret_exposure_attempted)} />
            <Metric label="blocked_by" value={telemetry.blocked_by || "none"} />
            <Metric label="risk_score" value={String(telemetry.risk_score)} />
          </div>
          <div style={{ border: "1px solid #1f2937", borderRadius: 10, background: "#0f172a", padding: 10, maxHeight: 200, overflowY: "auto" }}>
            {telemetry.event_log.length === 0 && <p style={{ color: "#94a3b8", margin: 0 }}>No events yet.</p>}
            {telemetry.event_log.map((evt, i) => (
              <div key={`${evt.timestamp}-${i}`} style={{ borderBottom: "1px solid #1f2937", padding: "6px 0" }}>
                <strong>{evt.type}</strong>
                <p style={{ margin: "2px 0", color: "#cbd5e1" }}>{evt.detail}</p>
                <small style={{ color: "#94a3b8" }}>{evt.timestamp}</small>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ border: "1px solid #4b5563", borderRadius: 8, padding: 10, background: "#0f172a" }}>
      <small style={{ color: "#9ca3af" }}>{label}</small>
      <div style={{ marginTop: 4, fontWeight: 700 }}>{value}</div>
    </div>
  );
}
