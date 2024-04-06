import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewEncapsulation } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { GenerativeAiService } from '../../../services/generative-ai.service';
import { FileConversionService } from '../../../services/file-conversion.service';

@Component({
  selector: 'app-gemini-pro-vision',
  standalone: true,
  imports: [NgIf, NgClass, ReactiveFormsModule],
  templateUrl: './gemini-pro-vision.component.html',
  styleUrl: './gemini-pro-vision.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GeminiProVisionComponent {
  isLoading = false;
  isBlocked = false;

  genConfig$ = firstValueFrom(this.generativeAiService.genConfig$);

  prompt = this.formBuilder.control('', Validators.required);
  promptText = '';

  imageFile: File | undefined;
  preview = '';
  responseText = '';

  constructor(public formBuilder: FormBuilder, private cdRef: ChangeDetectorRef,
    private generativeAiService: GenerativeAiService, private fileConversionService: FileConversionService) { }

  fileChangeEvent(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    const fileList: FileList | null = element.files;

    if (fileList && fileList.length > 0) {
      this.imageFile = fileList[0];
      this.preview = URL.createObjectURL(this.imageFile);
    }
  }

  async sendTextAndImages() {
    try {
      this.promptText = this.prompt.value!;
      this.generativeAiService.resetConfig();
      this.isLoading = true;
      this.isBlocked = false;

      const imageBase64 = await this.fileConversionService.convertFileToBase64(this.imageFile!);

      if (typeof imageBase64 !== 'string') {
        console.error('Image conversion to Base64 failed.');
        return;
      }

      const genModel = this.generativeAiService.getGenModel('gemini-pro-vision');

      const prompt = [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: imageBase64
          }
        },
        {
          text: this.prompt.value ?? ''
        }
      ];

      const result = await genModel?.generateContent(prompt);
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
    } catch (error) {
      this.isBlocked = true;
      this.responseText = `Error. ${error}`;
      console.error('Error converting file to Base64', error);
      this.cdRef.markForCheck();
    }
  }
}
