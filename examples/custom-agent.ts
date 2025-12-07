/**
 * Example: Custom Agent
 * 
 * Demonstrates how to create and register a custom agent
 */

import { BaseAgent, AgentInput, AgentOutput, AgentRegistry } from '../dist/index.js';

class ExampleCustomAgent extends BaseAgent {
  constructor() {
    super({
      id: 'example-custom',
      name: 'Example Custom Agent',
      description: 'A custom agent example for demonstration',
      version: '1.0.0',
      capabilities: ['greet', 'analyze'],
    });
  }

  async execute(input: AgentInput): Promise<AgentOutput> {
    const { command, params } = input;

    switch (command) {
      case 'greet':
        return this.greet(params);
      case 'analyze':
        return this.analyze(params);
      default:
        return this.createOutput(false, null, `Unknown command: ${command}`);
    }
  }

  private async greet(params?: Record<string, any>): Promise<AgentOutput> {
    this.validateInput({ command: 'greet', params }, ['name']);

    const greeting = `Hello, ${params!.name}! Welcome to the Awesome Hacking Agent SDK.`;
    
    return this.createOutput(true, { message: greeting }, undefined, {
      timestamp: new Date().toISOString(),
    });
  }

  private async analyze(params?: Record<string, any>): Promise<AgentOutput> {
    this.validateInput({ command: 'analyze', params }, ['data']);

    const data = params!.data;
    const analysis = {
      type: typeof data,
      value: data,
      length: Array.isArray(data) ? data.length : undefined,
      analyzed: true,
    };

    return this.createOutput(true, analysis);
  }
}

async function main() {
  console.log('=== Custom Agent Example ===\n');

  // Create a new registry
  const registry = new AgentRegistry();

  // Register the custom agent
  const customAgent = new ExampleCustomAgent();
  registry.register(customAgent);

  console.log('Registered custom agent:', customAgent.id);

  // Test the greet command
  console.log('\n--- Testing greet command ---');
  const greetResult = await registry.execute('example-custom', {
    command: 'greet',
    params: { name: 'Security Researcher' }
  });
  console.log(JSON.stringify(greetResult, null, 2));

  // Test the analyze command
  console.log('\n--- Testing analyze command ---');
  const analyzeResult = await registry.execute('example-custom', {
    command: 'analyze',
    params: { data: [1, 2, 3, 4, 5] }
  });
  console.log(JSON.stringify(analyzeResult, null, 2));
}

main().catch(console.error);
