import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TypeScriptParser {
  parse(code: string): string[] {
    const errors: string[] = [];

    // 1. Modules should use "export" to expose functionality.
    if (!code.includes('export ')) {
      errors.push('Info: TypeScript modules should use "export" to expose functionality.');
    }

    // 2. Avoid using "var". Use "let" or "const" instead.
    if (/var\s+\w+/.test(code)) {
      errors.push('Warning: Avoid "var", use "let" or "const" instead.');
    }

    // 3. TypeScript supports explicit type annotations.
    if (!code.includes(':')) {
      errors.push('Info: TypeScript supports explicit type annotations. Consider adding them.');
    }

    // 4. Ensure all declared variables are used in the code.
    const declaredVariables = code.match(/\b(let|const)\s+(\w+)/g);
    if (declaredVariables) {
      declaredVariables.forEach((decl) => {
        const varName = decl.split(' ')[1];
        if (!new RegExp(`\\b${varName}\\b`).test(code)) {
          errors.push(`Warning: Variable "${varName}" is declared but not used.`);
        }
      });
    }

    // 5. Ensure arrow functions are used.
    if (/function\s+\w+\s*\(.*\)\s*{/.test(code)) {
      errors.push('Warning: Use arrow functions instead of traditional function expressions.');
    }

    // 6. No implicit "any" type.
    if (/\bany\b/.test(code)) {
      errors.push('Error: Avoid using the "any" type. Use more specific types.');
    }

    // 7. Ensure "strict" mode is enabled in TypeScript configuration (in tsconfig.json).
    if (!code.includes('"strict": true')) {
      errors.push('Info: Enable "strict" mode in your tsconfig.json for better type checking.');
    }

    // 8. Ensure class methods have appropriate access modifiers (public, private, protected).
    const classMethods = code.match(/\bclass\s+\w+\s*{[^}]*}/g);
    if (classMethods) {
      classMethods.forEach((classMethod) => {
        if (!/(public|private|protected)\s+\w+\(/.test(classMethod)) {
          errors.push('Warning: Class methods should have appropriate access modifiers (public, private, protected).');
        }
      });
    }

    return errors.length ? errors : ['No TypeScript issues found.'];
  }
}
