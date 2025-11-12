import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Disponibilita, DebitoItem, CreditoItem, Finanziamento } from '../../models/contabilita';

@Injectable({ providedIn: 'root' })
export class ContabilitaService {
  private http = inject(HttpClient);
  private base = 'http://localhost:8080/api/contabilita';

  disponibilita() { return this.http.get<Disponibilita>(`${this.base}/disponibilita`); }
  crediti() { return this.http.get<CreditoItem[]>(`${this.base}/crediti`); }
  debiti() { return this.http.get<DebitoItem[]>(`${this.base}/debiti`); }

  finanziamenti() { return this.http.get<Finanziamento[]>(`http://localhost:8080/api/finanziamenti`); }
  confermaFinanziamento(id: number) { return this.http.put(`http://localhost:8080/api/finanziamenti/${id}/conferma`, {}); }
}
