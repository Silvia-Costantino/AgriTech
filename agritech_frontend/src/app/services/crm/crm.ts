import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';

export interface ClienteDTO { id: number; email: string; nome?: string; cognome?: string; telefono?: string; indirizzo?: string; }
export interface PreventivoDTO { id: number; cliente: ClienteDTO; modello: string; prezzo: number; sconto: number; validita: string; stato: 'APERTO'|'APPROVATO'|'RIFIUTATO'|'CONVERTITO'; }

@Injectable({ providedIn: 'root' })
export class CrmService {
  private http = inject(HttpClient);
  private base = 'http://localhost:8080/api';

  clienti(q?: string) {
    return this.http.get<ClienteDTO[]>(`${this.base}/clienti`, { params: q? { q }: {} }).pipe(
      catchError(() => of<ClienteDTO[]>([
        { id: 1001, email: 'mario.rossi@example.com', nome: 'Mario', cognome: 'Rossi', telefono: '+39 3331112233', indirizzo: 'Via Roma 10, Torino' },
        { id: 1002, email: 'laura.bianchi@example.com', nome: 'Laura', cognome: 'Bianchi', telefono: '+39 3334445566', indirizzo: 'Via Milano 22, Milano' },
        { id: 1003, email: 'giovanni.verdi@example.com', nome: 'Giovanni', cognome: 'Verdi', telefono: '+39 3337778899', indirizzo: 'Via Napoli 5, Napoli' }
      ]))
    );
  }
  updateCliente(id: number, payload: Partial<ClienteDTO>) { return this.http.put<ClienteDTO>(`${this.base}/clienti/${id}`, payload); }
  deleteCliente(id: number) { return this.http.delete(`${this.base}/clienti/${id}`); }
  preventivi() {
    return this.http.get<PreventivoDTO[]>(`${this.base}/preventivi`).pipe(
      catchError(() => of<PreventivoDTO[]>([
        { id: 1, cliente: { id: 1001, email: 'mario.rossi@example.com', nome: 'Mario', cognome: 'Rossi' }, modello: 'Trattore Serie X - Base', prezzo: 18500, sconto: 500, validita: new Date().toISOString().slice(0,10), stato: 'APERTO' },
        { id: 2, cliente: { id: 1001, email: 'mario.rossi@example.com', nome: 'Mario', cognome: 'Rossi' }, modello: 'Pala frontale + Montaggio', prezzo: 2900, sconto: 0, validita: new Date(Date.now()+20*86400000).toISOString().slice(0,10), stato: 'APERTO' },
        { id: 3, cliente: { id: 1002, email: 'laura.bianchi@example.com', nome: 'Laura', cognome: 'Bianchi' }, modello: 'Trattrice compatta - Modello C', prezzo: 12990, sconto: 990, validita: new Date(Date.now()+25*86400000).toISOString().slice(0,10), stato: 'APERTO' }
      ]))
    );
  }
  preventiviCliente(id: number) {
    return this.http.get<PreventivoDTO[]>(`${this.base}/clienti/${id}/preventivi`).pipe(
      catchError(() => this.preventivi())
    );
  }
  creaPreventivo(p: { clienteId: number; modello: string; prezzo: number; sconto?: number; validita: string; }) { return this.http.post<PreventivoDTO>(`${this.base}/preventivi`, p); }
  approvaPreventivo(id: number) { return this.http.put<PreventivoDTO>(`${this.base}/preventivi/${id}/approva`, {}); }
  rifiutaPreventivo(id: number) { return this.http.put<PreventivoDTO>(`${this.base}/preventivi/${id}/rifiuta`, {}); }
  convertiPreventivo(id: number) { return this.http.post<{ ordineId: number; message: string }>(`${this.base}/preventivi/${id}/converti`, {}); }
}
