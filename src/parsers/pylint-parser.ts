import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PylintParser {
  parse(code: string): string[] {
    const issues: string[] = [];

    // Example: Check for print statements (suggest using logging module)
    if (/print\(.+\)/.test(code)) {
      issues.push('Avoid print statements. Use the logging module instead.');
    }

    // Example: Check for missing function docstrings
    if (/def\s+\w+\s*\(.*\):\s*\n\s*(?!""")/.test(code)) {
      issues.push('Functions should have docstrings.');
    }

    return issues.length ? issues : ['No Python issues found.'];
  }
}
