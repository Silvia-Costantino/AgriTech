import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Dipendente, FeriePermessi, BustaPaga, Turno } from '../../models/dipendenti';

@Injectable({ providedIn: 'root' })
export class DipendentiService {
  private http = inject(HttpClient);
  private base = 'http://localhost:8080/api';

  list() { return this.http.get<Dipendente[]>(`${this.base}/dipendenti`); }
  save(d: Partial<Dipendente>) { return this.http.post(`${this.base}/dipendenti`, d); }
  update(cf: string, d: Partial<Dipendente>) { return this.http.put(`${this.base}/dipendenti/${cf}`, d); }
  remove(cf: string) { return this.http.delete(`${this.base}/dipendenti/${cf}`); }

  turni() { return this.http.get<Turno[]>(`${this.base}/turni`); }
  feriePermessi() { return this.http.get<FeriePermessi[]>(`${this.base}/ferie-permessi`); }
  bustePaga() { return this.http.get<BustaPaga[]>(`${this.base}/buste-paga`); }
}
