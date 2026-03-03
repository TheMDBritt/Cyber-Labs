# A) PRODUCT SPEC (PRD)

## Target outcomes
- Build secure LLM apps with threat models, controls, and validation gates.
- Detect/respond to prompt injection, data leakage, RAG poisoning, and tool abuse.
- Pass SecAI-style assessments and perform real operational hardening.

## Core features
- Structured lessons (belt-gated), quizzes, labs, capstones.
- Tutor Chat, Exam Mode, Lab Coach Mode.
- Progress engine (mastery score, weak areas, spaced repetition).
- Evaluation and incident-response playbooks.

## Non-goals
- Real-world offensive exploitation against live targets.
- Unbounded autonomous penetration guidance.

## Success metrics
- >=80% belt mastery at each level.
- >=70% first-pass quiz accuracy trend by level end.
- <15% repeated misses after remediation cycle.
- Capstone pass rate >=85% before next belt unlock.

## Scope
- MVP: White+Blue belts, 12 labs, quiz engine, progress tracking, tutor modes.
- v1: all 5 belts, placement test, evaluation dashboards, drift monitoring drills.
- v2: adaptive study plans, team leaderboard, exportable evidence reports.

---
# B) CURRICULUM BLUEPRINT (BELT SYSTEM)

## White Belt
- Entry: None.
- Lessons (8):
  1) LLM architecture fundamentals
  2) Tokens/context window/system prompts
  3) Tool calling and function contracts
  4) RAG basics and grounding
  5) Intro threat modeling for LLM apps
  6) Prompt injection patterns (safe overview)
  7) Data handling risks (PII/secrets/logs)
  8) Baseline mitigations + monitoring basics
- Labs (3): helpdesk prompt injection sandbox; secret-in-context leakage drill; logging hygiene mini-lab.
- Capstone: model a toy chatbot and harden minimal control set.
- Pass criteria: quiz >=80, labs >=80 rubric avg, capstone >=80.

## Blue Belt
- Entry: White pass.
- Lessons: attack trees, jailbreak families, secure prompting patterns, policy layering, RAG filtering, citation checks, eval harness intro, anomaly basics.
- Labs: indirect injection via retrieved docs; citation/grounding enforcement; jailbreak resistance eval.
- Capstone: secure RAG assistant with eval report.
- Pass criteria: quiz >=82, labs >=82 avg, capstone >=82.

## Purple Belt
- Entry: Blue pass.
- Lessons: data exfil paths, training-data leakage, telemetry risk, tool authz/authn, argument validation, allowlists/rate limits, model supply-chain risk, dependency governance.
- Labs: tool abuse attempt + mitigation; sensitive telemetry leak containment; provider/version risk gate.
- Capstone: tool-enabled agent with policy + telemetry controls.
- Pass criteria: quiz >=84, labs >=84 avg, capstone >=84.

## Brown Belt
- Entry: Purple pass.
- Lessons: red-team methodology, secure deployment patterns (in-house/vendor/hybrid), detection engineering, alert tuning, SOC workflows, incident response, recovery drills, NIST AI RMF mapping.
- Labs: controlled red-team campaign; incident tabletop; deployment architecture hardening.
- Capstone: end-to-end security operations plan for LLM service.
- Pass criteria: quiz >=86, labs >=86 avg, capstone >=86.

## Black Belt
- Entry: Brown pass or placement bypass.
- Lessons: adversarial resilience architecture, defense-in-depth composition, governance evidence, continuous evaluation gates, drift/rollback policy, executive risk reporting, purple-team orchestration, production assurance.
- Labs: multi-vector attack simulation; kill-chain detection buildout; release-gating simulation.
- Capstone: production-readiness board with quantified risk controls.
- Pass criteria: quiz >=88, labs >=88 avg, capstone >=90.

---
# C) CONTENT TEMPLATE SYSTEM (OBJECT MODELS)
See `data/object_schemas.json` for app-ready JSON schemas with examples for:
- Lesson
- QuizQuestion (mcq/multi_select/short_answer)
- Lab
- Rubric
- Progress

---
# D) TUTOR OPERATING MODES (SYSTEM PROMPTS)
See `data/tutor_system_prompts.md` for 3 system prompts:
1) Tutor Mode
2) Exam Mode
3) Lab Coach Mode

---
# E) LAB CATALOG (12)
1) Helpdesk Prompt Injection Sandbox (White)
2) System Prompt Boundary Test (White)
3) Logging Secrets Hygiene (White)
4) RAG Indirect Injection Simulation (Blue)
5) Grounding + Citation Enforcement (Blue)
6) Jailbreak Resilience Evaluation (Blue)
7) Tool Abuse Attempt + Contract Hardening (Purple)
8) Telemetry PII Leakage Containment (Purple)
9) Model Version Drift Gate (Purple)
10) LLM Incident Response Tabletop (Brown)
11) Multi-vector Purple Team Exercise (Black)
12) Release Eval Gate + Rollback Drill (Black)

Each lab includes: objectives, mock scenario, safe attack simulation steps, defense build, detection/monitoring, success criteria, common mistakes, reflection questions.

---
# F) QUIZ BANK SEED
- Total: 60
- MCQ: 35
- Multi-select: 15
- Short-answer scenario: 10
- Stored in `data/quiz_bank_seed.json` with: domain tag, difficulty, answer key, rationale, distractor analysis, misconception.

---
# G) PERSONALIZATION + TRACKING LOGIC
1) Mastery score: weighted blend
   - Quiz 40%, labs 40%, capstone 20%.
2) Spaced repetition for misses:
   - intervals: 1d, 3d, 7d, 14d, 30d.
3) Weak-topic remediation flow:
   - lesson refresh -> targeted quiz -> focused lab -> retest -> close ticket.
4) Level skip prevention:
   - strict lock unless placement test >=90 with no critical-domain failures.

---
# H) SECURE IN-APP LLM INTEGRATION DESIGN
- Threat model: assets (prompts, secrets, docs, tools), entry points (user input, docs, APIs), trust boundaries.
- Prompt layering: system/developer/user separation + immutable policy channel.
- Guardrails: input risk scoring, output policy checks, tool gating.
- RAG security: signed sources, provenance scoring, citation enforcement, quarantine for suspicious chunks.
- Tool security: authz checks, strict schemas, allowlists, idempotency keys, rate limits.
- Secrets: never in prompts; use tokenized references and secure retrieval at execution time.
- Telemetry: log policy decisions, tool calls, detection signals; avoid raw sensitive content.
- Abuse prevention: throttling, anomaly detection, progressive challenges.
- Release gates: red-team suite + regression + drift tests required before deploy.
- IR hooks: alert routing, kill switch, model rollback, forensics bundle export.
