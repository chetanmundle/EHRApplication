import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { specialisationDto } from '../../../../core/Models/Interfaces/Specialization/specialization.model';
import { Subscription } from 'rxjs';
import { SpecializationService } from '../../../../core/services/SpecializationService/specialization.service';
import { AppResponse } from '../../../../core/Models/AppResponse';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../../core/services/UserService/user.service';
import { UserWithIdNameDto } from '../../../../core/Models/Interfaces/User/provider.model';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  BookAppointmentDto,
  PayAndBookAppointmentDto,
} from '../../../../core/Models/Interfaces/Appointment/appointment.model';
import { LoggedUserDto } from '../../../../core/Models/classes/User/LoggedUserDto';
import { CustomTimeValidator } from '../../../../core/Validators/ValidateEndTime.validation';
import { AppointmentService } from '../../../../core/Services/Appointment/appointment.service';
import { MyToastServiceService } from '../../../../core/services/MyToastService/my-toast-service.service';
import { Modal } from 'bootstrap';
import { AngularStripeService } from '@fireflysemantics/angular-stripe-service';

@Component({
  selector: 'app-book-appointment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './book-appointment.component.html',
  styleUrl: './book-appointment.component.css',
})
export class BookAppointmentComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  @ViewChild('cardNumber', { static: false }) cardNumber!: ElementRef;
  @ViewChild('expiryInput', { static: false }) expiryInput!: ElementRef;
  @ViewChild('cvvInput', { static: false }) cvvInput!: ElementRef;
  specializationList?: specialisationDto[];
  providersList?: UserWithIdNameDto[];
  loggedUser?: LoggedUserDto;
  fee: number = 0;

  private modalInstance: Modal | null = null;
  isLoader: boolean = false;
  isSubmitClick: boolean = false;
  appointmentForm: FormGroup;
  private subscriptions: Subscription = new Subscription();

  stripe: any;
  cardNumberElement: any;
  cardExpiryElement: any;
  cardCvcElement: any;
  stripeToken: any;
  error: any;
  errorbutton: boolean = false;

  stripePaymentData:
    | { amount: any; customerName: string; customerEmail: string }
    | undefined;
  publisherKey =
    'pk_test_51QU2VaF4gzQPjLrK4QIWMoZft48fZHDBwvoXin0fMlDU3g4eq5XrFYF1De1N3MfLwkT7OOsepFFIycYIzOdu9yew0058GtKDcz';

  private specializationService = inject(SpecializationService);
  private userService = inject(UserService);
  private appointmentService = inject(AppointmentService);
  private toastr = inject(MyToastServiceService);

  constructor(
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private stripeService: AngularStripeService
  ) {
    this.appointmentForm = this.fb.group({
      specializationId: [0, Validators.required],
      providerId: ['', [Validators.required]],
      appointmentDate: ['', [Validators.required]],
      startTime: ['', [Validators.required]],
      endTime: [
        '',
        [
          Validators.required,
          CustomTimeValidator.validateEndTimeWithinOneHour('startTime'),
        ],
      ],
      chiefComplaint: ['', [Validators.required]],
    });
  }

  ngAfterViewInit() {
    this.initializeStripe();
  }

  initializeStripe() {
    this.stripeService.setPublishableKey(this.publisherKey).then((stripe) => {
      this.stripe = stripe;
      const elements = stripe.elements();

      // Initialize the Card Number element
      this.cardNumberElement = elements.create('cardNumber', {
        placeholder: 'Card Number',
      });

      // Initialize the Expiry Date element
      this.cardExpiryElement = elements.create('cardExpiry', {
        placeholder: 'MM/YY',
      });

      // Initialize the CVV element
      this.cardCvcElement = elements.create('cardCvc', {
        placeholder: 'CVV',
      });

      // Mount the elements to their respective HTML div containers
      this.cardNumberElement.mount(this.cardNumber.nativeElement);
      this.cardExpiryElement.mount(this.expiryInput.nativeElement);
      this.cardCvcElement.mount(this.cvvInput.nativeElement);

      // Event listener to handle errors
      this.cardNumberElement.addEventListener(
        'change',
        this.onChange.bind(this)
      );
      this.cardExpiryElement.addEventListener(
        'change',
        this.onChange.bind(this)
      );
      this.cardCvcElement.addEventListener('change', this.onChange.bind(this));
    });
  }

  // Handle changes in the input fields and show errors if any
  onChange({ error }: { error: Error }) {
    if (error) {
      this.error = error.message;
      this.errorbutton = false;
    } else {
      this.error = null;
      this.errorbutton = true;
    }
    this.cd.detectChanges();
  }

  ngOnInit(): void {
    this.GetAllSpecialization();
    this.GetProvidersBySpecializationId(0);
    this.GetLoggedUser();
  }

  resetAppointmentForm() {
    this.appointmentForm = this.fb.group({
      specializationId: [0, Validators.required],
      providerId: ['', [Validators.required]],
      appointmentDate: ['', [Validators.required]],
      startTime: ['', [Validators.required]],
      endTime: [
        '',
        [
          Validators.required,
          CustomTimeValidator.validateEndTimeWithinOneHour('startTime'),
        ],
      ],
      chiefComplaint: ['', [Validators.required]],
    });
  }

  GetLoggedUser() {
    this.userService.loggedUser$.subscribe((res: LoggedUserDto) => {
      this.loggedUser = res;
    });
  }

  // Get All Specializations
  GetAllSpecialization() {
    const sub = this.specializationService.GetAllSpecialization$().subscribe({
      next: (res: AppResponse<specialisationDto[]>) => {
        if (res.isSuccess) {
          this.specializationList = res.data;
        }
      },
      error: (err: Error) => {
        console.error('Erorr to get Specialization', err);
      },
    });
  }

  // Get Providers by specilization Id
  GetProvidersBySpecializationId(specialisationId: number) {
    const sub = this.userService
      .GetProvidersBySpecializationId$(specialisationId)
      .subscribe({
        next: (res: AppResponse<UserWithIdNameDto[]>) => {
          if (res.isSuccess) {
            this.providersList = res.data;
          }
        },
        error: (err: Error) => {
          console.error('Error to get Providers', err);
        },
      });

    this.subscriptions.add(sub);
  }

  onChangeSpecilization(event: Event) {
    this.appointmentForm.get('providerId')?.setValue('');
    const specializationId = Number((event.target as HTMLSelectElement).value);
    if (specializationId) {
      this.GetProvidersBySpecializationId(specializationId);
    }
  }

  todaysDate(): string {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = today.getFullYear();
    return `${year}-${month}-${day}`; // Returns the date in YYYY-MM-DD format
  }

  BookAppointment() {
    if (this.appointmentForm.invalid) {
      return;
    }

    if (!this.loggedUser) {
      this.toastr.showWarning('Login Again');
      return;
    }

    this.isLoader = true;
    const payload: PayAndBookAppointmentDto = {
      providerId: Number(this.appointmentForm.get('providerId')?.value),
      patientId: Number(this.loggedUser?.userId),
      appointmentDate: this.appointmentForm.get('appointmentDate')?.value,
      startTime: this.appointmentForm.get('startTime')?.value + ':00',
      endTime: this.appointmentForm.get('endTime')?.value + ':00',
      chiefComplaint: this.appointmentForm.get('chiefComplaint')?.value,
      amount: this.fee,
      customerEmail: this.loggedUser?.email,
      customerName: this.loggedUser?.firstName + this.loggedUser?.lastName,
      sourceToken: this.stripeToken.id.toString(),
    };

    this.appointmentService.PayAndBookAppointmentByPatient$(payload).subscribe({
      next: (res: AppResponse<null>) => {
        if (res.isSuccess) {
          this.resetAppointmentForm();
          this.closeModal();
          this.isLoader = false;
          this.toastr.showSuccess(res.message);
        } else {
          this.isLoader = false;
          this.toastr.showError(res.message);
        }
      },
      error: (err: Error) => {
        this.isLoader = false;
        console.error('Error to book appointment', err);
      },
    });
  }

  // Function to open the modal CArdModal
  openModal() {
    this.isSubmitClick = true;
    if (this.appointmentForm.invalid) {
      return;
    }
    const modalElement = document.getElementById('exampleModal');
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

  async onClickPayButton() {
    if (!this.loggedUser) {
      return;
    }

    // Ensure card elements are valid
    if (
      !this.cardNumberElement ||
      !this.cardExpiryElement ||
      !this.cardCvcElement
    ) {
      alert('Stripe Elements are not initialized correctly');
      return;
    }

    this.isLoader = true;
    // Create the token for the card details entered by the user
    const { token, error } = await this.stripe.createToken(
      this.cardNumberElement
    );
    if (token != undefined) {
      this.stripeToken = token;
      this.BookAppointment();
    } else {
      this.isLoader = false;
      alert(error.message);
    }
  }

  onChangeProvider(event: Event) {
    const providerId = Number((event.target as HTMLSelectElement).value);
    const provider = this.providersList?.find((p) => p.userId === providerId);
    if (provider) {
      this.fee = provider.visitingCharge;
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
