import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Modal } from 'bootstrap'; // Import Bootstrap Modal
import { UserService } from '../../../core/services/index';
import { CommonModule, DatePipe } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MyToastServiceService } from '../../../core/services/index';
import { ImageService } from '../../../core/services/index';
import { LoggedUserDto } from '../../../core/Models/classes/User/LoggedUserDto';
import {
  ChangePasswordDto,
  UpdateUserDto,
  UserDto,
} from '../../../core/Models/Interfaces/User/UserDto.model';
import { AppResponse } from '../../../core/Models/AppResponse';
import { specialisationDto } from '../../../core/Models/Interfaces/Specialization/specialization.model';
import { SpecializationService } from '../../../core/services/index';
import { SubSinkService } from '../../../core/services/index';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [DatePipe, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit, OnDestroy {
  loggedUser?: LoggedUserDto;
  user?: UserDto;
  isEditMode: boolean = false;
  userForm: FormGroup;
  selectedFile: File | null = null;
  isMobileNumberValid: boolean = false;

  private modalInstance: Modal | null = null; // Hold the modal instance

  Password: string = '';
  ConfirmPassword: string = '';

  private tostR = inject(MyToastServiceService);
  private imageService = inject(ImageService);
  private readonly subSink: SubSinkService = new SubSinkService();
  specializationList?: specialisationDto[];

  private userService = inject(UserService);
  private specializationService = inject(SpecializationService);

  constructor(private builder: FormBuilder) {
    this.userForm = this.builder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      gender: ['', Validators.required],
      bloodGroup: ['', Validators.required],
      qualification: [''], // for provider only
      specialisationId: [''], // for provider only
      registrationNumber: [''], // for provider only
      visitingCharge: [''], // for provider only
      address: ['', Validators.required],
      profileImage: [''],
    });
  }

  ngOnInit(): void {
    this.subSink.sink = this.userService.loggedUser$.subscribe({
      next: (res: LoggedUserDto) => {
        this.loggedUser = res;
        this.GetUserById(this.loggedUser.userId);
        if (this.loggedUser.userTypeName === 'Provider') {
          this.GetAllSpecializations();
        }
      },
    });
  }

  GetSpecilizationName(specialisationId: number): string {
    const specilization = this.specializationList?.find(
      (s) => s.specialisationId === specialisationId
    );

    return specilization?.specialisationName ?? '';
  }

  ngOnDestroy(): void {
    this.modalInstance = null;
    this.subSink.unsubscribe();
  }

  GetUserById(userId: number) {
    this.userService.GetUserByUserId$(userId).subscribe({
      next: (res: AppResponse<UserDto>) => {
        if (res.isSuccess) {
          this.user = res.data;
        } else {
          console.log('Unble to get User : ', res);
        }
      },
      error: (err: Error) => {
        console.log('Error to get USer : ', err);
      },
    });
  }

  GetAllSpecializations() {
    this.specializationService.GetAllSpecialization$().subscribe({
      next: (res: AppResponse<specialisationDto[]>) => {
        if (res.isSuccess) {
          this.specializationList = res.data;
        }
      },
      error: (err: Error) => {
        console.log('Unble to get specializations');
      },
    });
  }

  onClickChangePass() {
    if (this.Password === this.ConfirmPassword) {
      if (this.Password.length < 8) {
        this.tostR.showWarning('Password Must be at least 8 characters');
        return;
      }
      if (this.loggedUser) {
        const payload: ChangePasswordDto = {
          userName: this.loggedUser.userName,
          password: this.Password,
          confirmPassword: this.ConfirmPassword,
        };
        this.subSink.sink = this.userService
          .ChangePassword$(payload)
          .subscribe({
            next: (res: AppResponse<null>) => {
              if (res.isSuccess) {
                this.closeModal();
                this.tostR.showSuccess('Password changed successfully');
              } else {
                this.tostR.showError(res.message);
              }
            },
            error: (err: Error) => {
              this.tostR.showError('Server Error...!');
            },
          });
      }
    } else {
      this.tostR.showWarning('Passwords do not match');
    }
  }

  // Function to open the modal
  openModal() {
    const modalElement = document.getElementById('exampleModal');
    if (modalElement) {
      this.modalInstance = new Modal(modalElement);
      this.modalInstance.show();
    }
  }

  // Function to close the modal
  closeModal() {
    if (this.modalInstance) {
      this.Password = '';
      this.ConfirmPassword = '';
      this.modalInstance.hide();
      this.modalInstance = null; // Reset the modal instance
    }
  }

  onClickEdit() {
    this.isEditMode = true;
    if (this.user) {
      this.userForm.get('firstName')?.setValue(this.user?.firstName);
      this.userForm.get('lastName')?.setValue(this.user?.lastName);
      this.userForm.get('email')?.setValue(this.user?.email);
      this.userForm
        .get('dateOfBirth')
        ?.setValue(this.user?.dateOfBirth.toString().split('T')[0]);
      this.userForm.get('phoneNumber')?.setValue(this.user?.phoneNumber);
      this.userForm.get('address')?.setValue(this.user?.address);
      this.userForm.get('profileImage')?.setValue(this.user?.profileImage);
      this.userForm.get('gender')?.setValue(this.user?.gender);
      this.userForm.get('qualification')?.setValue(this.user?.qualification);
      this.userForm
        .get('specialisationId')
        ?.setValue(this.user?.specialisationId);
      this.userForm
        .get('registrationNumber')
        ?.setValue(this.user?.registrationNumber);
      this.userForm.get('visitingCharge')?.setValue(this.user?.visitingCharge);
      this.userForm.get('bloodGroup')?.setValue(this.user?.bloodGroup);
    }
  }
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  // call when click on update nad save the image
  onClickUpdate() {
    if (this.userForm.invalid) {
      this.tostR.showError('Enter all Required Fields');
      return;
    }
    if (this.selectedFile) {
      this.subSink.sink = this.imageService
        .uploadImage$(this.selectedFile)
        .subscribe({
          next: (res: AppResponse<string>) => {
            if (res.isSuccess) {
              this.userForm.get('profileImage')?.setValue(res.data);
              this.updateProfile();
            } else {
              this.tostR.showWarning(res.message);
              console.log('Unble to Save the Profile Image : ', res.message);
            }
          },
          error: (err: Error) => {
            console.log('Unble to Save the Image', err.message);
          },
        });
    } else {
      this.updateProfile();
    }
  }

  // SAve the data
  updateProfile() {
    if (!this.loggedUser) {
      this.tostR.showWarning('Please login Again');
      return;
    }
    const payload: UpdateUserDto = {
      userId: this.loggedUser?.userId,
      firstName: this.userForm.get('firstName')?.value,
      lastName: this.userForm.get('lastName')?.value,
      address: this.userForm.get('address')?.value,
      dateOfBirth: this.userForm.get('dateOfBirth')?.value,
      email: this.userForm.get('email')?.value,
      phoneNumber: this.userForm.get('phoneNumber')?.value,
      profileImage: this.userForm.get('profileImage')?.value,
      bloodGroup: this.userForm.get('bloodGroup')?.value,
      gender: this.userForm.get('gender')?.value,
      qualification: this.userForm.get('qualification')?.value ?? null,
      registrationNumber:
        this.userForm.get('registrationNumber')?.value ?? null,
      specialisationId:
        Number(this.userForm.get('specialisationId')?.value) ?? null,
      visitingCharge:
        Number(this.userForm.get('visitingCharge')?.value) ?? null,
    };
    this.subSink.sink = this.userService.UpdateUser$(payload).subscribe({
      next: (res: AppResponse<null>) => {
        if (res.isSuccess) {
          this.userService.resetLoggedUser();
          this.isEditMode = false;
          this.tostR.showSuccess(res.message);
        } else {
          this.tostR.showError(res.message);
        }
      },
      error: (err: Error) => {
        this.tostR.showError('Internal Server error');
      },
    });
  }

  onClickCancelEditMode() {
    this.isEditMode = false;
  }

  todaysDate(): string {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = today.getFullYear();
    return `${year}-${month}-${day}`; // Returns the date in YYYY-MM-DD format
  }

  onNumberType(event: any): void {
    let value = event.target.value;
    value = value.replace(/\D/g, '');
    if (value.length > 10) {
      value = value.slice(0, 10);
    }
    event.target.value = value;

    if (value.length == 10) {
      this.isMobileNumberValid = true;
    } else {
      this.isMobileNumberValid = false;
    }

    this.userForm.controls['phoneNumber'].setValue(value);
  }

  // Handle not accept more that 25 letters
  onInputText(event: any, length: number): void {
    const input = event.target;
    if (input.value.length > length) {
      input.value = input.value.slice(0, length);
      this.userForm.controls[input.getAttribute('formControlName')].setValue(
        input.value
      );
    }
  }

  checkTextNumberSpecialCharNotAllow(event: any, length: number): void {
    const input = event.target;
    // Remove any numeric characters and special characters
    input.value = input.value.replace(/[^a-zA-Z\s]/g, '');
    if (input.value.length > length) {
      input.value = input.value.slice(0, length);
      this.userForm.controls[input.getAttribute('formControlName')].setValue(
        input.value
      );
    }
  }
}
