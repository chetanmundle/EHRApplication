import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAppoinmentComponent } from './view-appoinment.component';

describe('ViewAppoinmentComponent', () => {
  let component: ViewAppoinmentComponent;
  let fixture: ComponentFixture<ViewAppoinmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewAppoinmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAppoinmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
