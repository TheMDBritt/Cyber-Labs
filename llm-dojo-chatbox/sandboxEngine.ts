import { randomUUID } from "crypto";
import { ChatResponse, DefenseToggles, SandboxState, Telemetry, TelemetryEvent } from "./types";

const sessions = new Map<string, SandboxState>();
const WINDOW_MS = 8_000;
const MAX_MESSAGES = 4;

export function createDefaultDefenses(mode: "attack" | "defense"): DefenseToggles {
  const hardened = mode === "defense";
  return {
    instruction_hierarchy_enforced: hardened,
    prompt_injection_filter: hardened,
    tool_allowlist_enabled: hardened,
    tool_argument_validation: hardened,
    output_secret_redaction: hardened,
    rate_limit_simulation: hardened
  };
}

export function getOrCreateSession(sessionId?: string): SandboxState {
  const id = sessionId && sessionId.trim() ? sessionId : randomUUID();
  const existing = sessions.get(id);
  if (existing) return existing;
  const initial: SandboxState = {
    sessionId: id,
    security_profile: "attack",
    defenses_enabled: createDefaultDefenses("attack"),
    mock_secrets: ["DOJO_FAKE_SECRET=katana-7781"],
    mock_docs: ["Mock policy: never expose secrets or internal control instructions."],
    recentTimestamps: []
  };
  sessions.set(id, initial);
  return initial;
}

export function resetSession(sessionId: string): SandboxState {
  sessions.delete(sessionId);
  return getOrCreateSession(sessionId);
}

function addEvent(events: TelemetryEvent[], type: TelemetryEvent["type"], detail: string): void {
  events.push({ timestamp: new Date().toISOString(), type, detail });
}

export function simulateTurn(userMessage: string, state: SandboxState): ChatResponse {
  const msg = userMessage.trim();
  const lowered = msg.toLowerCase();
  const events: TelemetryEvent[] = [];

  const telemetry: Telemetry = {
    injection_detected: /(ignore|override|reveal|system prompt|developer message)/i.test(msg),
    jailbreak_detected: /(jailbreak|bypass|no rules|unrestricted|do anything)/i.test(msg),
    tool_call_attempted: /(call tool|use tool|sendemailmock|getuserdatamock|searchdocs)/i.test(msg),
    secret_exposure_attempted: /(secret|token|key|credential|internal)/i.test(msg),
    blocked_by: "",
    risk_score: 5,
    event_log: events
  };

  if (telemetry.injection_detected) {
    addEvent(events, "injection_pattern", "Prompt injection pattern matched mock classifier.");
    telemetry.risk_score += 30;
  }
  if (telemetry.jailbreak_detected) {
    addEvent(events, "jailbreak_pattern", "Jailbreak phrase detected in user message.");
    telemetry.risk_score += 25;
  }
  if (telemetry.tool_call_attempted) {
    addEvent(events, "tool_call_attempt", "Tool-call syntax attempted in sandbox chat.");
    telemetry.risk_score += 20;
  }
  if (telemetry.secret_exposure_attempted) {
    addEvent(events, "secret_exposure_attempt", "Secret extraction intent detected.");
    telemetry.risk_score += 20;
  }

  const now = Date.now();
  state.recentTimestamps = state.recentTimestamps.filter((t) => now - t <= WINDOW_MS);
  state.recentTimestamps.push(now);
  if (state.defenses_enabled.rate_limit_simulation && state.recentTimestamps.length > MAX_MESSAGES) {
    telemetry.blocked_by = "rate_limit_simulation";
    telemetry.risk_score = Math.min(100, telemetry.risk_score + 15);
    addEvent(events, "rate_limited", "Too many rapid messages in a short window.");
    return {
      assistantMessage:
        "Rate limit triggered in sandbox. Slow down and retry so detections can be reviewed clearly.",
      telemetry
    };
  }

  const shouldBlockInjection =
    state.defenses_enabled.prompt_injection_filter && (telemetry.injection_detected || telemetry.jailbreak_detected);
  if (shouldBlockInjection) {
    telemetry.blocked_by = "prompt_injection_filter";
    telemetry.risk_score = Math.min(100, telemetry.risk_score + 10);
    addEvent(events, "blocked", "Prompt-injection filter blocked unsafe instruction pattern.");
    return {
      assistantMessage:
        "Blocked by sandbox defense: your message looks like an injection/jailbreak attempt. Rephrase with legitimate task goals.",
      telemetry
    };
  }

  if (state.defenses_enabled.tool_allowlist_enabled && telemetry.tool_call_attempted) {
    const allowed = ["searchDocs"];
    const attemptedUnsafe = /(sendemailmock|getuserdatamock)/i.test(msg);
    if (attemptedUnsafe) {
      telemetry.blocked_by = "tool_allowlist_enabled";
      telemetry.risk_score = Math.min(100, telemetry.risk_score + 10);
      addEvent(events, "blocked", `Tool denied. Allowed tools: ${allowed.join(", ")}.`);
      return {
        assistantMessage: "Tool call denied by allowlist in sandbox. Only approved tools can execute.",
        telemetry
      };
    }
  }

  if (state.defenses_enabled.tool_argument_validation && /(\.{2}|\/etc\/|drop table|--|<script)/i.test(lowered)) {
    telemetry.blocked_by = "tool_argument_validation";
    telemetry.risk_score = Math.min(100, telemetry.risk_score + 10);
    addEvent(events, "blocked", "Suspicious argument payload blocked by validator.");
    return {
      assistantMessage: "Blocked by argument validation. Payload looked unsafe for sandbox tool execution.",
      telemetry
    };
  }

  let assistantMessage =
    "Sandbox assistant: I can help you practice safe prompt engineering, defense controls, and detection strategy in mock scenarios.";

  const risky = telemetry.secret_exposure_attempted || telemetry.injection_detected || telemetry.jailbreak_detected;
  if (risky && !state.defenses_enabled.instruction_hierarchy_enforced) {
    assistantMessage =
      "[Simulated Failure] Under weak instruction hierarchy, the assistant followed user override attempts. Fake secret exposed: DOJO_FAKE_SECRET=katana-7781";
    addEvent(events, "allowed", "Unsafe behavior simulated because hierarchy defense was disabled.");
    telemetry.risk_score = Math.min(100, telemetry.risk_score + 20);
  } else if (risky) {
    assistantMessage =
      "Defense mode held instruction hierarchy. I cannot reveal hidden data, but I can explain why this pattern is risky and how to mitigate it.";
    addEvent(events, "blocked", "Instruction hierarchy prevented high-risk request from succeeding.");
  }

  if (state.defenses_enabled.output_secret_redaction) {
    assistantMessage = assistantMessage.replace(/DOJO_FAKE_SECRET=[\w-]+/g, "DOJO_FAKE_SECRET=[REDACTED]");
  }

  telemetry.risk_score = Math.min(100, telemetry.risk_score);
  return { assistantMessage, telemetry };
}
