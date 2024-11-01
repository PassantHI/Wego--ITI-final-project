import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { GetAirport } from '../../../_models/Airport/get-airport';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { GetLocation } from '../../../_models/Location/get-location';
import { AirportService } from '../../../_services/airport.service';
import { LocationService } from '../../../_services/location.service';
import { PutAirport } from '../../../_models/Airport/put-airport';

@Component({
  selector: 'app-update-airport',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './update-airport.component.html',
  styleUrl: './update-airport.component.css',
})
export class UpdateAirportComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly activeRoute = inject(ActivatedRoute);
  private readonly locationService = inject(LocationService);
  private readonly airportService = inject(AirportService);
  private subscriptions: Subscription | null = null;
  airportForm!: FormGroup;
  airport: GetAirport | null = null;
  locations: GetLocation[] = [];
  formErrors: string[] = [];

  ngOnInit(): void {
    this.airportForm = new FormGroup({
      code: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(2),
      ]),
      name: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(2),
      ]),
      locationId: new FormControl<string>('', [Validators.required]),
    });

    this.fetchLocations();
    this.fetchSelectedAirport();
  }

  ngOnDestroy(): void {
    this.subscriptions?.unsubscribe();
  }

  updateAirport() {
    this.formErrors = [];
    if (this.airportForm.status !== 'VALID') return this.generateErrors();

    const postData = this.generatePutObject();
    this.airportService.updateAirport(this.airport!.id, postData).subscribe({
      next: (res) => {
        this.router.navigateByUrl('/dashboard/airports?r=true');
      },
      error: (err) => {
        console.log(err.status);
      },
    });
  }

  private fetchLocations() {
    this.locationService.getLocations().subscribe({
      next: (res) => (this.locations = res),
    });
  }
  private fetchSelectedAirport() {
    this.subscriptions = this.activeRoute.params.subscribe({
      next: (params) => {
        const airportId: number = +params['id'];
        this.airportService.getAirportById(airportId).subscribe({
          next: (res) => {
            this.airport = res;
            this.updateForm();
          },
          error: (err) => {
            this.router.navigateByUrl('dashboard/airports');
          },
        });
      },
      error: (err) => {
        this.router.navigateByUrl('dashboard/airports');
      },
    });
  }
  private generateErrors() {
    var fields: string[] = ['code', 'name', 'locationId'];
    fields.forEach((field) => {
      const fieldErrors = this.airportForm.controls[field].errors;
      if (fieldErrors && fieldErrors['required']) {
        this.formErrors.push(`${field} is required`);
      } else if (fieldErrors && fieldErrors['minlength']) {
        this.formErrors.push(
          `${field} must have more than ${fieldErrors['minlength']['requiredLength']} characters`
        );
      }
    });
  }

  private generatePutObject(): PutAirport {
    const code: string = this.airportForm.controls['code'].value;
    const name: string = this.airportForm.controls['name'].value;
    const locationId: number = +this.airportForm.controls['locationId'].value;
    const postData = new PutAirport(this.airport!.id, name, code, locationId);
    return postData;
  }

  private updateForm() {
    this.airportForm.controls['code'].setValue(this.airport?.code);
    this.airportForm.controls['name'].setValue(this.airport?.name);
    this.airportForm.controls['locationId'].setValue(this.airport?.locationId);
  }
}
