import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Rooms } from '../../../_models/Rooms';
import { HotelsService } from '../../../_services/hotels.service';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrService } from 'ngx-toastr';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BookingService } from '../../../_services/booking.service';
import { Booking } from '../../../_models/booking';
import { DetailsService } from '../../../_services/details.service';
import { Details } from '../../../_models/details';
import { NavbarComponent } from '../../../core/navbar/navbar.component';
import { FooterComponent } from '../../../core/footer/footer.component';

@Component({
  selector: 'app-hotel-details',
  standalone: true,
  imports: [
    CarouselModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    BsDatepickerModule,
    NavbarComponent,
    FooterComponent,
    BsDatepickerModule,
  ],
  templateUrl: './hotel-details.component.html',
  styleUrl: './hotel-details.component.css',
  providers: [DatePipe],
})
export class HotelDetailsComponent implements OnInit {
  bsConfig: Partial<BsDatepickerConfig> = {};
  selectedDate: Date | null = null;
  reservedDates: Date[] = [];
  isDateDisabled: boolean = false;

  hotelService = inject(HotelsService);
  route = inject(ActivatedRoute);
  formBuilder = inject(FormBuilder);
  datePipe = inject(DatePipe);
  bookService = inject(BookingService);
  detailsService = inject(DetailsService);
  router = inject(Router);
  toastr = inject(ToastrService);

  currentDate: string = this.datePipe.transform(new Date(), 'yyyy-MM-dd') || '';
  dayAfter = new Date(this.currentDate);
  today = new Date();
  day = this.dayAfter.setDate(this.dayAfter.getDate() + 1);
  d = this.datePipe.transform(this.day, 'yyyy-MM-dd') || '';

  id = signal<string>('');
  room = signal<Rooms | undefined>(undefined);
  checkIn = signal<Date>(this.today);
  checkOut = signal<Date>(this.today);
  guest = signal<string>('1');
  book = signal<Booking | undefined>(undefined);

  selectedGuest: number = 1;

  numberOfDays = computed(() => {
    if (
      !isNaN(this.checkIn()?.getTime()!) &&
      !isNaN(this.checkOut()?.getTime()!)
    ) {
      const timeDifference =
        this.checkOut()?.getTime()! - this.checkIn()?.getTime()!;
      return Math.ceil(timeDifference / (1000 * 3600 * 24));
    }
    return 0;
  });

  totalPrice = computed(() => {
    if (this.numberOfDays()) {
      return (this.room()?.price || 1000) * this.numberOfDays();
    }
    return this.room()?.price;
  });

  mincheckout = computed(() => {
    if (this.checkIn()) {
      const inDate = this.checkIn();
      if (!isNaN(inDate!.getTime())) {
        inDate!.setDate(inDate!.getDate() + 1);
        return this.datePipe.transform(inDate, 'yyyy-MM-dd') || '';
      }
    }
    return this.datePipe.transform(new Date(), 'yyyy-MM-dd') || '';
  });

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id') || '';
      this.id.set(id);
    });
    this.fetchRoom();
    this.getReservedDates();

    this.bsConfig = {
      isAnimated: true,
      dateInputFormat: 'YYYY-MM-DD',
      datesDisabled: this.reservedDates,
    };
  }

  fetchRoom() {
    this.hotelService.filterRoomsById(this.id()).subscribe({
      next: (room) => {
        this.room.set(room);
      },
      error: (err) => console.error('Error fetching rooms', err),
    });
  }

  onGuestChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.guest.set(selectElement.value);
  }

  getReservedDates() {
    this.detailsService.getReservedDates(this.id()).subscribe({
      next: (data) => {
        this.reservedDates = data.map((d) => new Date(d));
        this.bsConfig.datesDisabled = this.reservedDates;
      },
      error(err) {
        console.error('Error fetching reserved dates:', err);
      },
    });
  }

  onDateRangeChange(dates: Date[]) {
    if (dates.length === 2) {
      this.checkIn.set(dates[0]);
      this.checkOut.set(dates[1]);
    }
  }

  onSubmit(form: any) {
    const checkIn = this.datePipe.transform(this.checkIn(), 'yyyy-MM-dd') || '';
    const checkOut =
      this.datePipe.transform(this.checkOut(), 'yyyy-MM-dd') || '';

    if (localStorage.getItem('token')) {
      this.detailsService.isReserved(this.id(), checkIn!, checkOut!).subscribe({
        next: (data) => {
          localStorage.setItem('roomId', this.id());
          localStorage.setItem('checkout', checkOut!);
          localStorage.setItem('checkin', checkIn!);
          localStorage.setItem('guest', this.guest());
          localStorage.setItem('totalprice', `${this.totalPrice()}`);

          this.router.navigateByUrl('/checkout');
        },
        error: (err) => {
          if (err.status === 400) {
            this.toastr.error('Room is reserved at this range of date', '', {
              timeOut: 10000,
            });
          }
        },
      });
    } else {
      this.router.navigateByUrl('/account/login');
    }
  }
}
