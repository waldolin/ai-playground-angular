import { Injectable } from '@angular/core';
import { GenerativeModel, GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment.development';

export interface settingConfigs {
  temperature: number;
  top_k: number;
  top_p: number;
  maxOutputTokens: number;
}

@Injectable({
  providedIn: 'root'
})
export class GenerativeAiService {
  private genAI: GoogleGenerativeAI;

  private genConfig = new BehaviorSubject({
    safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE
      }
    ],
    temperature: 0.9,
    top_k: 32,
    top_p: 1,
    maxOutputTokens: 100
  });
  genConfig$ = this.genConfig.asObservable();

  constructor() {
    this.genAI = new GoogleGenerativeAI(environment.API_KEY);
  }

  getGenModel(model: string): GenerativeModel {
    return this.genAI?.getGenerativeModel({
      model,
      ...this.genConfig.value
    });
  }

  setConfig(configs: settingConfigs) {
    this.genConfig.next({
      ...this.genConfig.value,
      ...configs,
    });
  }

  resetConfig() {
    this.genConfig.next({...this.genConfig.value});
  }
}
