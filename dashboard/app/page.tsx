'use client';

import { useState } from 'react';

export default function Dashboard() {
  const [status, setStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');
  const [agentResponse, setAgentResponse] = useState<string>('');
  
  // Hardcoded for testing. You will replace these with your actual GitLab project details.
  const testPayload = {
    pipelineId: "123456",
    repositoryId: "jacobjerryarackal123-group/jacobjerryarackal123-project"
  };

  const triggerAgent = async () => {
    setStatus('running');
    setAgentResponse('Agent initialized. Connecting to GitLab MCP... \nFetching pipeline logs...');
    
    try {
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testPayload),
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setAgentResponse(data.agentResponse);
      } else {
        setStatus('error');
        setAgentResponse('Agent encountered a critical error: ' + data.error);
      }
    } catch (error) {
      setStatus('error');
      setAgentResponse('Network error connecting to the MendCI backend.');
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 p-6 pt-14 sm:pt-8 flex flex-col items-center font-mono">
      <div className="w-full max-w-4xl">
        
        {/* Header */}
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

        {/* Action Panel */}
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

        {/* Terminal / Output Window */}
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
          
          {/* Actionable MR Button */}
          {status === 'success' && agentResponse.includes('http') && (
            <div className="mt-8 border-t border-gray-800 pt-6">
              <p className="text-emerald-400 text-sm mb-3">Fix generated successfully. Human review required.</p>
              <a 
                href={agentResponse.match(/https?:\/\/[^\s]+/)?.[0] || '#'} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded font-bold transition-colors shadow-lg shadow-emerald-900/20"
              >
                Review & Merge Request ↗
              </a>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}