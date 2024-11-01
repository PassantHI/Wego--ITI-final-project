import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { GenericResponse } from '../_models/generic-response';
import { GetTerminal } from '../_models/terminal/get-terminal';
import { PostTerminal } from '../_models/terminal/post-terminal';
import { PutTerminal } from '../_models/terminal/put-terminal';

@Injectable({
  providedIn: 'root',
})
export class TerminalService {
  private readonly apiUrl = `https://localhost:7024/api/terminals`;

  private client = inject(HttpClient);

  getTerminals(pageIndex: number, pageSize: number) {
    return this.client.get<GenericResponse<GetTerminal>>(
      this.apiUrl + `?pageIndex=${pageIndex}&pageSize=${pageSize}`
    );
  }
  getTerminalById(id: number) {
    return this.client.get<GetTerminal>(this.apiUrl + `/${id}`);
  }
  addNewTerminal(formData: PostTerminal) {
    return this.client.post<GetTerminal>(this.apiUrl, formData);
  }
  updateTerminal(id: number, formData: PutTerminal) {
    return this.client.put<GetTerminal>(this.apiUrl + `/${id}`, formData);
  }
  deleteTerminal(id: number) {
    return this.client.delete<void>(this.apiUrl + `/${id}`);
  }
}
