# LLM Dojo Chatbox (Next.js)

Single-page sandbox chatbox for safe AI attack/defense practice.

## File tree

```text
llm-dojo-chatbox/
├─ app/
│  ├─ api/chat/route.ts
│  ├─ layout.tsx
│  └─ page.tsx
├─ sandboxEngine.ts
├─ types.ts
├─ package.json
├─ tsconfig.json
└─ next-env.d.ts
```

## Run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Verification checklist

- Chat bubbles only show user/assistant text.
- Telemetry panel updates booleans + event log per turn.
- Switching Attack/Defense mode changes defaults for all six defenses.
- With defenses off, risky prompt can simulate fake secret leakage.
- With defenses on, risky prompt is blocked and `blocked_by` is populated.
