import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { LocationService } from '../../../_services/location.service';
import { AirportService } from '../../../_services/airport.service';
import { Router, RouterLink } from '@angular/router';
import { GetLocation } from '../../../_models/Location/get-location';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { FlightService } from '../../../_services/flight.service';
import { GetAirport } from '../../../_models/Airport/get-airport';
import { GetAirline } from '../../../_models/Airline/get-airline';
import { GetAirplane } from '../../../_models/airplane/get-airplane';
import { AirlineService } from '../../../_services/airline.service';
import { AirplaneService } from '../../../_services/airplane.service';
import { PostFlight } from '../../../_models/Flight/post-flight';

@Component({
  selector: 'app-new-flight',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './new-flight.component.html',
  styleUrl: './new-flight.component.css',
})
export class NewFlightComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly airportService = inject(AirportService);
  private readonly airlineService = inject(AirlineService);
  private readonly airplaneService = inject(AirplaneService);
  private readonly flightService = inject(FlightService);
  private subscriptions: Subscription | null = null;
  flightForm!: FormGroup;
  formErrors: string[] = [];
  airlines: GetAirline[] = [];
  airplanes: GetAirplane[] = [];
  airports: GetAirport[] = [];

  selectedDepartAirport: WritableSignal<GetAirport | null> = signal(null);
  selectedArrivaltAirport: WritableSignal<GetAirport | null> = signal(null);
  selectedAirplanes: WritableSignal<GetAirplane[] | null> = signal(null);

  ngOnInit(): void {
    this.flightForm = new FormGroup({
      departureTime: new FormControl<string>(this.minDate(), [
        Validators.required,
      ]),
      arrivalTime: new FormControl<string>(this.minDate(), [
        Validators.required,
      ]),
      status: new FormControl<number>(0, [Validators.required]),
      priceEconomyClass: new FormControl<number | null>(null, [
        Validators.required,
      ]),
      priceBusinessClass: new FormControl<number | null>(null, [
        Validators.required,
      ]),
      priceFirstClass: new FormControl<number | null>(null, [
        Validators.required,
      ]),
      airlineId: new FormControl<string>('', [Validators.required]),
      airplaneId: new FormControl<string>('', [Validators.required]),
      departureAirportId: new FormControl<string>('', [Validators.required]),
      departureTerminalId: new FormControl<string>('', [Validators.required]),
      arrivalAirportId: new FormControl<string>('', [Validators.required]),
      arrivalTerminalId: new FormControl<string>('', [Validators.required]),
    });

    this.fetchAirports();
    this.fetchAirlines();
    this.fetchAirplanes();
  }

  ngOnDestroy(): void {
    this.subscriptions?.unsubscribe();
  }

  addFlight() {
    this.formErrors = [];
    if (this.flightForm.status !== 'VALID') return this.generateErrors();

    const postData = this.generatePostObject();
    this.flightService.addNewFlight(postData).subscribe({
      next: (res) => {
        this.router.navigateByUrl('/dashboard/flights?r=true');
      },
      error: (err) => {
        console.log(err.status);
      },
    });
  }

  private fetchAirports() {
    this.airportService.getAirports(1, 20).subscribe({
      next: (res) => (this.airports = res.data),
    });
  }
  private fetchAirlines() {
    this.airlineService.getAirlines(1, 20).subscribe({
      next: (res) => (this.airlines = res.data),
    });
  }
  private fetchAirplanes() {
    this.airplaneService.getAirplanes(1, 20).subscribe({
      next: (res) => (this.airplanes = res.data),
    });
  }

  private generateErrors() {
    var fields: string[] = [
      'departureTime',
      'arrivalTime',
      'status',
      'priceEconomyClass',
      'priceBusinessClass',
      'priceFirstClass',
      'airlineId',
      'airplaneId',
      'departureAirportId',
      'departureTerminalId',
      'arrivalAirportId',
      'arrivalTerminalId',
    ];

    fields.forEach((field) => {
      const fieldErrors = this.flightForm.controls[field].errors;
      if (fieldErrors && fieldErrors['required']) {
        this.formErrors.push(`${field} is required`);
      }
    });
  }

  private generatePostObject(): PostFlight {
    const departureTime: Date = this.flightForm.controls['departureTime'].value;
    const arrivalTime: Date = this.flightForm.controls['arrivalTime'].value;
    const status: number = this.flightForm.controls['status'].value;
    const priceEconomyClass: number =
      this.flightForm.controls['priceEconomyClass'].value;
    const priceBusinessClass: number =
      this.flightForm.controls['priceBusinessClass'].value;
    const priceFirstClass: number =
      this.flightForm.controls['priceFirstClass'].value;
    const airlineId: number = this.flightForm.controls['airlineId'].value;
    const airplaneId: number = this.flightForm.controls['airplaneId'].value;
    const departureAirportId: number =
      this.flightForm.controls['departureAirportId'].value;
    const departureTerminalId: number =
      this.flightForm.controls['departureTerminalId'].value;
    const arrivalAirportId: number =
      this.flightForm.controls['arrivalAirportId'].value;
    const arrivalTerminalI: number =
      this.flightForm.controls['arrivalTerminalId'].value;

    const postData = new PostFlight(
      departureTime,
      arrivalTime,
      status,
      priceEconomyClass,
      priceBusinessClass,
      priceFirstClass,
      airlineId,
      airplaneId,
      departureTerminalId,
      arrivalTerminalI
    );
    return postData;
  }

  selectDepartAirport(event: any) {
    const selectedAirportId = event.target.value;
    this.selectedDepartAirport.set(
      this.airports.find((airport) => airport.id === +selectedAirportId) ?? null
    );
  }
  selectArrivalAirport(event: any) {
    const selectedAirportId = event.target.value;
    this.selectedArrivaltAirport.set(
      this.airports.find((airport) => airport.id === +selectedAirportId) ?? null
    );
  }
  selectAirline(event: any) {
    const selectedAirlineId = event.target.value;
    this.selectedAirplanes.set(
      this.airplanes.filter(
        (airplane) => airplane.airlineId == +selectedAirlineId
      )
    );
  }

  minDate() {
    const date = new Date();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`;
    return formattedDate;
  }
}
