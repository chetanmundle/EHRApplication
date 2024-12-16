import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { GetAppoinmentByPatientIdDto } from '../../../../core/Models/Interfaces/Appointment/appointment.model';
import { Subscription } from 'rxjs';
import { AppointmentService } from '../../../../core/services/Appointment/appointment.service';
import { UserService } from '../../../../core/services/UserService/user.service';
import { LoggedUserDto } from '../../../../core/Models/classes/User/LoggedUserDto';
import { AppResponse } from '../../../../core/Models/AppResponse';
import { CommonModule } from '@angular/common';
import { MyToastServiceService } from '../../../../core/services/MyToastService/my-toast-service.service';
import Swal from 'sweetalert2';

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
  isLoader: boolean = false;

  subscriptions: Subscription = new Subscription();
  private appointmentService = inject(AppointmentService);
  private userService = inject(UserService);
  private tostR = inject(MyToastServiceService);

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

  onClickCancelBtn(appointmentId: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoader = true;
        this.appointmentService
          .CancelAppointmentByApptId$(appointmentId)
          .subscribe({
            next: (res: AppResponse<null>) => {
              if (res.isSuccess) {
                if (this.loggedUser) {
                  this.GetAppoinments(this.loggedUser.userId);
                }
                this.isLoader = false;
                this.tostR.showSuccess(res.message);
              } else {
                this.isLoader = false;
                this.tostR.showError(res.message);
              }
            },
            error: (err: Error) => {
              this.isLoader = false;
              console.log('Error to cancel Appointment: ');
              this.tostR.showError('Internal Server Error ');
            },
          });
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
