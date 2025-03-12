import { Injectable } from '@angular/core';
import { CppParser } from './cpp-parser';
import { ESLintParser } from './eslint-parser';
import { PylintParser } from './pylint-parser';
import { JavaParser } from './java-parser';
import { CSharpParser } from './csharp-parser';
import { GoParser } from './go-parser';
import { PHPParser } from './php-parser';
import { TypeScriptParser } from './typescript-parser';
import { HTMLParser } from './html-parser'; // Import the new HTMLParser

@Injectable({
  providedIn: 'root',
})
export class ParserFactoryService {
  constructor(
    private cppParser: CppParser,
    private eslintParser: ESLintParser,
    private PylintParser: PylintParser,
    private javaParser: JavaParser,
    private csharpParser: CSharpParser,
    private goParser: GoParser,
    private phpParser: PHPParser,
    private tsParser: TypeScriptParser,
    private htmlParser: HTMLParser // Inject the HTMLParser
  ) {}

  getParser(language: string) {
    switch (language) {
      case 'c++':
        return this.cppParser;
      case 'javascript':
        return this.eslintParser;
      case 'python':
        return this.PylintParser;
      case 'java':
        return this.javaParser;
      case 'csharp':
        return this.csharpParser;
      case 'go':
        return this.goParser;
      case 'php':
        return this.phpParser;
      case 'typescript':
        return this.tsParser;
      case 'html': // Add HTML case
        return this.htmlParser;
      default:
        return null;
    }
  }
}
