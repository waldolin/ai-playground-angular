import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgIf } from '@angular/common';
import { SettingsComponent } from './components/settings/settings.component';

@Component({
  selector: 'app-ai',
  standalone: true,
  imports: [NgIf, RouterModule, SettingsComponent],
  templateUrl: './ai.component.html',
  styleUrl: './ai.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AiComponent { }
