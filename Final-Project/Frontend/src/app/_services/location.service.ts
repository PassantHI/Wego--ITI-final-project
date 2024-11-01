import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { GenericResponse } from '../_models/generic-response';
import { CategoryLocation } from '../_models/Category/category-location';
import { GetLocation } from '../_models/Location/get-location';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private readonly apiUrl = `https://localhost:7024/api/Locations`;
  private client = inject(HttpClient);

  getLocations() {
    return this.client.get<GetLocation[]>(this.apiUrl);
  }
  getLocationById(id: number) {
    return this.client.get<GetLocation>(this.apiUrl + `/${id}`);
  }
  newLocation(formData: FormData) {
    return this.client.post(this.apiUrl, formData);
  }
  updateLocation(id: number, formData: FormData) {
    return this.client.put(this.apiUrl + `/${id}`, formData);
  }
  deleteLocation(id: number) {
    return this.client.delete(this.apiUrl + `/${id}`);
  }
}
