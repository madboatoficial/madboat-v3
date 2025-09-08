/**
 * TypeScript-specific verifier with strict mode support
 */

import { Verifier } from '../core/Verifier';
import { VerificationResult } from '../core/VerificationResult';
import * as ts from 'typescript';

export interface TypeScriptVerifierConfig {
  strict?: boolean;
  noImplicitAny?: boolean;
  strictNullChecks?: boolean;
  noUnusedLocals?: boolean;
  noUnusedParameters?: boolean;
  target?: ts.ScriptTarget;
}

export class TypeScriptVerifier extends Verifier<string, void> {
  private compilerOptions: ts.CompilerOptions;
  
  constructor(config: TypeScriptVerifierConfig = {}) {
    super({ name: 'TypeScriptVerifier' });
    
    this.compilerOptions = {
      strict: config.strict ?? true,
      noImplicitAny: config.noImplicitAny ?? true,
      strictNullChecks: config.strictNullChecks ?? true,
      noUnusedLocals: config.noUnusedLocals ?? true,
      noUnusedParameters: config.noUnusedParameters ?? true,
      target: config.target ?? ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ESNext,
      jsx: ts.JsxEmit.React,
      esModuleInterop: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
      resolveJsonModule: true,
      isolatedModules: true,
      noEmit: true
    };
  }
  
  async verify(code: string, _expected?: void): Promise<VerificationResult> {
    const result: VerificationResult = {
      score: 0,
      reason: '',
      breakdown: {
        syntax: 0,
        types: 0,
        strict: 0,
        unused: 0
      },
      errors: [],
      warnings: []
    };
    
    try {
      // Create a virtual source file
      const sourceFile = ts.createSourceFile(
        'virtual.ts',
        code,
        this.compilerOptions.target!,
        true,
        ts.ScriptKind.TS
      );
      
      // Check for syntax errors
      const syntaxErrors = this.getSyntaxErrors(sourceFile);
      if (syntaxErrors.length > 0) {
        result.breakdown!.syntax = 0;
        result.errors = syntaxErrors;
        result.reason = 'TypeScript syntax errors found';
        result.score = 0;
        return result;
      }
      result.breakdown!.syntax = 1.0;
      
      // Create a program for type checking
      const host = this.createCompilerHost(code);
      const program = ts.createProgram(['virtual.ts'], this.compilerOptions, host);
      
      // Get all diagnostics
      const diagnostics = [
        ...program.getSemanticDiagnostics(),
        ...program.getSyntacticDiagnostics(),
        ...program.getDeclarationDiagnostics()
      ];
      
      // Categorize diagnostics
      const errors: string[] = [];
      const warnings: string[] = [];
      let typeScore = 1.0;
      let strictScore = 1.0;
      let unusedScore = 1.0;
      
      for (const diagnostic of diagnostics) {
        const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
        
        if (diagnostic.category === ts.DiagnosticCategory.Error) {
          errors.push(message);
          
          // Check what kind of error
          if (this.isTypeError(diagnostic)) {
            typeScore = Math.max(0, typeScore - 0.2);
          }
          if (this.isStrictError(diagnostic)) {
            strictScore = Math.max(0, strictScore - 0.2);
          }
        } else if (diagnostic.category === ts.DiagnosticCategory.Warning) {
          warnings.push(message);
          
          if (this.isUnusedWarning(diagnostic)) {
            unusedScore = Math.max(0, unusedScore - 0.1);
          }
        }
      }
      
      result.breakdown!.types = typeScore;
      result.breakdown!.strict = strictScore;
      result.breakdown!.unused = unusedScore;
      result.errors = errors;
      result.warnings = warnings;
      
      // Calculate overall score
      if (errors.length === 0) {
        result.score = (
          result.breakdown!.syntax * 0.25 +
          result.breakdown!.types * 0.35 +
          result.breakdown!.strict * 0.25 +
          result.breakdown!.unused * 0.15
        );
        result.reason = warnings.length > 0 
          ? `TypeScript verification passed with ${warnings.length} warnings`
          : 'TypeScript verification passed perfectly';
      } else {
        result.score = Math.max(0.3, result.score); // Minimum score for valid syntax
        result.reason = `TypeScript verification failed with ${errors.length} errors`;
      }
      
      // Add learned pattern if successful
      if (result.score > 0.8) {
        result.learnedPattern = this.extractPattern(code);
      }
      
      return result;
      
    } catch (error) {
      result.score = 0;
      result.reason = `TypeScript verification error: ${error}`;
      result.errors = [String(error)];
      return result;
    }
  }
  
