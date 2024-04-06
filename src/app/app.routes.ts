import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'ai', pathMatch: 'full' },
  {
    path: 'ai',
    loadChildren: () => import('./ai/ai.routes').then(m => m.routes)
  }
];
