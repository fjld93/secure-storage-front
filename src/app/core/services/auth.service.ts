import { inject, Injectable, Signal, signal } from '@angular/core';
import { User } from '@models/user.model';
import { environment } from '../../../environments/environment';
import { LoginRequest } from '@models/auth/login-request.model';
import { RegisterRequest } from '@models/auth/register-request.model';
import { AuthResponse } from '@models/auth/auth-response.model';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http: HttpClient = inject(HttpClient);

  private readonly baseUrl = environment.apiUrl;
  private readonly TOKEN_KEY = 'auth_token';
  private _user = signal<User | null>(null);
  readonly user = this._user;

  constructor() {

    const username = this._getUsernameFromToken();
    this._user.set(username ? { username } : null);

  }

  login(credentials: LoginRequest): Observable<void> {

    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/login`, credentials).pipe(
      tap(res => {
        sessionStorage.setItem(this.TOKEN_KEY, res.token);
        this._user.set({ "username": credentials.username });
      }),
      map(() => void 0),

      catchError(err => {
        console.error('Login failed:', err);
        return throwError(() => new Error('Login failed. Please check your credentials.'));
      })
    );
  }

  register(data: RegisterRequest): Observable<void> {

    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/register`, data).pipe(
      tap(res => {
        sessionStorage.setItem(this.TOKEN_KEY, res.token);
        this._user.set({ "username": data.username });
      }),
      map(() => void 0),

      catchError(err => {
        console.error('Register failed:', err);
        return throwError(() => new Error('Registration failed. Please try again.'));
      })
    );
  }

  logout(): void {

    sessionStorage.removeItem(this.TOKEN_KEY);
    this._user.set(null);
  }

  isLoggedIn(): boolean {

    return !!sessionStorage.getItem(this.TOKEN_KEY);
  }

  private _getUsernameFromToken(): string | null {

    const token = sessionStorage.getItem(this.TOKEN_KEY);

    if (!token) return null;

    try {
      const payloadB64 = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payloadB64));
      return decodedPayload.sub ?? null;

    } catch (err) {
      return null;
    }
  }

}
