import { Component, inject, OnDestroy } from '@angular/core';
import { AppointmentService } from '../../../../core/services/index';
import { UserService } from '../../../../core/services/index';
import { GetAppoinmentByProviderIdDto } from '../../../../core/Models/Interfaces/Appointment/appointment.model';
import { LoggedUserDto } from '../../../../core/Models/classes/User/LoggedUserDto';
import { Subscription } from 'rxjs';
import { AppResponse } from '../../../../core/Models/AppResponse';
import { CommonModule } from '@angular/common';
import { TimeFormatPipe } from '../../../../core/pipe/TimeFormat/time-format.pipe';
import { MyToastServiceService } from '../../../../core/services/index';
import Swal from 'sweetalert2';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { useChatStore } from '../../../../core/stores/chat.store';
import { SubSinkService } from '../../../../core/services/index';

@Component({
  selector: 'app-home-provider',
  standalone: true,
  imports: [CommonModule, TimeFormatPipe, RouterLink, FormsModule],
  templateUrl: './home-provider.component.html',
  styleUrl: './home-provider.component.css',
})
export class HomeProviderComponent implements OnDestroy {
  appointmentList?: GetAppoinmentByProviderIdDto[];
  loggedUser?: LoggedUserDto;
  status: string = 'Scheduled';

  private readonly subSink: SubSinkService = new SubSinkService();
  private userService = inject(UserService);
  private appointmentService = inject(AppointmentService);
  private tostR = inject(MyToastServiceService);
  private chatStore = inject(useChatStore);
  private router = inject(Router);

  constructor() {
    this.subSink.sink = this.userService.loggedUser$.subscribe(
      (res: LoggedUserDto) => {
        this.loggedUser = res;
        this.GetAllAppointments(this.loggedUser.userId, this.status);
      }
    );
  }

  GetAllAppointments(providerId: number, status: string) {
    this.subSink.sink = this.appointmentService
      .GetAppointmentByProviderId$(providerId, status)
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
  }

  onClickCancel = (appointmentId: number) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      //   showCancelButton: true,
      showCloseButton: true,
      showDenyButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Cancel it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.appointmentService
          .CancelAppointmentByApptId$(appointmentId)
          .subscribe({
            next: (res: AppResponse<null>) => {
              if (res.isSuccess) {
                if (this.loggedUser) {
                  this.GetAllAppointments(this.loggedUser?.userId, this.status);
                }
                this.tostR.showSuccess(res.message);
              } else {
                this.tostR.showError(res.message);
              }
            },
            error: (err: Error) => {
              this.tostR.showError('Internal Server Error');
              console.log('Unble to Cancel the appointment : ', err);
            },
          });
      }
    });
  };

  onChangeStatus() {
    if (this.loggedUser) {
      this.GetAllAppointments(this.loggedUser?.userId, this.status);
    }
  }

  ngOnDestroy(): void {
    this.subSink.unsubscribe();
  }

  async onClickMessage(email: string) {
    // alert('Implement It First');
    // return;

    // comment out above code for working chat

    try {
      const chatId = await this.chatStore.createNewChat(email);
      this.router.navigate(['/org/chat', chatId]);
    } catch (error) {
      console.error('New chat error:', error);
      if (error instanceof Error) {
        // this.errorMessage.set(error.message);
      } else {
        // this.errorMessage.set(
        //   'An unexpected error occurred. Please try again.'
        // );
      }
    }
  }
}
