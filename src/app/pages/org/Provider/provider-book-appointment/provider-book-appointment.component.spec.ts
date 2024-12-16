import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderBookAppointmentComponent } from './provider-book-appointment.component';

describe('ProviderBookAppointmentComponent', () => {
  let component: ProviderBookAppointmentComponent;
  let fixture: ComponentFixture<ProviderBookAppointmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProviderBookAppointmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProviderBookAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
