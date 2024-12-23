import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  GetAppoinmentByPatientIdDto,
  UpdateAppointmentDto,
} from '../../../../core/Models/Interfaces/Appointment/appointment.model';
import { Subscription } from 'rxjs';
import { AppointmentService } from '../../../../core/services/index';
import { UserService } from '../../../../core/services/index';
import { LoggedUserDto } from '../../../../core/Models/classes/User/LoggedUserDto';
import { AppResponse } from '../../../../core/Models/AppResponse';
import { CommonModule } from '@angular/common';
import { MyToastServiceService } from '../../../../core/services/index';
import Swal from 'sweetalert2';
import { TimeFormatPipe } from '../../../../core/pipe/TimeFormat/time-format.pipe';
import { Modal } from 'bootstrap';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { useChatStore } from '../../../../core/stores/chat.store';
import { SubSinkService } from '../../../../core/services/index';

@Component({
  selector: 'app-home-patient',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TimeFormatPipe,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './home-patient.component.html',
  styleUrl: './home-patient.component.css',
})
export class HomePatientComponent implements OnDestroy {
  appointmentList?: GetAppoinmentByPatientIdDto[];
  loggedUser?: LoggedUserDto;
  private modalInstance: Modal | null = null;
  appointmentForm: FormGroup;
  isSubmitClick: boolean = false;
  status: string = 'Scheduled';
  isTimeValid: boolean = true;

  private readonly subSink: SubSinkService = new SubSinkService();
  private appointmentService = inject(AppointmentService);
  private userService = inject(UserService);
  private tostR = inject(MyToastServiceService);
  private router = inject(Router);
  private chatStore = inject(useChatStore);

  constructor(private fb: FormBuilder) {
    this.subSink.sink = this.userService.loggedUser$.subscribe(
      (res: LoggedUserDto) => {
        this.loggedUser = res;
        this.GetAppoinments(this.loggedUser.userId, this.status);
      }
    );

    this.appointmentForm = this.fb.group({
      appointmentId: ['', Validators.required],
      appointmentDate: ['', [Validators.required]],
      appointmentTime: ['', [Validators.required]],
      chiefComplaint: ['', [Validators.required]],
    });
  }

  GetAppoinments(patientId: number, status: string) {
    this.subSink.sink = this.appointmentService
      .GetAppointmentByPatientId$(patientId, status)
      .subscribe({
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
      showCloseButton: true,
      showDenyButton: true,
      //   showCancelButton: true,
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
                  this.GetAppoinments(this.loggedUser.userId, this.status);
                }
                this.tostR.showSuccess(res.message);
              } else {
                this.tostR.showError(res.message);
              }
            },
            error: (err: Error) => {
              console.log('Error to cancel Appointment: ');
              this.tostR.showError('Internal Server Error ');
            },
          });
      }
    });
  }

  // Function to open the modal CArdModal
  openModal(appoinment: GetAppoinmentByPatientIdDto) {
    this.isTimeValid = true;
    this.appointmentForm
      .get('appointmentId')
      ?.setValue(appoinment.appointmentId);
    this.appointmentForm
      .get('appointmentDate')
      ?.setValue(appoinment.appointmentDate.toString().split('T')[0]);

    const appointmentTime = appoinment.appointmentTime
      .split(':')
      .slice(0, 2)
      .join(':');
    this.appointmentForm.get('appointmentTime')?.setValue(appointmentTime);

    this.appointmentForm
      .get('chiefComplaint')
      ?.setValue(appoinment.chiefComplaint);

    const modalElement = document.getElementById('editModal');
    if (modalElement) {
      this.modalInstance = new Modal(modalElement); // Initialize the modal
      this.modalInstance.show(); // Show the modal
    }
  }

  // Function to close the modal Card Modal
  closeModal() {
    if (this.modalInstance) {
      this.modalInstance.hide(); // Hide the modal
      this.modalInstance = null; // Reset the modal instance
    }
  }

  todaysDate(): string {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = today.getFullYear();
    return `${year}-${month}-${day}`; // Returns the date in YYYY-MM-DD format
  }

  onClickUpdate() {
    this.isSubmitClick = true;
    if (this.appointmentForm.invalid || !this.isTimeValid) {
      this.tostR.showError('Enter All Required Fields');
      return;
    }


    const payload: UpdateAppointmentDto = {
      appointmentId: this.appointmentForm.get('appointmentId')?.value,
      appointmentDate: this.appointmentForm.get('appointmentDate')?.value,
      appointmentTime:
        this.appointmentForm.get('appointmentTime')?.value + ':00',

      chiefComplaint: this.appointmentForm.get('chiefComplaint')?.value,
    };

    this.appointmentService.UpdateAppointment$(payload).subscribe({
      next: (res: AppResponse<null>) => {
        if (res.isSuccess) {
          if (this.loggedUser) {
            this.GetAppoinments(this.loggedUser?.userId, this.status);
          }
          this.tostR.showSuccess(res.message);
          this.closeModal();
        } else {
          this.tostR.showError(res.message);
        }
      },
      error: (err: Error) => {
        console.log('Error to update :', err);
        this.tostR.showError('Internal Service Error');
      },
    });
  }

  onChangeStatus() {
    if (this.loggedUser) {
      this.GetAppoinments(this.loggedUser?.userId, this.status);
    }
  }

  async onClickMessage(email: string) {
    // alert('Implement It First');
    // return;

    // comment out above code for working chat

    try {
      debugger;
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

  // validate time
  onChangeTime(event: Event) {
    const date = this.appointmentForm.get('appointmentDate')?.value;
    if (date) {
      const selectedDate = new Date(date);
      const today = new Date();

      selectedDate.setHours(0, 0, 0, 0); // Normalize to midnight
      today.setHours(0, 0, 0, 0); // Normalize to midnight

      if (selectedDate.getTime() === today.getTime()) {
        const selectedTime = (event.target as HTMLInputElement).value;

        // Get current time and add one hour
        const now = new Date();
        now.setHours(now.getHours() + 1);
        const nextHour = now.getHours().toString().padStart(2, '0');
        const nextMinutes = now.getMinutes().toString().padStart(2, '0');
        const nextTime = `${nextHour}:${nextMinutes}`;

        // Convert selected time and next time to Date objects for comparison
        const selectedDateTime = new Date(
          `${today.toDateString()} ${selectedTime}:00`
        ); // Ensure seconds are included for accuracy

        const nextDateTime = new Date(`${today.toDateString()} ${nextTime}:00`); // Add seconds

        // Use getTime() for precise comparison of time values
        if (selectedDateTime.getTime() < nextDateTime.getTime()) {
          this.isTimeValid = false;
          console.log('Selected time is less than one hour from now.');
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

      if (selectedDate.getTime() === today.getTime()) {
        const selectedTime = time;

        // Get current time and add one hour
        const now = new Date();
        now.setHours(now.getHours() + 1);
        const nextHour = now.getHours().toString().padStart(2, '0');
        const nextMinutes = now.getMinutes().toString().padStart(2, '0');
        const nextTime = `${nextHour}:${nextMinutes}`;

        // Convert selected time and next time to Date objects for comparison
        const selectedDateTime = new Date(
          `${today.toDateString()} ${selectedTime}`
        );
        const nextDateTime = new Date(`${today.toDateString()} ${nextTime}`);

        if (selectedDateTime < nextDateTime) {
          this.isTimeValid = false;
        } else {
          this.isTimeValid = true;
        }
      }
    }
  }

  ngOnDestroy(): void {
    this.subSink.unsubscribe();
  }
}
