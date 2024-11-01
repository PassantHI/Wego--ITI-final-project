import { inject, Injectable } from '@angular/core';
import { GetAirport } from '../_models/Airport/get-airport';
import { HttpClient } from '@angular/common/http';
import { PostAirport } from '../_models/Airport/post-airport';
import { PutAirport } from '../_models/Airport/put-airport';
import { GenericResponse } from '../_models/generic-response';

@Injectable({
  providedIn: 'root',
})
export class AirportService {
  private readonly apiUrl = `https://localhost:7024/api/Airports`;
  private client = inject(HttpClient);

  getAirports(pageIndex: number, pageSize: number) {
    return this.client.get<GenericResponse<GetAirport>>(
      this.apiUrl + `?pageIndex=${pageIndex}&pageSize=${pageSize}`
    );
  }
  getAirportById(id: number) {
    return this.client.get<GetAirport>(this.apiUrl + `/${id}`);
  }
  addNewAirport(formData: PostAirport) {
    return this.client.post<GetAirport>(this.apiUrl, formData);
  }
  updateAirport(id: number, formData: PutAirport) {
    return this.client.put<GetAirport>(this.apiUrl + `/${id}`, formData);
  }
  deleteAirport(id: number) {
    return this.client.delete<void>(this.apiUrl + `/${id}`);
  }
}
