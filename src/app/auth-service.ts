import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http
      .post<{ token: string }>('http://localhost:3000/api/auth/csrf', {
        email,
        password,
      })
      .pipe(
        tap((user) => {
          console.log('user', user);
          localStorage.setItem('authToken', user.token);
        }),
      );
  }

  isAuthenticated(): boolean {
    this.http.get('https://dev.velofinder.pl/api', { withCredentials: true }).subscribe({
      next: (response) => {
        console.log('Authentication validated:', response);
      },
      error: (error) => {
        console.error('Authentication validation failed:', error);
      },
    });

    return true;
  }
}
