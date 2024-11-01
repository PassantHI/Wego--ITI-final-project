import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { AirlineService } from '../../../_services/airline.service';
import { GetAirline } from '../../../_models/Airline/get-airline';

@Component({
  selector: 'app-update-airline',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './update-airline.component.html',
  styleUrl: './update-airline.component.css',
})
export class UpdateAirlineComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly airlineService = inject(AirlineService);
  private readonly activeRoute = inject(ActivatedRoute);
  private subscriptions: Subscription | null = null;
  public airline: GetAirline | null = null;
  public imageFile: File | null = null;
  updateAirlineForm!: FormGroup;
  formErrors: string[] = [];

  ngOnInit(): void {
    this.updateAirlineForm = new FormGroup({
      code: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(2),
      ]),
      name: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(2),
      ]),
      image: new FormControl<File | null>(null, []),
    });
    this.subscriptions = this.activeRoute.params.subscribe({
      next: (params) => {
        const id = params['id'];
        if (!id) this.router.navigateByUrl('dashboard/airlines');
        this.airlineService.getAirlineById(+id).subscribe({
          next: (res) => {
            this.airline = res;
            this.updateAirlineForm.controls['code'].setValue(this.airline.code);
            this.updateAirlineForm.controls['name'].setValue(this.airline.name);
          },
          error: (err) => {
            // navigate to error page
            this.router.navigateByUrl('dashboard/airlines');
          },
        });
      },
      error: (err) => {
        this.router.navigateByUrl('dashboard/airlines');
      },
    });
  }
  ngOnDestroy(): void {
    this.subscriptions?.unsubscribe();
  }

  updateImageFile(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.imageFile = target.files[0];
    }
  }

  updateAirline() {
    this.formErrors = [];
    if (this.updateAirlineForm.status !== 'VALID') {
      var fields: string[] = ['name', 'code'];

      fields.forEach((field) => {
        const fieldErrors = this.updateAirlineForm.controls[field].errors;
        if (fieldErrors && fieldErrors['required']) {
          this.formErrors.push(`${field} is required`);
        } else if (fieldErrors && fieldErrors['minlength']) {
          this.formErrors.push(
            `${field} must have more than ${fieldErrors['minlength']['requiredLength']} characters`
          );
        }
      });
      return;
    }
    const code: string = this.updateAirlineForm.controls['code'].value;
    const name: string = this.updateAirlineForm.controls['name'].value;

    const formData: FormData = new FormData();
    formData.append('id', this.airline!.id.toString());
    formData.append('code', code);
    formData.append('name', name);
    if (this.imageFile) formData.append('image', this.imageFile as File);

    this.airlineService.updateAirline(this.airline!.id, formData).subscribe({
      next: (res) => {
        this.router.navigateByUrl('/dashboard/airlines?r=true');
      },
      error: (err) => {
        console.log(err.status);
      },
    });
  }
}
