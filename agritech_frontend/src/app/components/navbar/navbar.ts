import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <nav class="navbar">
      <div class="nav-left">
        <a routerLink="/home" class="logo">🌿 AgriTech</a>
        <a routerLink="/catalogo" *ngIf="isLogged">Catalogo</a>

        <!-- CLIENTE -->
        <a routerLink="/carrello" *ngIf="role==='CLIENTE'">Carrello</a>
        <a routerLink="/ordini" *ngIf="role==='CLIENTE'">Ordini</a>

        <!-- DIPENDENTE -->
        <a routerLink="/ordini" *ngIf="role==='DIPENDENTE'">Ordini</a>
        <a routerLink="/officina" *ngIf="role==='DIPENDENTE'">Officina</a>

        <!-- SOCIO -->
        <a routerLink="/ordini" *ngIf="role==='SOCIO'">Ordini</a>
        <a routerLink="/officina" *ngIf="role==='SOCIO'">Officina</a>
        <a routerLink="/fornitori" *ngIf="role==='SOCIO'">Fornitori</a>
        <a routerLink="/dipendenti" *ngIf="role==='SOCIO'">Dipendenti</a>
        <a routerLink="/contabilita" *ngIf="role==='SOCIO'">Contabilità</a>
      </div>

      <div class="nav-right">
        <ng-container *ngIf="isLogged; else guest">
          <span class="user">{{userName}} ({{role}})</span>
          <button (click)="logout()">Logout</button>
        </ng-container>
        <ng-template #guest>
          <a routerLink="/login">Login</a>
          <a routerLink="/register">Registrati</a>
        </ng-template>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 24px;
      background: #2e7d32;
      color: white;
      flex-wrap: wrap;
    }
    .logo {
      font-weight: bold;
      color: #fff;
      margin-right: 16px;
      text-decoration: none;
      font-size: 1.2rem;
    }
    .nav-left a {
      color: white;
      text-decoration: none;
      margin-right: 12px;
      font-weight: 500;
      transition: color .2s;
    }
    .nav-left a:hover { color: #c8e6c9; }
    .nav-right {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .user { font-style: italic; }
    button {
      background: #fff;
      color: #2e7d32;
      border: none;
      padding: 6px 10px;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
    }
    button:hover { background: #c8e6c9; }
    @media (max-width: 768px) {
      .navbar { flex-direction: column; align-items: flex-start; }
      .nav-left, .nav-right { margin-top: 8px; }
    }
  `]
})
export class NavbarComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  role: string | null = null;
  userName: string | null = null;
  isLogged = false;

  constructor() {
    const token = this.auth.getToken();
    this.isLogged = !!token;
    this.role = this.auth.getRole();
    const user = (this.auth as any).user$?.value || null;
    if (user) this.userName = `${user.nome || ''} ${user.cognome || ''}`.trim();
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
