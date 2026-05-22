# MendCI: The Self-Healing CI/CD Agent

MendCI is an autonomous, context-aware AI agent designed to monitor, diagnose, and repair broken MERN/Next.js CI/CD pipelines in real time. Instead of just alerting developers to a build failure, MendCI steps into the pipeline, analyzes the error logs, locates the bug in the repository, writes the fix, and automatically opens a Merge Request (MR) with the patch. 

By keeping a "human-in-the-loop," developers can approve and merge autonomous fixes with a single click from a unified dashboard.

---

## 🚀 Key Features

- **Automated Failure Triage:** Listens via webhooks to catch failing GitLab/GitHub pipelines the exact second they crash.
- **Deep Log Analysis:** Leverages Google Gemini 3 to parse raw job traces and pinpoint syntax or configuration errors.
- **Context-Aware Repair:** Clones the targeted codebase context to write production-grade code patches specifically tailored for Next.js and Node.js environments.
- **Autonomous Git Injection:** Uses the Model Context Protocol (MCP) to securely open branches, commit code, and push Merge Requests directly back to your version control provider.
- **Developer Control Center:** A beautiful Next.js dashboard displaying side-by-side code diffs of the agent's proposed fixes.

---

## 🏗️ System Architecture

```text
[ GitLab Pipeline Fails ] ──( Webhook )──> [ Next.js API Trigger ]
                                                   │
                                                   ▼
                                        [ Google Cloud Run App ]
                                        (Gemini 3 + GitLab MCP)
                                                   │
     ┌───────────────────┬─────────────────────────┴────────────────────────┐
     ▼                   ▼                                                  ▼
[ Tool 1: Get Logs ] [ Tool 2: Fetch Code ]                       [ Tool 3: Create MR ]
     │                   │                                                  │
     └─────────┬─────────┘                                                  │
               ▼                                                            ▼
     [ Gemini 3 Reasoning ] ────────────────────────────────────────> [ Open Fix Branch ]

---

## ❓ What is this & Why do we need it?

**What is this?**  
MendCI is an AI-driven DevOps assistant that integrates directly into your version control workflow. Think of it as a first responder for broken builds.

**Why do we need this?**  
Context switching is expensive. When a pipeline fails, developers have to stop what they're doing, hunt down the CI logs, figure out what went wrong, test a fix, and push again. This completely breaks their flow state. MendCI handles this tedious triage and repair process autonomously in seconds. Developers stay perfectly in the loop by simply reviewing and clicking "Merge" on the generated fix.

