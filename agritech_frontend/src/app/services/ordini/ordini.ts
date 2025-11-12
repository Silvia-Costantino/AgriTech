import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Ordine} from '../../models/ordine';

@Injectable({ providedIn: 'root' })
export class OrdiniService {
  private http = inject(HttpClient);
  private api = 'http://localhost:8080/api/ordini-clienti';
  list(): Observable<Ordine[]> { return this.http.get<Ordine[]>(this.api); }
}
