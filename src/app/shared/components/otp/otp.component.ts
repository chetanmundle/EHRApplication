import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MyToastServiceService } from '../../../core/services/index';
import { UserService } from '../../../core/services/index';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  LoginUserResponseDto,
  LoginUserValidateOtpDto,
} from '../../../core/Models/Interfaces/User/UserDto.model';
import { AppResponse } from '../../../core/Models/AppResponse';

@Component({
  selector: 'app-otp',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './otp.component.html',
  styleUrl: './otp.component.css',
})
export class OtpComponent implements OnDestroy {
  @Input() email: string = '';
  @Output() onCancelBtnClick = new EventEmitter<boolean>();
  otp: string[] = ['', '', '', '', '', ''];
  subscriptions: Subscription = new Subscription();

  private tostr = inject(MyToastServiceService);
  private userService = inject(UserService);
  private router = inject(Router);

  onClickCancel() {
    this.onCancelBtnClick.emit(false);
  }

  onInput(event: any, index: number) {
    const inputElement = event.target as HTMLInputElement;
    const nextInput =
      document.querySelectorAll<HTMLInputElement>('#otp > input')[index + 1];
    const prevInput =
      document.querySelectorAll<HTMLInputElement>('#otp > input')[index - 1];

    // Handle paste event
    if (event.inputType === 'insertFromPaste') {
      const pastedData =
        event.clipboardData?.getData('text') || inputElement.value;
      if (pastedData && pastedData.length === 6) {
        this.populateOtpFromPaste(pastedData);
      }
      return;
    }

    // Allow only one character
    if (inputElement.value.length > 1) {
      inputElement.value = inputElement.value[0];
      this.otp[index] = inputElement.value; // Update the model
    }

    // Handle valid input and move focus to the next field
    if (inputElement.value && nextInput) {
      nextInput.focus();
    }

    // Handle backspace
    if (event.inputType === 'deleteContentBackward') {
      this.otp[index] = ''; // Clear the current value in the model
      if (prevInput) {
        prevInput.focus();
      }
    }
  }

  // New method to populate OTP inputs on paste
  populateOtpFromPaste(pastedOtp: string) {
    const otpInputs =
      document.querySelectorAll<HTMLInputElement>('#otp > input');
    this.otp = pastedOtp.split('').slice(0, 6); // Update the OTP array

    otpInputs.forEach((input, i) => {
      input.value = this.otp[i] || ''; // Set value for each input
    });
  }

  validateOTP() {
    const otpCode = this.otp.join('');
    if (!otpCode || otpCode.length !== 6) {
      this.tostr.showWarning('Enter the Correct Otp');
      return;
    }
    const payload: LoginUserValidateOtpDto = {
      email: this.email,
      otpValue: Number(otpCode),
    };

    const sub = this.userService.VerifyOtpAndGetJwtToken$(payload).subscribe({
      next: (res: AppResponse<LoginUserResponseDto>) => {
        if (res.isSuccess) {
          localStorage.setItem('accessToken', res.data.accessToken);

          this.userService.resetLoggedUser();

          if (res.data.userTypeName === 'Provider') {
            this.router.navigate(['/org/Provider/Home']);
          } else if (res.data.userTypeName === 'Patient') {
            this.router.navigate(['/org/Patient/Home']);
          }

          this.tostr.showSuccess(res.message);
        } else {
          this.tostr.showError(res.message);
        }
      },
      error: (err: Error) => {
        this.tostr.showError('Server Error...!');
        console.log('Error to varify otp : ', err);
      },
    });
    this.subscriptions.add(sub);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
