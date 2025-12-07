/**
 * Tool utilities for agents
 */

export interface ToolConfig {
  timeout?: number;
  retries?: number;
  verbose?: boolean;
}

export class ToolExecutor {
  private config: ToolConfig;

  constructor(config: ToolConfig = {}) {
    this.config = {
      timeout: config.timeout || 30000,
      retries: config.retries || 3,
      verbose: config.verbose || false,
    };
  }

  async execute<T>(
    fn: () => Promise<T>,
    description?: string
  ): Promise<T> {
    const startTime = Date.now();
    let lastError: Error | undefined;

    for (let attempt = 0; attempt < this.config.retries!; attempt++) {
      try {
        if (this.config.verbose && description) {
          console.log(`[${attempt + 1}/${this.config.retries}] ${description}`);
        }

        const result = await this.executeWithTimeout(fn, this.config.timeout!);
        
        if (this.config.verbose) {
          const duration = Date.now() - startTime;
          console.log(`✓ Completed in ${duration}ms`);
        }

        return result;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        
        if (this.config.verbose) {
          console.log(`✗ Attempt ${attempt + 1} failed: ${lastError.message}`);
        }

        if (attempt < this.config.retries! - 1) {
          const delay = Math.min(1000 * Math.pow(2, attempt), 10000);
          await this.sleep(delay);
        }
      }
    }

    throw lastError || new Error('Execution failed');
  }

  private async executeWithTimeout<T>(
    fn: () => Promise<T>,
    timeout: number
  ): Promise<T> {
    return Promise.race([
      fn(),
      new Promise<T>((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), timeout)
      ),
    ]);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export function formatOutput(data: any, format: 'json' | 'text' = 'json'): string {
  if (format === 'json') {
    return JSON.stringify(data, null, 2);
  }

  // Simple text formatting
  return typeof data === 'object' ? JSON.stringify(data) : String(data);
}

export function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function validateDomain(domain: string): boolean {
  const domainRegex = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i;
  return domainRegex.test(domain);
}

export function validateIP(ip: string): boolean {
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
}
