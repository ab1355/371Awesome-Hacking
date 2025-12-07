/**
 * Model Context Protocol (MCP) Server
 * 
 * Provides MCP interface for agent interactions
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { AgentRegistry } from './agent.js';
import { SecurityScanAgent } from './agents/security-scan.js';
import { ReconAgent } from './agents/recon.js';

export class MCPServer {
  private server: Server;
  private registry: AgentRegistry;

  constructor() {
    this.registry = new AgentRegistry();
    this.server = new Server(
      {
        name: 'awesome-hacking-agent-sdk',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
    this.registerDefaultAgents();
  }

  private registerDefaultAgents(): void {
    // Register default agents
    this.registry.register(new SecurityScanAgent());
    this.registry.register(new ReconAgent());
  }

  private setupHandlers(): void {
    // List available tools (agents)
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      const agents = this.registry.list();
      return {
        tools: agents.map((agent) => ({
          name: agent.id,
          description: agent.description,
          inputSchema: {
            type: 'object',
            properties: {
              command: {
                type: 'string',
                description: 'Command to execute',
              },
              params: {
                type: 'object',
                description: 'Command parameters',
              },
            },
            required: ['command'],
          },
        })),
      };
    });

    // Execute tool (agent)
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      const result = await this.registry.execute(name, {
        command: (args as any).command || 'execute',
        params: (args as any).params || {},
      });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    });
  }

  async start(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Awesome Hacking MCP Server running on stdio');
  }

  getRegistry(): AgentRegistry {
    return this.registry;
  }
}

// Start server if run directly
if (require.main === module) {
  const server = new MCPServer();
  server.start().catch(console.error);
}
