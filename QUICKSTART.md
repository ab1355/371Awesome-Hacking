# Quick Start Guide

Get up and running with the Awesome Hacking Agent SDK in minutes.

## Prerequisites

- Node.js ≥18.0.0
- npm or yarn
- Git (for cloning the repository)

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/ab1355/371Awesome-Hacking.git
cd 371Awesome-Hacking
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Build the Project

```bash
npm run build
```

## Usage Scenarios

### Scenario 1: Run Examples

Try the pre-built examples to see the SDK in action:

```bash
node examples/basic-usage.js
```

This will demonstrate:
- Security port scanning
- Vulnerability assessment
- DNS lookups
- Technology detection

### Scenario 2: Use as a Library

Create a new JavaScript file `my-scan.js`:

```javascript
const { createDefaultRegistry } = require('./dist/index.js');

async function scan() {
  const registry = createDefaultRegistry();
  
  const result = await registry.execute('security-scan', {
    command: 'port-scan',
    params: { target: '192.168.1.1' }
  });
  
  console.log(JSON.stringify(result, null, 2));
}

scan().catch(console.error);
```

Run it:
```bash
node my-scan.js
```

### Scenario 3: MCP Server Integration

Start the MCP server for AI assistant integration:

```bash
npm run mcp-server
```

Configure your MCP client (like Claude Desktop):

```json
{
  "mcpServers": {
    "awesome-hacking": {
      "command": "node",
      "args": ["/full/path/to/371Awesome-Hacking/dist/mcp-server.js"],
      "cwd": "/full/path/to/371Awesome-Hacking"
    }
  }
}
```

See [MCP_CONFIG.md](MCP_CONFIG.md) for detailed MCP setup instructions.

### Scenario 4: Create a Custom Agent

Create `custom-scanner.js`:

```javascript
const { BaseAgent, AgentRegistry } = require('./dist/index.js');

class MyScanner extends BaseAgent {
  constructor() {
    super({
      id: 'my-scanner',
      name: 'My Custom Scanner',
      description: 'Custom security scanner',
      version: '1.0.0',
      capabilities: ['custom-scan'],
    });
  }

  async execute(input) {
    if (input.command === 'custom-scan') {
      return this.createOutput(true, {
        scanned: input.params.target,
        result: 'All clear!'
      });
    }
    return this.createOutput(false, null, 'Unknown command');
  }
}

// Use your custom agent
const registry = new AgentRegistry();
registry.register(new MyScanner());

registry.execute('my-scanner', {
  command: 'custom-scan',
  params: { target: 'example.com' }
}).then(result => {
  console.log(JSON.stringify(result, null, 2));
});
```

## Available Commands

### Security Scanner (`security-scan`)

```javascript
// Port scan
await registry.execute('security-scan', {
  command: 'port-scan',
  params: { target: '192.168.1.1' }
});

// Vulnerability scan
await registry.execute('security-scan', {
  command: 'vulnerability-scan',
  params: { target: 'example.com' }
});

// Web application scan
await registry.execute('security-scan', {
  command: 'web-scan',
  params: { url: 'https://example.com' }
});

// SSL/TLS check
await registry.execute('security-scan', {
  command: 'ssl-check',
  params: { domain: 'example.com' }
});
```

### Reconnaissance (`recon`)

```javascript
// DNS lookup
await registry.execute('recon', {
  command: 'dns-lookup',
  params: { domain: 'example.com' }
});

// WHOIS lookup
await registry.execute('recon', {
  command: 'whois',
  params: { domain: 'example.com' }
});

// Subdomain enumeration
await registry.execute('recon', {
  command: 'subdomain-enum',
  params: { domain: 'example.com' }
});

// Technology detection
await registry.execute('recon', {
  command: 'tech-detect',
  params: { url: 'https://example.com' }
});
```

## Next Steps

1. **Read the Documentation**:
   - [AGENTS.md](AGENTS.md) - Complete agent documentation
   - [MCP_CONFIG.md](MCP_CONFIG.md) - MCP integration guide
   - [README.md](README.md) - Full project README

2. **Explore Examples**:
   - Check the `examples/` directory for more code samples
   - Modify examples to suit your needs

3. **Build Custom Agents**:
   - Extend the `BaseAgent` class
   - Implement your own security tools
   - Register them with the registry

4. **Integrate with AI**:
   - Set up MCP integration
   - Use with Claude or other AI assistants
   - Automate security research workflows

## Troubleshooting

### Build Fails
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### TypeScript Errors
Make sure you're using TypeScript 5.3+:
```bash
npm install typescript@latest --save-dev
npm run build
```

### Module Not Found
Ensure you've built the project:
```bash
npm run build
```

Always import from `dist/` directory:
```javascript
const { ... } = require('./dist/index.js');
```

## Getting Help

- **Issues**: Open an issue on GitHub
- **Documentation**: See the docs in this repository
- **Examples**: Check the `examples/` directory
- **Contributing**: See [contributing.md](contributing.md)

## Legal Notice

⚠️ **This SDK is for authorized security research and educational purposes only.**

Always ensure you have explicit written permission before testing any systems you do not own. Unauthorized access to computer systems is illegal.

---

**Happy Hacking!** 🔐
