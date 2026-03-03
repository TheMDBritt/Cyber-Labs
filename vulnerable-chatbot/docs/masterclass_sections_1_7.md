SECTION 1 — Deep Curriculum (Walk-Through Plan)

Stage 0: LLM foundations
- Prerequisites: none.
- 8 lessons: tokenization; embeddings; attention intuition; context window mechanics; system/developer/user roles; sampling/temperature; hallucination mechanics; evaluation basics.
- Build exercises: (1) mini prompt playground, (2) context-window truncation visualizer.
- Defend exercises: (1) prompt role separation, (2) hallucination containment patterns.
- Mastery: quiz >=80%, 2/2 builds pass, 2/2 defenses pass.

Stage 1: LLM app architecture (prompts, RAG, tools)
- Prerequisites: Stage 0 pass.
- 8 lessons: chain orchestration; prompt templates; RAG pipeline; retrieval scoring; tool/function calling; tool contracts; caching; fallback design.
- Build: (1) RAG chat endpoint, (2) tool-calling assistant mock.
- Defend: (1) prompt-layer hardening, (2) tool schema gating.
- Mastery: >=82% quiz + architecture review pass.

Stage 2: Threat modeling for LLM apps
- Prerequisites: Stage 1 pass.
- 8 lessons: asset inventory; trust boundaries; data flows; abuse cases; STRIDE adaptation; attack trees; control mapping; residual risk.
- Build: (1) threat model board, (2) abuse-case matrix.
- Defend: (1) control prioritization, (2) risk register.
- Mastery: >=84% + model completeness rubric >=85.

Stage 3: Core attack classes (safe simulation) + mitigations
- Prerequisites: Stage 2 pass.
- 8 lessons: prompt injection; indirect injection; jailbreak classes; data exfiltration; RAG poisoning; tool abuse; output handling abuse; supply-chain drift.
- Build: (1) sandbox vulnerable bot, (2) sandbox poisoned-RAG run.
- Defend: (1) retrieval sanitization, (2) defense-in-depth prompt and tool controls.
- Mastery: >=86%, attack-to-defense mapping score >=85.

Stage 4: Testing/evals + monitoring + IR
- Prerequisites: Stage 3 pass.
- 8 lessons: eval suites; safety regression; scoring metrics; telemetry design; alerting; triage; containment; post-incident hardening.
- Build: (1) eval gate pipeline, (2) detection dashboard mock.
- Defend: (1) runbook execution drill, (2) alert tuning drill.
- Mastery: >=88%, tabletop pass >=85.

Stage 5: Advanced defenses + governance
- Prerequisites: Stage 4 pass.
- 8 lessons: policy-as-code; secure release gates; model governance; NIST AI RMF mapping; vendor risk; privacy-by-design; evidence reporting; resilience engineering.
- Build: (1) governance control matrix, (2) release approval workflow.
- Defend: (1) drift rollback policy, (2) executive risk communication package.
- Mastery: >=90%, capstone >=90.

SECTION 2 — Make Labs Usable (Lab Runner Spec)
- State machine: NOT_STARTED → SETUP → ATTACK_SIM → DEFENSE_BUILD → DETECTION → VERIFY → SCORE → DEBRIEF.
- UI per step: setup checklist, sandbox console, defense editor, detection panel, verifier panel, rubric panel, debrief form.
- Stored data: lab_id, user_id, step transitions, timestamps, artifacts, verification results, rubric scores, debrief notes.
- Rubric: weighted categories (Correctness 30, Defense 25, Detection 25, Explainability 20).
- No skipping: transitions only to next state unless admin reset.
- Auto-verify: deterministic checks using fixture transcripts and expected flags (no external services).

SECTION 3 — Tool-Assembled Tutor (Function Tooling)
1) generate_lesson(stage, topic, level)
2) generate_quiz(topic, difficulty, count)
3) grade_quiz(answers, key)
4) create_lab(template, difficulty)
5) run_lab_simulation(lab_id, user_input)
6) evaluate_attack_result(transcript)
7) suggest_defenses(attack_type, app_arch)
8) generate_detection_plan(attack_type)
9) verify_lab_completion(lab_id, evidence)
10) update_progress(user_id, results)
11) safety_policy_check(text)
12) prompt_diff(before, after)

Tool orchestration policy:
- Start with safety_policy_check.
- If learning request: generate_lesson or generate_quiz.
- If lab request: create_lab -> run_lab_simulation -> evaluate_attack_result -> suggest_defenses/generate_detection_plan -> verify_lab_completion -> update_progress.

Logging:
- Log: tool calls, parameters hash, outcomes, rubric scores.
- Never log: secrets, raw PII, tokens, real credentials.

