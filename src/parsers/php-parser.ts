import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PHPParser {
  parse(code: string): string[] {
    const errors: string[] = [];

    if (!code.includes('<?php')) {
      errors.push('Error: PHP scripts should start with "<?php".');
    }
    if (!code.includes(';')) {
      errors.push('Warning: PHP statements should end with a semicolon.');
    }
    if (!code.includes('echo')) {
      errors.push('Info: Consider using "echo" for output in PHP.');
    }

    return errors.length ? errors : ['No issues found.'];
  }
}
