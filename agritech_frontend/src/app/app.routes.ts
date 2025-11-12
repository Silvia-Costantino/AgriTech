import { Routes } from '@angular/router';

// Componenti principali
import { HomePage } from './pages/home/home';
import { CatalogoPage } from './pages/catalogo/catalogo';
import { OrdiniPage } from './pages/ordini/ordini';
import { CarrelloPage } from './pages/carrello/carrello';
import { ProfiloPage } from './pages/profilo/profilo';

// Autenticazione
import { LoginComponent } from './auth/login/login';
import { RegisterComponent } from './auth/register/register';

// Sezioni amministrative (SOCIO / DIPENDENTE)
import { DipendentiPage } from './pages/dipendenti/dipendenti';
import { TurniPage } from './pages/dipendenti/turni';
import { FeriePage } from './pages/dipendenti/ferie';
import { BustePagaPage } from './pages/dipendenti/buste-paga';
import { FornitoriPage } from './pages/fornitori/fornitori';
import { ContabilitaPage } from './pages/contabilita/contabilita';
import { OfficinaPage } from './pages/officina/officina';
import { RicambiPage } from './pages/officina/ricambi';

// Guards
import { AuthGuard } from './guards/auth-guard';
import { RoleGuard } from './guards/role-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomePage },
  { path: '**', redirectTo: 'home' },

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  { path: 'catalogo', component: CatalogoPage, canActivate: [AuthGuard] },
  { path: 'ordini', component: OrdiniPage, canActivate: [AuthGuard, RoleGuard], data: { roles: ['SOCIO', 'DIPENDENTE'] } },

  // Area Cliente
  { path: 'carrello', component: CarrelloPage, canActivate: [AuthGuard, RoleGuard], data: { roles: ['CLIENTE'] } },
  { path: 'profilo', component: ProfiloPage, canActivate: [AuthGuard] },

  // === AREA ADMIN (SOCIO / DIPENDENTE) ===
  { path: 'dipendenti', component: DipendentiPage, canActivate: [AuthGuard, RoleGuard], data: { roles: ['SOCIO'] } },
  { path: 'dipendenti/turni', component: TurniPage, canActivate: [AuthGuard, RoleGuard], data: { roles: ['SOCIO'] } },
  { path: 'dipendenti/ferie', component: FeriePage, canActivate: [AuthGuard, RoleGuard], data: { roles: ['SOCIO'] } },
  { path: 'dipendenti/buste-paga', component: BustePagaPage, canActivate: [AuthGuard, RoleGuard], data: { roles: ['SOCIO'] } },

  { path: 'fornitori', component: FornitoriPage, canActivate: [AuthGuard, RoleGuard], data: { roles: ['SOCIO'] } },
  { path: 'contabilita', component: ContabilitaPage, canActivate: [AuthGuard, RoleGuard], data: { roles: ['SOCIO'] } },

  { path: 'officina', component: OfficinaPage, canActivate: [AuthGuard, RoleGuard], data: { roles: ['SOCIO', 'DIPENDENTE'] } },
  { path: 'officina/ricambi', component: RicambiPage, canActivate: [AuthGuard, RoleGuard], data: { roles: ['SOCIO', 'DIPENDENTE'] } },

  // Fallback
  { path: '**', redirectTo: 'home' }
];
