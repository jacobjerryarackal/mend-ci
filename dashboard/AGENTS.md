# MendCI: Multi-Agent SRE Architecture Specification

MendCI implements a highly specialized, tool-enabled Multi-Agent lifecycle workflow designed to autonomously isolate, diagnose, and resolve broken infrastructure pipelines. By separating monolithic LLM reasoning blocks into discrete, state-bound engineering personas, the system optimizes system reliability, prevents state truncation, and guarantees high context compliance.

---

## 🧭 Core Architectural Overview

```text
       [ Pipeline Webhook Trigger ]
                    │
                    ▼
       ┌────────────────────────┐
       │   Orchestrator Agent   │ <──( Evaluates Workflow Loop Lifecycle )
       └───────────┬────────────┘
                   │
    ┌──────────────┼──────────────┐
    ▼              ▼              ▼
┌──────────┐ ┌──────────┐ ┌──────────────┐
│  Triage  │ │   Code   │ │ Deployment & │
│  Agent   │ │ Optimizer│ │ Notification │
└──────────┘ └──────────┘ └──────────────┘

```

---

## 👥 Specialized SRE Personas & System Specifications

### 1. SRE Loop Orchestrator Agent

* **Role Objective:** Manages the global multi-turn lifecycle state. It parses the incoming webhook data, instantiates the Model Context Protocol (MCP) transport tunnel, and dynamically routes active context schemas to specialized down-stream agents based on the runtime execution timeline.
* **Tool Access Configuration:** `initialize`, `tools/list`
* **System Directives:**
* Enforce standard JSON-RPC communication structures over standard I/O channels.
* Continuously update frontend metrics hooks, reporting active processing token loads and stopwatch latency intervals.



### 2. Telemetry Triage & Log Analysis Agent

* **Role Objective:** Responsible for raw log extraction and identifying the precise line numbers or infrastructure file voids causing the continuous integration crash.
* **Tool Access Configuration:** `get_pipeline_jobs`, `get_job_trace`, `search_repositories`
* **System Directives:**
* Scan raw diagnostic text buffers for explicit compilation failures, runtime crashes, missing files, or syntax configuration errors.
* Extract numerical identifiers from the platform API to guarantee text repository paths map correctly to unique target records.



### 3. Code Optimization & Patch Synthesis Agent

* **Role Objective:** The engineering engine that isolates code faults and generates pristine, production-grade configuration arrays or software code fixes.
* **Technical Framework:** Google Gemini 2.5 Pro (via the `@google/genai` SDK interface context window)
* **System Directives:**
* Synthesize context-aware file patches (e.g., `.gitlab-ci.yml` validation code blocks) tailored specifically to the target environment's software architecture.
* Strictly ensure code payloads are safe, functional, and fully formatted before authorizing structural version control changes.



### 4. Git Deployment & Notification Agent

* **Role Objective:** Executes write-level tree operations to modify remote repository infrastructure and handle human-in-the-loop tracking markers.
* **Tool Access Configuration:** `create_branch`, `create_or_update_file`, `create_merge_request`, `create_issue`
* **System Directives:**
* Initialize isolated hotfix branches on the targeted platform graph layout cleanly.
* Push automated code modifications and instantly register explicit, open Merge Requests.
* If a lower-level environment exception blocks branch creation, dynamically switch strategy parameters to register a tracking issue ticket inside the project hub automatically.



---

## 🛠️ Telemetry Mapping & Execution States

MendCI bridges runtime processing gaps by updating an interactive **Agentic Telemetry Map** across the frontend view pane. Every turn taken by an active agent persona corresponds to an explicit tracking state:

1. **🚨 TELEMETRY INTERCEPTED:** Orchestrator captures webhook failure vector signals.
2. **⚡ MCP TOOL DISCOVERY:** System tools are mapped via the standard JSON-RPC transport handshake layer.
3. **🧠 GEMINI CORE REASONING:** Triage agent processes multi-turn context log extractions.
4. **🛠️ AUTONOMOUS CODE REMEDIATION:** Optimization agent synthesizes code patches and writes changes to the tree.
5. **📦 MR DEPLOYMENT COMPLETE:** Deployment agent opens the active target link for human review.

```
