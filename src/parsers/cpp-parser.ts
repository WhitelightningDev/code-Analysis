import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CppParser {
  parse(code: string): string[] {
    const issues: string[] = [];

    // 1. Check for 'using namespace std' in global scope
    if (/using\s+namespace\s+std\s*;/.test(code)) {
      issues.push('Avoid using `using namespace std;` in the global scope.');
    }

    // 2. Check for missing return statements in functions with int return type
    const functionMatches = code.match(/int\s+\w+\s*\(.*\)\s*{[^}]*}/g);
    if (functionMatches) {
      functionMatches.forEach((func) => {
        if (!/return\s+\w+/.test(func)) {
          issues.push(`Function missing return statement: ${func.substring(0, 30)}...`);
        }
      });
    }

    // 3. Check for missing semicolons at the end of statements
    const lines = code.split('\n');
    lines.forEach((line, index) => {
      if (
        /\b(int|float|double|char|bool|string|void)\s+\w+\s*=?.*[^;{}]\s*$/.test(line) &&
        !/if|for|while|switch/.test(line)
      ) {
        issues.push(`Possible missing semicolon at line ${index + 1}: "${line.trim()}"`);
      }
    });

    // 4. Check for global variable declarations (bad practice)
    const globalVarMatches = code.match(/^\s*(int|float|double|char|bool|string)\s+\w+\s*=?\s*[^;]*;/gm);
    if (globalVarMatches) {
      issues.push(`Avoid using global variables: ${globalVarMatches.join(', ')}`);
    }

    // 5. Check for uninitialized variables
    const uninitializedVars = code.match(/\b(int|float|double|char|bool|string)\s+\w+\s*;/g);
    if (uninitializedVars) {
      issues.push(`Uninitialized variables detected: ${uninitializedVars.join(', ')}`);
    }

    // 6. Detect magic numbers (hardcoded numbers in expressions)
    if (/\b\d+\b/.test(code)) {
      issues.push('Avoid using magic numbers. Use named constants instead.');
    }

    // 7. Check for missing standard library includes
    const missingIncludes = !/#include\s+<.*>/.test(code);
    if (missingIncludes) {
      issues.push('Missing standard library includes. Ensure all required headers are included.');
    }

    // 8. Check for unused variables (variable is declared but not used)
    const unusedVariables = code.match(/\b(int|float|double|char|bool|string)\s+\w+\s*[^=]*;/g);
    if (unusedVariables) {
      unusedVariables.forEach((variable) => {
        const varName = variable.split(' ')[1].trim();
        if (!new RegExp(`\\b${varName}\\b`).test(code)) {
          issues.push(`Unused variable: ${varName}`);
        }
      });
    }

    // 9. Check for improper indentation (if no tabs/spaces before code block)
    lines.forEach((line, index) => {
      if (line.trim() !== '' && line !== line.trimStart()) {
        issues.push(`Improper indentation at line ${index + 1}: "${line.trim()}"`);
      }
    });

    // 10. Check for multiple empty catch blocks (potentially missed exceptions)
    const catchBlocks = code.match(/catch\s*\(.*\)\s*{[^}]*}/g);
    if (catchBlocks) {
      catchBlocks.forEach((catchBlock, index) => {
        if (catchBlock.includes('{}')) {
          issues.push(`Empty catch block at index ${index + 1}`);
        }
      });
    }

    // 11. Check for memory leaks (using `new` without `delete`)
    const newStatements = code.match(/\bnew\s+/g);
    const deleteStatements = code.match(/\bdelete\s+/g);
    if (newStatements && deleteStatements && newStatements.length > deleteStatements.length) {
      issues.push('Potential memory leak detected. Ensure `delete` is used after `new`.');
    }

    // 12. Detect empty functions
    const emptyFunctions = code.match(/\w+\s+\w+\s*\(.*\)\s*{[^}]*}/g);
    if (emptyFunctions) {
      emptyFunctions.forEach((func) => {
        if (!func.includes('return') && !func.includes('throw') && !func.includes('continue') && !func.includes('break')) {
          issues.push(`Empty function detected: ${func.substring(0, 30)}...`);
        }
      });
    }

    // 13. Check for unreachable code after return statements
    const returnStatements = code.match(/\breturn\b/);
    if (returnStatements) {
      const codeAfterReturn = code.split(returnStatements[0])[1];
      if (codeAfterReturn && !/^\s*$/.test(codeAfterReturn)) {
        issues.push('Unreachable code detected after return statement.');
      }
    }

    // 14. Check for braces mismatches
    let openBraces = 0;
    let closeBraces = 0;
    for (let i = 0; i < code.length; i++) {
      if (code[i] === '{') openBraces++;
      if (code[i] === '}') closeBraces++;
    }
    if (openBraces !== closeBraces) {
      issues.push('Braces mismatch detected. Ensure all opening and closing braces match.');
    }

    // 15. Incorrect type usage (checking if variable type matches its use)
    const typeMatches = code.match(/\b(int|float|double|char|bool|string)\s+\w+/g);
    if (typeMatches) {
      typeMatches.forEach((match) => {
        const type = match.split(' ')[0];
        if (code.includes(`*${match.split(' ')[1]}`) && type !== 'int') {
          issues.push(`Incorrect type usage detected for ${match.split(' ')[1]}`);
        }
      });
    }

    // 16. Check for const correctness
    const constVars = code.match(/\bconst\s+\w+\s+\w+/g);
    if (constVars) {
      constVars.forEach((constVar) => {
        if (!/const\s+\w+\s+\w+[^=]/.test(constVar)) {
          issues.push(`Ensure that const variables are correctly assigned or used: ${constVar}`);
        }
      });
    }

    return issues.length ? issues : ['No C++ issues found.'];
  }
}
