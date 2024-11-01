import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CarouselModule } from 'ngx-bootstrap/carousel';
import { Rooms } from '../../../_models/Rooms';
import { HotelsService } from '../../../_services/hotels.service';

@Component({
  selector: 'app-room-details',
  standalone: true,
  imports: [CarouselModule],
  templateUrl: './room-details.component.html',
  styleUrl: './room-details.component.css',
})
export class RoomDetailsComponent implements OnInit {
  route = inject(ActivatedRoute);
  roomService = inject(HotelsService);
  room = signal<Rooms | undefined>(undefined);

  id = signal<string>('');

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id') || '';
      this.id.set(id);
    });

    this.fetchRoom();
  }

  fetchRoom() {
    this.roomService.filterRoomsById(this.id()).subscribe({
      next: (room) => {
        this.room.set(room);
        console.log(this.room());
      },
      error: (err) => console.error('Error fetching rooms', err),
    });
  }
}
