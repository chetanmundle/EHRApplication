import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CountryDto } from '../../../core/Models/Interfaces/countryState/CountryDto';
import { StateDto } from '../../../core/Models/Interfaces/countryState/StateDto';
import { CountryStateService } from '../../../core/services/index';
import { MyToastServiceService } from '../../../core/services/index';
import { ImageService } from '../../../core/services/index';
import { UserService } from '../../../core/services/index';
import { Router } from '@angular/router';
import { customEmailValidator } from '../../../core/Validators/EmailValidation.validation';
import { AppResponse } from '../../../core/Models/AppResponse';
import { RegisterProvidertDto } from '../../../core/Models/Interfaces/User/provider.model';
import { SpecializationService } from '../../../core/services/index';
import { specialisationDto } from '../../../core/Models/Interfaces/Specialization/specialization.model';
import { useAuthStore } from '../../../core/stores/auth.store';
import { SubSinkService } from '../../../core/services/index';

@Component({
  selector: 'app-provider-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './provider-register.component.html',
  styleUrl: './provider-register.component.css',
})
export class ProviderRegisterComponent {
  registerForm: FormGroup;
  private readonly subSink: SubSinkService = new SubSinkService();

  countryList?: CountryDto[];
  stateList?: StateDto[];
  specializationList?: specialisationDto[];

  isSubmitClick: boolean = false;
  isMobileNumberValid: boolean = false;
  selectedFile: File | null = null;

  private countryStateService = inject(CountryStateService);
  private tostR = inject(MyToastServiceService);
  private imageService = inject(ImageService);
  private userService = inject(UserService);
  private router = inject(Router);
  private specializationService = inject(SpecializationService);
  private authStore = inject(useAuthStore);

