export type Role = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: Role;
  content: string;
  timestamp: string;
}

export type SecurityMode = "attack" | "defense";

export interface DefenseToggles {
  instruction_hierarchy_enforced: boolean;
  prompt_injection_filter: boolean;
  tool_allowlist_enabled: boolean;
  tool_argument_validation: boolean;
  output_secret_redaction: boolean;
  rate_limit_simulation: boolean;
}

export interface TelemetryEvent {
  timestamp: string;
  type:
    | "injection_pattern"
    | "jailbreak_pattern"
    | "tool_call_attempt"
    | "secret_exposure_attempt"
    | "blocked"
    | "allowed"
    | "rate_limited";
  detail: string;
}

export interface Telemetry {
  injection_detected: boolean;
  jailbreak_detected: boolean;
  tool_call_attempted: boolean;
  secret_exposure_attempted: boolean;
  blocked_by: string;
  risk_score: number;
  event_log: TelemetryEvent[];
}

export interface SandboxState {
  sessionId: string;
  security_profile: SecurityMode;
  defenses_enabled: DefenseToggles;
  mock_secrets: string[];
  mock_docs: string[];
  recentTimestamps: number[];
}

export interface ChatRequest {
  sessionId: string;
  userMessage: string;
  mode: SecurityMode;
  defenses: DefenseToggles;
  reset?: boolean;
}

export interface ChatResponse {
  assistantMessage: string;
  telemetry: Telemetry;
}
