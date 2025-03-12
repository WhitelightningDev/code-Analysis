import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class JavaParser {
  parse(code: string): string[] {
    const errors: string[] = [];

    if (!code.includes('class ')) {
      errors.push('Error: Java files should contain at least one class definition.');
    }
    if (!code.includes('public static void main')) {
      errors.push('Warning: Java programs usually have a "public static void main" method.');
    }
    if (!code.includes(';')) {
      errors.push('Warning: Java statements should end with a semicolon.');
    }

    return errors.length ? errors : ['No issues found.'];
  }
}
