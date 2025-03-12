import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CSharpParser {
  parse(code: string): string[] {
    const errors: string[] = [];

    // 1. Check if the code contains a namespace
    if (!code.includes('namespace')) {
      errors.push('Warning: C# programs should be inside a namespace.');
    }

    // 2. Check if 'using' statements are present
    if (!code.includes('using ')) {
      errors.push('Info: Consider importing necessary namespaces using "using" statements.');
    }

    // 3. Check for the presence of a Main method
    if (!code.includes('Main(')) {
      errors.push('Error: C# applications should have a "static void Main" method.');
    }

    // 4. Check for missing return types in functions
    const methodMatches = code.match(/(public|private|protected)?\s*(static\s*)?(void|int|bool|string|float|double)\s+\w+\s*\(.*\)\s*{[^}]*}/g);
    if (methodMatches) {
      methodMatches.forEach((method) => {
        if (!/void|int|bool|string|float|double/.test(method)) {
          errors.push(`Method without a return type found: ${method.substring(0, 30)}...`);
        }
      });
    }

    // 5. Check for unused variables (variables declared but not used)
    const variableMatches = code.match(/\b(var|int|float|double|string|bool)\s+\w+\s*=?\s*[^;]*;/g);
    if (variableMatches) {
      variableMatches.forEach((variable) => {
        if (!new RegExp(variable.split(' ')[1]).test(code)) {
          errors.push(`Unused variable detected: ${variable}`);
        }
      });
    }

    // 6. Check for async/await usage
    if (/async\s+\w+\s*\(.*\)\s*{[^}]*}/.test(code) && !/await/.test(code)) {
      errors.push('Warning: Async method found, but no await statement detected.');
    }

    // 7. Detect magic numbers (hardcoded numbers)
    if (/\b\d+\b/.test(code)) {
      errors.push('Avoid using magic numbers. Use named constants instead.');
    }

    // 8. Check for empty methods
    const emptyMethodMatches = code.match(/(public|private|protected)?\s*(static\s*)?(void|int|bool|string|float|double)\s+\w+\s*\(.*\)\s*{\s*}/g);
    if (emptyMethodMatches) {
      errors.push(`Empty methods detected: ${emptyMethodMatches.join(', ')}`);
    }

    // 9. Check for missing curly braces in control structures (if, for, while, etc.)
    if (/if\s*\(.*\)\s*[^}]*$/.test(code) || /for\s*\(.*\)\s*[^}]*$/.test(code) || /while\s*\(.*\)\s*[^}]*$/.test(code)) {
      errors.push('Warning: Missing curly braces for control structures.');
    }

    // 10. Check for inappropriate access modifiers (methods without access modifiers)
    const methodAccessModifiers = code.match(/\b(public|private|protected|internal)\s+(void|int|string|bool|float|double)\s+\w+\s*\(.*\)\s*{[^}]*}/g);
    if (methodAccessModifiers) {
      methodAccessModifiers.forEach((method) => {
        if (!/\b(public|private|protected|internal)\s+/.test(method)) {
          errors.push(`Inappropriate access modifier in method: ${method.substring(0, 30)}...`);
        }
      });
    }

    // 11. Detect empty classes (no methods or properties)
    if (/\bclass\s+\w+\s*{[^}]*}/.test(code)) {
      const classMatches = code.match(/\bclass\s+\w+\s*{[^}]*}/g);
      classMatches?.forEach((cls) => {
        if (!/\bclass\s+\w+\s*{[^{}]*}/.test(cls)) {
          errors.push(`Empty class detected: ${cls.substring(0, 30)}...`);
        }
      });
    }

    // 12. Check for unused exception variables (catch blocks)
    const catchMatches = code.match(/catch\s*\((.*?)\)\s*{[^}]*}/g);
    if (catchMatches) {
      catchMatches.forEach((catchBlock) => {
        const exceptionVariable = catchBlock.match(/\((.*?)\)/)?.[1];
        if (exceptionVariable && !new RegExp(exceptionVariable).test(catchBlock)) {
          errors.push(`Unused exception variable in catch block: ${exceptionVariable}`);
        }
      });
    }

    return errors.length ? errors : ['No issues found.'];
  }
}
