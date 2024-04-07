import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewEncapsulation } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { MarkdownComponent } from 'ngx-markdown';
import { GenerativeAiService } from '../../../services/generative-ai.service';

@Component({
  selector: 'app-gemini-pro',
  standalone: true,
  imports: [NgIf, NgClass, ReactiveFormsModule, MarkdownComponent],
  templateUrl: './gemini-pro.component.html',
  styleUrl: './gemini-pro.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GeminiProComponent {
  isLoading = false;
  isBlocked = false;

  prompt = this.formBuilder.control('', Validators.required);
  promptText = '';
  responseText = '';

  constructor(public formBuilder: FormBuilder, private cdRef: ChangeDetectorRef,
    private generativeAiService: GenerativeAiService) { }

  async sendText() {
    const genModel = this.generativeAiService.getGenModel('gemini-pro');

    this.promptText = this.prompt.value!;
    this.generativeAiService.resetConfig();
    this.isLoading = true;
    this.isBlocked = false;

    const result = await genModel?.generateContent(this.promptText);
    const response = await result?.response;
    if (!response) {
      this.isBlocked = true;
      this.responseText = 'No response.';
    } else {
      if (response.promptFeedback?.blockReason) {
        this.isBlocked = true;
        this.responseText = `Not available. ${response.promptFeedback?.blockReason} reason.`;
      } else {
        this.responseText = response.text();
      }
    }

    this.isLoading = false;
    this.prompt.reset();
    this.cdRef.markForCheck();
  }
}
