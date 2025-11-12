import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Prodotto } from '../../models/prodotto';

@Injectable({ providedIn: 'root' })
export class CatalogoService {
  private http = inject(HttpClient);
  private api = 'http://localhost:8080/api/automezzi';

  list(): Observable<Prodotto[]> { return this.http.get<Prodotto[]>(this.api); }
  add(p: Prodotto): Observable<Prodotto> { return this.http.post<Prodotto>(this.api, p); }
  delete(targa: string) { return this.http.delete(`${this.api}/${targa}`); }
}
