/**
 * Example: Basic Usage
 * 
 * Demonstrates how to use the Awesome Hacking Agent SDK
 */

const { createDefaultRegistry } = require('../dist/index.js');

async function main() {
  console.log('=== Awesome Hacking Agent SDK - Basic Example ===\n');

  // Create a registry with default agents
  const registry = createDefaultRegistry();

  // List available agents
  console.log('Available agents:');
  const agents = registry.list();
  agents.forEach(agent => {
    console.log(`  - ${agent.id}: ${agent.description}`);
    console.log(`    Capabilities: ${agent.capabilities.join(', ')}`);
  });

  console.log('\n--- Security Scan: Port Scan ---');
  const portScanResult = await registry.execute('security-scan', {
    command: 'port-scan',
    params: { target: '192.168.1.1' }
  });
  console.log(JSON.stringify(portScanResult, null, 2));

  console.log('\n--- Security Scan: Vulnerability Scan ---');
  const vulnScanResult = await registry.execute('security-scan', {
    command: 'vulnerability-scan',
    params: { target: 'example.com' }
  });
  console.log(JSON.stringify(vulnScanResult, null, 2));

  console.log('\n--- Recon: DNS Lookup ---');
  const dnsResult = await registry.execute('recon', {
    command: 'dns-lookup',
    params: { domain: 'example.com' }
  });
  console.log(JSON.stringify(dnsResult, null, 2));

  console.log('\n--- Recon: Technology Detection ---');
  const techResult = await registry.execute('recon', {
    command: 'tech-detect',
    params: { url: 'https://example.com' }
  });
  console.log(JSON.stringify(techResult, null, 2));
}

main().catch(console.error);
