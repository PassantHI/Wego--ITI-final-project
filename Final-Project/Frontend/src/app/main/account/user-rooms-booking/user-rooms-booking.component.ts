import { Component, inject, OnInit } from '@angular/core';
import { DetailsService } from '../../../_services/details.service';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-rooms-booking',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './user-rooms-booking.component.html',
  styleUrl: './user-rooms-booking.component.css'
})
export class UserRoomsBookingComponent implements OnInit  {

  service=inject(DetailsService);

  ngOnInit(): void {
    if(!this.service.booking())this.service.getUserBooking();
    
  }

}
