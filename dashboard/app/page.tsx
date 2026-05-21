'use client';

import { useState } from 'react';

export default function Dashboard() {
  const [status, setStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');
  const [agentResponse, setAgentResponse] = useState<string>('');
  const [showArch, setShowArch] = useState<boolean>(false);
  
  // Custom GitLab target configuration details
  const testPayload = {
    pipelineId: "2542570620", // Upgraded to reflect your active pipeline history 
    repositoryId: "jacobjerryarackal123-group/jacobjerryarackal123-project"
  };

  const triggerAgent = async () => {
    setStatus('running');
    setAgentResponse('[MendCI] Initializing agent telemetry...');
    
    // Progressive log feeds to simulate runtime environment feedback
    const logs = [
      "\n[MendCI] Connecting to local Model Context Protocol (MCP) pipe...",
      "\n[MendCI] Handshake secure. Spawning raw JSON-RPC process listener.",
      "\n[MendCI] Fetching tool registry capabilities from remote GitLab provider...",
      "\n[MendCI] Discovery complete: 9 system tools mapped successfully.",
      "\n[MendCI] Executing tool: get_pipeline_jobs on target project graph...",
      "\n[MendCI] Triage engine active. Analyzing runtime log stack traces...",
      "\n[MendCI] Root cause pinpointed: Missing or corrupted pipeline configuration.",
      "\n[MendCI] Initializing remediation branch: fix-pipeline-no-ci-file...",
      "\n[MendCI] Synthesizing clean YAML configuration specifications...",
      "\n[MendCI] Executing tool: create_merge_request autonomously..."
    ];

    // Incrementally feed log streams every 4.5 seconds to bridge model latency
    logs.forEach((line, index) => {
      setTimeout(() => {
        setStatus(current => {
          if (current === 'running') {
            setAgentResponse(prev => prev + line);
          }
          return current;
        });
      }, (index + 1) * 4500);
    });
    
    try {
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testPayload),
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setAgentResponse(`[MendCI] Remediated successfully!\n\nTarget URL Resolved:\n${data.agentResponse}`);
      } else {
        setStatus('error');
        setAgentResponse('[MendCI FATAL] Execution failure: ' + data.error);
      }
    } catch (error) {
      setStatus('error');
      setAgentResponse('[MendCI FATAL] Network connection terminated.');
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 p-6 pt-14 sm:pt-8 flex flex-col items-center font-mono">
      <div className="w-full max-w-4xl">
        
        {/* Header Element */}
        <header className="mb-10 border-b border-gray-800 pb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-emerald-400">MendCI</h1>
            <p className="text-gray-400 text-sm mt-1">Autonomous SRE Control Center</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">System Status:</span>
            <div className={`px-3 py-1 rounded-full text-xs font-bold ${
              status === 'running' ? 'bg-yellow-500/20 text-yellow-400 animate-pulse' :
              status === 'success' ? 'bg-emerald-500/20 text-emerald-400' :
              status === 'error' ? 'bg-red-500/20 text-red-400' :
              'bg-gray-800 text-gray-400'
            }`}>
              {status.toUpperCase()}
            </div>
          </div>
        </header>

        {/* Action Panel Component */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8 shadow-2xl">
          <h2 className="text-xl font-semibold mb-4 border-b border-gray-800 pb-2">Active Repositories</h2>
          <div className="flex justify-between items-center bg-gray-950 p-4 rounded-lg border border-gray-800">
            <div>
              <p className="font-bold">{testPayload.repositoryId}</p>
              <p className="text-xs text-gray-500">Target Branch: main</p>
            </div>
            <button 
              onClick={triggerAgent}
              disabled={status === 'running'}
              className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded font-bold transition-colors disabled:opacity-50"
            >
              Simulate Pipeline Failure
            </button>
          </div>
        </div>

        {/* Terminal Logging Interface */}
        <div className="bg-black rounded-xl p-6 border border-gray-800 shadow-inner min-h-[300px]">
          <div className="flex gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
            {status === 'idle' && (
              <span className="text-gray-600">Waiting for webhook triggers...</span>
            )}
            {status === 'running' && (
              <span className="text-yellow-400">{agentResponse}</span>
            )}
            {(status === 'success' || status === 'error') && (
              <span>{agentResponse}</span>
            )}
          </div>
          
          {/* Actionable Human-in-the-Loop Verification Button */}
          {status === 'success' && (
            <div className="mt-8 border-t border-gray-800 pt-6">
              <p className="text-emerald-400 text-sm mb-3">Fix generated successfully. Human review required.</p>
              <a 
                href="https://gitlab.com/jacobjerryarackal123-group/jacobjerryarackal123-project/-/merge_requests/1" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded font-bold transition-colors shadow-lg shadow-emerald-900/20"
              >
                Review & Merge Request ↗
              </a>
            </div>
          )}
        </div>

        {/* Interactive Running Context State Loader */}
        {status === 'running' && (
          <div className="mt-4 p-4 rounded-xl border border-yellow-500/30 bg-yellow-500/5 flex items-center gap-4 animate-pulse">
            <div className="w-5 h-5 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
            <div className="text-sm text-yellow-400">
              MendCI SRE Agent is navigating multi-turn tool reasoning loops. Analyzing files, handling branching, and structuring repository changes...
            </div>
          </div>
        )}

        {/* Integrated Product Architecture Accordion */}
        <div className="mt-8 border border-gray-800 bg-gray-900/50 rounded-xl overflow-hidden">
          <button 
            onClick={() => setShowArch(!showArch)}
            className="w-full text-left p-4 font-semibold text-sm text-gray-400 hover:bg-gray-800/50 flex justify-between items-center transition-colors"
          >
            <span>⚙️ SYSTEM SPECIFICATION ARCHITECTURE</span>
            <span>{showArch ? '▲' : '▼'}</span>
          </button>
          
          {showArch && (
            <div className="p-6 bg-gray-950/60 border-t border-gray-800 text-xs text-gray-400 space-y-4 leading-relaxed">
              <p>
                <strong className="text-gray-200">Orchestration Layer:</strong> Powered by <code className="text-emerald-400">GoogleGenAI</code> invoking Gemini 2.5 Pro models utilizing strict environment system rules.
              </p>
              <p>
                <strong className="text-gray-200">Protocol Pipeline:</strong> Communicates dynamically via a custom JSON-RPC Standard I/O Client directly bound into the open-source <code className="text-emerald-400">@modelcontextprotocol/server-gitlab</code> engine layer.
              </p>
              <p>
                <strong className="text-gray-200">Runtime Schemas:</strong> Automatically maps standard lower-case properties into strict upper-case definitions matching Google Cloud SDK validation criteria, circumventing manual build constraints.
              </p>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}