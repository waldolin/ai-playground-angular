import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { DatePipe, NgClass, NgIf } from '@angular/common';
import { Role, TextPart } from '@google/generative-ai';

export interface Message {
  role: Role;
  parts: TextPart;
  time: Date | string;
};

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [NgIf, NgClass, DatePipe],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessageComponent {
  @Input() message!: Message;
}
