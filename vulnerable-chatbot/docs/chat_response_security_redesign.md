# Chat Response Security Redesign

## 1) Secure separation architecture
- **Assistant-visible channel**: only `assistantMessage` string is returned to chat UI.
- **Internal channel (server-only)**: debug state, system prompts, internal secrets, retrieved context, tool traces, sandbox metadata.
- **Frontend rule**: chat bubble components are bound only to `assistantMessage` and never to debug/internal objects.

## 2) Secure API response JSON structure

```json
{
  "ok": true,
  "requestId": "req_01HXYZ",
  "assistantMessage": "I can help with that. Let’s test the guarded policy path.",
  "conversation": {
    "turnId": "turn_123",
    "role": "assistant",
    "timestamp": "2026-03-03T00:00:00Z"
  },
  "uiHints": {
    "mode": "simulated",
    "securityProfile": "guarded"
  },
  "error": null
}
```

Server-only debug payload (never returned to chat response body):

```json
{
  "requestId": "req_01HXYZ",
  "debug": {
    "systemPromptVersion": "v7",
    "ragContextHash": "sha256:...",
    "toolCalls": [{"name": "searchDocs", "status": "blocked"}],
    "sandboxMeta": {"scenario": "prompt-injection-lab"}
  }
}
```

## 3) Updated backend handler logic (Node/Next.js style)

```ts
// app/api/chat/route.ts
import { NextResponse } from "next/server";
import { safeLog, buildAssistantReply, runSandboxSimulation } from "@/lib/chat";

export async function POST(req: Request) {
  const requestId = crypto.randomUUID();

  try {
    const body = await req.json();
    const userMessage = String(body?.message ?? "");
    const controls = body?.controls ?? {};

    // Strictly internal-only objects:
    const internal = await runSandboxSimulation({ userMessage, controls });
    // internal contains systemPrompt, secret refs, raw rag context, debug traces

    const assistantMessage = buildAssistantReply(internal);

    // Debug log is server-side only
    safeLog({ requestId, debug: internal.debug, securityProfile: internal.profile });

    return NextResponse.json({
      ok: true,
      requestId,
      assistantMessage,
      conversation: {
        turnId: internal.turnId,
        role: "assistant",
        timestamp: new Date().toISOString()
      },
      uiHints: {
        mode: internal.mode,
        securityProfile: internal.profile
      },
      error: null
    });
  } catch {
    // Never dump stack/system/internal state to user
    return NextResponse.json(
      {
        ok: false,
        requestId,
        assistantMessage: "I couldn’t process that safely. Please retry with a simpler input.",
        conversation: null,
        uiHints: null,
        error: { code: "SAFE_PROCESSING_ERROR", message: "Request could not be completed." }
      },
      { status: 400 }
    );
  }
}
```

## 4) Updated frontend rendering logic (React style)

```tsx
// components/ChatWindow.tsx
export function ChatWindow({ turns }: { turns: Array<{ role: string; assistantMessage?: string; userMessage?: string }> }) {
  return (
    <div className="chat-window">
      {turns.map((t, i) => (
        <div key={i} className={`bubble ${t.role}`}>
          {t.role === "assistant" ? t.assistantMessage : t.userMessage}
        </div>
      ))}
    </div>
  );
}
```

```tsx
// NEVER do this in chat UI:
// <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
```

## 5) Safe malformed input handling
- Parse failures (`unclosed quotes`, malformed JSON, invalid UTF-8) return generic safe message.
- Do not attach stack traces, prompt state, RAG content, or tool traces to client response.
- Log parse and validation errors server-side with requestId only.

## 6) Debug Panel architecture (separate, never auto-render)
- Dedicated route: `/dojo/debug`.
- Access control: internal/dev-only flag in production.
- Data source: server debug log store (hashed context refs, policy outcomes, tool statuses).
- UI behavior: manual navigation only; chat route never embeds debug payload.

## 7) Security rules enforced
- Internal secrets are never concatenated into `assistantMessage`.
- System prompts never sent to frontend payload.
- Retrieved raw RAG context never returned in chat response.
- Simulation failures return safe generic error only.
- Debug data logged server-side only.

## 8) Before/After examples

### Vulnerable (before)
```json
{
  "assistantMessage": "[SIMULATED CHAT RESPONSE]\nSystem prompt state: ...\nInternal secret state: ...\nRetrieved context: ..."
}
```

### Corrected (after)
```json
{
  "assistantMessage": "I can help test that scenario safely. In vulnerable mode, the injection path was simulated.",
  "uiHints": { "mode": "simulated", "securityProfile": "vulnerable" }
}
```

## 9) Leak-fix verification checklist
- [ ] Chat bubbles render only `assistantMessage`.
- [ ] API chat response has no `systemPrompt`, `secret`, or `retrievedContext` fields.
- [ ] Malformed input returns safe generic message without stack traces.
- [ ] Debug traces appear only in `/dojo/debug`, never in chat timeline.
- [ ] Server logs include requestId and internal debug metadata only.
