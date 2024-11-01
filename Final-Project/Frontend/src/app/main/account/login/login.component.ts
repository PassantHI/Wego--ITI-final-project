import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../_services/auth.service';
import { CommonModule } from '@angular/common';
import { Route, Router, RouterLink } from '@angular/router';
import { FooterComponent } from '../../../core/footer/footer.component';
import { NavbarComponent } from '../../../core/navbar/navbar.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterLink,
    FooterComponent,
    NavbarComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  constructor(
    public formBuilder: FormBuilder,
    public service: AuthService,
    private router: Router
  ) {}

  form!: FormGroup;
  isSubmited = false;
  errMessage: string | null = null;

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {
    this.isSubmited = true;
    if (this.form.valid) {
      this.service.login(this.form.value).subscribe({
        next: (res: any) => {
          localStorage.setItem('token', res.token);
          this.service.successLog();
          this.router.navigateByUrl('/home');
        },
        error: (err) => {
          this.errMessage = err.error;
        },
      });
    } else console.log('form in valid');
  }

  hasDisplayMessage(controlName: string): Boolean {
    const control = this.form.get(controlName);
    return (
      Boolean(control?.invalid) &&
      (this.isSubmited || Boolean(control?.touched))
    );
  }
}
