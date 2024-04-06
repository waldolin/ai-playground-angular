import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren, ViewEncapsulation, model } from '@angular/core';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Role, TextPart } from '@google/generative-ai';
import { GenerativeAiService } from '../../../services/generative-ai.service';
import { Message, MessageComponent } from './components/message/message.component';
import { MessageInputComponent } from './components/message-input/message-input.component';

@Component({
  selector: 'app-gemini-pro-chat',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, ReactiveFormsModule, MessageComponent, MessageInputComponent],
  templateUrl: './gemini-pro-chat.component.html',
  styleUrl: './gemini-pro-chat.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GeminiProChatComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('messageContainer') messageContainer!: ElementRef;
  @ViewChildren('messageElements') messageElements!: QueryList<any>;

  isLoading = false;
  isBlocked = false;
  responseStatus = '';
  blockedResponseText = '';

  messages: Message[] = [];

  form = new FormGroup({
    messageInput: new FormControl('')
  });

  private _destroy$ = new Subject<void>();

  constructor(private cdRef: ChangeDetectorRef, private generativeAiService: GenerativeAiService) { }

  ngOnInit(): void {
    this.form.controls.messageInput.valueChanges.pipe(
      takeUntil(this._destroy$)
    ).subscribe(async (text) => {
      this.generativeAiService.resetConfig();
      this.isLoading = true;
      this.isBlocked = false;

      this.addMessageToList({
        role: 'user',
        parts: { text: !!text ? text : '' }
      });

      const genModel = this.generativeAiService.getGenModel('gemini-pro');
      const chat = genModel.startChat({
        // history: [
        //   {
        //     role: 'user',
        //     parts: [{ text: '若我使用中文，請使用繁體中文回答我' }]
        //   },
        //   {
        //     role: 'model',
        //     parts: [{ text: '好的' }]
        //   }
        // ],
        generationConfig: {
          maxOutputTokens: 100
        }
      });

      const result = await chat.sendMessage(text!);
      const response = await result.response;

      if (!response) {
        this.isBlocked = true;
        this.responseStatus = 'no_response';
      } else {
        if (response.promptFeedback?.blockReason) {
          this.isBlocked = true;
          this.responseStatus = 'blocked';
          this.blockedResponseText = response.promptFeedback?.blockReason;
        } else {
          this.addMessageToList({
            role: 'model',
            parts: { text: response.text() }
          });
        }
      }

      this.isLoading = false;
      this.cdRef.markForCheck();
    });
  }

  ngAfterViewInit(): void {
    this.messageElements.changes.pipe(
      takeUntil(this._destroy$)
    ).subscribe(() => this.scrollToBottom());
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private addMessageToList(message: { role: Role, parts: TextPart }) {
    if (message.parts.text === '') {
      return;
    }

    if (this.messages.length > 80) {
      this.messages.splice(0, 40);
    }

    this.messages.push({...message, time: new Date()});
  }

  private scrollToBottom(): void {
    // this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
    this.messageContainer.nativeElement.scroll({
      top: this.messageContainer.nativeElement.scrollHeight,
      left: 0,
      behavior: 'smooth'
    });
  }
}
