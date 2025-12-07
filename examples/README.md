# Examples

This directory contains example code demonstrating how to use the Awesome Hacking Agent SDK.

## Available Examples

### basic-usage.js
Demonstrates basic usage of the SDK:
- Creating an agent registry
- Listing available agents
- Executing various agent commands
- Working with security scanning and reconnaissance

**Run:**
```bash
node examples/basic-usage.js
```

### custom-agent.ts
Shows how to create and register custom agents:
- Extending the BaseAgent class
- Implementing custom commands
- Registering agents with the registry
- Executing custom agent commands

**Note:** TypeScript examples require the project to be built first.

## Running Examples

1. Install dependencies:
```bash
npm install
```

2. Build the project:
```bash
npm run build
```

3. Run an example:
```bash
node examples/basic-usage.js
```

## Creating Your Own Examples

Feel free to create your own examples by:
1. Importing from `../dist/index.js`
2. Using the agent registry API
3. Following the patterns shown in existing examples

For more information, see the [main README](../README.md) and [AGENTS.md](../AGENTS.md).
