/**
 * Agent SDK Core
 * 
 * Base interfaces and types for building security research agents
 */

export interface Agent {
  id: string;
  name: string;
  description: string;
  version: string;
  capabilities: string[];
  execute(input: AgentInput): Promise<AgentOutput>;
}

export interface AgentInput {
  command: string;
  params?: Record<string, any>;
  context?: AgentContext;
}

export interface AgentOutput {
  success: boolean;
  data?: any;
  error?: string;
  metadata?: Record<string, any>;
}

export interface AgentContext {
  userId?: string;
  sessionId?: string;
  environment?: Record<string, string>;
}

export abstract class BaseAgent implements Agent {
  public readonly id: string;
  public readonly name: string;
  public readonly description: string;
  public readonly version: string;
  public readonly capabilities: string[];

  constructor(config: {
    id: string;
    name: string;
    description: string;
    version: string;
    capabilities: string[];
  }) {
    this.id = config.id;
    this.name = config.name;
    this.description = config.description;
    this.version = config.version;
    this.capabilities = config.capabilities;
  }

  abstract execute(input: AgentInput): Promise<AgentOutput>;

  protected validateInput(input: AgentInput, requiredParams: string[]): void {
    if (!input.params) {
      throw new Error('Missing required parameters');
    }

    for (const param of requiredParams) {
      if (!(param in input.params)) {
        throw new Error(`Missing required parameter: ${param}`);
      }
    }
  }

  protected createOutput(
    success: boolean,
    data?: any,
    error?: string,
    metadata?: Record<string, any>
  ): AgentOutput {
    return { success, data, error, metadata };
  }
}

export class AgentRegistry {
  private agents: Map<string, Agent> = new Map();

  register(agent: Agent): void {
    if (this.agents.has(agent.id)) {
      throw new Error(`Agent with id ${agent.id} is already registered`);
    }
    this.agents.set(agent.id, agent);
  }

  unregister(agentId: string): void {
    this.agents.delete(agentId);
  }

  get(agentId: string): Agent | undefined {
    return this.agents.get(agentId);
  }

  list(): Agent[] {
    return Array.from(this.agents.values());
  }

  async execute(agentId: string, input: AgentInput): Promise<AgentOutput> {
    const agent = this.get(agentId);
    if (!agent) {
      return {
        success: false,
        error: `Agent not found: ${agentId}`,
      };
    }

    try {
      return await agent.execute(input);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
