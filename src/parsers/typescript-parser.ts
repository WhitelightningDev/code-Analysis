import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TypeScriptParser {
  parse(code: string): string[] {
    const errors: string[] = [];

    if (!code.includes('export ')) {
      errors.push('Info: TypeScript modules should use "export" to expose functionality.');
    }
    if (code.includes('var ')) {
      errors.push('Warning: Avoid "var", use "let" or "const" instead.');
    }
    if (!code.includes(':')) {
      errors.push('Info: TypeScript supports explicit type annotations.');
    }

    return errors.length ? errors : ['No issues found.'];
  }
}