  constructor(private formBuilder: FormBuilder) {
    this.registerForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, customEmailValidator()]],
      dateOfBirth: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      bloodGroup: ['', [Validators.required]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      stateId: ['', [Validators.required]],
      countryId: ['', [Validators.required]],
      zipCode: ['', [Validators.required]],
      qualification: ['', [Validators.required]],
      specialisationId: ['', [Validators.required]],
      registrationNumber: ['', [Validators.required]],
      visitingCharge: ['', [Validators.required]],
      profileImage: [''],
      isChecked: [true, [Validators.requiredTrue]],
    });
  }
  ngOnInit(): void {
    this.GetAllContries();
    this.GetAllSpecializations();
  }
  ngOnDestroy(): void {
    this.subSink.unsubscribe();
  }

  onClickClearBtn() {
    this.registerForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, customEmailValidator()]],
      dateOfBirth: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      bloodGroup: ['', [Validators.required]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      stateId: ['', [Validators.required]],
      countryId: ['', [Validators.required]],
      zipCode: ['', [Validators.required]],
      qualification: ['', [Validators.required]],
      specialisationId: ['', [Validators.required]],
      registrationNumber: ['', [Validators.required]],
      visitingCharge: ['', [Validators.required]],
      profileImage: [''],
      isChecked: [true, [Validators.requiredTrue]],
    });
  }

  // function will call only when the country will change
  onChangeCountry(event: Event) {
    this.registerForm.get('stateId')?.setValue('');
    const selectElement = event.target as HTMLSelectElement;
    const countryId = Number(selectElement.value);

    this.subSink.sink = this.countryStateService
      .GetAllStateByCountryId$(countryId)
      .subscribe({
        next: (res: AppResponse<StateDto[]>) => {
          if (res.isSuccess) {
            this.stateList = res.data;
            return;
          } else {
            console.log('Unble to get the state : ', res);
          }
        },
        error: (err: Error) => {
          console.log('Error to get the States : ', err);
        },
      });
  }

  // Handle not accept more that 25 letters
  onInputText(event: any, length: number): void {
    const input = event.target;
    if (input.value.length > length) {
      input.value = input.value.slice(0, length);
      this.registerForm.controls[
        input.getAttribute('formControlName')
      ].setValue(input.value);
    }
  }

  checkTextNumberSpecialCharNotAllow(event: any, length: number): void {
    const input = event.target;
    // Remove any numeric characters and special characters
    input.value = input.value.replace(/[^a-zA-Z\s]/g, '');
    if (input.value.length > length) {
      input.value = input.value.slice(0, length);
      this.registerForm.controls[
        input.getAttribute('formControlName')
      ].setValue(input.value);
    }
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

    this.registerForm.controls['phoneNumber'].setValue(value);
  }

  GetAllContries() {
    this.subSink.sink = this.countryStateService.GetAllCountries$().subscribe({
      next: (res: AppResponse<CountryDto[]>) => {
        if (res.isSuccess) {
          this.countryList = res.data;
          return;
        } else {
          console.log('Unble to get Countries ', res);
        }
      },
      error: (error: Error) => {
        console.log('Error to register', error);
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

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  // this fuction call whern user click on Register btn
  onClickRegitster() {
    this.isSubmitClick = true;
    if (this.registerForm.invalid) {
      return;
    }

    if (this.selectedFile) {
      this.subSink.sink = this.imageService
        .uploadImage$(this.selectedFile)
        .subscribe({
          next: (res: AppResponse<string>) => {
            if (res.isSuccess) {
              this.registerForm.get('profileImage')?.setValue(res.data);
              this.RegisterUser();
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
      this.RegisterUser();
    }
  }

  RegisterUser() {
    const payload: RegisterProvidertDto = {
      firstName: this.registerForm.get('firstName')?.value,
      lastName: this.registerForm.get('lastName')?.value,
      email: this.registerForm.get('email')?.value,
      dateOfBirth: this.registerForm.get('dateOfBirth')?.value,
      phoneNumber: this.registerForm.get('phoneNumber')?.value,
      gender: this.registerForm.get('gender')?.value,
      bloodGroup: this.registerForm.get('bloodGroup')?.value,
      address: this.registerForm.get('address')?.value,
      city: this.registerForm.get('city')?.value,
      stateId: Number(this.registerForm.get('stateId')?.value),
      countryId: Number(this.registerForm.get('countryId')?.value),
      zipCode: Number(this.registerForm.get('zipCode')?.value),
      profileImage: this.registerForm.get('profileImage')?.value,
      qualification: this.registerForm.get('qualification')?.value,
      registrationNumber: this.registerForm.get('registrationNumber')?.value,
      specialisationId: Number(
        this.registerForm.get('specialisationId')?.value
      ),
      visitingCharge: Number(this.registerForm.get('visitingCharge')?.value),
    };
    this.subSink.sink = this.userService.RegisterProvider$(payload).subscribe({
      next: (res: AppResponse<null>) => {
        if (res.isSuccess) {
          this.RegisterInFirebase(
            payload.email,
            'Pass@123',
            'Dr. ' + payload.firstName
          );
          this.onClickClearBtn();
          this.tostR.showSuccess(res.message);
          this.router.navigateByUrl('/auth/Login');
        } else {
          this.tostR.showError(res.message);
        }
      },
      error: (err: Error) => {
        console.log('Errot to Register the User ', err);
        this.tostR.showError('Internal Server Error');
      },
    });
  }

  async RegisterInFirebase(
    email: string,
    password: string,
    displayName: string
  ) {
    try {
      console.log(displayName);
      await this.authStore.signUp(email, password, displayName);
      // Navigate to chat list after successful signup
    } catch (error) {
      console.error('Signup error:', error);
      if (error instanceof Error) {
        console.log('Errm : ', error.message);

        // this.errorMessage.set(error.message);
      } else {
        console.log('Errm : ', error);
        // this.errorMessage.set(
        //   'An unexpected error occurred. Please try again.'
        // );
      }
    }
  }
}
