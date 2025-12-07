/**
 * Awesome Hacking Agent SDK
 * 
 * Main entry point for the SDK
 */

export { Agent, AgentInput, AgentOutput, AgentContext, BaseAgent, AgentRegistry } from './agent.js';
export { SecurityScanAgent } from './agents/security-scan.js';
export { ReconAgent } from './agents/recon.js';
export { MCPServer } from './mcp-server.js';

// Re-export for convenience
import { AgentRegistry } from './agent.js';
import { SecurityScanAgent } from './agents/security-scan.js';
import { ReconAgent } from './agents/recon.js';

/**
 * Create a new agent registry with default agents
 */
export function createDefaultRegistry(): AgentRegistry {
  const registry = new AgentRegistry();
  registry.register(new SecurityScanAgent());
  registry.register(new ReconAgent());
  return registry;
}

/**
 * SDK version
 */
export const VERSION = '1.0.0';
