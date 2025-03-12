import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GoParser {
  parse(code: string): string[] {
    const errors: string[] = [];

    // 1. Check for missing "package main" declaration
    if (!code.includes('package main')) {
      errors.push('Error: Go programs should start with "package main".');
    }

    // 2. Check for missing "func main()" function
    if (!code.includes('func main()')) {
      errors.push('Warning: Go programs usually have a "func main()" function.');
    }

    // 3. Check for semicolons (Go does not require them)
    if (code.includes(';')) {
      errors.push('Warning: Go does not require semicolons at the end of statements.');
    }

    // 4. Check for missing error handling
    if (/\w+\s*\(.+\)\s*(error)/.test(code) && !/\s*if\s+\(err\s*!=\s*nil\)/.test(code)) {
      errors.push('Error: Missing error handling. Consider checking for errors after function calls.');
    }

    // 5. Check for unnecessary use of `panic()`
    if (/panic\(/.test(code)) {
      errors.push('Warning: Avoid using `panic()` unless absolutely necessary.');
    }

    // 6. Check for inconsistent indentation (assuming 2 spaces indentation)
    const lines = code.split('\n');
    const indentSpaces = lines[0].match(/^\s*/)?.[0].length || 0;
    lines.forEach((line, index) => {
      const currentIndent = line.match(/^\s*/)?.[0].length || 0;
      if (currentIndent !== indentSpaces && line.trim().length > 0) {
        errors.push(`Inconsistent indentation at line ${index + 1}: "${line.trim()}"`);
      }
    });

    // 7. Check for redundant imports
    const importMatches = code.match(/import\s+\(/g);
    if (importMatches) {
      const seenImports: Set<string> = new Set();
      const imports = code.match(/import\s+\(([^)]+)\)/);
      if (imports) {
        const importList = imports[1].split('\n');
        importList.forEach((imp) => {
          if (seenImports.has(imp.trim())) {
            errors.push(`Redundant import detected: ${imp.trim()}`);
          } else {
            seenImports.add(imp.trim());
          }
        });
      }
    }

    // 8. Check for "main" function with no body
    if (/func\s+main\s*\(\)\s*\{\s*\}/.test(code)) {
      errors.push('Warning: The "main" function is empty. Ensure it has a meaningful body.');
    }

    // 9. Check for function names not following Go naming conventions (should be capitalized for exported functions)
    const funcMatches = code.match(/func\s+[a-z]\w*\s*\(/g);
    if (funcMatches) {
      funcMatches.forEach((func) => {
        const funcName = func.match(/func\s+([a-z]\w*)\s*\(/)?.[1];
        if (funcName && funcName[0] === funcName[0].toLowerCase()) {
          errors.push(`Function "${funcName}" should be capitalized to follow Go naming conventions.`);
        }
      });
    }

    // 10. Check for too many nested if statements (suggest refactoring)
    const nestedIfs = code.match(/\s*if\s*\(/g);
    if (nestedIfs && nestedIfs.length > 3) {
      errors.push('Too many nested `if` statements. Consider refactoring.');
    }

    // 11. Ensure proper use of `defer` for closing resources
    if (/defer\s+\w+\(/.test(code) && !/defer\s+.*close\(/.test(code)) {
      errors.push('Warning: Ensure you use `defer` to close resources properly (e.g., files, database connections).');
    }

    return errors.length ? errors : ['No Go issues found.'];
  }
}
