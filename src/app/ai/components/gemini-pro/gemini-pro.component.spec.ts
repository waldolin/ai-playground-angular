import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeminiProComponent } from './gemini-pro.component';

describe('GeminiProComponent', () => {
  let component: GeminiProComponent;
  let fixture: ComponentFixture<GeminiProComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeminiProComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GeminiProComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
