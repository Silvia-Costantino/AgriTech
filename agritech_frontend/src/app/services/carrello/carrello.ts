import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth';

@Injectable({ providedIn: 'root' })
export class CarrelloService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private readonly api = 'http://localhost:8080/api/carrello';

  /** Aggiunge un prodotto al carrello dell'utente loggato */
  aggiungiProdotto(prodottoId: number, quantita?: number): Observable<any> {
    return this.http.post(`${this.api}/aggiungi`, { prodottoId, quantita });
  }

  /** Recupera il carrello corrente */
  getCarrello(): Observable<any> {
    return this.http.get(`${this.api}`);
  }

  /** Aggiorna la quantità di un prodotto nel carrello */
  aggiornaQuantita(prodottoId: number, quantita: number): Observable<any> {
    return this.http.put(`${this.api}/aggiorna`, { prodottoId, quantita });
  }

  /** Rimuove un prodotto dal carrello */
  rimuoviProdotto(prodottoId: number): Observable<any> {
    return this.http.delete(`${this.api}/rimuovi/${prodottoId}`);
  }

  /** Svuota tutto il carrello */
  svuotaCarrello(): Observable<any> {
    return this.http.delete(`${this.api}/svuota`);
  }
}
