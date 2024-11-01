import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoggedInSubject: BehaviorSubject<boolean>;

  public isLoggedIn$: Observable<boolean>;

  constructor(private http: HttpClient) {
    const storedLoginStatus = localStorage.getItem('isLoggedIn');
    const isLoggedIn = storedLoginStatus === 'true';
    this.isLoggedInSubject = new BehaviorSubject<boolean>(isLoggedIn);
    this.isLoggedIn$ = this.isLoggedInSubject.asObservable();
  }

  url = 'https://localhost:7024/api/Account/';

  register(formData: any) {
    return this.http.post(this.url + 'register', formData);
  }

  login(formData: any) {
    return this.http.post(this.url + 'Login', formData);
  }
  successLog() {
    this.isLoggedInSubject.next(true);
    localStorage.setItem('isLoggedIn', 'true');
    const token = localStorage.getItem('token');
    if (token) {
    }
  }
  logout() {
    this.isLoggedInSubject.next(false);
    localStorage.removeItem('isLoggedIn');
  }
  get isLoggedIn(): boolean {
    return this.isLoggedInSubject.value;
  }

  changePassword(formData: any) {
    return this.http.post(this.url + `ChangePassword`, formData);
  }

  forgetPassword(formData: any) {
    return this.http.post(this.url + `ForgetPassword`, formData);
  }

  resetPassword(data: any) {
    return this.http.post(this.url + `ResetPassword`, data);
  }
}
