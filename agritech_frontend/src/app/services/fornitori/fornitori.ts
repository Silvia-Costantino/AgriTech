import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Fornitore } from '../../models/fornitore';

@Injectable({ providedIn: 'root' })
export class FornitoriService {
  private http = inject(HttpClient);
  private base = 'http://localhost:8080/api/fornitori';

  list() { return this.http.get<Fornitore[]>(this.base); }
  save(f: Partial<Fornitore>) { return this.http.post<Fornitore>(this.base, f); }
  update(piva: string, f: Partial<Fornitore>) { return this.http.put<Fornitore>(`${this.base}/${piva}`, f); }
  remove(piva: string) { return this.http.delete(`${this.base}/${piva}`); }
}
