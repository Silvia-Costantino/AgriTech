import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface OrdineDTO {
  id: number;
  tipo: 'CLIENTE' | 'FORNITORE';
  cliente?: string;
  fornitore?: string;
  data: string;
  stato: string;
  importo: number;
}

export interface OrdiniResponse {
  ordiniCliente: OrdineDTO[];
  ordiniFornitore: OrdineDTO[];
}

@Injectable({ providedIn: 'root' })
export class OrdiniService {
  private http = inject(HttpClient);
  private api = 'http://localhost:8080/api/ordini';

  /** Ottiene tutti gli ordini (clienti e fornitori) */
  list(): Observable<OrdiniResponse> {
    return this.http.get<OrdiniResponse>(this.api);
  }

  /** Ottiene tutti gli ordini unificati in un'unica lista */
  listUnificati(): Observable<OrdineDTO[]> {
    return this.list().pipe(
      map(res => [...res.ordiniCliente, ...res.ordiniFornitore])
    );
  }

  /** Aggiorna lo stato di un ordine cliente */
  aggiornaStato(id: number, stato: string): Observable<OrdineDTO> {
    return this.http.put<OrdineDTO>(`${this.api}/${id}/stato`, { stato });
  }

  /** Annulla un ordine cliente */
  annulla(id: number): Observable<OrdineDTO> {
    return this.http.delete<OrdineDTO>(`${this.api}/${id}`);
  }

  /** Conferma spedizione di un ordine */
  confermaSpedizione(id: number): Observable<OrdineDTO> {
    return this.http.post<OrdineDTO>(`${this.api}/${id}/conferma-spedizione`, {});
  }

  /** Aggiorna lo stato di un ordine fornitore */
  aggiornaStatoFornitore(id: number, stato: string): Observable<OrdineDTO> {
    return this.http.put<OrdineDTO>(`${this.api}/fornitore/${id}/stato`, { stato });
  }

  /** Annulla un ordine fornitore */
  annullaFornitore(id: number): Observable<OrdineDTO> {
    return this.http.delete<OrdineDTO>(`${this.api}/fornitore/${id}`);
  }
}
