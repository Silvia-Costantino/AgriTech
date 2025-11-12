import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contabilita',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="contabilita-container">

      <div class="header">
        <h2>Contabilità & Finanziamenti</h2>

        <div class="tab-menu">
          <button [class.active]="tab === 'disponibilita'" (click)="tab = 'disponibilita'">Disponibilità</button>
          <button [class.active]="tab === 'crediti'" (click)="tab = 'crediti'">Crediti</button>
          <button [class.active]="tab === 'debiti'" (click)="tab = 'debiti'">Debiti</button>
          <button [class.active]="tab === 'finanziamenti'" (click)="tab = 'finanziamenti'">Finanziamenti</button>
        </div>
      </div>

      <!-- ------------------------- -->
      <!--   PAGINA: DISPONIBILITÀ   -->
      <!-- ------------------------- -->
      <div *ngIf="tab === 'disponibilita'" class="section">

        <h3>Liquidità disponibile</h3>
        <div class="kpi-card">
          <p class="value">{{ disponibilitaTotale | currency:'EUR' }}</p>
          <p class="label">Saldo totale aziendale</p>
        </div>

        <h3>Movimenti giornalieri</h3>
        <table class="tabella">
          <thead>
          <tr>
            <th>Data</th>
            <th>Descrizione</th>
            <th>Importo</th>
          </tr>
          </thead>
          <tbody>
          <tr *ngFor="let mov of movimentiGiornalieri">
            <td>{{ mov.data | date:'dd/MM/yyyy' }}</td>
            <td>{{ mov.descrizione }}</td>
            <td [class.positivo]="mov.importo > 0" [class.negativo]="mov.importo < 0">
              {{ mov.importo | currency:'EUR' }}
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <!-- ------------------------- -->
      <!--       PAGINA: CREDITI     -->
      <!-- ------------------------- -->
      <div *ngIf="tab === 'crediti'" class="section">
        <h3>Crediti Aziendali</h3>

        <table class="tabella">
          <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Importo</th>
            <th>Tipo</th>
          </tr>
          </thead>
          <tbody>
          <tr *ngFor="let c of crediti">
            <td>{{ c.id }}</td>
            <td>{{ c.cliente }}</td>
            <td>{{ c.importo | currency:'EUR' }}</td>
            <td>{{ c.tipo }}</td>
          </tr>
          </tbody>
        </table>
      </div>

      <!-- ------------------------- -->
      <!--        PAGINA: DEBITI     -->
      <!-- ------------------------- -->
      <div *ngIf="tab === 'debiti'" class="section">
        <h3>Debiti Aziendali</h3>

        <table class="tabella">
          <thead>
          <tr>
            <th>ID</th>
            <th>Descrizione</th>
            <th>Importo</th>
            <th>Categoria</th>
          </tr>
          </thead>
          <tbody>
          <tr *ngFor="let d of debiti">
            <td>{{ d.id }}</td>
            <td>{{ d.descrizione }}</td>
            <td class="negativo">{{ d.importo | currency:'EUR' }}</td>
            <td>{{ d.categoria }}</td>
          </tr>
          </tbody>
        </table>
      </div>

      <!-- ------------------------------ -->
      <!--   PAGINA: FINANZIAMENTI        -->
      <!-- ------------------------------ -->
      <div *ngIf="tab === 'finanziamenti'" class="section">

        <h3>Finanziamenti Clienti</h3>

        <table class="tabella">
          <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Rate</th>
            <th>Importo Totale</th>
            <th>Importo Rata</th>
            <th>Stato</th>
          </tr>
          </thead>
          <tbody>
          <tr *ngFor="let f of finanziamenti">
            <td>{{ f.id }}</td>
            <td>{{ f.cliente }}</td>
            <td>{{ f.rate }}</td>
            <td>{{ f.totale | currency:'EUR' }}</td>
            <td>{{ f.rata | currency:'EUR' }}</td>
            <td>
                <span [class]="'stato-' + f.stato.toLowerCase()">
                  {{ f.stato === 'ATTIVO' ? 'Attivo' : 'Completato' }}
                </span>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

    </div>
  `,
  styles: [`
    .contabilita-container { padding: 2rem; max-width: 1200px; margin: auto; }

    .header { display:flex; flex-direction:column; gap:1rem; margin-bottom:2rem; }
    h2 { margin:0; color:#0e3f25; font-size:2rem; }

    .tab-menu { display:flex; gap:.5rem; }
    .tab-menu button {
      padding:.6rem 1rem; border-radius:8px; border:1px solid #ccc;
      background:#f4f4f4; cursor:pointer; font-weight:600;
    }
    .tab-menu button.active {
      background:#2e9d37; color:white; border-color:#2e9d37;
    }

    .section { margin-top:1rem; }

    .kpi-card {
      background:white; padding:1rem; border-radius:12px;
      box-shadow:0 2px 8px rgba(0,0,0,0.1); margin-bottom:2rem;
    }
    .kpi-card .value { font-size:2rem; font-weight:700; color:#2e9d37; }
    .kpi-card .label { color:#555; }

    .tabella { width:100%; border-collapse:collapse; background:white; border-radius:12px; overflow:hidden; }
    thead { background:#0e3f25; color:white; }
    th, td { padding:1rem; border-bottom:1px solid #eee; }
    tr:hover { background:#fafafa; }

    .positivo { color:#2e9d37; font-weight:600; }
    .negativo { color:#c0392b; font-weight:600; }

    .stato-attivo { color:#1976d2; font-weight:bold; }
    .stato-completato { color:#2e9d37; font-weight:bold; }

    @media(max-width:768px){
      th, td { padding:.6rem; font-size:.9rem; }
    }
  `]
})
export class ContabilitaPage implements OnInit {

  tab: 'disponibilita' | 'crediti' | 'debiti' | 'finanziamenti' = 'disponibilita';

  disponibilitaTotale = 32500;

  movimentiGiornalieri = [
    { data: new Date(), descrizione: 'Vendita prodotto', importo: 450 },
    { data: new Date(), descrizione: 'Pagamento fornitore', importo: -1200 },
  ];

  crediti = [
    { id: 1, cliente: 'Luca Argenterp', importo: 1200, tipo: 'Finanziamento cliente' },
    { id: 2, cliente: 'Forniture Agri S.p.A.', importo: 800, tipo: 'Reso verso fornitore' }
  ];

  debiti = [
    { id: 1, descrizione: 'Stipendi mensili', importo: -3500, categoria: 'Personale' },
    { id: 2, descrizione: 'Ordini in sospeso', importo: -2200, categoria: 'Magazzino' },
    { id: 3, descrizione: 'Spese di gestione', importo: -980, categoria: 'Servizi' }
  ];

  finanziamenti = [
    { id: 101, cliente: 'Luca Neri', rate: 12, totale: 2400, rata: 200, stato: 'ATTIVO' },
    { id: 102, cliente: 'Sara Verdi', rate: 6, totale: 1200, rata: 200, stato: 'COMPLETATO' }
  ];

  ngOnInit() {}
}
