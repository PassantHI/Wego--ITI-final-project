import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericResponse } from '../_models/generic-response';
import { GetAirplane } from '../_models/airplane/get-airplane';
import { PostAirplane } from '../_models/airplane/post-airplane';
import { PutAirplane } from '../_models/airplane/put-airplane';
@Injectable({
  providedIn: 'root',
})
export class AirplaneService {
  private readonly apiUrl = `https://localhost:7024/api/Airplanes`;
  private client = inject(HttpClient);

  getAirplanes(pageIndex: number, pageSize: number) {
    return this.client.get<GenericResponse<GetAirplane>>(
      this.apiUrl + `?pageIndex=${pageIndex}&pageSize=${pageSize}`
    );
  }
  getAirplaneById(id: number) {
    return this.client.get<GetAirplane>(this.apiUrl + `/${id}`);
  }
  addNewAirplane(formData: PostAirplane) {
    return this.client.post<GetAirplane>(this.apiUrl, formData);
  }
  updateAirplane(id: number, formData: PutAirplane) {
    return this.client.put<GetAirplane>(this.apiUrl + `/${id}`, formData);
  }
  deleteAirplane(id: number) {
    return this.client.delete<void>(this.apiUrl + `/${id}`);
  }
}
