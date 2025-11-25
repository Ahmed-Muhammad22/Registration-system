
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environement';
import { CompanyRegistrationRequest, LoginRequest, LoginResponse, SendOtpRequest, SetPasswordRequest } from '../../../Shared/Models/company.model'
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  constructor(private httpClient: HttpClient) {}
  private readonly _Router = inject(Router);
  userData: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return token
      ? new HttpHeaders().set('Authorization', `Bearer ${token}`)
      : new HttpHeaders();
  }

  // ----------------- SIGNUP -----------------
  getSignup(data: CompanyRegistrationRequest) {
  return this.httpClient.post(
    'http://dev-stsandbox.rookierise.org/api/CompanyPortal/signUp-Company',
    data,
    {
      headers: { 'Content-Type': 'application/json' }
    }
  );
}

  // ----------------- LOGIN -----------------
  getLogin(data: LoginRequest): Observable<LoginResponse> {
    return this.httpClient.post<LoginResponse>(environment.baseUrl + 'CompanyPortal/AccountPortal/login', data);
  }

  // ----------------- SAVE USER DATA -----------------
  saveUserData(): void {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        this.userData.next(decodedUser);
        console.log('Decoded User:', decodedUser);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    } else {
      console.warn('No user token found in localStorage');
    }
  }

  // ----------------- LOGOUT -----------------
  logOut(): void {
    localStorage.removeItem('token');
    this.userData.next(null);
    this._Router.navigate(['/login']);
  }

  // ----------------- UPLOAD LOGO -----------------
  uploadLogo(companyId: number, logoFile: File): Observable<any> {
    const formData = new FormData();
    formData.append('logoFile', logoFile);

    const headers = this.getAuthHeaders();

    return this.httpClient.post(
      `${environment.baseUrl}/File/upload-logo/${companyId}`,
      formData,
      { headers }
    );
  }

  // ----------------- FORGOT PASSWORD -----------------
  forgetPassword(data: SendOtpRequest): Observable<any> {
    return this.httpClient.post(environment.baseUrl + 'AccountPortal/forget-password-portal', data);
  }

  // ----------------- RESEND OTP -----------------
  resendOtp(data: SendOtpRequest): Observable<any> {
    return this.httpClient.post(environment.baseUrl + 'AccountPortal/resend-otp-portal', data);
  }

  // ----------------- SET PASSWORD -----------------
  setPassword(data: SetPasswordRequest): Observable<any> {
    return this.httpClient.post(environment.baseUrl + 'AccountPortal/setpassword', data);
  }


 
}
