import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';

export interface ProfiloDTO {
  id?: number;
  email: string;
  nome?: string;
  cognome?: string;
  telefono?: string;
  indirizzo?: string;
}

export interface FinanziamentoDTO { id: number; clienteId: number; importoTotale: number; importoRata: number; numeroRate: number; stato: 'ATTIVO'|'COMPLETATO'; }
export interface PreventivoDTO { id: number; descrizione: string; totale: number; data: string; stato: 'APERTO'|'ACCETTATO'|'SCADUTO'; }

@Injectable({ providedIn: 'root' })
export class AccountService {
  private http = inject(HttpClient);
  private base = 'http://localhost:8080/api';

  me() { return this.http.get<ProfiloDTO>(`${this.base}/account/me`); }
  updateMe(payload: Partial<ProfiloDTO>) { return this.http.put<ProfiloDTO>(`${this.base}/account/me`, payload); }
  changePassword(oldPassword: string, newPassword: string) {
    return this.http.put<{ message: string }>(`${this.base}/account/password`, { oldPassword, newPassword });
  }
  deleteAccount() { return this.http.delete<{ message: string }>(`${this.base}/account`); }

  finanziamentiCliente() {
    // prova endpoint dedicato, altrimenti fallback demo
    return this.http.get<FinanziamentoDTO[]>(`${this.base}/finanziamenti/miei`).pipe(
      catchError(() => of<FinanziamentoDTO[]>([
        { id: 1, clienteId: 0, importoTotale: 12000, importoRata: 400, numeroRate: 30, stato: 'ATTIVO' },
        { id: 2, clienteId: 0, importoTotale: 2500, importoRata: 250, numeroRate: 10, stato: 'COMPLETATO' }
      ]))
    );
  }
  preventiviCliente() {
    return this.http.get<PreventivoDTO[]>(`${this.base}/preventivi/miei`).pipe(
      catchError(() => of<PreventivoDTO[]>([
        { id: 10, descrizione: 'Trattore Serie X - Config A', totale: 18500, data: '2025-05-12', stato: 'APERTO' },
        { id: 11, descrizione: 'Kit attrezzi + Manutenzione', totale: 980, data: '2025-05-20', stato: 'SCADUTO' }
      ]))
    );
  }
}

