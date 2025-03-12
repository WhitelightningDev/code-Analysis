import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CSharpParser {
  parse(code: string): string[] {
    const errors: string[] = [];

    if (!code.includes('namespace')) {
      errors.push('Warning: C# programs should be inside a namespace.');
    }
    if (!code.includes('using ')) {
      errors.push('Info: Consider importing necessary namespaces using "using" statements.');
    }
    if (!code.includes('Main(')) {
      errors.push('Error: C# applications should have a "static void Main" method.');
    }

    return errors.length ? errors : ['No issues found.'];
  }
}
