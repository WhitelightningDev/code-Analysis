import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PHPParser {
  parse(code: string): string[] {
    const errors: string[] = [];

    // 1. Ensure PHP scripts start with "<?php"
    if (!code.includes('<?php')) {
      errors.push('Error: PHP scripts should start with "<?php".');
    }

    // 2. Ensure statements end with a semicolon
    if (!code.includes(';')) {
      errors.push('Warning: PHP statements should end with a semicolon.');
    }

    // 3. Ensure "echo" is used for output
    if (!code.includes('echo')) {
      errors.push('Info: Consider using "echo" for output in PHP.');
    }

    // 4. Check for proper function naming conventions (snake_case)
    const functionNames = code.match(/function\s+([a-z0-9_]+)/g);
    if (functionNames) {
      functionNames.forEach((fn) => {
        const name = fn.split(' ')[1];
        if (name !== name.toLowerCase()) {
          errors.push(`Function name "${name}" should follow snake_case convention.`);
        }
      });
    }

    // 5. Check for proper variable naming conventions (snake_case)
    const variables = code.match(/\$(\w+)/g);
    if (variables) {
      variables.forEach((varName) => {
        const name = varName.substring(1);
        if (name !== name.toLowerCase()) {
          errors.push(`Variable name "${name}" should follow snake_case convention.`);
        }
      });
    }

    // 6. Ensure strict comparison (===) instead of loose comparison (==)
    if (/==\s+/.test(code)) {
      errors.push('Warning: Use strict comparison (===) instead of loose comparison (==).');
    }

    // 7. Avoid using short tags ("<?")
    if (/<?\w/.test(code)) {
      errors.push('Warning: Avoid using PHP short tags ("<?"). Always use "<?php".');
    }

    // 8. Ensure PHP files end with a proper closing tag or no closing tag
    if (/>/.test(code) && !code.endsWith('?>')) {
      errors.push('Warning: PHP files should ideally not have a closing tag (?>).');
    }

    // 9. Check for unnecessary comments
    const comments = code.match(/\/\/.*|\/\*[\s\S]*?\*\//g);
    if (comments) {
      comments.forEach((comment) => {
        if (comment.includes('TODO') || comment.includes('FIXME')) {
          errors.push('Info: Remove unnecessary comments (e.g., TODO, FIXME) from code.');
        }
      });
    }

    // 10. Suggest using the newer array syntax ([]) instead of (array())
    if (/\barray\(/.test(code)) {
      errors.push('Warning: Use "[]" instead of "array()" for array declarations in PHP.');
    }

    return errors.length ? errors : ['No PHP issues found.'];
  }
}
