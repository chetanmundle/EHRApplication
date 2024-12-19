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

// import { AppointmentService } from '../../../../core/services/Appointment/appointment.service';
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
  isTimeValid: boolean = true;

  private subscriptions: Subscription = new Subscription();
  private userService = inject(UserService);
  private appoinmentService = inject(AppointmentService);
  private tostR = inject(MyToastServiceService);
  private router = inject(Router);

  constructor(private fb: FormBuilder) {
    this.appointmentForm = this.fb.group({
      patientId: ['', [Validators.required]],
      appointmentDate: ['', [Validators.required]],
      appointmentTime: ['', [Validators.required]],

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
      appointmentTime: ['', [Validators.required]],

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
      appointmentTime:
        this.appointmentForm.get('appointmentTime')?.value + ':00',

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

  onChangeTime(event: Event) {
    const date = this.appointmentForm.get('appointmentDate')?.value;
    if (date) {
      const selectedDate = new Date(date);
      const today = new Date();

      selectedDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);

      if (selectedDate.getTime() === today.getTime()) {
        const selectedTime = (event.target as HTMLInputElement).value;

        const now = new Date();
        const currentHour = now.getHours().toString().padStart(2, '0');
        const currentMinutes = now.getMinutes().toString().padStart(2, '0');
        const currentTime = `${currentHour}:${currentMinutes}`;

        const selectedDateTime = new Date(
          `${today.toDateString()} ${selectedTime}`
        );
        const currentDateTime = new Date(
          `${today.toDateString()} ${currentTime}`
        );

        if (selectedDateTime.getTime() < currentDateTime.getTime()) {
          this.isTimeValid = false;
          console.log('Selected time is in the past.');
        } else {
          this.isTimeValid = true;
          console.log('Selected time is valid.');
        }
      }
    }
  }

  onChangeDate() {
    const time = this.appointmentForm.get('appointmentTime')?.value;
    if (time) {
      const date = this.appointmentForm.get('appointmentDate')?.value;
      const selectedDate = new Date(date);
      const today = new Date();

      selectedDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);

      if (selectedDate.getTime() !== today.getTime()) {
        this.isTimeValid = true;
      } else {
        const selectedTime = time;

        const now = new Date();
        const currentHour = now.getHours().toString().padStart(2, '0');
        const currentMinutes = now.getMinutes().toString().padStart(2, '0');
        const currentTime = `${currentHour}:${currentMinutes}`;

        const selectedDateTime = new Date(
          `${today.toDateString()} ${selectedTime}`
        );
        const currentDateTime = new Date(
          `${today.toDateString()} ${currentTime}`
        );

        if (selectedDateTime.getTime() < currentDateTime.getTime()) {
          this.isTimeValid = false;
        } else {
          this.isTimeValid = true;
        }
      }
    }
  }
}
