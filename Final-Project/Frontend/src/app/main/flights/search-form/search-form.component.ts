import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AirportService } from '../../../_services/airport.service';
import { GetAirport } from '../../../_models/Airport/get-airport';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-search-form',
  standalone: true,
  imports: [
    RouterLink,
    RouterModule,
    CommonModule,
    ReactiveFormsModule,
    BsDropdownModule,
    BsDatepickerModule,
  ],
  templateUrl: './search-form.component.html',
  styleUrl: './search-form.component.css',
})
export class SearchFormComponent {
  private router = inject(Router);
  flightType: string = 'one'; // one or round
  seatClass: string = 'Economy'; // First Class or Economy or Business
  numberOfSeats: number = 1;
  todayDate: Date = new Date();
  searchForm!: FormGroup;
  formError: string | null = null;

  private allAirports: GetAirport[] = [];
  fromAirports: GetAirport[] = [];
  toAirports: GetAirport[] = [];
  departAirport: GetAirport | null = null;
  arrivalAirport: GetAirport | null = null;
  private readonly airportService = inject(AirportService);

  setAirport(id: number, target: 'depart' | 'arrival') {
    const airport = this.allAirports.find((a) => a.id === id);
    if (!airport) return;

    const airportField =
      target === 'depart' ? 'departAirport' : 'arrivalAirport';
    this[airportField] = airport;

    this.searchForm
      .get(airportField)
      ?.setValue(`${airport.city},${airport.country} (${airport.code})`);
    this.fromAirports = this.toAirports = [];
  }

  updateAirports(
    target: 'departAirport' | 'arrivalAirport',
    airportList: 'fromAirports' | 'toAirports'
  ) {
    const searchString: string = this.searchForm.get(target)?.value ?? '';
    if (searchString.length <= 0) {
      this[airportList] = [];
      return;
    }
    this[airportList] = this.allAirports?.filter(
      (a) =>
        a.name.toLowerCase().includes(searchString.toLowerCase()) ||
        a.city.toLowerCase().includes(searchString.toLowerCase()) ||
        a.country.toLowerCase().includes(searchString.toLowerCase())
    );
  }
  getFlights() {
    if (!this.arrivalAirport || !this.departAirport) {
      this.formError = 'You must select Airports From dropdown menu';
      return;
    }
    if (this.searchForm.status === 'INVALID') {
      this.formError = 'Invalid Date/s';
      return;
    }
    if (this.departAirport?.id == this.arrivalAirport?.id) {
      this.formError = 'Arrival Airport Cant be the same as Depart Airport';
      return;
    }
    this.formError = null;
    const departAirportId: number | undefined = this.departAirport?.id;
    const arrivalAirportId: number | undefined = this.arrivalAirport?.id;
    const departDate: Date | undefined =
      this.searchForm.controls['departDate'].value;
    const returnDate: Date | undefined =
      this.searchForm.controls['returnDate'].value;
    const noOfSeats: number = this.numberOfSeats;
    let seatClass: number;
    switch (
      this.seatClass.toLowerCase() // 'Economy'; // First Class or Economy or Business
    ) {
      case 'business':
        seatClass = 1;
        break;
      case 'first class':
        seatClass = 2;
        break;
      default:
        seatClass = 0;
        break;
    }

    if (
      !departAirportId ||
      !arrivalAirportId ||
      !(seatClass >= 0 && seatClass <= 2) ||
      !departDate
    )
      return;
    if (this.flightType == 'round' && !returnDate) return;

    // departDate.setHours(0, 0, 0, 0);
    // returnDate?.setHours(0, 0, 0, 0);
    const offsetInHours = departDate.getTimezoneOffset() / 60;
    departDate.setHours(departDate.getHours() - offsetInHours);

    const queryLink = `type=${
      this.flightType
    }&class=${seatClass}&seats=${noOfSeats}&departDate=${departDate.toISOString()}${
      returnDate ? '&returnDate=' + returnDate.toISOString() : ''
    }&departAirportId=${departAirportId}&arrivalAirportId=${arrivalAirportId}`;
    this.router.navigateByUrl(`/flights/search?${queryLink}`);
  }

  ngOnInit() {
    this.searchForm = new FormGroup(
      {
        departAirport: new FormControl<string>('', [Validators.required]),
        arrivalAirport: new FormControl<string>('', [Validators.required]),
        departDate: new FormControl<Date | null>(null, [Validators.required]),
        returnDate: new FormControl<Date | null>(null, []),
      },
      { validators: this.datesValidator }
    );
  }
  constructor() {
    this.airportService.getAirports(1, 1).subscribe({
      next: (res) => {
        const pageSize = res.total;
        this.airportService.getAirports(1, pageSize).subscribe({
          next: (res) => (this.allAirports = res.data),
        });
      },
    });
  }

  datesValidator: ValidatorFn = (
    group: AbstractControl
  ): ValidationErrors | null => {
    const departDate: Date | null = group.get('departDate')?.value;
    const returnDate: Date | null = group.get('returnDate')?.value;

    const validDates =
      (this.flightType == 'one' && departDate) ||
      (this.flightType == 'round' &&
        returnDate &&
        departDate &&
        returnDate >= departDate);
    return !validDates ? { invalidDate: { value: false } } : null;
  };
}
