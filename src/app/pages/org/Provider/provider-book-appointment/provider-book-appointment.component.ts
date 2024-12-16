import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { UserNameIdDto } from '../../../../core/Models/Interfaces/User/UserDto.model';
import { UserService } from '../../../../core/services/UserService/user.service';
import { Subscription } from 'rxjs';
import { AppResponse } from '../../../../core/Models/AppResponse';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CustomTimeValidator } from '../../../../core/Validators/ValidateEndTime.validation';
import { AppointmentService } from '../../../../core/services/Appointment/appointment.service';
import { MyToastServiceService } from '../../../../core/services/MyToastService/my-toast-service.service';
import { BookAppointmentDto } from '../../../../core/Models/Interfaces/Appointment/appointment.model';
import { LoggedUserDto } from '../../../../core/Models/classes/User/LoggedUserDto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-provider-book-appointment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './provider-book-appointment.component.html',
  styleUrl: './provider-book-appointment.component.css',
})
export class ProviderBookAppointmentComponent implements OnInit, OnDestroy {
  patientList?: UserNameIdDto[];
  appointmentForm: FormGroup;
  isSubmitClick: boolean = false;
  loggedUser?: LoggedUserDto;
  isLoader: boolean = false;

  private subscriptions: Subscription = new Subscription();
  private userService = inject(UserService);
  private appoinmentService = inject(AppointmentService);
  private tostR = inject(MyToastServiceService);
  private router = inject(Router);

  constructor(private fb: FormBuilder) {
    this.appointmentForm = this.fb.group({
      patientId: ['', [Validators.required]],
      appointmentDate: ['', [Validators.required]],
      startTime: ['', [Validators.required]],
      endTime: [
        '',
        [
          Validators.required,
          CustomTimeValidator.validateEndTimeWithinOneHour('startTime'),
        ],
      ],
      chiefComplaint: ['', [Validators.required]],
    });

    const sub = this.userService.loggedUser$.subscribe((res: LoggedUserDto) => {
      this.loggedUser = res;
    });
    this.subscriptions.add(sub);
  }
  ngOnInit(): void {
    this.GetAllPatient();
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ResetAppoinmentForm() {
    this.appointmentForm = this.fb.group({
      patientId: ['', [Validators.required]],
      appointmentDate: ['', [Validators.required]],
      startTime: ['', [Validators.required]],
      endTime: [
        '',
        [
          Validators.required,
          CustomTimeValidator.validateEndTimeWithinOneHour('startTime'),
        ],
      ],
      chiefComplaint: ['', [Validators.required]],
    });
  }

  GetAllPatient() {
    this.userService.GetAllPatientNameId$().subscribe({
      next: (res: AppResponse<UserNameIdDto[]>) => {
        if (res.isSuccess) {
          this.patientList = res.data;
        }
      },
      error: (err: Error) => {
        console.log('Unble to get Patients : ', err);
      },
    });
  }

  todaysDate(): string {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = today.getFullYear();
    return `${year}-${month}-${day}`; // Returns the date in YYYY-MM-DD format
  }

  onClickBookAppointment() {
    this.isSubmitClick = true;
    if (this.appointmentForm.invalid) {
      this.tostR.showWarning('Please Fill the All Required Fields');
      return;
    }

    if (!this.loggedUser) {
      this.tostR.showWarning('Please login Again');
      return;
    }
    this.isLoader = true;

    const payload: BookAppointmentDto = {
      appointmentDate: this.appointmentForm.get('appointmentDate')?.value,
      startTime: this.appointmentForm.get('startTime')?.value + ':00',
      endTime: this.appointmentForm.get('endTime')?.value + ':00',
      chiefComplaint: this.appointmentForm.get('chiefComplaint')?.value,
      patientId: Number(this.appointmentForm.get('patientId')?.value),
      providerId: this.loggedUser?.userId,
    };

    this.appoinmentService.BookAppointmentByProvider$(payload).subscribe({
      next: (res: AppResponse<null>) => {
        if (res.isSuccess) {
          this.ResetAppoinmentForm();
          this.isLoader = false;
          this.tostR.showSuccess(res.message);
          this.router.navigateByUrl('/org/Provider/Home');
        } else {
          this.isLoader = false;
          this.tostR.showError(res.message);
        }
      },
      error: (err: Error) => {
        this.isLoader = false;
        this.tostR.showError('Internal Server Error');
        console.log('Error to book Appointment : ', err);
      },
    });
  }
}
