import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdiniService, OrdineDTO } from '../../services/ordini/ordini';
import { AuthService } from '../../services/auth/auth';

@Component({
  selector: 'app-storico-ordini',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="storico-container">
      <div class="header">
        <h2>Storico Ordini</h2>
      </div>

      <div *ngIf="loading" class="loading">Caricamento storico...</div>
      <div *ngIf="error" class="error">{{ error }}</div>

      <div *ngIf="!loading && ordini.length === 0" class="empty">
        <p>Nessun ordine trovato</p>
      </div>

      <div *ngIf="!loading && ordini.length > 0" class="table-container">
        <table class="ordini-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Data</th>
              <th>Stato</th>
              <th>Importo</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let o of ordini">
              <td>{{ o.id }}</td>
              <td>{{ formatData(o.data) }}</td>
              <td>{{ formatStato(o.stato) }}</td>
              <td class="importo">{{ o.importo | currency:'EUR' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .storico-container { padding: 2rem; max-width: 1200px; margin: 0 auto; }
    .header { display:flex; align-items:center; justify-content: space-between; margin-bottom: 1.5rem; }
    .header h2 { margin:0; color:#0e3f25; font-size: 2rem; }
    .loading, .error, .empty { padding: 1rem; }
    .error { color: #b00020; }
    .table-container { background: #fff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); overflow-x:auto; }
    table { width:100%; border-collapse: collapse; }
    thead { background: linear-gradient(110deg, #0e3f25 0%, #1f6c2e 55%, #2e9d37 100%); color:#fff; }
    th, td { padding: .75rem; border-bottom: 1px solid #e0e0e0; text-align:left; }
    .importo { font-weight:600; color:#0e3f25; }
  `]
})
export class StoricoOrdiniPage implements OnInit {
  private service = inject(OrdiniService);
  private auth = inject(AuthService);

  ordini: OrdineDTO[] = [];
  loading = false;
  error: string | null = null;

  ngOnInit() {
    // Solo clienti: carico gli ordini cliente
    const ruolo = this.auth.getRole();
    if (ruolo !== 'CLIENTE') {
      this.error = 'Accesso non consentito';
      return;
    }
    this.caricaStorico();
  }

  caricaStorico() {
    this.loading = true;
    this.error = null;
    this.service.list().subscribe({
      next: (res) => {
        this.ordini = res.ordiniCliente;
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Errore nel caricamento dello storico ordini';
        this.loading = false;
      }
    });
  }

  formatData(data: string): string {
    if (!data) return 'N/A';
    try {
      const d = new Date(data);
      return d.toLocaleDateString('it-IT', { year:'numeric', month:'2-digit', day:'2-digit' });
    } catch {
      return data;
    }
  }

  formatStato(stato: string): string {
    const stati: { [k: string]: string } = {
      'IN_ELABORAZIONE': 'In elaborazione',
      'PRONTO_CONSEGNA': 'Pronto',
      'CONSEGNATO': 'Consegnato',
      'ANNULLATO': 'Annullato'
    };
    return stati[stato] || stato;
  }
}
