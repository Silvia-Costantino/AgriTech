// src/app/components/navbar/navbar.component.ts
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <nav class="navbar" *ngIf="showNavbar">
      <div class="nav-left">
        <a routerLink="/home" class="brand">
          <span class="icon">&#128668;</span>
          <div class="brand-text">
            <strong>AgriTech</strong>
            <small>Trattori e Soluzioni</small>
          </div>
        </a>

        <div class="nav-links" *ngIf="isLogged">
          <a routerLink="/catalogo">Catalogo</a>
          <a routerLink="/carrello" *ngIf="role==='CLIENTE'">Carrello</a>
          <a routerLink="/ordini/storico" *ngIf="role==='CLIENTE'">Storico ordini</a>
          <a routerLink="/profilo" *ngIf="role==='CLIENTE'">Account CLIENTE</a>
          <a routerLink="/ordini" *ngIf="role==='DIPENDENTE' || role==='SOCIO'">Ordini</a>
          <a routerLink="/officina" *ngIf="role==='DIPENDENTE' || role==='SOCIO'">Officina</a>
          <a routerLink="/clienti-preventivi" *ngIf="role==='SOCIO'">Clienti e Preventivi</a>
          <a routerLink="/dipendenti" *ngIf="role==='SOCIO'">Dipendenti</a>
          <a routerLink="/contabilita" *ngIf="role==='SOCIO'">Contabilità</a>
        </div>
      </div>

      <div class="nav-right">
        <ng-container *ngIf="isLogged; else guest">
          <div class="user-pill">
            <span class="user-name">{{ userName || 'Account' }}</span>
            <span class="role">{{ role }}</span>
          </div>
          <button (click)="logout()">Esci</button>
        </ng-container>
        <ng-template #guest>
          <a routerLink="/login" class="ghost">Accedi</a>
          <a routerLink="/register" class="cta">Registrati</a>
        </ng-template>
      </div>
    </nav>
  `,
  styles: [`
    nav { display:block; }
    .navbar {
      background: linear-gradient(110deg, #0e3f25 0%, #1f6c2e 55%, #2e9d37 100%);
      color: #fdfdfc;
      padding: 0.85rem clamp(1rem, 4vw, 2.5rem);
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1.5rem;
      box-shadow: 0 18px 30px rgba(14, 63, 37, 0.25);
      position: sticky;
      top: 0;
      z-index: 1000;
    }
    .nav-left { display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap; }
    .brand { display: inline-flex; align-items: center; gap: 0.65rem; text-decoration: none; color: inherit; }
    .icon { font-size: 1.6rem; }
    .brand-text strong { font-size: 1.15rem; letter-spacing: 0.05em; }
    .brand-text small { display: block; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.28em; opacity: 0.8; }
    .nav-links { display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; }
    .nav-links a { color: rgba(255, 255, 255, 0.88); text-decoration: none; font-weight: 600; font-size: 0.95rem; padding: 0.45rem 0.75rem; border-radius: 999px; transition: 0.2s; }
    .nav-links a:hover { background: rgba(255, 255, 255, 0.13); transform: translateY(-1px); }
    .nav-right { display: flex; align-items: center; gap: 0.85rem; flex-wrap: wrap; }
    .user-pill { background: rgba(255,255,255,0.12); border-radius: 999px; padding: 0.45rem 1.1rem; display: flex; align-items: center; gap: 0.65rem; }
    .role { background: rgba(241, 143, 28, 0.25); padding: 0.15rem 0.65rem; border-radius: 999px; font-size: 0.75rem; text-transform: uppercase; }
    button, .ghost, .cta { border-radius: 999px; font-weight: 700; padding: 0.55rem 1.4rem; cursor: pointer; border: none; }
    .ghost { color: #fff; border: 1px solid rgba(255,255,255,0.4); background: transparent; }
    .cta { background: linear-gradient(120deg, #f18f1c 0%, #ffa630 65%, #ffbe54 100%); color: #0e3f25; }
  `]
})
export class NavbarComponent implements OnInit, OnDestroy {
  private auth = inject(AuthService);
  private router = inject(Router);

  role: string | null = null;
  userName: string | null = null;
  isLogged = false;
  showNavbar = true;
  private sub?: Subscription;

  ngOnInit() {
    this.sub = this.auth.user$.subscribe(user => {
      this.isLogged = !!user;
      this.role = user?.ruolo || this.auth.getRole();
      this.userName = user ? `${user.nome || ''} ${user.cognome || ''}`.trim() : null;
      this.showNavbar = true;
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}


