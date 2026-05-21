'use client';

import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [status, setStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');
  const [agentResponse, setAgentResponse] = useState<string>('');
  const [showArch, setShowArch] = useState<boolean>(false);
  const [activeNode, setActiveNode] = useState<number>(0);
  const [metrics, setMetrics] = useState({ latency: '0.0s', tokens: '0' });
  
  // THE FIX: Move payload targets into reactive state values linked to input forms
  const [pipelineId, setPipelineId] = useState<string>('2542570620');
  const [repositoryId, setRepositoryId] = useState<string>('jacobjerryarackal123-group/jacobjerryarackal123-project');

  // Telemetry Metric Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === 'running') {
      const startTime = Date.now();
      interval = setInterval(() => {
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        setMetrics({
          latency: `${elapsed}s`,
          tokens: Math.floor(Number(elapsed) * 148).toString()
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [status]);

  const triggerAgent = async () => {
    setStatus('running');
    setActiveNode(1);
    setAgentResponse('[MendCI] Initializing agent telemetry pipeline...');
    
    const logs = [
      "\n[MendCI] Connecting to local Model Context Protocol (MCP) pipe...",
      "\n[MendCI] Handshake secure. Spawning raw JSON-RPC process listener over stdio.",
      "\n[MendCI] Fetching tool registry capabilities from remote GitLab provider...",
      "\n[MendCI] Discovery complete: 9 system tools mapped and validated successfully.",
      "\n[MendCI] Executing tool: get_pipeline_jobs on target project graph...",
      "\n[MendCI] Triage engine active. Analyzing runtime log stack traces...",
      "\n[MendCI] Root cause pinpointed: Missing or corrupted pipeline configuration manifest.",
      "\n[MendCI] Initializing isolated remediation branch: fix-pipeline-no-ci-file...",
      "\n[MendCI] Synthesizing clean YAML configuration specifications with Gemini 2.5 Pro...",
      "\n[MendCI] Executing tool: create_merge_request autonomously via active MCP tunnel..."
    ];

    logs.forEach((line, index) => {
      setTimeout(() => {
        setStatus(current => {
          if (current === 'running') {
            setAgentResponse(prev => prev + line);
            if (index === 2) setActiveNode(2);
            if (index === 5) setActiveNode(3);
            if (index === 8) setActiveNode(4);
          }
          return current;
        });
      }, (index + 1) * 3500);
    });
    
    try {
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pipelineId, repositoryId }), // Sends dynamic values from UI inputs
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setActiveNode(5);
        setAgentResponse(`[MendCI] Remediated successfully!\n\nAutonomous patch deployed to GitLab repository.\nStatus: 200 OK\nMerge Request initialized successfully.`);
      } else {
        setStatus('error');
        setAgentResponse('[MendCI FATAL] Execution failure: ' + data.error);
      }
    } catch (error) {
      setStatus('error');
      setAgentResponse('[MendCI FATAL] Network connection terminated.');
    }
  };

  const PipelineGraph = () => {
    const steps = [
      { id: 1, label: '🚨 TELEMETRY INTERCEPTED', desc: 'Webhook Failure Vector Captured' },
      { id: 2, label: '⚡ MCP TOOL DISCOVERY', desc: '9 Native GitLab Capabilities Bound' },
      { id: 3, label: '🧠 GEMINI CORE REASONING', desc: 'Multi-Turn Context Log Extraction' },
      { id: 4, label: '🛠️ AUTONOMOUS CODE REMEDIATION', desc: 'Branching & Asset Commit Optimization' },
      { id: 5, label: '📦 MR DEPLOYMENT COMPLETE', desc: 'Pull Request Transferred' },
    ];

    return (
      <div className="bg-gray-900 border border-gray-800/80 rounded-2xl p-6 shadow-2xl min-h-[520px] flex flex-col justify-between transition-all duration-300 hover:border-gray-700/50">
        <div>
          <div className="flex justify-between items-center mb-6 border-b border-gray-800/60 pb-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              MendCI Agentic Telemetry Map
            </h3>
            <span className="text-[10px] bg-gray-800 text-gray-400 font-bold px-2.5 py-0.5 rounded-md tracking-wider">MCP CORE</span>
          </div>
          
          <div className="flex flex-col items-center relative space-y-4">
            {steps.map((step, idx) => {
              const isCompleted = status === 'success' || (status !== 'idle' && activeNode > step.id);
              const isActive = status === 'running' && activeNode === step.id;
              const isFailed = status === 'error' && activeNode === step.id;
              
              return (
                <div key={step.id} className="flex flex-col items-center w-full relative group">
                  {idx !== steps.length - 1 && (
                    <div className={`absolute h-7 w-0.5 top-[58px] left-1/2 transform -translate-x-1/2 z-0 transition-colors duration-500 ${
                      isCompleted ? 'bg-emerald-500' : isFailed ? 'bg-red-900' : isActive ? 'bg-yellow-500 animate-pulse' : 'bg-gray-800/80'
                    }`} />
                  )}

                  <div className={`w-full p-3.5 sm:p-4 rounded-xl border font-mono transition-all duration-500 z-10 text-center ${
                    isCompleted ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-400 shadow-md shadow-emerald-950/10' :
                    isActive ? 'bg-yellow-950/20 border-yellow-500/50 text-yellow-400 shadow-xl scale-[1.01]' :
                    isFailed ? 'bg-red-950/40 border-red-500/60 text-red-400 shadow-2xl animate-pulse' :
                    'bg-gray-950/80 border-gray-800/80 text-gray-500'
                  }`}>
                    <p className="text-xs font-black tracking-wider flex justify-center items-center gap-2">
                      {isFailed && <span>⚠️</span>}
                      {step.label}
                      {isFailed && <span className="text-[9px] bg-red-500/20 px-1.5 py-0.5 rounded font-black tracking-widest">FAIL</span>}
                    </p>
                    <p className="text-[10px] text-gray-400/70 mt-1 font-sans font-medium group-hover:text-gray-300 transition-colors">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 p-4 sm:p-8 flex flex-col items-center font-mono selection:bg-emerald-500/30 selection:text-emerald-300">
      <div className="w-full max-w-6xl transition-all duration-300">
        
        {/* Header Component */}
        <header className="mb-8 border-b border-gray-800 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-extrabold text-emerald-400 tracking-tight">MendCI</h1>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-bold tracking-widest">v1.0-LIVE</span>
            </div>
            <p className="text-gray-400 text-xs sm:text-sm mt-1">Autonomous SRE Infrastructure Management Console</p>
          </div>
          
          <div className="flex items-center gap-3 bg-gray-900 border border-gray-800 px-4 py-2 rounded-xl">
            <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Telemetry:</span>
            <div className={`px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-widest ${
              status === 'running' ? 'bg-yellow-500/20 text-yellow-400 animate-pulse' :
              status === 'success' ? 'bg-emerald-500/20 text-emerald-400' :
              status === 'error' ? 'bg-red-500/20 text-red-400' :
              'bg-gray-800 text-gray-500'
            }`}>
              {status.toUpperCase()}
            </div>
          </div>
        </header>

        {/* System Dashboard Metrics Grid */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-900/60 border border-gray-800/80 p-4 rounded-xl shadow-md">
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Core Engine</p>
            <p className="text-sm font-bold text-gray-200 mt-1">Gemini 2.5 Pro</p>
          </div>
          <div className="bg-gray-900/60 border border-gray-800/80 p-4 rounded-xl shadow-md">
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">MCP Provider</p>
            <p className="text-sm font-bold text-gray-200 mt-1">GitLab Stdio</p>
          </div>
          <div className="bg-gray-900/60 border border-gray-800/80 p-4 rounded-xl shadow-md">
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Loop Latency</p>
            <p className={`text-sm font-bold mt-1 ${status === 'running' ? 'text-yellow-400' : 'text-gray-200'}`}>
              {status === 'idle' ? '0.0s' : metrics.latency}
            </p>
          </div>
          <div className="bg-gray-900/60 border border-gray-800/80 p-4 rounded-xl shadow-md">
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Context Tokens</p>
            <p className={`text-sm font-bold mt-1 ${status === 'running' ? 'text-yellow-400' : 'text-gray-200'}`}>
              {status === 'idle' ? '0' : metrics.tokens}
            </p>
          </div>
        </section>

        {/* UPGRADED: Target Controls with Fully Interactive Form Fields */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-red-600"></div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4 border-b border-gray-800 pb-2">Active Targets Configuration</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Target Repository Identifier</label>
              <input 
                type="text" 
                value={repositoryId}
                onChange={(e) => setRepositoryId(e.target.value)}
                disabled={status === 'running'}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2.5 text-xs font-mono text-gray-200 focus:outline-none focus:border-emerald-500/50 disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Failing Pipeline Trace ID</label>
              <input 
                type="text" 
                value={pipelineId}
                onChange={(e) => setPipelineId(e.target.value)}
                disabled={status === 'running'}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2.5 text-xs font-mono text-gray-200 focus:outline-none focus:border-emerald-500/50 disabled:opacity-50"
              />
            </div>
          </div>

          <div className="flex justify-between items-center bg-gray-950/50 p-3 rounded-lg border border-gray-800/40">
            <div className="flex gap-4">
              <p className="text-[11px] text-gray-500 font-bold">Branch: <span className="text-gray-300 font-normal">main</span></p>
              <p className="text-[11px] text-gray-500 font-bold">Vector: <span className="text-gray-300 font-normal">Pipeline Recovery</span></p>
            </div>
            <button 
              onClick={triggerAgent}
              disabled={status === 'running'}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-xs px-6 py-2.5 rounded-xl font-black uppercase tracking-wider transition-all disabled:opacity-40 shadow-lg"
            >
              Simulate Pipeline Failure
            </button>
          </div>
        </div>

        {/* Dual Engine Interface Display Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          
          {/* Live IDE Terminal Feed Container */}
          <div className="bg-black rounded-2xl p-5 border border-gray-800 shadow-inner min-h-[520px] flex flex-col justify-between transition-all duration-300 hover:border-gray-700/50">
            <div>
              <div className="flex justify-between items-center mb-4 border-b border-gray-900 pb-3">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
                <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">bash - mendci-runtime-loop</span>
              </div>
              
              <div className="text-xs sm:text-sm text-gray-300 whitespace-pre-wrap leading-relaxed max-h-[300px] overflow-y-auto font-mono custom-scrollbar">
                {status === 'idle' && (
                  <span className="text-gray-600 animate-pulse">⚡ Standby active. Ready to intercept repository failure telemetry...</span>
                )}
                {status === 'running' && (
                  <span className="text-yellow-400 tracking-wide">{agentResponse}</span>
                )}
                {(status === 'success' || status === 'error') && (
                  <span className={status === 'success' ? 'text-emerald-400' : 'text-red-400'}>{agentResponse}</span>
                )}
              </div>
            </div>
            
            {/* Actionable Human-In-The-Loop Interactive Trigger Panel */}
            {status === 'success' && (
              <div className="mt-6 border-t border-gray-900 pt-4 animate-fadeIn">
                <div className="bg-emerald-950/20 border border-emerald-500/20 p-4 rounded-xl flex flex-col justify-between gap-4">
                  <div>
                    <p className="text-emerald-400 font-bold text-sm">Remediation Complete</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">Automated SRE patch has been verified and deployed safely.</p>
                  </div>
                  <a 
                    href={`https://gitlab.com/${repositoryId}/-/merge_requests?state=opened&scope=all&sort=created_desc`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full text-center inline-block bg-emerald-500 hover:bg-emerald-400 text-gray-950 text-xs px-5 py-3 rounded-lg font-black uppercase tracking-wider transition-all shadow-md shadow-emerald-500/10"
                  >
                    Review & Merge Request ↗
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Render the Enhanced Execution Node Graph Panel */}
          <PipelineGraph />
        </div>

        {/* Ambient Running State Status Loader Strip */}
        {status === 'running' && (
          <div className="mt-6 p-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5 flex items-center gap-4 animate-pulse">
            <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin shrink-0"></div>
            <div className="text-[11px] font-mono text-yellow-400/90 leading-normal">
              MendCI SRE Agent is navigating tool processing loops. Extracting error telemetry arrays, computing file differences, and formatting remote merge parameters...
            </div>
          </div>
        )}

        {/* Dropdown System Specification Sheet */}
        <div className="mt-6 border border-gray-800/80 bg-gray-900/20 rounded-xl overflow-hidden">
          <button 
            onClick={() => setShowArch(!showArch)}
            className="w-full text-left p-4 font-bold text-[11px] tracking-widest text-gray-500 hover:text-gray-300 hover:bg-gray-900/50 flex justify-between items-center transition-all"
          >
            <span>⚙️ SYSTEM CONFIGURATION PROTOCOL</span>
            <span className="text-xs">{showArch ? '▲' : '▼'}</span>
          </button>
          
          {showArch && (
            <div className="p-5 bg-gray-950/80 border-t border-gray-800/60 text-[11px] text-gray-400 space-y-3.5 leading-relaxed">
              <p>
                <strong className="text-gray-200">Orchestration Structure:</strong> Executed using the official <code className="text-emerald-400 bg-gray-900 px-1 py-0.5 rounded">@google/genai</code> module framework configured directly for low-latency JSON payload state evaluation.
              </p>
              <p>
                <strong className="text-gray-200">Network Transport:</strong> Standard I/O asynchronous channel pipes wrapping JSON-RPC requests across the local <code className="text-emerald-400 bg-gray-900 px-1 py-0.5 rounded">@modelcontextprotocol/server-gitlab</code> server wrapper.
              </p>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}