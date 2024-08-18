import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-llm',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './llm.component.html',
  styleUrl: './llm.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LlmComponent {
  constructor(private http: HttpClient) {
    this.http.get('http://localhost:1234/v1/models').subscribe(result => {
      console.log(result);
    });
  }
}
