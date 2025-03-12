import { Component } from '@angular/core';
import { NgFor, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ParserFactoryService } from '../../parsers/parser-factory.service';
import { LanguageDetectionService } from '../../services/language-detection.service';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  imports: [CommonModule, FormsModule, NgFor], // Import required modules
})
export class HomeComponent {
  code = '';
  detectedLanguage = '';
  parsingResults: string[] = [];

  constructor(
    private parserFactory: ParserFactoryService,
    private languageDetection: LanguageDetectionService
  ) {}

  analyzeCode() {
    this.detectedLanguage = this.languageDetection.detectLanguage(this.code);
    const parser = this.parserFactory.getParser(this.detectedLanguage);

    if (parser) {
      this.parsingResults = parser.parse(this.code);
    } else {
      this.parsingResults = ['Unsupported language.'];
    }
  }
}
