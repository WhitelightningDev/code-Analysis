import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PylintParser {
  parse(code: string): string[] {
    const issues: string[] = [];

    // 1. Avoid print statements. Use the logging module instead.
    if (/print\(.+\)/.test(code)) {
      issues.push('Avoid print statements. Use the logging module instead.');
    }

    // 2. Functions should have docstrings.
    if (/def\s+\w+\s*\(.*\):\s*\n\s*(?!""")/.test(code)) {
      issues.push('Functions should have docstrings.');
    }

    // 3. Ensure function arguments are named clearly (snake_case).
    const functionArgs = code.match(/def\s+\w+\s*\(([^)]*)\)/g);
    if (functionArgs) {
      functionArgs.forEach((fn) => {
        const args = fn.split('(')[1].split(')')[0].split(',').map(arg => arg.trim());
        args.forEach((arg) => {
          if (arg && arg !== arg.toLowerCase()) {
            issues.push(`Function argument "${arg}" should follow snake_case convention.`);
          }
        });
      });
    }

    // 4. Ensure lines do not exceed 79 characters.
    const lines = code.split('\n');
    lines.forEach((line, index) => {
      if (line.length > 79) {
        issues.push(`Line ${index + 1} exceeds 79 characters. Please limit line length.`);
      }
    });

    // 5. Unused imports.
    const importStatements = code.match(/import\s+\S+/g);
    if (importStatements) {
      importStatements.forEach((importStatement) => {
        if (!code.includes(importStatement.split(' ')[1])) {
          issues.push(`Unused import detected: ${importStatement}.`);
        }
      });
    }

    // 6. Multiple imports on a single line.
    if (/import\s+\S+\s+,\s+\S+/g.test(code)) {
      issues.push('Avoid multiple imports on a single line. Use separate lines for each import.');
    }

    // 7. Indentation consistency (using 4 spaces per indentation level).
    const indentations = code.match(/^(?!\s*$)(\s*)/gm);
    if (indentations) {
      indentations.forEach((indentation) => {
        if (indentation.length % 4 !== 0) {
          issues.push('Use 4 spaces for indentation. Tabs or mixed indentation are not allowed.');
        }
      });
    }

    // 8. Global variables should follow snake_case.
    const globalVars = code.match(/^\s*\w+\s*=\s*/gm);
    if (globalVars) {
      globalVars.forEach((varDeclaration) => {
        const varName = varDeclaration.split('=')[0].trim();
        if (varName !== varName.toLowerCase()) {
          issues.push(`Global variable "${varName}" should follow snake_case convention.`);
        }
      });
    }

    // 9. Avoid unnecessary parentheses in return values or boolean checks.
    if (/return\s+\(.*\)/.test(code)) {
      issues.push('Avoid unnecessary parentheses in return statements.');
    }

    if (/if\s*\(.*\)/.test(code)) {
      issues.push('Avoid unnecessary parentheses in if conditions.');
    }

    return issues.length ? issues : ['No Python issues found.'];
  }
}
