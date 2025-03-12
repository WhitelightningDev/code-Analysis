import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GoParser {
  parse(code: string): string[] {
    const errors: string[] = [];

    if (!code.includes('package main')) {
      errors.push('Error: Go programs should start with "package main".');
    }
    if (!code.includes('func main()')) {
      errors.push('Warning: Go programs usually have a "func main()" function.');
    }
    if (code.includes(';')) {
      errors.push('Warning: Go does not require semicolons at the end of statements.');
    }

    return errors.length ? errors : ['No issues found.'];
  }
}
