import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  GetAppoinmentByPatientIdDto,
  UpdateAppointmentDto,
} from '../../../../core/Models/Interfaces/Appointment/appointment.model';
import { Subscription } from 'rxjs';
import { AppointmentService } from '../../../../core/services/Appointment/appointment.service';
import { UserService } from '../../../../core/services/UserService/user.service';
import { LoggedUserDto } from '../../../../core/Models/classes/User/LoggedUserDto';
import { AppResponse } from '../../../../core/Models/AppResponse';
import { CommonModule } from '@angular/common';
import { MyToastServiceService } from '../../../../core/services/MyToastService/my-toast-service.service';
import Swal from 'sweetalert2';
import { TimeFormatPipe } from '../../../../core/pipe/TimeFormat/time-format.pipe';
import { Modal } from 'bootstrap';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-home-patient',
  standalone: true,
  imports: [CommonModule, TimeFormatPipe, ReactiveFormsModule],
  templateUrl: './home-patient.component.html',
  styleUrl: './home-patient.component.css',
})
export class HomePatientComponent implements OnDestroy {
  appointmentList?: GetAppoinmentByPatientIdDto[];
  loggedUser?: LoggedUserDto;
  isLoader: boolean = false;
  private modalInstance: Modal | null = null;
  appointmentForm: FormGroup;
  isSubmitClick: boolean = false;

  subscriptions: Subscription = new Subscription();
  private appointmentService = inject(AppointmentService);
  private userService = inject(UserService);
  private tostR = inject(MyToastServiceService);

  constructor(private fb: FormBuilder) {
    const sub = this.userService.loggedUser$.subscribe((res: LoggedUserDto) => {
      this.loggedUser = res;
      this.GetAppoinments(this.loggedUser.userId);
    });

    this.subscriptions.add(sub);

    this.appointmentForm = this.fb.group({
      appointmentId: ['', Validators.required],
      appointmentDate: ['', [Validators.required]],
      appointmentTime: ['', [Validators.required]],
      chiefComplaint: ['', [Validators.required]],
    });
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

  // Function to open the modal CArdModal
  openModal(appoinment: GetAppoinmentByPatientIdDto) {
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
    if (this.appointmentForm.invalid) {
      this.tostR.showError('Enter All Required Fields');
      return;
    }

    this.isLoader = true;

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
            this.GetAppoinments(this.loggedUser?.userId);
          }
          this.isLoader = false;
          this.tostR.showSuccess(res.message);
          this.closeModal();
        } else {
          this.isLoader = false;
          this.tostR.showError(res.message);
        }
      },
      error: (err: Error) => {
        this.isLoader = false;
        console.log('Error to update :', err);
        this.tostR.showError('Internal Service Error');
      },
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
