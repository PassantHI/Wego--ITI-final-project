import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { GenericResponse } from '../_models/generic-response';
import { GetAirline } from '../_models/Airline/get-airline';

@Injectable({
  providedIn: 'root',
})
export class AirlineService {
  private readonly apiUrl = `https://localhost:7024/api/Airlines`;
  private client = inject(HttpClient);

  getAirlines(pageIndex: number, pageSize: number) {
    return this.client.get<GenericResponse<GetAirline>>(
      this.apiUrl + `?pageIndex=${pageIndex}&pageSize=${pageSize}`
    );
  }
  getAirlineById(id: number) {
    return this.client.get<GetAirline>(this.apiUrl + `/${id}`);
  }
  addNewAirline(formData: FormData) {
    return this.client.post<GetAirline>(this.apiUrl, formData);
  }
  updateAirline(id: number, formData: FormData) {
    return this.client.put<GetAirline>(this.apiUrl + `/${id}`, formData);
  }
  deleteAirline(id: number) {
    return this.client.delete<void>(this.apiUrl + `/${id}`);
  }
}
