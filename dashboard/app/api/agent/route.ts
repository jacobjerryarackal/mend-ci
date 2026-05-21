// /app/api/agent/route.ts
import { NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';
import { spawn, execSync } from 'child_process';

// ── Find npx.cmd path on Windows ──────────────────────────────────────────
function findNpx(): string {
  if (process.platform === 'win32') {
    try {
      const result = execSync('where.exe npx.cmd', { encoding: 'utf8' }).trim();
      const found  = result.split('\n')[0].trim();
      if (found) return found;
    } catch { /* fall through */ }

    const candidates = [
      `${process.env.APPDATA      ?? ''}\\npm\\npx.cmd`,
      `${process.env.LOCALAPPDATA ?? ''}\\fnm\\aliases\\default\\npx.cmd`,
      'C:\\Program Files\\nodejs\\npx.cmd',
      'C:\\Program Files (x86)\\nodejs\\npx.cmd',
    ];
    for (const p of candidates) {
      try {
        execSync(`"${p}" --version`, { encoding: 'utf8' });
        return p;
      } catch { /* try next */ }
    }
    return 'npx.cmd'; // last resort
  }

  // Mac / Linux
  try {
    return execSync('which npx', { encoding: 'utf8' }).trim();
  } catch {
    for (const p of ['/usr/local/bin/npx', '/usr/bin/npx']) {
      try { execSync(`${p} --version`, { encoding: 'utf8' }); return p; } catch { /* next */ }
    }
    throw new Error('Cannot find npx. Make sure Node.js is installed.');
  }
}

// ── Raw JSON-RPC MCP client over stdio ────────────────────────────────────
class RawMCPClient {
  private proc: ReturnType<typeof spawn>;
  private buffer = '';
  private pending = new Map<number, (res: any) => void>();
  private idCounter = 1;

  constructor() {
    const npxPath = findNpx();
    console.log('[MendCI] npx path:', npxPath);

    const isWin = process.platform === 'win32';

    // On Windows, .cmd files MUST be spawned with shell:true.
    // To avoid the "C:\Program is not recognized" space-splitting bug,
    // we pass the whole command as a single shell string instead of
    // using the args array when shell:true is active.
    this.proc = isWin
      ? spawn(
          // Wrap path in quotes, append args as a plain string
          `"${npxPath}" -y @modelcontextprotocol/server-gitlab`,
          [], // no separate args — all baked into the command string
          {
            env: {
              ...process.env,
              PATH:                         process.env.PATH                         ?? '',
              GITLAB_PERSONAL_ACCESS_TOKEN: process.env.GITLAB_PERSONAL_ACCESS_TOKEN ?? '',
              GITLAB_API_URL:               process.env.GITLAB_API_URL               ?? 'https://gitlab.com/api/v4',
            },
            stdio: ['pipe', 'pipe', 'pipe'],
            shell: true, // required for .cmd on Windows
          }
        )
      : spawn(
          npxPath,
          ['-y', '@modelcontextprotocol/server-gitlab'],
          {
            env: {
              ...process.env,
              PATH:                         process.env.PATH                         ?? '',
              GITLAB_PERSONAL_ACCESS_TOKEN: process.env.GITLAB_PERSONAL_ACCESS_TOKEN ?? '',
              GITLAB_API_URL:               process.env.GITLAB_API_URL               ?? 'https://gitlab.com/api/v4',
            },
            stdio: ['pipe', 'pipe', 'pipe'],
            shell: false,
          }
        );

    this.proc.on('error', (err) =>
      console.error('[MendCI] MCP process spawn error:', err)
    );

    this.proc.stdout!.on('data', (chunk: Buffer) => {
      this.buffer += chunk.toString();
      const lines  = this.buffer.split('\n');
      this.buffer  = lines.pop() ?? '';
      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const msg = JSON.parse(line);
          if (msg.id !== undefined && this.pending.has(msg.id)) {
            this.pending.get(msg.id)!(msg);
            this.pending.delete(msg.id);
          }
        } catch { /* ignore non-JSON noise */ }
      }
    });

    this.proc.stderr!.on('data', (d: Buffer) =>
      console.log('[GitLab MCP stderr]', d.toString())
    );
  }

  private send(method: string, params: any = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      const id  = this.idCounter++;
      const msg = JSON.stringify({ jsonrpc: '2.0', id, method, params }) + '\n';
      this.pending.set(id, resolve);
      setTimeout(() => {
        if (this.pending.has(id)) {
          this.pending.delete(id);
          reject(new Error(`MCP timeout: ${method}`));
        }
      }, 30_000);
      this.proc.stdin!.write(msg);
    });
  }

  async initialize() {
    const res = await this.send('initialize', {
      protocolVersion: '2024-11-05',
      capabilities:    {},
      clientInfo:      { name: 'MendCI-Agent', version: '1.0.0' },
    });
    console.log('[MendCI] MCP initialized:', JSON.stringify(res?.result?.serverInfo));
    this.proc.stdin!.write(
      JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' }) + '\n'
    );
  }

  async listTools(): Promise<any[]> {
    const res = await this.send('tools/list', {});
    return res?.result?.tools ?? [];
  }

  async callTool(name: string, args: Record<string, unknown>): Promise<string> {
    const res     = await this.send('tools/call', { name, arguments: args });
    const content = res?.result?.content;
    if (Array.isArray(content)) {
      return content.map((c: any) => c.text ?? JSON.stringify(c)).join('\n');
    }
    return JSON.stringify(res?.result ?? res?.error ?? 'No result');
  }

  close() {
    try {
      this.proc.stdin!.end();
      this.proc.kill();
    } catch { /* already dead */ }
  }
}