SECTION 4 — Sandbox Designs
A) Vulnerable Chatbot Sandbox
- Simulates: role hierarchy conflicts, hidden context, secret exposure patterns.
- Allowed: prompt crafting against mock assistant.
- Block: real targets, real credentials.
- Scoring: exploit signal + remediation quality + detection setup.

B) RAG Sandbox
- Simulates: fake docs, retrieval ranking, poisoned chunk injection.
- Allowed: manipulate mock docs and observe retrieval effects.
- Block: external ingestion and real corpora.
- Scoring: poisoning detection, filtering, citation grounding quality.

C) Tool-Calling Sandbox
- Simulates: searchDocs(), sendEmailMock(), getUserDataMock().
- Allowed: argument experiments and policy tests.
- Block: outbound calls and real side effects.
- Scoring: authz correctness, schema enforcement, alert precision.

SECTION 5 — 10 Runnable Labs (Deep + Practical)
1. Direct Prompt Injection Sandbox (Stage 3, Medium)
2. Indirect Prompt Injection via Mock Docs (Stage 3, Hard)
3. Jailbreak Attempt + Refusal Hardening (Stage 3, Medium)
4. Data Leakage Through Telemetry Logs (Stage 3, Medium)
5. RAG Doc Injection + Retrieval Filtering (Stage 3, Hard)
6. Tool Calling Abuse + AuthZ Validation (Stage 3, Hard)
7. System Prompt Exposure Misconfiguration + Fix (Stage 3, Medium)
8. Eval Gate Before Deploy (Regression + Safety) (Stage 4, Hard)
9. Incident Response Tabletop: contain/eradicate/recover (Stage 4, Hard)
10. Supply-Chain Drift + Safe Rollout with Gate (Stage 5, Hard)

Each lab must include setup, safe simulation, defense build, detection tasks, verification evidence, rubric, debrief.

SECTION 6 — Make Content Deep (Lesson Format)
Format:
1) Concept
2) How it fails
3) Why defenses work
4) Implementation patterns
5) Pitfalls
6) Checklist

Example lesson: Prompt Injection & Trust Boundaries in LLM Apps
Prompt injection is a trust-boundary failure where untrusted text is treated like instruction. In LLM apps, user messages, retrieved documents, tool outputs, and system prompts coexist in one sequence. When boundaries are weak, attacker-controlled content can compete with or override intended behavior. The central principle is not “block every bad prompt,” but “separate authority and constrain execution.”

How it fails: teams place sensitive context and policy in the same prompt channel as untrusted data, then rely on wording strength alone. Another failure is indirect injection: a poisoned document retrieved by RAG says “ignore prior instructions.” If pipeline controls are absent, the model may comply. Tool-calling expands risk: if arguments are loosely validated, malicious instructions can trigger unsafe tool paths.

Why defenses work: robust systems use layered controls. First, trust separation: privileged policy and sensitive context are isolated and minimally exposed. Second, retrieval hygiene: provenance scoring, sanitization, and citation grounding reduce poisoned content impact. Third, execution governance: strict tool schemas, allowlists, and authz checks prevent unsafe side effects even when text is adversarial. Fourth, observability: structured logs and anomaly alerts detect failures early.

Implementation patterns: build a prompt assembly contract with explicit zones (system policy, runtime guard policy, sanitized context, user input). Use a context broker to redact sensitive values and attach trust labels to chunks. For tool calls, define JSON schemas plus policy validators before execution. Add preflight and postflight checks: preflight evaluates prompt risk score; postflight inspects output for policy violations and leakage signatures.

Pitfalls: assuming larger models automatically resist injection; over-redacting until utility collapses; logging raw prompts with secrets; missing regression evals after model/provider changes.

Checklist:
- Have you defined trust boundaries for each input source?
- Are secrets excluded from model context unless strictly required?
- Is retrieval filtered by provenance and policy?
- Are tool calls authz-gated and schema-validated?
- Do you monitor leak indicators and jailbreak success rate?
- Do you run regression/safety evals before release?

Trust boundary diagram (text):
User Input -> [Untrusted Zone] -> Prompt Assembler -> [Policy Zone: system/developer rules] -> Model -> Output Filter -> Tool Gateway -> Mock Tools. RAG docs enter from [Retrieval Zone] with provenance labels before assembler. Security controls exist at zone boundaries, not just at model output.

SECTION 7 — SecAI Alignment (But beyond exam)
- SecAI-style alignment: threat modeling, attack classes, data protection, monitoring/IR, governance.
- Beyond exam gaps covered: release gating pipelines, drift operations, SOC-ready telemetry design, runbook automation, policy-as-code for tool execution, evidence packaging for stakeholders.
