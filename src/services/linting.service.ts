import { Injectable } from '@angular/core';
import { LanguageDetectionService } from './language-detection.service';
import { ParserFactoryService } from '../parsers/parser-factory.service';

@Injectable({
  providedIn: 'root',
})
export class LintingService {
  constructor(
    private languageDetection: LanguageDetectionService,
    private parserFactory: ParserFactoryService
  ) {}

  lintCode(code: string): string {
    const language = this.languageDetection.detectLanguage(code);

    // Get the appropriate parser from the factory
    const parser = this.parserFactory.getParser(language);

    // If a parser is found for the language, lint the code
    if (parser) {
      const issues = parser.parse(code);
      return issues.length ? issues.join(', ') : 'No issues found';
    } else {
      return 'Unsupported language or no issues found';
    }
  }
}
