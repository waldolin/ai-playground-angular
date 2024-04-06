import { ChangeDetectionStrategy, Component, ViewEncapsulation, forwardRef } from '@angular/core';
import { NgClass } from '@angular/common';
import { ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-message-input',
  standalone: true,
  imports: [NgClass, ReactiveFormsModule],
  templateUrl: './message-input.component.html',
  styleUrl: './message-input.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MessageInputComponent),
    multi: true
  }]
})
export class MessageInputComponent implements ControlValueAccessor {
  messageInputForm = new FormGroup({
    messageInput: new FormControl<string | null>('', Validators.required)
  });

  get message(): string {
    return this.messageInputForm.controls.messageInput?.value!;
  }

  onChange = (value: string) => {};
  onTouched = () => {};

  writeValue(value: string): void {
    this.messageInputForm.controls.messageInput.setValue(value);
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  sendMessage(): void {
    if (this.messageInputForm.valid) {
      this.onChange(this.message);
      this.messageInputForm.controls.messageInput.setValue('');
    }
  }
}
