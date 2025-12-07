# Agents Documentation

This document provides comprehensive documentation for all agents available in the Awesome Hacking Agent SDK.

## Table of Contents

- [Overview](#overview)
- [Agent Architecture](#agent-architecture)
- [Available Agents](#available-agents)
  - [Security Scanner Agent](#security-scanner-agent)
  - [Reconnaissance Agent](#reconnaissance-agent)
- [Creating Custom Agents](#creating-custom-agents)
- [Agent Registry](#agent-registry)
- [Best Practices](#best-practices)

## Overview

Agents in this SDK are modular, reusable components designed to perform specific security research tasks. Each agent implements a standardized interface, making them easy to use, extend, and integrate with the MCP server.

### Key Concepts

- **Agent**: A self-contained module that performs specific security tasks
- **Command**: An action the agent can perform
- **Capability**: A feature or function the agent supports
- **Input**: Parameters and context provided to the agent
- **Output**: Results returned by the agent

## Agent Architecture

All agents extend the `BaseAgent` class and implement the `Agent` interface:

```typescript
interface Agent {
  id: string;              // Unique identifier
  name: string;            // Human-readable name
  description: string;     // What the agent does
  version: string;         // Semantic version
  capabilities: string[];  // List of supported commands
  execute(input: AgentInput): Promise<AgentOutput>;
}
```

### Agent Input

```typescript
interface AgentInput {
  command: string;                    // Command to execute
  params?: Record<string, any>;       // Command parameters
  context?: AgentContext;             // Optional execution context
}
```

### Agent Output

```typescript
interface AgentOutput {
  success: boolean;                   // Whether execution succeeded
  data?: any;                         // Result data
  error?: string;                     // Error message if failed
  metadata?: Record<string, any>;     // Additional metadata
}
```

## Available Agents

### Security Scanner Agent

**ID**: `security-scan`  
**Version**: 1.0.0

A comprehensive security scanning agent that performs various types of security assessments.

#### Capabilities

##### 1. Port Scan (`port-scan`)

Scans target systems for open ports and identifies running services.

**Input Parameters:**
- `target` (required): IP address or hostname to scan

**Example:**
```typescript
const result = await registry.execute('security-scan', {
  command: 'port-scan',
  params: { target: '192.168.1.1' }
});
```

**Output:**
```json
{
  "success": true,
  "data": {
    "target": "192.168.1.1",
    "timestamp": "2024-01-01T12:00:00.000Z",
    "openPorts": [
      { "port": 22, "service": "SSH", "version": "OpenSSH 8.2" },
      { "port": 80, "service": "HTTP", "version": "nginx 1.18.0" },
      { "port": 443, "service": "HTTPS", "version": "nginx 1.18.0" }
    ],
    "scanDuration": "2.3s"
  },
  "metadata": {
    "scanType": "port-scan",
    "portsScanned": 65535
  }
}
```

##### 2. Vulnerability Scan (`vulnerability-scan`)

Identifies security vulnerabilities in target systems.

**Input Parameters:**
- `target` (required): IP address or hostname to scan

**Example:**
```typescript
const result = await registry.execute('security-scan', {
  command: 'vulnerability-scan',
  params: { target: 'example.com' }
});
```

**Output:**
```json
{
  "success": true,
  "data": {
    "target": "example.com",
    "vulnerabilities": [
      {
        "id": "CVE-2023-12345",
        "severity": "HIGH",
        "description": "SQL Injection vulnerability",
        "affectedComponent": "Web Application"
      }
    ],
    "totalVulnerabilities": 1
  }
}
```

##### 3. Web Scan (`web-scan`)

Analyzes web applications for security issues.

**Input Parameters:**
- `url` (required): URL of the web application

**Example:**
```typescript
const result = await registry.execute('security-scan', {
  command: 'web-scan',
  params: { url: 'https://example.com' }
});
```

##### 4. SSL Check (`ssl-check`)

Validates SSL/TLS certificates and configurations.

**Input Parameters:**
- `domain` (required): Domain name to check

**Example:**
```typescript
const result = await registry.execute('security-scan', {
  command: 'ssl-check',
  params: { domain: 'example.com' }
});
```

### Reconnaissance Agent

**ID**: `recon`  
**Version**: 1.0.0

Performs information gathering and reconnaissance on target systems.

#### Capabilities

##### 1. DNS Lookup (`dns-lookup`)

Retrieves DNS records for a domain.

**Input Parameters:**
- `domain` (required): Domain name to lookup

**Example:**
```typescript
const result = await registry.execute('recon', {
  command: 'dns-lookup',
  params: { domain: 'example.com' }
});
```

**Output:**
```json
{
  "success": true,
  "data": {
    "domain": "example.com",
    "records": {
      "A": ["192.0.2.1", "192.0.2.2"],
      "MX": [
        { "priority": 10, "exchange": "mail1.example.com" }
      ],
      "NS": ["ns1.example.com", "ns2.example.com"]
    }
  }
}
```

##### 2. WHOIS Lookup (`whois`)

Retrieves domain registration information.

**Input Parameters:**
- `domain` (required): Domain name to query

**Example:**
```typescript
const result = await registry.execute('recon', {
  command: 'whois',
  params: { domain: 'example.com' }
});
```

##### 3. Subdomain Enumeration (`subdomain-enum`)

Discovers subdomains for a given domain.

**Input Parameters:**
- `domain` (required): Domain to enumerate

**Example:**
```typescript
const result = await registry.execute('recon', {
  command: 'subdomain-enum',
  params: { domain: 'example.com' }
});
```

##### 4. Technology Detection (`tech-detect`)

Identifies technologies used by a web application.

**Input Parameters:**
- `url` (required): URL to analyze

**Example:**
```typescript
const result = await registry.execute('recon', {
  command: 'tech-detect',
  params: { url: 'https://example.com' }
});
```

## Creating Custom Agents

To create a custom agent, extend the `BaseAgent` class:

```typescript
import { BaseAgent, AgentInput, AgentOutput } from 'awesome-hacking-agent-sdk';

export class MyCustomAgent extends BaseAgent {
  constructor() {
    super({
      id: 'my-custom-agent',
      name: 'My Custom Agent',
      description: 'Does something awesome',
      version: '1.0.0',
      capabilities: ['custom-scan', 'custom-analyze'],
    });
  }

  async execute(input: AgentInput): Promise<AgentOutput> {
    const { command, params } = input;

    switch (command) {
      case 'custom-scan':
        return this.customScan(params);
      case 'custom-analyze':
        return this.customAnalyze(params);
      default:
        return this.createOutput(false, null, `Unknown command: ${command}`);
    }
  }

  private async customScan(params?: Record<string, any>): Promise<AgentOutput> {
    // Validate required parameters
    this.validateInput({ command: 'custom-scan', params }, ['target']);

    // Perform your custom logic
    const result = {
      target: params!.target,
      findings: [],
    };

    return this.createOutput(true, result);
  }

  private async customAnalyze(params?: Record<string, any>): Promise<AgentOutput> {
    // Your implementation
    return this.createOutput(true, { analyzed: true });
  }
}
```

### Registering Custom Agents

```typescript
import { AgentRegistry } from 'awesome-hacking-agent-sdk';
import { MyCustomAgent } from './my-custom-agent';

const registry = new AgentRegistry();
registry.register(new MyCustomAgent());
```

## Agent Registry

The `AgentRegistry` manages all available agents and provides methods for registration and execution.

### Methods

#### `register(agent: Agent): void`
Registers a new agent with the registry.

```typescript
registry.register(new MyCustomAgent());
```

#### `unregister(agentId: string): void`
Removes an agent from the registry.

```typescript
registry.unregister('my-custom-agent');
```

#### `get(agentId: string): Agent | undefined`
Retrieves a registered agent by ID.

```typescript
const agent = registry.get('security-scan');
```

#### `list(): Agent[]`
Returns all registered agents.

```typescript
const agents = registry.list();
console.log(agents.map(a => a.id));
```

#### `execute(agentId: string, input: AgentInput): Promise<AgentOutput>`
Executes an agent command.

```typescript
const result = await registry.execute('security-scan', {
  command: 'port-scan',
  params: { target: '192.168.1.1' }
});
```

## Best Practices

### 1. Error Handling

Always handle errors gracefully and return informative error messages:

```typescript
try {
  // Agent logic
  return this.createOutput(true, result);
} catch (error) {
  return this.createOutput(
    false,
    null,
    error instanceof Error ? error.message : 'Unknown error'
  );
}
```

### 2. Input Validation

Validate all required parameters before execution:

```typescript
this.validateInput({ command: 'scan', params }, ['target', 'port']);
```

### 3. Metadata

Include useful metadata in responses:

```typescript
return this.createOutput(true, result, undefined, {
  scanType: 'port-scan',
  duration: '2.3s',
  itemsProcessed: 100
});
```

### 4. Versioning

Use semantic versioning for your agents and update versions when making changes:

- **MAJOR**: Breaking changes to the agent's interface
- **MINOR**: New features, backward compatible
- **PATCH**: Bug fixes, backward compatible

### 5. Documentation

Document all capabilities, parameters, and output formats for your agents.

### 6. Security

- Never execute arbitrary code from user input
- Validate and sanitize all inputs
- Respect rate limits and timeouts
- Log security-relevant actions
- Follow the principle of least privilege

## Contributing

When contributing new agents:

1. Follow the agent architecture guidelines
2. Include comprehensive documentation
3. Add tests for all capabilities
4. Update this AGENTS.md file
5. Ensure your agent follows security best practices

## Support

For questions or issues with agents, please:
- Check this documentation
- Review example implementations
- Open an issue on GitHub
- Consult the contributing guidelines

---

**Version**: 1.0.0  
**Last Updated**: 2024-01-01
