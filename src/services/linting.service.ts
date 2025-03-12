import { Injectable } from '@angular/core';
import { LanguageDetectionService } from './language-detection.service';

@Injectable({
  providedIn: 'root',
})
export class LintingService {
  constructor(private languageDetection: LanguageDetectionService) {}

  lintCode(code: string): string {
    const language = this.languageDetection.detectLanguage(code);

    switch (language) {
      case 'javascript':
        return this.lintJavaScript(code);
      case 'python':
        return this.lintPython(code);
      case 'cpp':
        return this.lintCpp(code);
      default:
        return 'Unsupported language or no issues found';
    }
  }

  private lintJavaScript(code: string): string {
    return code.includes('var') ? 'Avoid using var, use let or const' : 'No issues found';
  }

  private lintPython(code: string): string {
    return code.includes('print ') ? 'Use logging module instead of print' : 'No issues found';
  }

  private lintCpp(code: string): string {
    return code.includes('using namespace std;')
      ? 'Avoid using `using namespace std;` in global scope'
      : 'No issues found';
  }
}
