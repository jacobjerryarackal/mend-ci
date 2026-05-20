// /app/api/agent/route.ts
import { VertexAI, FunctionDeclaration, SchemaType } from '@google-cloud/vertexai';
import { NextResponse } from 'next/server';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

// 1. Initialize Vertex AI
const vertexAI = new VertexAI({
  project: process.env.GOOGLE_CLOUD_PROJECT as string,
  location: 'us-central1', 
});

// Helper function to map MCP tools to Vertex AI format
function mcpToolToVertexTool(mcpTool: any): FunctionDeclaration {
  return {
    name: mcpTool.name,
    description: mcpTool.description || `Executes the ${mcpTool.name} tool.`,
    parameters: {
      type: SchemaType.OBJECT,
      properties: mcpTool.inputSchema?.properties || {},
      required: mcpTool.inputSchema?.required || [],
    },
  };
}

export async function POST(req: Request) {
  try {
    const { pipelineId, repositoryId } = await req.json();

    // 2. Initialize the MCP Client and connect to GitLab
    const transport = new StdioClientTransport({
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-gitlab'],
      env: {
        ...process.env,
        GITLAB_PERSONAL_ACCESS_TOKEN: process.env.GITLAB_PERSONAL_ACCESS_TOKEN!,
        GITLAB_API_URL: process.env.GITLAB_API_URL || "https://gitlab.com/api/v4"
      }
    });

    const mcpClient = new Client({ name: 'MendCI-Agent', version: '1.0.0' }, { capabilities: {} });
    await mcpClient.connect(transport);

    // 3. Fetch Tools from GitLab MCP and format them for Gemini
    const mcpToolsResponse = await mcpClient.listTools();
    const vertexTools = mcpToolsResponse.tools.map(mcpToolToVertexTool);

    // 4. Initialize Gemini 3 with the injected tools
    const model = vertexAI.preview.getGenerativeModel({
      model: 'gemini-3-pro',
      systemInstruction: {
        role: 'system',
        parts: [{
          text: `You are MendCI, an autonomous Site Reliability Engineer. 
          Resolve pipeline ID: ${pipelineId} for repo: ${repositoryId}.
          Fetch the failing log, analyze the error, rewrite the file, and create a Merge Request.
          Return the Merge Request URL in your final response.`
        }]
      },
      tools: [{ functionDeclarations: vertexTools }], 
    });

    // 5. Execute the Agentic Loop
    const chat = model.startChat();
    let result = await chat.sendMessage(`Pipeline ${pipelineId} just failed. Fix it.`);
    let responseText = "";

    // If Gemini decides to call a tool, it will return a functionCall
    let parts = result.response.candidates?.[0]?.content?.parts || [];

    let functionCallPart = parts.find(
    (part: any) => part.functionCall
    );

    while (functionCallPart?.functionCall) {
    const call = functionCallPart.functionCall;
      
      // Execute the tool locally via the MCP Client
      const toolResult = await mcpClient.callTool({
        name: call.name,
        arguments: call.args as Record<string, unknown>
      });

      // Pass the tool's result back to Gemini so it can continue reasoning
      result = await chat.sendMessage([{
        functionResponse: {
            name: call.name!,
            response: {
            result: toolResult.content
            }
        }
        }]);

        parts = result.response.candidates?.[0]?.content?.parts || [];

        functionCallPart = parts.find(
        (part: any) => part.functionCall
        );
    }

    // Capture the final human-readable string (which should contain the MR link)
    responseText = result.response.candidates?.[0]?.content?.parts?.[0]?.text || "Execution complete.";
    
    // Clean up
    await transport.close();

    return NextResponse.json({ success: true, agentResponse: responseText });

  } catch (error) {
    console.error("Agent Execution Error:", error);
    return NextResponse.json({ success: false, error: "Agent loop failed." }, { status: 500 });
  }
}