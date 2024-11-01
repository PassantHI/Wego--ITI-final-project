import { HttpClient } from '@angular/common/http';
import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HotelsService } from '../../../_services/hotels.service';
import { Rooms } from '../../../_models/Rooms';
import { BookingService } from '../../../_services/booking.service';
import { DetailsService } from '../../../_services/details.service';
import { Booking } from '../../../_models/booking';
import { Details } from '../../../_models/details';
import { PaymentService } from '../../../_services/payment.service';
import { CheckoutDto } from '../../../_models/checkoutDto';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent implements OnInit {
  bookService = inject(BookingService);
  detailsService = inject(DetailsService);
  private client: HttpClient = inject(HttpClient);
  private router = inject(Router);
  hotelService = inject(HotelsService);
  private readonly paymentService = inject(PaymentService);
  room = signal<Rooms | undefined>(undefined);
  checkout = localStorage.getItem('checkout');
  checkin = localStorage.getItem('checkin');
  guests = localStorage.getItem('guest');
  totalPriceString = localStorage.getItem('totalprice');
  totalPrice = this.totalPriceString ? parseInt(this.totalPriceString) : 0;
  roomId = localStorage.getItem('roomId');

  ngOnInit(): void {
    this.fetchRoom();
  }
  fetchRoom() {
    this.hotelService.filterRoomsById(this.roomId!).subscribe({
      next: (room) => {
        this.room.set(room);
      },
      error: (err) => {
        console.error('Error fetching rooms', err);
        this.router.navigateByUrl('/rooms');
      },
    });
  }

  checkOut() {
    const book: Booking = { totalPrice: this.totalPrice };
    const details: Details = {
      roomId: this.roomId!,
      checkin: this.checkin!,
      checkout: this.checkout!,
      guests: this.guests!,
      booking: book,
    };

    this.detailsService.creatRoomDetails(details).subscribe({
      next: (res) => {
        if (this.totalPrice && this.roomId && this.room()) {
          const bookingIds = [res.bookId.toString()];
          const amount = this.totalPrice;
          const checkoutData = new CheckoutDto(
            'rooms',
            'http://localhost:4200/hotels/',
            bookingIds,
            amount,
            `${this.room()?.roomTitle}`,
            1,
            this.room()?.roomDescribtion,
            this.room()?.images.map((i) => i.url)
          );
          this.paymentService.payNow(checkoutData).subscribe({
            next: (res) => {
              window.location.href = res.url;
            },
          });
        }
      },
      error(err) {
        console.log(err);
      },
    });
  }
}
