# Architecture Overview

## Introduction

The Awesome Hacking Agent SDK is a TypeScript-based framework for building modular security research agents with Model Context Protocol (MCP) integration. This document provides an architectural overview of the system.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Applications                      │
│  (AI Assistants, CLI Tools, Custom Applications)            │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                      MCP Server                              │
│  - Handles MCP protocol communication                        │
│  - Exposes agents as MCP tools                              │
│  - Manages request/response lifecycle                        │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   Agent Registry                             │
│  - Registers and manages agents                             │
│  - Routes commands to appropriate agents                     │
│  - Handles errors and validates responses                    │
└────────────────────────┬────────────────────────────────────┘
                         │
          ┌──────────────┴──────────────┐
          ▼                             ▼
┌──────────────────┐          ┌──────────────────┐
│ Security Scanner │          │  Recon Agent     │
│      Agent       │          │                  │
│                  │          │                  │
│ - port-scan      │          │ - dns-lookup     │
│ - vuln-scan      │          │ - whois          │
│ - web-scan       │          │ - subdomain-enum │
│ - ssl-check      │          │ - tech-detect    │
└──────────────────┘          └──────────────────┘
          ▲                             ▲
          └──────────────┬──────────────┘
                         │
              ┌──────────┴──────────┐
              │   Custom Agents     │
              │  (User-defined)     │
              └─────────────────────┘
```

## Core Components

### 1. Agent Interface (`src/agent.ts`)

The foundation of the SDK, defining:

- **Agent Interface**: Contract that all agents must implement
- **BaseAgent Class**: Abstract base class providing common functionality
- **AgentRegistry**: Central registry for managing agents
- **Input/Output Types**: Standardized data structures

**Key Features:**
- Type-safe agent definitions
- Input validation helpers
- Consistent error handling
- Metadata support

### 2. MCP Server (`src/mcp-server.ts`)

Implements the Model Context Protocol server:

- **Protocol Implementation**: Uses `@modelcontextprotocol/sdk`
- **Tool Listing**: Exposes agents as MCP tools
- **Tool Execution**: Routes MCP tool calls to agents
- **Transport**: Stdio-based communication

**Responsibilities:**
- Accept MCP client connections
- Translate MCP requests to agent commands
- Format agent responses as MCP responses
- Handle protocol-level errors

### 3. Pre-built Agents

#### Security Scanner Agent (`src/agents/security-scan.ts`)

Provides security assessment capabilities:

```typescript
Commands:
  - port-scan: Network port scanning
  - vulnerability-scan: Vulnerability assessment
  - web-scan: Web application security analysis
  - ssl-check: SSL/TLS configuration validation
```

#### Reconnaissance Agent (`src/agents/recon.ts`)

Provides information gathering capabilities:

```typescript
Commands:
  - dns-lookup: DNS record retrieval
  - whois: Domain registration information
  - subdomain-enum: Subdomain discovery
  - tech-detect: Technology stack detection
```

### 4. Utilities (`src/tools/utils.ts`)

Common utility functions:

- **ToolExecutor**: Retry logic and timeout handling
- **Validators**: URL, domain, and IP validation
- **Formatters**: Output formatting utilities

## Data Flow

### 1. Standard SDK Usage

```
Client Code
    │
    ├─→ Create Registry
    │
    ├─→ Register Agents
    │
    ├─→ Execute Command
    │       │
    │       ├─→ Registry.execute()
    │       │       │
    │       │       ├─→ Find Agent
    │       │       │
    │       │       ├─→ Agent.execute()
    │       │       │       │
    │       │       │       ├─→ Validate Input
    │       │       │       │
    │       │       │       ├─→ Execute Logic
    │       │       │       │
    │       │       │       └─→ Return Output
    │       │       │
    │       │       └─→ Handle Errors
    │       │
    │       └─→ Return Result
    │
    └─→ Process Result
```

### 2. MCP Integration

```
MCP Client (e.g., Claude)
    │
    ├─→ Send MCP Request
    │       │
    │       └─→ MCP Server
    │               │
    │               ├─→ Parse Request
    │               │
    │               ├─→ Registry.execute()
    │               │       │
    │               │       └─→ Agent.execute()
    │               │
    │               ├─→ Format Response
    │               │
    │               └─→ Send MCP Response
    │
    └─→ Receive Result
```

## Extension Points

### Creating Custom Agents

1. **Extend BaseAgent**:
```typescript
class MyAgent extends BaseAgent {
  constructor() {
    super({
      id: 'my-agent',
      name: 'My Agent',
      description: 'Custom agent',
      version: '1.0.0',
      capabilities: ['cmd1', 'cmd2'],
    });
  }

  async execute(input: AgentInput): Promise<AgentOutput> {
    // Custom logic
  }
}
```

2. **Register with Registry**:
```typescript
const registry = new AgentRegistry();
registry.register(new MyAgent());
```

### Adding New Capabilities

1. Add command to agent's capabilities array
2. Implement command handler method
3. Add switch case in execute() method
4. Update documentation

## Security Considerations

### Input Validation

- All agent inputs validated before execution
- Type checking via TypeScript
- Runtime parameter validation
- Sanitization of user inputs

### Error Handling

- Try-catch blocks around all agent logic
- Consistent error response format
- No sensitive data in error messages
- Proper error propagation

### Isolation

- Each agent execution is independent
- No shared state between executions
- Clean input/output boundaries
- Controlled external access

## Performance

### Optimization Strategies

1. **Async Execution**: All operations are asynchronous
2. **No Blocking**: Agents use non-blocking I/O
3. **Resource Management**: Proper cleanup and disposal
4. **Efficient Serialization**: Minimal JSON overhead

### Scalability

- Stateless agents enable horizontal scaling
- Registry supports concurrent execution
- No global state dependencies
- Lightweight agent instances

## Configuration

### Build Configuration

- **TypeScript**: `tsconfig.json` with strict mode
- **Target**: ES2020 for modern features
- **Module**: CommonJS for Node.js compatibility
- **Source Maps**: Enabled for debugging

### Lint Configuration

- **ESLint**: TypeScript-aware linting
- **Rules**: Recommended + custom rules
- **Auto-fix**: Available for common issues

### CI/CD

- **GitHub Actions**: Automated testing
- **Matrix Builds**: Node.js 18, 20, 22
- **Steps**: Install, lint, build, test

## Dependencies

### Runtime
- `@modelcontextprotocol/sdk`: MCP protocol implementation

### Development
- `typescript`: Type system and compiler
- `ts-node`: TypeScript execution
- `eslint`: Code linting
- `jest`: Testing framework (configured)

## Future Enhancements

### Planned Features

1. **Agent Marketplace**: Discoverable agent repository
2. **Plugin System**: Dynamic agent loading
3. **State Management**: Persistent agent state
4. **Advanced Scheduling**: Cron-like agent execution
5. **Monitoring**: Built-in telemetry and logging
6. **Authentication**: Agent-level access control
7. **Rate Limiting**: Request throttling
8. **Caching**: Result caching layer

### API Evolution

- Maintain backward compatibility
- Semantic versioning
- Deprecation notices
- Migration guides

## Contributing

### Adding New Agents

1. Create agent file in `src/agents/`
2. Extend `BaseAgent`
3. Implement capabilities
4. Register in MCP server
5. Add tests
6. Update documentation

### Code Standards

- Follow TypeScript best practices
- Use ESLint configuration
- Write comprehensive tests
- Document all public APIs
- Include usage examples

## Resources

- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [MCP Specification](https://modelcontextprotocol.io)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

**Last Updated**: 2024-12-07  
**Version**: 1.0.0
