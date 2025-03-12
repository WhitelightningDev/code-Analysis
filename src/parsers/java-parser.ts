import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class JavaParser {
  parse(code: string): string[] {
    const errors: string[] = [];

    // 1. Ensure Java files contain at least one class definition
    if (!code.includes('class ')) {
      errors.push('Error: Java files should contain at least one class definition.');
    }

    // 2. Ensure Java programs include a "public static void main" method
    if (!code.includes('public static void main')) {
      errors.push('Warning: Java programs usually have a "public static void main" method.');
    }

    // 3. Ensure statements end with a semicolon
    if (!code.includes(';')) {
      errors.push('Warning: Java statements should end with a semicolon.');
    }

    // 4. Ensure class names follow Java conventions (Pascal case)
    const classNames = code.match(/class\s+([A-Z][A-Za-z0-9]*)/g);
    if (classNames) {
      classNames.forEach((className) => {
        const name = className.split(' ')[1];
        if (name[0] !== name[0].toUpperCase()) {
          errors.push(`Class name "${name}" should follow Pascal case convention.`);
        }
      });
    }

    // 5. Ensure method names follow Java conventions (camel case)
    const methodNames = code.match(/public\s+.*\s+([a-z][A-Za-z0-9]*)\s*\(/g);
    if (methodNames) {
      methodNames.forEach((method) => {
        const name = method.split(' ')[2].split('(')[0];
        if (name[0] !== name[0].toLowerCase()) {
          errors.push(`Method name "${name}" should follow camel case convention.`);
        }
      });
    }

    // 6. Check for missing access modifiers for methods and classes
    const missingAccessModifiers = code.match(/class\s+[A-Za-z0-9]+/g);
    if (missingAccessModifiers) {
      missingAccessModifiers.forEach((def) => {
        if (!def.includes('public') && !def.includes('private') && !def.includes('protected')) {
          errors.push(`Class "${def.split(' ')[1]}" lacks an access modifier.`);
        }
      });
    }

    const methodMissingModifiers = code.match(/(public|private|protected)?\s+.*\s+\w+\s*\(.*\)\s*{/g);
    if (methodMissingModifiers) {
      methodMissingModifiers.forEach((method) => {
        if (!method.includes('public') && !method.includes('private') && !method.includes('protected')) {
          errors.push('Methods should have an access modifier (public/private/protected).');
        }
      });
    }

    // 7. Check for redundant or unused imports
    const importStatements = code.match(/import\s+.*;/g);
    if (importStatements) {
      const usedImports: Set<string> = new Set();
      importStatements.forEach((imp) => {
        if (!code.includes(imp)) {
          errors.push(`Redundant import: ${imp}`);
        }
      });
    }

    // 8. Ensure proper error handling with try-catch blocks
    if (/try\s*{/.test(code) && !/catch\s*\(/.test(code)) {
      errors.push('Warning: Missing catch block after try block. Ensure error handling.');
    }

    // 9. Avoid magic numbers (use constants instead)
    const magicNumbers = code.match(/\b\d+\b/g);
    if (magicNumbers) {
      magicNumbers.forEach((num) => {
        if (parseInt(num) > 0 && parseInt(num) < 100) {
          errors.push(`Consider replacing magic number "${num}" with a named constant.`);
        }
      });
    }

    // 10. Ensure resources are properly closed (e.g., streams, database connections)
    if (/new\s+FileReader\(/.test(code) && !/reader.close\(\)/.test(code)) {
      errors.push('Warning: Ensure resources (e.g., FileReader) are properly closed after use.');
    }

    return errors.length ? errors : ['No Java issues found.'];
  }
}
