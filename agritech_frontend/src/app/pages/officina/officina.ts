import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OfficinaService } from '../../services/officina/officina';
import { Ricambio, Riparazione } from '../../models/officina';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-officina',
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="officina-container">
      <div class="header">
        <h2>Officina — Riparazioni</h2>
        <a routerLink="/officina/ricambi" class="btn-link">Archivio ricambi</a>
      </div>

      <div class="nuova-riparazione">
        <h3>Nuova richiesta di riparazione</h3>
        <form (ngSubmit)="creaRiparazione()" class="form-inline">
          <input [(ngModel)]="form.targa" name="targa" placeholder="Targa" required />
          <select [(ngModel)]="form.urgenza" name="urgenza">
            <option value="BASSA">Bassa</option>
            <option value="MEDIA">Media</option>
            <option value="ALTA">Alta</option>
          </select>
          <select [(ngModel)]="form.stato" name="stato">
            <option value="ATTESA">In attesa</option>
            <option value="LAVORAZIONE">In lavorazione</option>
            <option value="COMPLETATA">Completato</option>
          </select>
          <button class="btn-primary" type="submit">Aggiungi</button>
        </form>
      </div>

      <div *ngIf="loading" class="loading">Caricamento riparazioni...</div>
      <div *ngIf="error" class="error">{{ error }}</div>

      <div *ngIf="!loading && riparazioni.length === 0" class="empty">Nessuna riparazione in corso</div>

      <div *ngIf="!loading && riparazioni.length > 0" class="table-container">
        <table class="table">
          <thead>
          <tr>
            <th>ID</th>
            <th>Targa</th>
            <th>Stato</th>
            <th>Urgenza</th>
            <th>Ricambio necessario</th>
            <th>Azioni</th>
          </tr>
          </thead>
          <tbody>
          <tr *ngFor="let r of riparazioni">
            <td>{{ r.id }}</td>
            <td>{{ r.targa }}</td>
            <td>
              <select [(ngModel)]="r.stato">
                <option value="ATTESA">In attesa</option>
                <option value="LAVORAZIONE">In lavorazione</option>
                <option value="COMPLETATA">Completato</option>
              </select>
            </td>
            <td>
              <select [(ngModel)]="r.urgenza">
                <option value="BASSA">Bassa</option>
                <option value="MEDIA">Media</option>
                <option value="ALTA">Alta</option>
              </select>
            </td>
            <td class="ricambi-cell">
              <select [(ngModel)]="segnalazioni[r.id].ricambioId">
                <option [ngValue]="null">— Seleziona ricambio —</option>
                <option *ngFor="let rc of ricambi" [ngValue]="rc.id">{{ rc.descrizione }} ({{ rc.quantita }})</option>
              </select>
              <input type="number" min="1" [(ngModel)]="segnalazioni[r.id].quantita" placeholder="Qtà" class="qta-input" />
              <button (click)="segnalaRicambio(r)" class="btn-secondary">Segnala</button>
            </td>
            <td class="actions">
              <button (click)="salva(r)" class="btn-primary">Salva</button>
              <button (click)="completa(r)" class="btn-success" [disabled]="r.stato !== 'COMPLETATA'">Completa</button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <div class="table-container" *ngIf="completateList.length > 0">
        <h3>Riparazioni completate</h3>
        <table class="table">
          <thead>
          <tr>
            <th>ID</th>
            <th>Targa</th>
            <th>Stato</th>
            <th>Urgenza</th>
            <th>Completata</th>
          </tr>
          </thead>
          <tbody>
            <tr *ngFor="let r of completateList">
              <td>{{r.id}}</td>
              <td>{{r.targa}}</td>
              <td>{{r.stato}}</td>
              <td>{{r.urgenza}}</td>
              <td>Sì</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .officina-container { padding: 2rem; max-width: 1200px; margin: 0 auto; }
    .header { display:flex; align-items:center; justify-content: space-between; margin-bottom: 1.5rem; }
    .header h2 { margin:0; color:#0e3f25; font-size: 2rem; }
    .btn-link { text-decoration:none; font-weight:700; color:#2e9d37; }
    .nuova-riparazione { background:#f8f9fa; padding:1rem; border:1px solid #e0e0e0; border-radius:8px; margin-bottom:1rem; }
    .form-inline { display:flex; gap:.5rem; flex-wrap:wrap; align-items:center; }
    .form-inline input, .form-inline select { padding:.5rem; border:1px solid #ddd; border-radius:6px; }
    .loading, .error, .empty { padding: 1rem; }
    .error { color:#b00020; background:#ffeaea; border:1px solid #e0b4b4; border-radius:8px; }
    .table-container { background:#fff; border-radius:8px; box-shadow:0 2px 6px rgba(0,0,0,0.1); overflow-x:auto; }
    table { width:100%; border-collapse: collapse; }
    thead { background: linear-gradient(110deg, #0e3f25 0%, #1f6c2e 55%, #2e9d37 100%); color:#fff; }
    th, td { padding:.75rem; border-bottom:1px solid #e0e0e0; text-align:left; }
    .actions { display:flex; gap:.5rem; }
    .btn-primary { background:#2e9d37; color:#fff; border:none; padding:.45rem .9rem; border-radius:6px; cursor:pointer; }
    .btn-secondary { background:#fff; color:#1f6c2e; border:1px solid #1f6c2e; padding:.4rem .8rem; border-radius:6px; cursor:pointer; }
    .btn-success { background:#1f6c2e; color:#fff; border:none; padding:.45rem .9rem; border-radius:6px; cursor:pointer; }
    .qta-input { width:70px; margin:0 .4rem; }
    .ricambi-cell { display:flex; align-items:center; gap:.4rem; }
  `]
})
export class OfficinaPage implements OnInit {
  private svc = inject(OfficinaService);

  riparazioni: Riparazione[] = [];
  ricambi: Ricambio[] = [];
  segnalazioni: Record<number, { ricambioId: number | null; quantita: number } > = {};
  completateList: Riparazione[] = [];
  loading = false;
  error: string | null = null;
  form: { targa: string; urgenza: 'BASSA'|'MEDIA'|'ALTA'; stato: 'ATTESA'|'LAVORAZIONE'|'COMPLETATA' } = { targa: '', urgenza: 'MEDIA', stato: 'ATTESA' };

  ngOnInit(){ this.caricaDati(); }

  caricaDati(){
    this.loading = true; this.error = null;
    this.svc.riparazioni().subscribe({
      next: (rips) => {
        this.riparazioni = (rips || []).filter(r => r.stato !== 'COMPLETATA');
        this.completateList = (rips || []).filter(r => r.stato === 'COMPLETATA');
        this.segnalazioni = {};
        for (const r of rips) this.segnalazioni[r.id] = { ricambioId: null, quantita: 1 };
        this.svc.ricambi().subscribe({
          next: (rc) => { this.ricambi = rc; this.loading = false; },
          error: (e) => { this.error = e?.error?.message || 'Errore nel caricamento ricambi'; this.loading = false; }
        });
        this.svc.completate().subscribe({ next: (cl) => this.completateList = cl || this.completateList });
      },
      error: (err) => { this.error = err?.error?.message || 'Errore nel caricamento riparazioni'; this.loading = false; }
    });
  }

  salva(r: Riparazione){
    this.svc.updateRiparazione(r.id, { stato: r.stato, urgenza: r.urgenza }).subscribe({
      next: () => {},
      error: (e) => { this.error = e?.error?.message || 'Errore nel salvataggio'; }
    });
  }

  segnalaRicambio(r: Riparazione){
    const s = this.segnalazioni[r.id];
    if (!s.ricambioId || !s.quantita || s.quantita < 1) { alert('Seleziona ricambio e quantità valida'); return; }
    this.svc.richiestaRicambio(r.id, s.ricambioId, s.quantita).subscribe({
      next: () => { alert('Richiesta ricambio registrata'); this.caricaDati(); },
      error: (e) => { this.error = e?.error?.message || 'Errore nella richiesta ricambio'; }
    });
  }

  completa(r: Riparazione){
    if (!confirm(`Confermi il completamento della manutenzione per ${r.targa}?`)) return;
    const sel = this.segnalazioni[r.id];
    const after = () => this.svc.completaManutenzione(r.id).subscribe({
      next: (res) => { alert(res?.message || `Manutenzione completata. Report #${res?.reportId ?? ''}`); this.caricaDati(); },
      error: (e) => { this.error = e?.error?.message || 'Errore nel completamento manutenzione'; }
    });
    if (sel?.ricambioId && sel?.quantita && sel.quantita > 0) {
      this.svc.richiestaRicambio(r.id, sel.ricambioId, sel.quantita).subscribe({
        next: () => after(),
        error: () => after()
      });
    } else {
      after();
    }
  }

  creaRiparazione(){
    if (!this.form.targa?.trim()) { alert('Inserisci una targa'); return; }
    this.svc.creaRiparazione({ targa: this.form.targa.trim(), urgenza: this.form.urgenza, stato: this.form.stato }).subscribe({
      next: () => { this.form = { targa: '', urgenza: 'MEDIA', stato: 'ATTESA' }; this.caricaDati(); },
      error: (e) => { this.error = e?.error?.message || 'Errore nella creazione riparazione'; }
    });
  }
}
