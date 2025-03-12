import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ESLintParser {
  parse(code: string): string[] {
    const issues: string[] = [];

    // 1. Check for 'var' usage (should use let or const)
    if (/var\s+\w+/.test(code)) {
      issues.push('Avoid using `var`. Use `let` or `const` instead.');
    }

    // 2. Check for missing semicolons
    if (!code.trim().endsWith(';') && !/^\s*\/\/|^\s*\/\*/.test(code)) {
      issues.push('Consider adding semicolons for consistency.');
    }

    // 3. Check for missing 'use strict' directive
    if (!/['"]use strict['"]/.test(code) && !/^\s*\/\*.*use strict.*\*\//.test(code)) {
      issues.push('Consider adding "use strict" at the beginning of your code.');
    }

    // 4. Check for console logs (especially in production code)
    if (/console\.log/.test(code)) {
      issues.push('Avoid using `console.log` in production code.');
    }

    // 5. Check for unused variables
    const variableMatches = code.match(/\b(let|const|var)\s+(\w+)\s*[^;]*;/g);
    if (variableMatches) {
      variableMatches.forEach((variable) => {
        const varName = variable.split(' ')[1];
        if (!new RegExp(`\\b${varName}\\b`).test(code)) {
          issues.push(`Unused variable detected: ${varName}`);
        }
      });
    }

    // 6. Check for inconsistent indentation
    const lines = code.split('\n');
    const indentSpaces = lines[0].match(/^\s*/)?.[0].length || 0;
    lines.forEach((line, index) => {
      const currentIndent = line.match(/^\s*/)?.[0].length || 0;
      if (currentIndent !== indentSpaces && line.trim().length > 0) {
        issues.push(`Inconsistent indentation at line ${index + 1}: "${line.trim()}"`);
      }
    });

    // 7. Check for '==' and '!=' usage (use '===' and '!==')
    if (/\b==\b/.test(code)) {
      issues.push('Avoid using `==` for equality check. Use `===` for strict equality.');
    }
    if (/\b!=\b/.test(code)) {
      issues.push('Avoid using `!=` for inequality check. Use `!==` for strict inequality.');
    }

    // 8. Check for unreachable code after return statements
    if (/return\s+.*\s*;\s*[^}]*\breturn\b/.test(code)) {
      issues.push('Unreachable code detected after return statement.');
    }

    // 9. Check for functions with too many parameters
    const functionMatches = code.match(/\w+\s*\(.*\)/g);
    if (functionMatches) {
      functionMatches.forEach((func) => {
        const params = func.match(/\(([^)]*)\)/)?.[1];
        if (params && params.split(',').length > 5) {
          issues.push(`Function has too many parameters: ${func.substring(0, 30)}...`);
        }
      });
    }

    // 10. Check for duplicate imports
    const importMatches = code.match(/import\s+[^{]*\s*from\s*['"].*['"]/g);
    if (importMatches) {
      const seenImports: Set<string> = new Set();
      importMatches.forEach((imp) => {
        if (seenImports.has(imp)) {
          issues.push(`Duplicate import detected: ${imp}`);
        } else {
          seenImports.add(imp);
        }
      });
    }

    // 11. Check for excessive code complexity (too many nested blocks)
    const nestedBlocks = code.match(/{[^}]*\{[^}]*\}/g);
    if (nestedBlocks && nestedBlocks.length > 3) {
      issues.push('Too many nested blocks. Consider simplifying.');
    }

    // 12. Detect 'eval' usage
    if (/eval\s*\(/.test(code)) {
      issues.push('Avoid using `eval()`. It can introduce security risks.');
    }

    // 13. Ensure consistent function return types
    const functionReturns = code.match(/return\s+.*;/g);
    if (functionReturns) {
      functionReturns.forEach((returnStmt) => {
        if (!/return\s+(undefined|null|boolean|number|string)/.test(returnStmt)) {
          issues.push(`Inconsistent return type: ${returnStmt.substring(0, 30)}...`);
        }
      });
    }

    return issues.length ? issues : ['No JavaScript issues found.'];
  }
}
