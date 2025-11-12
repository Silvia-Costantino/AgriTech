import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Dipendente, FeriePermessi, BustaPaga, Turno } from '../../models/dipendenti';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class DipendentiService {
  private http = inject(HttpClient);
  private base = 'http://localhost:8080/api';

  list() {
    return this.http.get<Dipendente[]>(`${this.base}/dipendenti`).pipe(
      catchError(() => of<Dipendente[]>([
        { cf: 'RSSMRA80A01H501Z', nome: 'Mario', cognome: 'Rossi', mansione: 'Meccanico' },
        { cf: 'BNCLRA85C11F205X', nome: 'Laura', cognome: 'Bianchi', mansione: 'Magazziniere' },
        { cf: 'VRDGPP90D22L219Y', nome: 'Giovanni', cognome: 'Verdi', mansione: 'Programmatore' },
        { cf: 'NRIFRN75B15C351J', nome: 'Francesca', cognome: 'Neri', mansione: 'Addetto vendite' },
        { cf: 'CNTLGI82E05M082K', nome: 'Luigi', cognome: 'Conti', mansione: 'Addetto allo showroom' }
      ]))
    );
  }
  save(d: Partial<Dipendente>) { return this.http.post(`${this.base}/dipendenti`, d); }
  update(cf: string, d: Partial<Dipendente>) { return this.http.put(`${this.base}/dipendenti/${cf}`, d); }
  remove(cf: string) { return this.http.delete(`${this.base}/dipendenti/${cf}`); }

  turni() {
    return this.http.get<Turno[]>(`${this.base}/turni`).pipe(
      catchError(() => of<Turno[]>([
        { dipendenteCf: 'RSSMRA80A01H501Z', giorni: ['Lun', 'Mar', 'Mer'], orario: '08:00-16:00' },
        { dipendenteCf: 'BNCLRA85C11F205X', giorni: ['Gio', 'Ven', 'Sab'], orario: '09:00-17:00' },
        { dipendenteCf: 'VRDGPP90D22L219Y', giorni: ['Lun', 'Mer', 'Ven'], orario: '10:00-18:00' },
        { dipendenteCf: 'NRIFRN75B15C351J', giorni: ['Mar', 'Gio'], orario: '08:00-14:00' },
        { dipendenteCf: 'CNTLGI82E05M082K', giorni: ['Lun', 'Mar', 'Gio'], orario: '09:00-13:00' }
      ]))
    );
  }
  feriePermessi() {
    return this.http.get<FeriePermessi[]>(`${this.base}/ferie-permessi`).pipe(
      catchError(() => of<FeriePermessi[]>([
        { dipendenteCf: 'BNCLRA85C11F205X', durata: 3, giorniLavorativi: ['2025-08-02','2025-08-03','2025-08-04'], stato: 'IN_ATTESA' },
        { dipendenteCf: 'VRDGPP90D22L219Y', durata: 1, giorniLavorativi: ['2025-08-10'], stato: 'IN_ATTESA' },
        { dipendenteCf: 'NRIFRN75B15C351J', durata: 2, giorniLavorativi: ['2025-08-15','2025-08-16'], stato: 'IN_ATTESA' }
      ]))
    );
  }

  // aggiornamento turno (backend o fallback no-op)
  updateTurno(t: Partial<Turno> & { dipendenteCf: string }) {
    return this.http.put(`${this.base}/turni/${t.dipendenteCf}`, t).pipe(
      catchError(() => of(null))
    );
  }

  // approvazione/rifiuto ferie/permessi (backend o fallback no-op)
  setFerieStato(cf: string, giorni: string[], stato: 'APPROVATO'|'RIFIUTATO') {
    return this.http.put(`${this.base}/ferie-permessi/${cf}`, { giorni, stato }).pipe(
      catchError(() => of(null))
    );
  }
  bustePaga() { return this.http.get<BustaPaga[]>(`${this.base}/buste-paga`); }
}
