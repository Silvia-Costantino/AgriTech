// src/app/services/auth/auth.ts
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Utente } from '../../models/utente';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  // 🔁 Utente corrente esposto in modo pubblico e osservabile
  private userSubject = new BehaviorSubject<Utente | null>(null);
  public user$: Observable<Utente | null> = this.userSubject.asObservable();

  private readonly api = 'http://localhost:8080/api/auth';
  private readonly tokenKey = 'jwt_agritech';
  private readonly roleKey = 'role_agritech';

  private get storage() {
    return isPlatformBrowser(this.platformId) ? globalThis.localStorage : null;
  }

  constructor() {
    // 🔹 Al caricamento, se c’è un token valido, ricostruisce lo stato utente
    const token = this.getToken();
    if (token) {
      const role = this.getRole();
      this.userSubject.next({
        id: 0,
        nome: '',
        cognome: '',
        email: '',
        ruolo: role as any
      } as Utente);
    }
  }

  login(data: any) {
    return this.http.post<{ token: string; user?: { id?: number; email: string; nome?: string; cognome?: string; ruolo: string }; ruolo?: string; email?: string }>(`${this.api}/login`, data).pipe(
      tap(res => {
        this.storage?.setItem(this.tokenKey, res.token);
        const roleFromResponse = res.user?.ruolo ?? (res.ruolo as any);
        if (roleFromResponse) {
          this.storage?.setItem(this.roleKey, roleFromResponse);
        }
        // ✅ Usa res.user se disponibile, altrimenti costruisce l'oggetto da ruolo ed email
        const user: Utente = res.user ? {
          id: res.user.id,
          email: res.user.email,
          nome: res.user.nome,
          cognome: res.user.cognome,
          ruolo: res.user.ruolo as any
        } : {
          id: 0,
          email: res.email || '',
          nome: '',
          cognome: '',
          ruolo: (res.ruolo as any) || 'CLIENTE'
        };
        this.userSubject.next(user);
      })
    );
  }

  register(data: any) {
    return this.http.post(`${this.api}/register`, data);
  }

  logout() {
    this.storage?.removeItem(this.tokenKey);
    this.storage?.removeItem(this.roleKey);
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return this.storage?.getItem(this.tokenKey) ?? null;
  }

  /** Ritorna lo stream dell’utente corrente */
  currentUser(): Observable<Utente | null> {
    return this.user$;
  }

  private parseJwt(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return null;
    }
  }

  getRole(): 'SOCIO' | 'DIPENDENTE' | 'CLIENTE' | null {
    const storedRole = this.storage?.getItem(this.roleKey) as 'SOCIO' | 'DIPENDENTE' | 'CLIENTE' | null | undefined;
    if (storedRole) return storedRole;

    const t = this.getToken();
    if (!t) return null;
    const payload = this.parseJwt(t);
    return payload?.role || payload?.roles?.[0] || null;
  }
}
