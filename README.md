# MendCI: The Self-Healing CI/CD Agent

MendCI is an autonomous, context-aware AI engineering assistant designed to monitor, diagnose, and repair broken Next.js and MERN CI/CD pipelines in real time. Instead of merely alerting development teams to a build failure, MendCI intercepts the failure vector, triages the raw execution traces, synthesizes a pristine code patch, and automatically opens a configured Merge Request (MR).

By keeping a **Human-in-the-Loop** design parameter, developers retain full validation control, approving and merging autonomous fixes with a single click from an intuitive, telemetry-driven dashboard control center.

---

## 🚀 Key Features

* **Automated Failure Triage:** Intercepts real-time webhook payloads to capture failing platform pipelines the exact second they crash.
* **Deep Trace Log Analysis:** Leverages the `gemini-2.5-pro` engines via the official Google GenAI SDK to parse multi-megabyte log stack traces and locate root-cause constraints.
* **Model Context Protocol (MCP) Integration:** Uses an active JSON-RPC Client over standard I/O to link directly with the `@modelcontextprotocol/server-gitlab` registry, executing secure branch generation and commits.
* **Interactive Agentic Map:** Built-in real-time pipeline visualizer displaying live execution steps, latency stopwatches, and active context tokens evaluated.
* **Dynamic Target Configuration:** Fully interactive dashboard input fields allowing administrators to easily reroute triage vectors to any repository or failure ID on the fly.

---

## 🏗️ System Architecture

MendCI processes telemetry over a multi-layered, tool-enabled automation topology:

![MendCI Orchestration Topology](/assets/screenshots/architecture.png)

---

## ❓ Concept Overview & Core Value

### What is this?

MendCI operates as an automated, first-responder Site Reliability Engineer integrated directly into your infrastructure layer. It converts static terminal logs into actionable, human-reviewed pull request remediation steps without requiring manual engineering intervention.

### Why do we need this?

Context switching inside DevOps loops is incredibly expensive. When a build or deployment script crashes, an engineer must drop their active flow state, load up cloud logs, trace dependencies, spin up an isolated hotfix branch, and commit. MendCI completely automates this tedious process, compressing triage loops from hours down to seconds, ensuring developers spend their time reviewing resolutions rather than hunting bugs.

---

## 📁 Project Structure

```text
mend-ci/
├── assets/                  # Public presentation graphics
│   └── screenshots/         # Dashboard telemetry lifecycle states
├── dashboard/               # Next.js Frontend Control Panel Application
│   ├── app/
│   │   ├── api/
│   │   │   └── agent/      # Core Endpoint (JSON-RPC + Google GenAI Client)
│   │   │       └── route.ts
│   │   ├── layout.tsx
│   │   └── page.tsx        # Dashboard Telemetry UI Panel
│   ├── components/          # Reusable dashboard viewport nodes
│   ├── public/              # Global structural interface assets
│   ├── .env.local           # Local Environment Secrets (Tokens & Project IDs)
│   ├── package.json
│   └── tsconfig.json
├── AGENTS.md                # Specialized SRE Agent Personas & Architectural Specs
└── README.md                # Project Presentation Documentation

```

---

## ⚙️ Local Development & Environment Configuration

To configure the application environment locally, create a `.env.local` file inside the root of your `dashboard/` directory matching the structural definitions below:

```env
# ── Google Cloud GenAI API Credentials ─────────────────────────────────────
# Standard API Key obtained from Google AI Studio for rate-limit quota safety
GEMINI_API_KEY="AIzaSy..."

# Vertex AI Google Cloud Project Routing Fallback (Optional)
GOOGLE_CLOUD_PROJECT="your-gcp-project-id"

# ── GitLab Model Context Protocol Configuration ───────────────────────────
# Personal access token with api, read_api, read_repository, and write_repository scopes
GITLAB_PERSONAL_ACCESS_TOKEN="glpat-..."
GITLAB_API_URL="https://gitlab.com/api/v4"

```

### Setup Instructions

1. Clone the workspace and navigate to the application directory:
```bash
cd mend-ci/dashboard

```


2. Install dependencies securely:
```bash
npm install

```


3. Boot the Next.js development server:
```bash
npm run dev

```


4. Access the web controller framework locally at `http://localhost:3000`.

---

## 📸 Production Workspace Telemetry

Below is the lifecycle execution sequence of the MendCI engine managing an environment recovery task:

### 1. Standby Interface State

The primary deployment panel initialized, listening for active pipeline failure webhooks across the configured workspace coordinates:


### 2. Live Agent Run Time

The loop is triggered—the live terminal feed logs background tool calls while the interactive graph lights up to illustrate the active multi-turn context steps:



### 3. Automated Code Remediation

Upon locating missing file matrices, the agent invokes the GitLab MCP endpoint to inject the correct `.gitlab-ci.yml` builds onto the branch path:



### 4. Successful Target Closure

The final step turns green, calculating total latency and outputting the direct human-in-the-loop review confirmation path:


### 5. Resilient Exception Tracking

If an infrastructure tool returns a configuration exception mid-run, the graph halts execution, maps the failure point, and automatically creates an issue tracking item:


---

## 🌐 Live Deployment

* **Live Dashboard Application:** [https://mend-ci.vercel.app/](https://www.google.com/search?q=https://mend-ci.vercel.app/) 

---

## 🌐 Demo Video

👉 **[Click Here to Watch the Full Presentation Walkthrough](https://vimeo.com/1194660093?share=copy&fl=sv&fe=ci)**


---

## 🌐 Screenshots

![Home Screen](/assets/screenshots/home1.png)
![Home Screen](/assets/screenshots/home2.png)

![Execution](/assets/screenshots/execution1.png)
![Execution](/assets/screenshots/execution2.png)

![Result Remediation](/assets/screenshots/result.png)

![Failure Points](/assets/screenshots/error.png)

![Merge Request Output](/assets/screenshots/merge_request1.png)
![Merge Request Output](/assets/screenshots/merge_request2.png)
![Merge Request Output](/assets/screenshots/merge_request3.png)
![Merge Request Output](/assets/screenshots/merge_request4.png)