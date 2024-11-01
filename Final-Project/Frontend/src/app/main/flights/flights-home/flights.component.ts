import { Component } from '@angular/core';
import { HeaderComponent } from '../../../core/header/header.component';
import { SearchFormComponent } from '../search-form/search-form.component';
import { WhatWeOfferComponent } from '../../shared/what-we-offer/what-we-offer.component';
import { StoriessComponent } from '../../shared/storiess/storiess.component';
import { PopularAirlinesComponent } from '../popular-airlines/popular-airlines.component';
import { TravelPartnersComponent } from '../travel-partners/travel-partners.component';
import { TripIdeasComponent } from '../../shared/trip-ideas/trip-ideas.component';
import { MobileAppComponent } from '../../shared/mobile-app/mobile-app.component';
import { NavbarComponent } from '../../../core/navbar/navbar.component';
import { FooterComponent } from '../../../core/footer/footer.component';

@Component({
  selector: 'app-flights',
  standalone: true,
  imports: [
    HeaderComponent,
    SearchFormComponent,
    WhatWeOfferComponent,
    StoriessComponent,
    PopularAirlinesComponent,
    TravelPartnersComponent,
    TripIdeasComponent,
    MobileAppComponent,
    NavbarComponent,
    FooterComponent,
  ],
  templateUrl: './flights.component.html',
  styleUrl: './flights.component.css',
})
export class FlightsComponent {}
