// /app/api/agent/route.ts
import { VertexAI } from '@google-cloud/vertexai';
import { NextResponse } from 'next/server';

// Initialize Vertex AI with your project credentials
const vertexAI = new VertexAI({
  project: process.env.GOOGLE_CLOUD_PROJECT as string,
  location: 'us-central1', 
});

export async function POST(req: Request) {
  try {
    // We will pass the failing pipeline details from the frontend/webhook
    const { pipelineId, repositoryId } = await req.json();

    // Initialize Gemini 3 Pro with strict SRE instructions
    const model = vertexAI.preview.getGenerativeModel({
      model: 'gemini-3-pro',
      systemInstruction: {
        role: 'system',
        parts: [{
          text: `You are MendCI, an autonomous MERN-stack Site Reliability Engineer. 
          Your ONLY objective is to resolve failing GitLab CI/CD pipelines.
          
          Execution Workflow:
          1. Analyze the failing pipeline ID: ${pipelineId} for repository: ${repositoryId}.
          2. Use your connected GitLab MCP tools to fetch the exact job trace and error logs.
          3. Identify the syntax or configuration error (focusing on Next.js, React, Node.js, or MongoDB).
          4. Fetch the broken file's contents.
          5. Generate the corrected code patch.
          6. Use the GitLab MCP tool to open a Merge Request with your fix.
          
          CRITICAL: Do not ask for user permission to create the Merge Request. Autonomously execute the tool and return the Merge Request URL in your final JSON response.`
        }]
      },
      // In Phase 5b, we will bind the MCP tools here
      tools: [], 
    });

    // Initial prompt to kick off the autonomous loop
    const prompt = `Pipeline ${pipelineId} just failed. Begin triage and remediation immediately.`;
    
    const result = await model.generateContent(prompt);
    const response = result.response;
    const agentResponse = response.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated";

    return NextResponse.json({ success: true, agentResponse });

  } catch (error) {
    console.error("Agent Execution Error:", error);
    return NextResponse.json({ success: false, error: "Failed to deploy agent" }, { status: 500 });
  }
}