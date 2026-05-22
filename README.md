# MendCI: The Self-Healing CI/CD Agent

MendCI is an autonomous, context-aware AI agent designed to monitor, diagnose, and repair broken Next.js and Node.js CI/CD pipelines in real time. Instead of just alerting developers to a build failure, MendCI steps directly into the pipeline graph, extracts raw trace logs, pinpoints systemic bugs, writes isolated code patches, and deploys Merge Requests (MRs) autonomously.

By leveraging a clear "human-in-the-loop" pattern, engineers retain complete control—reviewing and merging production-grade fixes with a single click from an interactive, high-fidelity metrics dashboard.

---

## 🚀 Key Features

- **Automated Failure Triage:** Listens dynamically via repository interfaces to intercept and resolve pipeline failures the exact second they crash.
- **Dynamic Target Configuration:** Exposes fully interactive control center inputs allowing engineers to seamlessly target any repository workspace path or pipeline ID trace on the fly.
- **Multi-Turn Context Reasoning:** Utilizes `gemini-2.5-pro` via the official Google Cloud GenAI SDK to deeply evaluate environment schemas and raw container failures.
- **Asynchronous MCP Bridge:** Implements a low-latency, raw JSON-RPC Client running over standard I/O (stdio) to interact securely with the open-source `@modelcontextprotocol/server-gitlab` engine.
- **Agentic Telemetry Map:** Features a beautifully aligned, live-updating visual tree graph that maps out every granular step of the agent's logic pathway in real time.

---

## 🏗️ System Architecture

```text
  [ GitLab Pipeline Fails ] 
              │
              ▼ (Interceptors)
  [ Next.js Control Dashboard ] ──── (Reactive State UI Panel)
              │
              ▼ (Post Payload)
  [ /api/agent Route Handler ]
              │
              ├─► [ Local JSON-RPC Bridge ] ──► [ MCP GitLab Server Node ]
              │
              ▼ (Context Optimization Engine)
  [ Google GenAI: Gemini 2.5 Pro ]
              │
              ├─► Tool Loop 1: search_repositories (Map Numerical IDs)
              ├─► Tool Loop 2: get_file_contents (Locate Pipeline Configs)
              ├─► Tool Loop 3: create_branch (Isolate Ref Trees)
              ├─► Tool Loop 4: create_or_update_file (Inject YAML Patches)
              └─► Tool Loop 5: create_merge_request (Open Human Review Code)