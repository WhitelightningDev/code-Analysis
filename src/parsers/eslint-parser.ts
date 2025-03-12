import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ESLintParser {
  parse(code: string): string[] {
    const issues: string[] = [];

    // Example: Check for 'var' usage (should use let or const)
    if (/var\s+\w+/.test(code)) {
      issues.push('Avoid using var. Use let or const instead.');
    }

    // Example: Check for missing semicolons
    if (!code.trim().endsWith(';')) {
      issues.push('Consider adding semicolons for consistency.');
    }

    return issues.length ? issues : ['No JavaScript issues found.'];
  }
}
