import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LanguageDetectionService {
  detectLanguage(code: string): string {
    if (/function\s+\w+\s*\(.*\)\s*{/.test(code) || /const|let|var/.test(code)) {
      return 'javascript';
    }
    if (/def\s+\w+\s*\(.*\):/.test(code) || /print\(.+\)/.test(code)) {
      return 'python';
    }
    if (/#include\s+<.+>/.test(code) || /int\s+main\s*\(.*\)\s*{/.test(code)) {
      return 'cpp';
    }
    if (/public\s+class\s+\w+\s*{/.test(code) || /System\.out\.println/.test(code)) {
      return 'java';
    }
    if (/using\s+System/.test(code) || /namespace\s+\w+/.test(code)) {
      return 'csharp';
    }
    if (/package\s+main/.test(code) || /fmt\.Println/.test(code)) {
      return 'go';
    }
    if (/<?php/.test(code) || /echo\s+["'].*["'];/.test(code)) {
      return 'php';
    }
    if (/import\s+\w+\s+from\s+['"].+['"]/.test(code) || /export\s+const|let|var/.test(code)) {
      return 'typescript';
    }
    return 'unknown';
  }
}
