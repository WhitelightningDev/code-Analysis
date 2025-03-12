import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true, // ✅ Required for standalone components
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] // ✅ "styleUrls" instead of "styleUrl"
})
export class AppComponent {
  title = 'codeanalysis';
}
