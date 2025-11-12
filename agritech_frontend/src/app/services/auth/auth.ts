import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router';
import { Utente } from '../../models/utente';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private user$ = new BehaviorSubject<Utente | null>(null);
  private readonly api = 'http://localhost:8080/api/auth';
  private readonly tokenKey = 'jwt_agritech';

  login(data: any) {
    return this.http.post<{ token: string; user: Utente }>(`${this.api}/login`, data).pipe(
      tap(res => {
        localStorage.setItem(this.tokenKey, res.token);
        this.user$.next(res.user);
      })
    );
  }

  register(data: any) {
    return this.http.post(`${this.api}/register`, data);
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this.user$.next(null);
    this.router.navigate(['/login']);
  }

  getToken() { return localStorage.getItem(this.tokenKey); }

  currentUser() { return this.user$.asObservable(); }

  private parseJwt(token: string): any {
    try { return JSON.parse(atob(token.split('.')[1])); } catch { return null; }
  }

  getRole(): 'SOCIO'|'DIPENDENTE'|'CLIENTE'|null {
    const t = this.getToken();
    if (!t) return null;
    const payload = this.parseJwt(t);
    return payload?.role || payload?.roles?.[0] || null; // adatta alla tua claim
  }
}