// ── Schema cleaning ────────────────────────────────────────────────────────
const typeMap: Record<string, Type> = {
  object:  Type.OBJECT,
  string:  Type.STRING,
  number:  Type.NUMBER,
  integer: Type.INTEGER,
  boolean: Type.BOOLEAN,
  array:   Type.ARRAY,
};

function cleanProperties(properties: any): Record<string, any> {
  if (!properties || typeof properties !== 'object') return {};
  const cleaned: Record<string, any> = {};

  for (const [key, val] of Object.entries(properties)) {
    if (!val || typeof val !== 'object') continue;
    const v            = val as Record<string, any>;
    const resolvedType = typeMap[String(v.type ?? '').toLowerCase()] ?? Type.STRING;

    cleaned[key] = {
      type:        resolvedType,
      description: String(v.description ?? ''),
    };

    if (resolvedType === Type.OBJECT && v.properties)
      cleaned[key].properties = cleanProperties(v.properties);

    if (resolvedType === Type.ARRAY && v.items) {
      cleaned[key].items = {
        type:        typeMap[String(v.items.type ?? '').toLowerCase()] ?? Type.STRING,
        description: String(v.items.description ?? ''),
        ...(v.items.properties
          ? { properties: cleanProperties(v.items.properties) }
          : {}),
      };
    }
  }
  return cleaned;
}

function buildGeminiTool(rawTool: any) {
  return {
    name:        String(rawTool.name),
    description: String(rawTool.description ?? `Execute ${rawTool.name}`),
    parameters: {
      type:       Type.OBJECT,
      properties: cleanProperties(rawTool?.inputSchema?.properties ?? {}),
      required:   Array.isArray(rawTool?.inputSchema?.required)
                    ? [...rawTool.inputSchema.required]
                    : [],
    },
  };
}

// ── Route handler ──────────────────────────────────────────────────────────
export async function POST(req: Request) {
  const mcp = new RawMCPClient();

  try {
    const { pipelineId, repositoryId } = await req.json();

    await mcp.initialize();

    const rawTools = await mcp.listTools();
    console.log('[MendCI] Tools fetched:', rawTools.length);

    const tools = rawTools.map(buildGeminiTool);

    const ai = new GoogleGenAI({
      vertexai: true,
      project:  process.env.GOOGLE_CLOUD_PROJECT ?? '',
      location: 'us-central1',
    });

    const systemInstruction = `You are MendCI, an autonomous Site Reliability Engineer.
Resolve failed pipeline ${pipelineId} in repository ${repositoryId}.
1. Fetch the failing job log.
2. Identify the root cause.
3. Rewrite the broken file.
4. Commit and open a Merge Request.
5. Return ONLY the Merge Request URL as your final message.`;

    const contents: any[] = [
      {
        role:  'user',
        parts: [{ text: `Pipeline ${pipelineId} just failed. Fix it.` }],
      },
    ];

    let turns = 0;
    while (turns++ < 20) {
      const response = await ai.models.generateContent({
        model:    'gemini-2.5-pro',
        config:   { systemInstruction, tools: [{ functionDeclarations: tools }] },
        contents,
      });

      const parts = response.candidates?.[0]?.content?.parts ?? [];
      contents.push({ role: 'model', parts });

      const fnPart = parts.find((p: any) => p.functionCall);
      if (!fnPart?.functionCall) break;

      const { name, args } = fnPart.functionCall;
      console.log(`[MendCI] 🛠️  Tool: ${name}`, args);

      let toolResult: string;
      try {
        toolResult = await mcp.callTool(name as string, args as Record<string, unknown>);
        console.log(`[MendCI] ✅ ${name}:`, toolResult.slice(0, 300));
      } catch (e) {
        toolResult = `ERROR: ${String(e)}`;
        console.error(`[MendCI] ❌ ${name} failed:`, e);
      }

      contents.push({
        role:  'user',
        parts: [{ functionResponse: { name, response: { result: toolResult } } }],
      });
    }

    const lastModelTurn = [...contents].reverse().find((c) => c.role === 'model');
    const finalText =
      lastModelTurn?.parts?.find((p: any) => p.text)?.text
      ?? 'Done but no final text returned.';

    return NextResponse.json({ success: true, agentResponse: finalText });

  } catch (error: any) {
    console.error('[MendCI FATAL]', error);
    return NextResponse.json(
      { success: false, error: error.message ?? 'Agent loop failed.' },
      { status: 500 }
    );
  } finally {
    mcp.close();
  }
}