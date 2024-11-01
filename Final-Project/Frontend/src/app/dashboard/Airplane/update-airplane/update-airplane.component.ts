import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { GetAirline } from '../../../_models/Airline/get-airline';
import { AirlineService } from '../../../_services/airline.service';
import { AirplaneService } from '../../../_services/airplane.service';
import { GetAirplane } from '../../../_models/airplane/get-airplane';
import { PutAirplane } from '../../../_models/airplane/put-airplane';

@Component({
  selector: 'app-update-airplane',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './update-airplane.component.html',
  styleUrl: './update-airplane.component.css',
})
export class UpdateAirplaneComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly airlineService = inject(AirlineService);
  private readonly airplaneService = inject(AirplaneService);
  private readonly activeRoute = inject(ActivatedRoute);

  private subscriptions: Subscription | null = null;
  airplaneForm!: FormGroup;
  airlines: GetAirline[] = [];
  airplane: GetAirplane | null = null;
  features: string[] = ['meal', 'video', 'usb', 'wifi'];
  airplaneFeatures: string[] = [];
  formErrors: string[] = [];

  ngOnInit(): void {
    this.airplaneForm = new FormGroup({
      code: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(2),
      ]),
      type: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(2),
      ]),
      airlineId: new FormControl<string>('', [Validators.required]),
      features: new FormArray([]),
    });

    this.fetchAirlines();
  }

  updateAirplane() {
    this.formErrors = [];
    if (this.airplaneForm.status !== 'VALID') return this.generateErrors();

    const putData = this.generatePutObject();

    this.airplaneService.updateAirplane(+this.airplane!.id, putData).subscribe({
      next: (res) => {
        this.router.navigateByUrl('/dashboard/airplanes?r=true');
      },
      error: (err) => {
        console.log(err.status);
      },
    });
  }

  ngOnDestroy(): void {
    this.subscriptions?.unsubscribe();
  }

  private fetchAirlines() {
    this.airlineService.getAirlines(1, 1).subscribe({
      next: (res) => {
        const total = res.total;
        this.airlineService.getAirlines(1, total).subscribe({
          next: (res) => {
            this.airlines = res.data;
            this.fetchSelectedAirplane();
          },
        });
      },
    });
  }

  private fetchSelectedAirplane() {
    this.subscriptions = this.activeRoute.params.subscribe({
      next: (params) => {
        const id = params['id'];
        if (!id) this.router.navigateByUrl('dashboard/airplanes');
        this.airplaneService.getAirplaneById(+id).subscribe({
          next: (res) => {
            this.airplane = res;
            this.airplaneForm.controls['code'].setValue(this.airplane.code);
            this.airplaneForm.controls['type'].setValue(this.airplane.type);

            this.airplaneForm.controls['airlineId'].setValue(
              this.airplane.airlineId
            );

            const formArray = this.airplaneForm.get('features') as FormArray;
            this.airplane.features.forEach((f) => {
              formArray.push(new FormControl(f));
            });
          },
          error: (err) => {
            // navigate to error page
            this.router.navigateByUrl('dashboard/airplanes');
          },
        });
      },
      error: (err) => {
        this.router.navigateByUrl('dashboard/airplanes');
      },
    });
  }

  onCheckboxChange(event: Event) {
    const formArray = this.airplaneForm.get('features') as FormArray;
    const element = event.target as HTMLInputElement;
    if (element.checked) formArray.push(new FormControl(element.value));
    else {
      const index = formArray.controls.findIndex(
        (x) => x.value === element.value
      );
      formArray.removeAt(index);
    }
  }

  private generateErrors() {
    var fields: string[] = ['type', 'code', 'airlineId'];
    fields.forEach((field) => {
      const fieldErrors = this.airplaneForm.controls[field].errors;
      if (fieldErrors && fieldErrors['required']) {
        this.formErrors.push(`${field} is required`);
      } else if (fieldErrors && fieldErrors['minlength']) {
        this.formErrors.push(
          `${field} must have more than ${fieldErrors['minlength']['requiredLength']} characters`
        );
      }
    });
  }

  private generatePutObject(): PutAirplane {
    const code: string = this.airplaneForm.controls['code'].value;
    const type: string = this.airplaneForm.controls['type'].value;
    const airlineId: number = +this.airplaneForm.controls['airlineId'].value;
    const features: string[] = this.airplaneForm.controls['features'].value;
    const postData = new PutAirplane(
      +this.airplane!.id,
      code,
      type,
      airlineId,
      features
    );
    return postData;
  }
  isChecked(feature: string) {
    const featursFormArray = this.airplaneForm.get('features') as FormArray;
    const features = featursFormArray.value as string[];

    return features.includes(feature);
  }
}
