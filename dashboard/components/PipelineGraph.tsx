// /components/PipelineGraph.tsx
import React from 'react';
import ReactFlow, { Background, Controls, MarkerType } from 'reactflow';
import 'reactflow/dist/style.css';

interface GraphProps {
  status: 'idle' | 'running' | 'success' | 'error';
}

export default function PipelineGraph({ status }: GraphProps) {
  // Styles for our custom rectangular nodes
  const nodeStyle = (isActive: boolean, isSuccess: boolean) => ({
    background: isSuccess ? '#065f46' : isActive ? '#854d0e' : '#111827',
    color: isSuccess ? '#34d399' : isActive ? '#facc15' : '#9ca3af',
    border: `1px solid ${isSuccess ? '#10b981' : isActive ? '#eab308' : '#374151'}`,
    padding: '10px',
    borderRadius: '8px',
    fontWeight: 'bold',
    fontSize: '11px',
    fontFamily: 'monospace',
    width: 220,
    boxShadow: isActive ? '0 0 15px rgba(234, 179, 8, 0.15)' : 'none',
  });

  const nodes = [
    {
      id: '1',
      data: { label: '🔴 CRITICAL: HOOK_TRIGGERED' },
      position: { x: 100, y: 20 },
      style: nodeStyle(status === 'running' || status === 'success', status === 'success'),
    },
    {
      id: '2',
      data: { label: '🔍 TOOL: fetch_pipeline_jobs' },
      position: { x: 100, y: 100 },
      style: nodeStyle(status === 'running' || status === 'success', status === 'success'),
    },
    {
      id: '3',
      data: { label: '🧠 REASONING: gemini-2.5-pro' },
      position: { x: 100, y: 180 },
      style: nodeStyle(status === 'running' || status === 'success', status === 'success'),
    },
    {
      id: '4',
      data: { label: '🚀 EXECUTION: create_merge_request' },
      position: { x: 100, y: 260 },
      style: nodeStyle(status === 'running', status === 'success'),
    },
    {
      id: '5',
      data: { label: '✅ REPAIR COMPLETE (200 OK)' },
      position: { x: 100, y: 340 },
      style: nodeStyle(false, status === 'success'),
    },
  ];

  const edges = [
    { id: 'e1-2', source: '1', target: '2', animated: status === 'running', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e2-3', source: '2', target: '3', animated: status === 'running', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e3-4', source: '3', target: '4', animated: status === 'running', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e4-5', source: '4', target: '5', animated: false, markerEnd: { type: MarkerType.ArrowClosed } },
  ];

  return (
    <div className="w-full h-[420px] bg-gray-950 border border-gray-800 rounded-xl overflow-hidden mt-6">
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <Background color="#374151" gap={16} size={1} />
        <Controls className="bg-gray-900 border border-gray-800 text-gray-100 fill-white [&>button]:border-gray-800" />
      </ReactFlow>
    </div>
  );
}