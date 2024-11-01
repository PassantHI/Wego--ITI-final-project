import { inject, Injectable, signal } from '@angular/core';
import { Rooms } from '../_models/Rooms';
import { HttpClient } from '@angular/common/http';
import { map, of, retry, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HotelsService {
  hotels = signal<Rooms[] | undefined>(undefined);
  httpClient = inject(HttpClient);
  private readonly port = 7024;

  loadRooms() {
    this.httpClient
      .get<Rooms[]>(`https://localhost:${this.port}/api/Rooms`)
      .subscribe({
        next: (value) => this.hotels.set(value),
        error: (error) => console.log(error),
        complete: () => {},
      });
  }

  filterRooms(country: string, roomType: string) {
    console.log(country);
    const room = this.hotels()?.filter(
      (x) =>
        x.roomAddress.toLowerCase().includes(country.toLowerCase()) &&
        (!roomType || x.roomType.toString() === roomType)
    );
    if (room) {
      return of(room);
    } else {
      return this.httpClient.get<Rooms[]>(
        `https://localhost:${this.port}/api/Rooms/filter/` +
          country.toLowerCase() +
          '?' +
          'type=' +
          roomType
      );
    }
  }

  filterRoomsById(id: string) {
    const room = this.hotels()?.find(
      (x) => x.roomID && x.roomID.toString() === id
    );
    if (room) {
      return of(room);
    } else {
      return this.httpClient.get<Rooms>(
        `https://localhost:${this.port}/api/Rooms/` + id
      );
    }
  }

  //dashboard/room/create
  CreateRoom(room: Rooms) {
    return this.httpClient
      .post<number>(
        `https://localhost:${this.port}/api/rooms/dashboard/room/create`,
        room
      )
      .pipe(
        map((roomId) => {
          const newRoom = { ...room, roomID: roomId };
          const rooms = this.hotels();
          if (rooms && rooms.length > 0) {
            const newRoomArray = [...rooms, newRoom];
            this.hotels.set(newRoomArray);
          }
        })
      );
  }

  //dashboard/room/{id}
  updateRoom(room: Rooms, id: string) {
    return this.httpClient
      .put(
        `https://localhost:${this.port}/api/rooms/dashboard/room/` + id,
        room
      )
      .pipe(
        tap(() => {
          this.hotels.update((oldRooms) =>
            oldRooms?.map((oldRoom) =>
              oldRoom.roomID?.toString() === id ? room : oldRoom
            )
          );
        })
      );
  }

  //"dashboard/delete/{id}"
  deleteRoom(id: string) {
    return this.httpClient
      .delete(`https://localhost:${this.port}/api/rooms/dashboard/delete/` + id)
      .pipe(
        tap(() => {
          this.hotels.update((oldRooms) =>
            oldRooms?.filter((oldroom) => oldroom.roomID?.toString() != id)
          );
        })
      );
  }
}
