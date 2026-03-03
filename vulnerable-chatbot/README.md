# Vulnerable Flask Chatbot + LLM Dojo (OpenAI API)

A multi-page AI security training web app with:
- an intentionally vulnerable chatbot arena, and
- a structured White→Black Belt LLM security training system.

## Multi-page experience

- `/` → **Chat Arena** (interactive vulnerable assistant)
- `/dojo` → **Training Hub** (lessons + progression + scoring)
- `/dojo/roadmap` → **Learning progression map**
- `/dojo/labs` → **Red-team and defensive lab center**
- `/dojo/quiz-bank` → **Question bank by belt**
- `/dojo/core` → **Full A→H implementation blueprint**
- `/dojo/debug` → **Isolated debug panel (not auto-rendered in chat)**

## Core content artifacts

- `docs/llm_dojo_core.md` (A→H structured plan)
- `data/object_schemas.json` (Lesson/Quiz/Lab/Rubric/Progress schemas)
- `data/tutor_system_prompts.md` (Tutor/Exam/Lab Coach system prompts)
- `data/lab_catalog.json` (12-lab safe catalog with defensive + detection steps)
- `data/quiz_bank_seed.json` (60-question seed bank)


## LLM Dojo architecture

1. **Curriculum engine** with progressive belts.
2. **Progression gatekeeper** (no skipping levels).
3. **Assessment engine** for 5-question quizzes.
4. **Lab completion tracker** for red/defensive labs.
5. **Knowledge tracker** (mastery %, weak areas, event log).
6. **UI layer** with dedicated pages and navigation.

## Progression map (White → Black Belt)

1. White: Foundations and trust boundaries.
2. Yellow: Prompt injection and jailbreak engineering.
3. Orange: Data exfiltration and privacy abuse.
4. Green: RAG poisoning and retrieval pipeline integrity.
5. Blue: Tool abuse and agentic controls.
6. Brown: Detection engineering and IR.
7. Black: Enterprise adversarial resilience architecture.

## Example lesson/lab/quiz design

- **Lesson structure:** objectives + threat model + success criteria.
- **Red-team lab:** realistic exploit simulation against LLM system behavior.
- **Defensive lab:** mitigation design + detection strategy + validation.
- **Quiz:** 5 operationally focused checks per belt.

## Run locally

1. Create and activate a virtual environment:
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Set OpenAI key (optional if using mock mode):
   ```bash
   export OPENAI_API_KEY="your_api_key_here"
   ```
4. Optional defaults:
   ```bash
   export OPENAI_MODEL="gpt-4o-mini"
   export OPENAI_MOCK_MODE="1"
   export DEFAULT_RUN_MODE="mock"
   export DEFAULT_SECURITY_PROFILE="vulnerable"
   ```
5. Run app:
   ```bash
   python app.py
   ```


## Chat Arena attack-learning controls

- **Security Profile = Vulnerable Training (guardrails OFF):** keeps the chatbot intentionally susceptible for prompt-injection/exfiltration learning.
- **Security Profile = Guarded Demo (guardrails ON):** applies a safer context path for comparison during lessons.
- **LLM Command field:** directly influences model behavior and mock-mode attack simulations.


## Chatbox runtime behavior

- **No key required:** choose `Simulated LLM (no API key)` or `Mock (offline)` and the chatbox responds without showing key errors.
- **Security Profile toggle:**
  - `Vulnerable Training (guardrails OFF)`
  - `Guarded Demo (guardrails ON)`
- **Attack/Defense Control Panel:** enable/disable prompt override simulation, secret inclusion, system prompt inclusion, tool-abuse simulation, RAG-poisoning simulation, and strict refusal mode.
- **State is logged per turn** in conversation history for reproducible testing.

## Additional deep curriculum artifact

- `docs/masterclass_sections_1_7.md` includes sections 1–7 for full end-to-end LLM mastery, runnable lab runner spec, tool-assembled tutor design, and safe sandbox/lab details.
- `docs/chat_response_security_redesign.md` includes secure response contract, Node/Next handler pattern, React rendering pattern, debug-panel isolation, and leak-fix checklist.
