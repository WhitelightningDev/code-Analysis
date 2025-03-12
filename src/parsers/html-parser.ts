import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HTMLParser {
  parse(code: string): string[] {
    const issues: string[] = [];

    // Check for missing DOCTYPE declaration
    if (!code.includes('<!DOCTYPE html>')) {
      issues.push('Warning: Missing DOCTYPE declaration. It is recommended to include "<!DOCTYPE html>" at the top of the document.');
    }

    // Check for missing <html> or <body> tags
    if (!/<html[^>]*>.*<\/html>/i.test(code)) {
      issues.push('Warning: Missing <html> tags.');
    }
    if (!/<body[^>]*>.*<\/body>/i.test(code)) {
      issues.push('Warning: Missing <body> tags.');
    }

    // Check for inline styles (best practice is to use external CSS)
    if (/<\w+[^>]*style\s*=\s*['"][^'"]*['"][^>]*>/i.test(code)) {
      issues.push('Warning: Inline styles detected. Consider moving styles to an external CSS file.');
    }

    // Check for missing alt attributes on images (accessibility issue)
    if (/<img[^>]*\s*src\s*=\s*['"][^'"]+['"][^>]*\s*(?!alt\s*=\s*['"][^'"]*['"])/i.test(code)) {
      issues.push('Error: Missing alt attribute in <img> tag. This is important for accessibility.');
    }

    // Check for unquoted attribute values
    if (/<\w+[^>]*\s+[^=\s]+=[^"'\s][^>\s]*[^>\s]*>/i.test(code)) {
      issues.push('Warning: Unquoted attribute values detected. Always quote attribute values in HTML.');
    }

    // Check for improperly closed tags
    const tags = code.match(/<\w+/g);
    if (tags) {
      const openTags = tags.filter(tag => !code.includes(`</${tag.substring(1)}>`));
      if (openTags.length) {
        issues.push(`Error: Missing closing tags for the following elements: ${openTags.join(', ')}`);
      }
    }

    // Check for multiple `<br>` tags used for layout (use CSS instead)
    const brTags = (code.match(/<br\s*\/?>/g) || []).length;
    if (brTags > 3) {
      issues.push('Warning: Too many <br> tags used. Consider using CSS for layout instead.');
    }

    // Check for script tags without async or defer (optimize load times)
    if (/<script[^>]*>([^<]*)<\/script>/i.test(code) && !/<script[^>]*\s*(async|defer)\s*=\s*['"][^'"]*['"][^>]*>/i.test(code)) {
      issues.push('Warning: Script tags without async or defer may block rendering. Consider adding async or defer.');
    }

    return issues.length ? issues : ['No HTML issues found.'];
  }
}
