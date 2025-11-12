import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Riparazione, Ricambio } from '../../models/officina';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class OfficinaService {
  private http = inject(HttpClient);
  private base = 'http://localhost:8080/api';

  riparazioni() {
    return this.http.get<Riparazione[]>(`${this.base}/riparazioni`).pipe(
      catchError(() =>
        of<Riparazione[]>([
          { id: 1, targa: 'AB123CD', stato: 'ATTESA',       urgenza: 'MEDIA' },
          { id: 2, targa: 'XY987ZT', stato: 'LAVORAZIONE',  urgenza: 'ALTA'  }
        ])
      )
    );
  }
  completate() {
    return this.http.get<Riparazione[]>(`${this.base}/riparazioni/completate`).pipe(
      catchError(() => of<Riparazione[]>([]))
    );
  }
  updateRiparazione(id: number, body: Partial<Riparazione>) { return this.http.put(`${this.base}/riparazioni/${id}`, body); }

  ricambi() {
    return this.http.get<Ricambio[]>(`${this.base}/ricambi`).pipe(
      catchError(() =>
        of<Ricambio[]>([
          { id: 101, descrizione: 'Filtro olio', quantita: 12, prezzo: 9.9 },
          { id: 102, descrizione: 'Cinghia alternatore', quantita: 5, prezzo: 24.5 }
        ])
      )
    );
  }

  // Crea una nuova riparazione
  creaRiparazione(body: { targa: string; stato?: 'ATTESA'|'LAVORAZIONE'|'COMPLETATA'; urgenza?: 'BASSA'|'MEDIA'|'ALTA' }) {
    return this.http.post(`${this.base}/riparazioni`, body);
  }
  saveRicambio(r: Partial<Ricambio>) { return this.http.post<Ricambio>(`${this.base}/ricambi`, r); }
  updateRicambio(id: number, r: Partial<Ricambio>) { return this.http.put<Ricambio>(`${this.base}/ricambi/${id}`, r); }

  // Segnala necessità di un ricambio per una riparazione
  richiestaRicambio(riparazioneId: number, ricambioId: number, quantita: number) {
    return this.http.post(`${this.base}/riparazioni/${riparazioneId}/ricambi`, { ricambioId, quantita });
  }

  // Completa la manutenzione e genera un report interno
  completaManutenzione(riparazioneId: number, note?: string) {
    return this.http.post<{ reportId: number; message?: string }>(`${this.base}/riparazioni/${riparazioneId}/completa`, { note });
  }
}
