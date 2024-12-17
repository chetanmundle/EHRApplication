import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppointmentWithSOAPNotesDto } from '../../../../core/Models/Interfaces/Appointment/appointment.model';
import { AppointmentService } from '../../../../core/services/Appointment/appointment.service';
import { AppResponse } from '../../../../core/Models/AppResponse';
import { CommonModule } from '@angular/common';
import { TimeFormatPipe } from '../../../../core/pipe/TimeFormat/time-format.pipe';
import { SOAPNoteService } from '../../../../core/services/SOAPNoteService/soapnote.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MyToastServiceService } from '../../../../core/services/MyToastService/my-toast-service.service';
import { CreateSOAPNoteDto } from '../../../../core/Models/Interfaces/SOAPNotes/SOAPNotes.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-appoinment',
  standalone: true,
  imports: [CommonModule, TimeFormatPipe, ReactiveFormsModule],
  templateUrl: './view-appoinment.component.html',
  styleUrl: './view-appoinment.component.css',
})
export class ViewAppoinmentComponent implements OnInit, OnDestroy {
  appointmentId?: number;
  appointmentwithSoapNote?: AppointmentWithSOAPNotesDto;
  isLoader: boolean = false;
  isSubmitClick: boolean = false;

  soapNoteForm: FormGroup;
  private subscriptions: Subscription = new Subscription();
  private appointmentService = inject(AppointmentService);
  private soapNoteService = inject(SOAPNoteService);
  private tostR = inject(MyToastServiceService);

  constructor(private route: ActivatedRoute, private fb: FormBuilder) {
    this.soapNoteForm = this.fb.group({
      subjective: ['', [Validators.required]],
      objective: ['', [Validators.required]],
      assessment: ['', [Validators.required]],
      plan: ['', [Validators.required]],
    });
  }
  ngOnInit(): void {
    this.appointmentId = Number(
      this.route.snapshot.paramMap.get('appointmentId') || ''
    );

    if (this.appointmentId) {
      this.GetAppoinmentWithSoapNote(this.appointmentId);
    }
  }

  GetAppoinmentWithSoapNote(appointmentId: number) {
    this.isLoader = true;
    const sub = this.appointmentService
      .GetAppointmentWithSOAPNotes$(appointmentId)
      .subscribe({
        next: (res: AppResponse<AppointmentWithSOAPNotesDto>) => {
          if (res.isSuccess) {
            this.isLoader = false;
            console.log(res);

            this.appointmentwithSoapNote = res.data;
          } else {
            this.isLoader = false;
            console.log(res.message);
          }
        },
        error: (err: Error) => {
          this.isLoader = false;
          console.log('Error to get the Data : ', err);
        },
      });

    this.subscriptions.unsubscribe();
  }

  calculateAge(dateOfBirth: string): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }

  onClickSaveSOAPNote() {
    this.isSubmitClick = true;
    if (this.soapNoteForm.invalid) {
      this.tostR.showWarning('Fill all the Required Fields..!');
      return;
    }

    if (!this.appointmentService) {
      return;
    }

    Swal.fire({
      title: 'Do you want to save the changes? You Cannot Edit it Again..!',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Save',
      denyButtonText: `Don't save`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        const payload: CreateSOAPNoteDto = {
          appointmentId: this.appointmentwithSoapNote?.appointmentId ?? 0,
          subjective: this.soapNoteForm.get('subjective')?.value,
          objective: this.soapNoteForm.get('objective')?.value,
          assessment: this.soapNoteForm.get('assessment')?.value,
          plan: this.soapNoteForm.get('plan')?.value,
        };

        this.soapNoteService.SaveSOAPNotes$(payload).subscribe({
          next: (res: AppResponse<null>) => {
            if (res.isSuccess) {
              if (this.appointmentId) {
                this.GetAppoinmentWithSoapNote(this.appointmentId);
              }
              this.tostR.showSuccess(res.message);
            } else {
              this.tostR.showError(res.message);
            }
          },
          error: (err: Error) => {
            this.tostR.showError('Internal Server Error');
            console.log('Error to save the Soap note : ', err);
          },
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
