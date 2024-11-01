import { Component, inject, input, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { HotelsService } from '../../../_services/hotels.service';

@Component({
  selector: 'app-delete-room',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './delete-room.component.html',
  styleUrl: './delete-room.component.css',
})
export class DeleteRoomComponent {
  id = input.required<string>();
  roomService = inject(HotelsService);
  router = inject(Router);

  delete() {
    this.roomService.deleteRoom(this.id()).subscribe({
      next: () => {
        this.router.navigateByUrl('dashboard/rooms');
      },
      error: (err) => console.log(err),
    });
  }
}
