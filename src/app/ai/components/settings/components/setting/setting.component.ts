import { NgClass, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-setting',
  standalone: true,
  imports: [NgClass, NgIf],
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingComponent {
  @Input() title = '';
  @Input() description = '';
  @Input() showDescription = false;
}
