import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CppParser {
  parse(code: string): string[] {
    const issues: string[] = [];

    // Example: Check for 'using namespace std' in global scope
    if (/using\s+namespace\s+std\s*;/.test(code)) {
      issues.push('Avoid using `using namespace std;` in global scope.');
    }

    // Example: Check for missing return statements in functions
    if (/int\s+\w+\s*\(.*\)\s*{[^}]*}$/.test(code) && !/return\s+\w+/.test(code)) {
      issues.push('Functions with int return type should return a value.');
    }

    return issues.length ? issues : ['No C++ issues found.'];
  }
}
