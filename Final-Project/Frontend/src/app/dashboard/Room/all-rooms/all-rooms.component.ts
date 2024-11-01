import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { HotelsService } from '../../../_services/hotels.service';
import { Rooms } from '../../../_models/Rooms';

@Component({
  selector: 'app-all-rooms',
  standalone: true,
  imports: [RouterOutlet,RouterLink],
  templateUrl: './all-rooms.component.html',
  styleUrl: './all-rooms.component.css'
})
export class AllRoomsComponent implements OnInit {
  roomService=inject(HotelsService)
  rooms=signal<Rooms[]|undefined>(undefined)
  
  ngOnInit() {
    if(!this.roomService.hotels()) {
      this.roomService.loadRooms();
    }
      
  }

  


}
