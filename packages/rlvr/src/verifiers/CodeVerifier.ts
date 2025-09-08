/**
 * Code execution and compilation verifier
 */

import { Verifier } from '../core/Verifier';
import { VerificationResult } from '../core/VerificationResult';
import { exec } from 'child_process';
import { promisify } from 'util';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import { randomBytes } from 'crypto';

const execAsync = promisify(exec);

export interface CodeVerifierConfig {
  language: 'typescript' | 'javascript' | 'python';
  strict?: boolean;
  timeout?: number;
}

export class CodeVerifier extends Verifier<string, any> {
  private language: string;
  private strict: boolean;
  
  constructor(config: CodeVerifierConfig) {
    super({
      name: `CodeVerifier-${config.language}`,
      timeout: config.timeout || 10000
    });
    this.language = config.language;
    this.strict = config.strict ?? true;
  }
  
  async verify(code: string, expected: any): Promise<VerificationResult> {
    const startTime = Date.now();
    const result: VerificationResult = {
      score: 0,
      reason: '',
      breakdown: {},
      metadata: {}
    };
    
    try {
      // Step 1: Syntax validation
      const syntaxValid = await this.validateSyntax(code);
      result.breakdown!.syntax = syntaxValid ? 1.0 : 0.0;
      
      if (!syntaxValid) {
        result.reason = 'Syntax validation failed';
        result.score = 0;
        return result;
      }
      
      // Step 2: Compilation (for TypeScript)
      if (this.language === 'typescript') {
        const compileResult = await this.compileTypeScript(code);
        result.breakdown!.compilation = compileResult.success ? 1.0 : 0.0;
        
        if (!compileResult.success) {
          result.reason = `Compilation failed: ${compileResult.error}`;
          result.score = 0.2; // Partial credit for valid syntax
          result.errors = [compileResult.error];
          return result;
        }
        
        code = compileResult.output!;
      }
      
      // Step 3: Execution
      const executionResult = await this.executeCode(code);
      result.breakdown!.execution = executionResult.success ? 1.0 : 0.0;
      
      if (!executionResult.success) {
        result.reason = `Execution failed: ${executionResult.error}`;
        result.score = 0.3; // Partial credit for compilation
        result.errors = [executionResult.error];
        return result;
      }
      
      // Step 4: Output verification
      const outputMatch = await this.verifyOutput(executionResult.output, expected);
      result.breakdown!.semantic = outputMatch ? 1.0 : 0.0;
      
      if (!outputMatch) {
        result.reason = 'Output does not match expected result';
        result.score = 0.5; // Partial credit for execution
        return result;
      }
      
      // Success!
      result.score = 1.0;
      result.reason = 'Code verified successfully';
      result.metadata!.executionTime = Date.now() - startTime;
      
      return result;
      
    } catch (error) {
      result.score = 0;
      result.reason = `Verification error: ${error}`;
      result.errors = [String(error)];
      return result;
    }
  }
  
  private async validateSyntax(code: string): Promise<boolean> {
    if (this.language === 'javascript' || this.language === 'typescript') {
      try {
        // Basic syntax check using Function constructor
        new Function(code);
        return true;
      } catch {
        // Try module syntax
        try {
          // Check for import/export statements
          if (code.includes('import ') || code.includes('export ')) {
            // Module syntax is valid if it contains proper keywords
            return true;
          }
          return false;
        } catch {
          return false;
        }
      }
    }
    
    if (this.language === 'python') {
      try {
        const { stdout, stderr } = await execAsync(
          `python3 -m py_compile -`,
          { input: code, timeout: 5000 }
        );
        return !stderr;
      } catch {
        return false;
      }
    }
    
    return false;
  }
  
  private async compileTypeScript(code: string): Promise<{
    success: boolean;
    output?: string;
    error?: string;
  }> {
    const tmpFile = join(tmpdir(), `madboat-${randomBytes(8).toString('hex')}.ts`);
    const outFile = tmpFile.replace('.ts', '.js');
    
    try {
      await writeFile(tmpFile, code);
      
      const compileCmd = this.strict
        ? `npx tsc ${tmpFile} --strict --outFile ${outFile}`
        : `npx tsc ${tmpFile} --outFile ${outFile}`;
      
      const { stderr } = await execAsync(compileCmd, { timeout: 10000 });
      
      if (stderr) {
        return { success: false, error: stderr };
      }
      
      const { readFile } = await import('fs/promises');
      const output = await readFile(outFile, 'utf-8');
      
      // Cleanup
      await Promise.all([
        unlink(tmpFile).catch(() => {}),
        unlink(outFile).catch(() => {})
      ]);
      
      return { success: true, output };
      
    } catch (error) {
      // Cleanup on error
      await Promise.all([
        unlink(tmpFile).catch(() => {}),
        unlink(outFile).catch(() => {})
      ]);
      
      return { success: false, error: String(error) };
    }
  }
  
  private async executeCode(code: string): Promise<{
    success: boolean;
    output?: any;
    error?: string;
  }> {
    const runtime = this.language === 'python' ? 'python3' : 'node';
    const tmpFile = join(
      tmpdir(),
      `madboat-${randomBytes(8).toString('hex')}.${this.language === 'python' ? 'py' : 'js'}`
    );
    
    try {
      // Wrap code to capture output
      const wrappedCode = this.wrapCodeForExecution(code);
      await writeFile(tmpFile, wrappedCode);
      
      const { stdout, stderr } = await execAsync(
        `${runtime} ${tmpFile}`,
        { timeout: this.config.timeout }
      );
      
      if (stderr) {
        return { success: false, error: stderr };
      }
      
      // Parse output
      const output = this.parseOutput(stdout);
      
      // Cleanup
      await unlink(tmpFile).catch(() => {});
      
      return { success: true, output };
      
    } catch (error) {
      // Cleanup on error
      await unlink(tmpFile).catch(() => {});
      return { success: false, error: String(error) };
    }
  }
  
  private wrapCodeForExecution(code: string): string {
    if (this.language === 'python') {
      return `
import json
import sys

${code}

# Capture the last expression or result
if 'result' in locals():
    print(json.dumps(result))
elif 'output' in locals():
    print(json.dumps(output))
`;
    }
    
    // JavaScript/TypeScript
    return `
${code}

// Capture the last expression or result
if (typeof result !== 'undefined') {
  console.log(JSON.stringify(result));
} else if (typeof output !== 'undefined') {
  console.log(JSON.stringify(output));
}
`;
  }
  
  private parseOutput(stdout: string): any {
    try {
      return JSON.parse(stdout.trim());
    } catch {
      // Return as string if not JSON
      return stdout.trim();
    }
  }
  
  private async verifyOutput(actual: any, expected: any): Promise<boolean> {
    // Deep equality check
    if (typeof actual === 'object' && typeof expected === 'object') {
      return JSON.stringify(actual) === JSON.stringify(expected);
    }
    
    // Number comparison with tolerance
    if (typeof actual === 'number' && typeof expected === 'number') {
      return this.compareWithTolerance(actual, expected);
    }
    
    // String comparison (semantic)
    if (typeof actual === 'string' && typeof expected === 'string') {
      return this.areStringsSemanticallyEqual(actual, expected);
    }
    
    // Direct comparison
    return actual === expected;
  }
}