import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { GetAppoinmentByPatientIdDto } from '../../../../core/Models/Interfaces/Appointment/appointment.model';
import { Subscription } from 'rxjs';
import { AppointmentService } from '../../../../core/Services/Appointment/appointment.service';
import { UserService } from '../../../../core/services/UserService/user.service';
import { LoggedUserDto } from '../../../../core/Models/classes/User/LoggedUserDto';
import { AppResponse } from '../../../../core/Models/AppResponse';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-patient',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-patient.component.html',
  styleUrl: './home-patient.component.css',
})
export class HomePatientComponent implements OnDestroy {
  appointmentList?: GetAppoinmentByPatientIdDto[];
  loggedUser?: LoggedUserDto;

  subscriptions: Subscription = new Subscription();
  private appointmentService = inject(AppointmentService);
  private userService = inject(UserService);

  constructor() {
    const sub = this.userService.loggedUser$.subscribe((res: LoggedUserDto) => {
      this.loggedUser = res;
      this.GetAppoinments(this.loggedUser.userId);
    });

    this.subscriptions.add(sub);
  }

  GetAppoinments(patientId: number) {
    this.appointmentService.GetAppointmentByPatientId$(patientId).subscribe({
      next: (res: AppResponse<GetAppoinmentByPatientIdDto[]>) => {
        if (res.isSuccess) {
          this.appointmentList = res.data;
          console.log(res);
        }
      },
      error: (err: Error) => {
        console.error('Error to get appoinment :', err);
      },
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
