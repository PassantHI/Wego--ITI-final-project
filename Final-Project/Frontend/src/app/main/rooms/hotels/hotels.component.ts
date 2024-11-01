import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { HotelsService } from '../../../_services/hotels.service';
import { HotelCardComponent } from '../hotel-card/hotel-card.component';
import { FormsModule, NgModel } from '@angular/forms';
import { NavbarComponent } from '../../../core/navbar/navbar.component';
import { HeaderComponent } from '../../../core/header/header.component';
import { SearchFormComponent } from '../search-from/search-form.component';
import { FooterComponent } from '../../../core/footer/footer.component';
import { RouterOutlet } from '@angular/router';
import { StoriessComponent } from "../../shared/storiess/storiess.component";
import { WhatWeOfferComponent } from "../../shared/what-we-offer/what-we-offer.component";
import { TripIdeasComponent } from "../../shared/trip-ideas/trip-ideas.component";
import { MobileAppComponent } from "../../shared/mobile-app/mobile-app.component";
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { Rooms } from '../../../_models/Rooms';

@Component({
  selector: 'app-hotels',
  standalone: true,
  imports: [
    HotelCardComponent,
    FormsModule,
    NavbarComponent,
    HeaderComponent,
    SearchFormComponent,
    FooterComponent,
    RouterOutlet,
    StoriessComponent,
    WhatWeOfferComponent,
    TripIdeasComponent,
    MobileAppComponent,
    PaginationModule
],
  templateUrl: './hotels.component.html',
  styleUrl: './hotels.component.css',
})
export class HotelsComponent implements OnInit {
  roomService = inject(HotelsService);
  paginatedRooms = signal<Rooms[]>([]);
  currentPage = signal(1);          
  itemsPerPage = 12;                 
  totalItems = signal(0);  

  constructor() {
    effect(() => {
      const rooms = this.roomService.hotels();
      if (rooms) {
        this.totalItems.set(rooms.length);
        this.paginateRooms();
      }
    },{ allowSignalWrites: true });
  }

  ngOnInit() {
    if (!this.roomService.hotels()) this.roomService.loadRooms();
  }
  // Function to paginate rooms based on the current page
paginateRooms(): void {
  const rooms = this.roomService.hotels();
  if (rooms) {
    const startIndex = (this.currentPage() - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedRooms.set(rooms.slice(startIndex, endIndex));
  }
}

// Event handler when page changes
onPageChange(event: any): void {
  this.currentPage.set(event.page);
  this.paginateRooms();
}
}
