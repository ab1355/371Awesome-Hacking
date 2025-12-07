# MCP Configuration

This file contains configuration examples for integrating the Awesome Hacking Agent SDK with MCP-compatible clients.

## Claude Desktop Configuration

Add this to your Claude Desktop MCP configuration file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`  
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`  
**Linux**: `~/.config/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "awesome-hacking": {
      "command": "node",
      "args": [
        "/path/to/371Awesome-Hacking/dist/mcp-server.js"
      ],
      "cwd": "/path/to/371Awesome-Hacking"
    }
  }
}
```

## Generic MCP Client Configuration

For other MCP-compatible clients, use these settings:

```json
{
  "name": "awesome-hacking",
  "transport": "stdio",
  "command": "node",
  "args": ["dist/mcp-server.js"],
  "cwd": "/path/to/371Awesome-Hacking"
}
```

## Environment Setup

1. **Build the project**:
   ```bash
   npm install
   npm run build
   ```

2. **Test the MCP server**:
   ```bash
   npm run mcp-server
   ```

   The server should output:
   ```
   Awesome Hacking MCP Server running on stdio
   ```

3. **Restart your MCP client** to load the new configuration.

## Using the MCP Server

Once configured, you can use the following tools through your MCP client:

### security-scan
Performs security scanning and vulnerability assessment.

**Example prompt to Claude:**
> Use the security-scan tool to perform a port scan on 192.168.1.1

**Parameters:**
```json
{
  "command": "port-scan",
  "params": {
    "target": "192.168.1.1"
  }
}
```

### recon
Performs reconnaissance and information gathering.

**Example prompt to Claude:**
> Use the recon tool to do a DNS lookup for example.com

**Parameters:**
```json
{
  "command": "dns-lookup",
  "params": {
    "domain": "example.com"
  }
}
```

## Available Commands

### Security Scan Tool
- `port-scan` - Scan for open ports
- `vulnerability-scan` - Find vulnerabilities
- `web-scan` - Analyze web application security
- `ssl-check` - Check SSL/TLS configuration

### Recon Tool
- `dns-lookup` - DNS record lookup
- `whois` - WHOIS information
- `subdomain-enum` - Enumerate subdomains
- `tech-detect` - Detect web technologies

## Troubleshooting

### Server won't start
- Ensure Node.js ≥18.0.0 is installed
- Check that `npm install` and `npm run build` completed successfully
- Verify the path in your configuration is absolute and correct

### Tools not appearing
- Restart your MCP client after configuration changes
- Check the client's logs for error messages
- Verify the MCP server starts without errors

### Permission issues
- Ensure the MCP server has appropriate file system permissions
- On Unix systems, you may need to set execute permissions:
  ```bash
  chmod +x dist/mcp-server.js
  ```

## Development Mode

For development, you can run the server with additional logging:

```bash
NODE_ENV=development npm run mcp-server
```

## Security Notes

⚠️ **Important**: This SDK is for authorized security research only. Always ensure you have explicit permission before testing any systems.

The MCP server runs with the same permissions as your MCP client. Be cautious about:
- Which systems you scan
- Network access from your machine
- Data privacy and retention
- Compliance with local laws and regulations
