import { Component, inject, OnDestroy } from '@angular/core';
import { AppointmentService } from '../../../../core/services/Appointment/appointment.service';
import { UserService } from '../../../../core/services/UserService/user.service';
import { GetAppoinmentByProviderIdDto } from '../../../../core/Models/Interfaces/Appointment/appointment.model';
import { LoggedUserDto } from '../../../../core/Models/classes/User/LoggedUserDto';
import { Subscription } from 'rxjs';
import { AppResponse } from '../../../../core/Models/AppResponse';
import { CommonModule } from '@angular/common';
import { TimeFormatPipe } from '../../../../core/pipe/TimeFormat/time-format.pipe';
import { MyToastServiceService } from '../../../../core/services/MyToastService/my-toast-service.service';
import Swal from 'sweetalert2';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home-provider',
  standalone: true,
  imports: [CommonModule, TimeFormatPipe, RouterLink],
  templateUrl: './home-provider.component.html',
  styleUrl: './home-provider.component.css',
})
export class HomeProviderComponent implements OnDestroy {
  appointmentList?: GetAppoinmentByProviderIdDto[];
  loggedUser?: LoggedUserDto;
  isLoader: boolean = false;

  private subscriptions: Subscription = new Subscription();
  private userService = inject(UserService);
  private appointmentService = inject(AppointmentService);
  private tostR = inject(MyToastServiceService);

  constructor() {
    const sub = this.userService.loggedUser$.subscribe((res: LoggedUserDto) => {
      this.loggedUser = res;
      this.GetAllAppointments(this.loggedUser.userId);
    });
    this.subscriptions.add(sub);
  }

  GetAllAppointments(providerId: number) {
    const sub = this.appointmentService
      .GetAppointmentByProviderId$(providerId)
      .subscribe({
        next: (res: AppResponse<GetAppoinmentByProviderIdDto[]>) => {
          if (res.isSuccess) {
            this.appointmentList = res.data;
          }
        },
        error: (err: Error) => {
          console.log('Error to get Appointment : ', err);
        },
      });

    this.subscriptions.add(sub);
  }

  onClickCancel = (appointmentId: number) => {
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
                  this.GetAllAppointments(this.loggedUser?.userId);
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
              this.tostR.showError('Internal Server Error');
              console.log('Unble to Cancel the appointment : ', err);
            },
          });
      }
    });
  };

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
