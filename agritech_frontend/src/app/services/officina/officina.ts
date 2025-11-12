import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Riparazione, Ricambio } from '../../models/officina';

@Injectable({ providedIn: 'root' })
export class OfficinaService {
  private http = inject(HttpClient);
  private base = 'http://localhost:8080/api';

  riparazioni() { return this.http.get<Riparazione[]>(`${this.base}/riparazioni`); }
  updateRiparazione(id: number, body: Partial<Riparazione>) { return this.http.put(`${this.base}/riparazioni/${id}`, body); }

  ricambi() { return this.http.get<Ricambio[]>(`${this.base}/ricambi`); }
  saveRicambio(r: Partial<Ricambio>) { return this.http.post<Ricambio>(`${this.base}/ricambi`, r); }
  updateRicambio(id: number, r: Partial<Ricambio>) { return this.http.put<Ricambio>(`${this.base}/ricambi/${id}`, r); }
}
