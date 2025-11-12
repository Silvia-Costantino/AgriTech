import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrdiniService, OrdineDTO } from '../../services/ordini/ordini';
import { AuthService } from '../../services/auth/auth';

@Component({
  selector: 'app-ordini',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="ordini-container">
      <div class="header">
        <h2>Gestione Ordini</h2>
        <button *ngIf="isDipendente || isSocio" (click)="mostraFormNuovoOrdine()" class="btn-nuovo">
          Nuovo Ordine
        </button>
      </div>

      <div *ngIf="loading" class="loading">Caricamento ordini...</div>
      <div *ngIf="error" class="error">{{ error }}</div>

      <div *ngIf="!loading && ordini.length === 0" class="empty">
        <p>Nessun ordine trovato</p>
      </div>

      <div *ngIf="!loading && ordini.length > 0" class="table-container">
        <table class="ordini-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tipo</th>
              <th>Cliente / Fornitore</th>
              <th>Data</th>
              <th>Stato</th>
              <th>Importo</th>
              <th *ngIf="isSocio || isDipendente">Azioni</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let o of ordini" class="ordine-row">
              <td>{{ o.id }}</td>
              <td>
                <span [class]="'badge-' + o.tipo.toLowerCase()">
                  {{ o.tipo === 'CLIENTE' ? 'Cliente' : 'Fornitore' }}
                </span>
              </td>

              <td>{{ o.cliente || o.fornitore || 'N/A' }}</td>
              <td>{{ formatData(o.data) }}</td>

              <td>
                <select
                  *ngIf="isSocio && o.tipo === 'CLIENTE'"
                  [value]="o.stato"
                  (change)="aggiornaStatoOrdine(o, $event)"
                  class="select-stato"
                >
                  <option value="IN_ELABORAZIONE">In elaborazione</option>
                  <option value="PRONTO_CONSEGNA">Pronto</option>
                  <option value="CONSEGNATO">Consegnato</option>
                  <option value="ANNULLATO">Annullato</option>
                </select>

                <select
                  *ngIf="isSocio && o.tipo === 'FORNITORE'"
                  [value]="getStatoFornitore(o.stato)"
                  (change)="aggiornaStatoOrdineFornitore(o, $event)"
                  class="select-stato"
                >
                  <option value="IN_ATTESA">In attesa</option>
                  <option value="EVASO">Evaso</option>
                  <option value="ANNULLATO">Annullato</option>
                </select>

                <span *ngIf="!isSocio" [class]="'stato-' + o.stato.toLowerCase()">
                  {{ formatStato(o.stato) }}
                </span>
              </td>

              <td class="importo">{{ o.importo | currency:'EUR' }}</td>

              <td *ngIf="isSocio || isDipendente" class="azioni">
                <ng-container *ngIf="isSocio">
                  <button
                    *ngIf="o.tipo === 'CLIENTE' && o.stato !== 'CONSEGNATO' && o.stato !== 'ANNULLATO'"
                    (click)="annullaOrdine(o)"
                    class="btn-annulla"
                  >Annulla</button>

                  <button
                    *ngIf="o.tipo === 'FORNITORE' && o.stato !== 'ANNULLATO'"
                    (click)="annullaOrdineFornitore(o)"
                    class="btn-annulla"
                  >Annulla</button>
                </ng-container>

                <button
                  *ngIf="(isDipendente || isSocio) && o.tipo === 'CLIENTE' && o.stato === 'PRONTO_CONSEGNA'"
                  (click)="confermaSpedizione(o)"
                  class="btn-conferma"
                >Conferma</button>
              </td>

            </tr>
          </tbody>
        </table>
      </div>

      <!-- Spedizioni -->
      <div class="table-container" *ngIf="spedizioni.length > 0">
        <h3 class="section-title">Spedizioni</h3>
        <table class="ordini-table">
          <thead>
            <tr>
              <th>Numero d'ordine</th>
              <th>Cliente</th>
              <th>Stato spedizione</th>
              <th>DDT</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let s of spedizioni">
              <td>{{ s.ordineId }}</td>
              <td>{{ s.cliente }}</td>
              <td>
                <span [class]="s.stato==='CONSEGNATO' ? 'stato-consegnato' : 'stato-pronto_consegna'">
                  {{ s.stato === 'CONSEGNATO' ? 'Consegnato' : 'In transito' }}
                </span>
              </td>
              <td>{{ s.ddt }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Resi -->
      <div class="table-container" *ngIf="resi.length > 0">
        <h3 class="section-title">Resi richiesti</h3>
        <table class="ordini-table">
          <thead>
            <tr>
              <th>ID Reso</th>
              <th>Numero d'ordine</th>
              <th>Cliente</th>
              <th>Motivo</th>
              <th>Data richiesta</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let r of resi">
              <td>{{ r.id }}</td>
              <td>{{ r.ordineId }}</td>
              <td>{{ r.cliente }}</td>
              <td>{{ r.motivo }}</td>
              <td>{{ r.dataRichiesta | date:'dd/MM/yyyy' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .ordini-container { padding: 2rem; max-width: 1400px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    .header h2 { color: #0e3f25; font-size: 2rem; margin: 0; }

    .btn-nuovo {
      background: #2e9d37; color: white; padding: .7rem 1.5rem; border-radius: 8px;
      border: none; cursor: pointer; font-weight: 600; transition: .2s;
    }
    .btn-nuovo:hover { background:#23812b; transform: translateY(-1px); }

    .loading, .error, .empty { padding:2rem; text-align:center; }
    .error { color:#e74c3c; background:#ffeaea; border:1px solid #e74c3c; border-radius:8px; }
    .empty { color:#666; font-style:italic; }

    .table-container { background:white; border-radius:12px; box-shadow:0 2px 8px rgba(0,0,0,0.1); overflow-x:auto; margin-bottom:2rem; }
    .ordini-table { width:100%; border-collapse:collapse; }
    .ordini-table thead {
      background: linear-gradient(110deg, #0e3f25, #1f6c2e 55%, #2e9d37); color:white;
    }
    th { padding:1rem; font-weight:600; text-align:left; }
    .ordine-row { border-bottom:1px solid #eee; }
    .ordine-row:hover { background:#f8f9fa; }
    td { padding:1rem; }

    .badge-cliente { background:#e3f2fd; color:#1976d2; }
    .badge-fornitore { background:#fff3e0; color:#f57c00; }
    .badge-cliente, .badge-fornitore {
      padding:.3rem .8rem; border-radius:12px; font-size:.85rem; font-weight:600;
    }

    .select-stato { padding:.4rem .6rem; border:1px solid #ccc; border-radius:6px; background:white; }

    .stato-in_elaborazione { color:#f57c00; font-weight:600; }
    .stato-pronto_consegna { color:#1976d2; font-weight:600; }
    .stato-consegnato { color:#2e9d37; font-weight:600; }
    .stato-annullato { color:#e74c3c; font-weight:600; }

    .importo { font-weight:600; color:#0e3f25; }
    .azioni { display:flex; gap:.5rem; }

    .btn-annulla, .btn-conferma {
      border:none; padding:.3rem .5rem; cursor:pointer; font-size:1rem;
      border-radius:6px; transition:.2s;
    }
    .btn-annulla:hover { background:#ffeaea; }
    .btn-conferma:hover { background:#e8f5e9; }

    @media(max-width:768px) {
      .ordini-container { padding:1rem; }
      th, td { padding:.6rem; }
    }
  `]
})
export class OrdiniPage implements OnInit {

  private service = inject(OrdiniService);
  private auth = inject(AuthService);

  ordini: OrdineDTO[] = [];
  spedizioni: any[] = [];
  resi: any[] = [];
  loading = false;
  error: string | null = null;

  isSocio = false;
  isDipendente = false;

  ngOnInit() {
    const ruolo = this.auth.getRole();
    this.isSocio = ruolo === 'SOCIO';
    this.isDipendente = ruolo === 'DIPENDENTE';
    this.caricaOrdini();
  }

  caricaOrdini() {
    this.loading = true;
    this.error = null;

    this.service.listUnificati().subscribe({
      next: (ordini) => {
        this.ordini = ordini;
        this.aggiornaSpedizioniEResi();
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Errore nel caricamento degli ordini';
        this.loading = false;
      }
    });
  }

  formatData(data: string) {
    try {
      return new Date(data).toLocaleString('it-IT');
    } catch {
      return data;
    }
  }

  formatStato(stato: string) {
    const map: any = {
      'IN_ELABORAZIONE': 'In elaborazione',
      'PRONTO_CONSEGNA': 'Pronto',
      'CONSEGNATO': 'Consegnato',
      'ANNULLATO': 'Annullato'
    };
    return map[stato] || stato;
  }

  aggiornaStatoOrdine(o: OrdineDTO, ev: Event) {
    const nuovoStato = (ev.target as HTMLSelectElement).value;
    this.service.aggiornaStato(o.id, nuovoStato).subscribe(() => this.caricaOrdini());
  }

  aggiornaStatoOrdineFornitore(o: OrdineDTO, ev: Event) {
    const nuovoStato = (ev.target as HTMLSelectElement).value;
    this.service.aggiornaStatoFornitore(o.id, nuovoStato).subscribe(() => this.caricaOrdini());
  }

  getStatoFornitore(s: string): string {
    if (s === 'IN_ELABORAZIONE') return 'IN_ATTESA';
    if (s === 'CONSEGNATO') return 'EVASO';
    return s;
  }

  annullaOrdine(o: OrdineDTO) {
    if (!confirm(`Annullare ordine #${o.id}?`)) return;
    this.service.annulla(o.id).subscribe(() => this.caricaOrdini());
  }

  annullaOrdineFornitore(o: OrdineDTO) {
    if (!confirm(`Annullare ordine fornitore #${o.id}?`)) return;
    this.service.annullaFornitore(o.id).subscribe(() => this.caricaOrdini());
  }

  confermaSpedizione(o: OrdineDTO) {
    if (!confirm(`Confermare spedizione ordine #${o.id}?`)) return;
    this.service.confermaSpedizione(o.id).subscribe(() => this.caricaOrdini());
  }

  mostraFormNuovoOrdine() {
    alert("Funzione in arrivo!");
  }

  // 📦 LOGICA SPEDIZIONI E RESI
  private aggiornaSpedizioniEResi() {
    const daBackend = this.ordini
      .filter(o => o.tipo === 'CLIENTE' && (o.stato === 'PRONTO_CONSEGNA' || o.stato === 'CONSEGNATO'))
      .map(o => ({
        ordineId: o.id,
        cliente: o.cliente,
        stato: o.stato === 'CONSEGNATO' ? 'CONSEGNATO' : 'IN_TRANSITO',
        ddt: this.generaDDT(o.id, o.data)
      }));

    this.spedizioni = daBackend;

    this.resi = [
      { id: 1, ordineId: 1002, cliente: 'Laura Bianchi', motivo: 'Difetto', dataRichiesta: new Date().toISOString() }
    ];
  }

  private generaDDT(id: number, data: string) {
    try {
      const d = new Date(data);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      return `DDT-${id}-${yyyy}${mm}${dd}`;
    } catch {
      return `DDT-${id}`;
    }
  }
}
