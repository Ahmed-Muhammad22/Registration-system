import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtpvalidationComponent } from './otpvalidation.component';

describe('OtpvalidationComponent', () => {
  let component: OtpvalidationComponent;
  let fixture: ComponentFixture<OtpvalidationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtpvalidationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OtpvalidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
