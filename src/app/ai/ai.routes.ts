import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'gemini-pro', pathMatch: 'full' },
  {
    path: '',
    loadComponent: () => import('./ai.component').then(m => m.AiComponent),
    children: [
      {
        path: 'gemini-pro',
        loadComponent: () => import('./components/gemini-pro/gemini-pro.component').then(m => m.GeminiProComponent)
      },
      {
        path: 'gemini-pro-vision',
        loadComponent: () => import('./components/gemini-pro-vision/gemini-pro-vision.component').then(m => m.GeminiProVisionComponent)
      },
      {
        path: 'gemini-pro-chat',
        loadComponent: () => import('./components/gemini-pro-chat/gemini-pro-chat.component').then(m => m.GeminiProChatComponent)
      }
    ]
  }
];
