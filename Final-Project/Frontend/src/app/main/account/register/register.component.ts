import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../_services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { FooterComponent } from '../../../core/footer/footer.component';
import { NavbarComponent } from '../../../core/navbar/navbar.component';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterLink,
    FooterComponent,
    NavbarComponent,
  ], //import
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  form!: FormGroup;
  isSubmited = false;
  toastr = inject(ToastrService);

  //name=new FormControl(''); //Use the constructor of FormControl to set its initial value, which in this case is an empty string.
  //form control instance gives you control over a (single input field)
  /* update(){
    this.name.setValue('passant ts')  
  }*/
  constructor(
    public formBuilder: FormBuilder,
    public service: AuthService,
    public router: Router
  ) {}

  //custom validator for confirm passsword match
  passwordMatchValidator: ValidatorFn = (
    control: AbstractControl
  ): /*implement ValidatorFn interface take one parameter =>AbstractControl*/ null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    if (password && confirmPassword && password.value != confirmPassword.value)
      confirmPassword?.setErrors({ passwordMismatch: true });
    else confirmPassword?.setErrors(null);
    return null;
  };

  //custom validator for prevent space and spcial char in username

  userNameValidator: ValidatorFn = (control: AbstractControl): null => {
    const userName = control.get('userName');
    const userNamePattern = /^[a-zA-Z0-9]+$/;
    if (userName?.value && !userNamePattern.test(userName.value)) {
      userName?.setErrors({ lettersAndDigitsOnly: true });
    } else userName?.setErrors(null);

    return null;
  };

  ngOnInit(): void {
    this.form = this.formBuilder.group(
      {
        userName: ['', [Validators.required]], //validation
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/(?=.*[^a-zA-Z0-9])/),
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      { validators: [this.passwordMatchValidator, this.userNameValidator] }
    ); //interdependant validation
  }

  onSubmit() {
    this.isSubmited = true;

    if (this.form.valid) {
      this.service.register(this.form.value).subscribe({
        next: (res: any) => {
          this.toastr.success('The confirmation email has been sent');
          this.router.navigateByUrl('/account/login');
        },
        error: (err) => {
          this.toastr.error(
            'Error occured while registering, try using another email'
          );
        },
      });
    } else console.log('form in valid');
  }

  hasDisplayMessage(controlName: string): Boolean {
    //when the error message display?
    const control = this.form.get(controlName);
    return (
      Boolean(control?.invalid) &&
      (this.isSubmited || Boolean(control?.touched))
    );
  }
}