  private getSyntaxErrors(sourceFile: ts.SourceFile): string[] {
    const errors: string[] = [];
    
    const visitNode = (node: ts.Node) => {
      if (node.kind === ts.SyntaxKind.Unknown) {
        errors.push(`Syntax error at position ${node.pos}`);
      }
      ts.forEachChild(node, visitNode);
    };
    
    visitNode(sourceFile);
    return errors;
  }
  
  private createCompilerHost(code: string): ts.CompilerHost {
    const files = new Map<string, string>();
    files.set('virtual.ts', code);
    
    // Add React types if needed
    if (code.includes('React') || code.includes('jsx')) {
      files.set('react.d.ts', `
        declare module 'react' {
          export interface FC<P = {}> {
            (props: P): JSX.Element | null;
          }
          export function useState<T>(initial: T): [T, (value: T) => void];
          export function useEffect(fn: () => void, deps?: any[]): void;
        }
      `);
    }
    
    return {
      getSourceFile: (fileName) => {
        const content = files.get(fileName);
        if (content) {
          return ts.createSourceFile(fileName, content, this.compilerOptions.target!, true);
        }
        // Return empty file for missing imports
        return ts.createSourceFile(fileName, '', this.compilerOptions.target!, true);
      },
      writeFile: () => {},
      getCurrentDirectory: () => '/',
      getDirectories: () => [],
      fileExists: (fileName) => files.has(fileName),
      readFile: (fileName) => files.get(fileName),
      getCanonicalFileName: (fileName) => fileName,
      useCaseSensitiveFileNames: () => true,
      getNewLine: () => '\n',
      getDefaultLibFileName: () => 'lib.d.ts',
      resolveModuleNames: () => []
    };
  }
  
  private isTypeError(diagnostic: ts.Diagnostic): boolean {
    const typeErrorCodes = [
      2322, // Type not assignable
      2339, // Property does not exist
      2345, // Argument type not assignable
      2741, // Property missing in type
      7006, // Parameter implicitly has 'any' type
    ];
    return typeErrorCodes.includes(diagnostic.code);
  }
  
  private isStrictError(diagnostic: ts.Diagnostic): boolean {
    const strictErrorCodes = [
      2531, // Object is possibly 'null'
      2532, // Object is possibly 'undefined'
      7005, // Variable implicitly has 'any' type
      2722, // Cannot invoke possibly 'undefined'
    ];
    return strictErrorCodes.includes(diagnostic.code);
  }
  
  private isUnusedWarning(diagnostic: ts.Diagnostic): boolean {
    const unusedCodes = [
      6133, // Declared but never used
      6196, // Declared but never read
      6198, // All destructured elements unused
    ];
    return unusedCodes.includes(diagnostic.code);
  }
  
  private extractPattern(code: string): string {
    // Extract common patterns from successful code
    const patterns: string[] = [];
    
    if (code.includes('async') && code.includes('await')) {
      patterns.push('async/await pattern');
    }
    if (code.includes('interface') || code.includes('type')) {
      patterns.push('strong typing');
    }
    if (code.includes('?.') || code.includes('??')) {
      patterns.push('optional chaining');
    }
    if (code.includes('as const')) {
      patterns.push('const assertions');
    }
    if (code.match(/\<\w+\>/)) {
      patterns.push('generics usage');
    }
    
    return patterns.length > 0 
      ? `Successful patterns: ${patterns.join(', ')}`
      : 'Standard TypeScript patterns';
  }
}