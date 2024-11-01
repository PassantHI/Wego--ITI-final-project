import {
  Component,
  computed,
  effect,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { HotelsService } from '../../../_services/hotels.service';
import { ActivatedRoute } from '@angular/router';
import { HotelCardComponent } from '../hotel-card/hotel-card.component';
import { Rooms } from '../../../_models/Rooms';

@Component({
  selector: 'app-hotel-filter',
  standalone: true,
  imports: [HotelCardComponent],
  templateUrl: './hotel-filter.component.html',
  styleUrl: './hotel-filter.component.css',
})

/*export class HotelFilterComponent{
  hotelService = inject(HotelsService);
  route = inject(ActivatedRoute);
  
  country = input.required<string>();
  roomType = input.required<string>();
   
  rooms = computed(() => {
    let roomList: Rooms[] = [];
    this.hotelService.filterRooms(this.country(), this.roomType()).subscribe({
      next: rooms => roomList = rooms
    });
    return roomList;
  });
}*/
export class HotelFilterComponent implements OnInit {
  hotelService = inject(HotelsService);
  route = inject(ActivatedRoute);

  // Use signals for country and roomType
  country = signal<string>('');
  roomType = signal<string>('');

  // Create a signal for the rooms list
  rooms = signal<Rooms[]>([]);

  ngOnInit() {
    // Get the parameters from the route on component initialization

    this.route.queryParamMap.subscribe((queryParams) => {
      const roomType = queryParams.get('roomType') || '';
      this.roomType.set(roomType);

      this.route.paramMap.subscribe((params) => {
        const country = params.get('country') || '';
        this.country.set(country);
        this.fetchRooms();
      });

      // Fetch rooms whenever country or roomType changes
    });
  }

  // Fetch rooms based on country and roomType
  fetchRooms() {
    this.hotelService.filterRooms(this.country(), this.roomType()).subscribe({
      next: (rooms) => this.rooms.set(rooms),
      error: (err) => console.error('Error fetching rooms', err),
    });
  }
}
