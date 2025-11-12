import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthService } from '../../services/auth/auth';
import { CarrelloService } from '../../services/carrello/carrello';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="catalogo">
      <h2>Catalogo Automezzi Agricoli</h2>

      <!-- Filtri avanzati per SOCIO/DIPENDENTE -->
      <div *ngIf="isAdmin" class="filtri-avanzati">
        <h3>Filtri Avanzati</h3>
        <div class="filtri-grid">
          <div class="filtro-group">
            <label>Marca:</label>
            <input [(ngModel)]="filtri.marca" placeholder="Cerca marca..." />
          </div>
          <div class="filtro-group">
            <label>Prezzo Min (€):</label>
            <input type="number" [(ngModel)]="filtri.prezzoMin" placeholder="0" />
          </div>
          <div class="filtro-group">
            <label>Prezzo Max (€):</label>
            <input type="number" [(ngModel)]="filtri.prezzoMax" placeholder="999999" />
          </div>
          <div class="filtro-group">
            <label>Quantità Min:</label>
            <input type="number" [(ngModel)]="filtri.quantitaMin" placeholder="0" />
          </div>
          <div class="filtro-group">
            <label>Quantità Max:</label>
            <input type="number" [(ngModel)]="filtri.quantitaMax" placeholder="999" />
          </div>
          <div class="filtro-actions">
            <button (click)="applicaFiltri()" class="btn-filtra">🔍 Applica Filtri</button>
            <button (click)="resetFiltri()" class="btn-reset">🔄 Reset</button>
          </div>
        </div>
      </div>

      <!-- Controlli per CLIENTE -->
      <div *ngIf="!isAdmin" class="controlli-cliente">
        <div class="filtro-semplice">
          <input [(ngModel)]="filtroMarca" placeholder="Filtra per marca..." />
          <button (click)="cercaMarca()">🔍 Cerca</button>
        </div>
        <div class="ordinamento">
          <label>Ordina per:</label>
          <select [(ngModel)]="ordinamento" (change)="ordinaProdotti()">
            <option value="">Nessun ordinamento</option>
            <option value="marca-asc">Marca (A-Z)</option>
            <option value="marca-desc">Marca (Z-A)</option>
            <option value="prezzo-asc">Prezzo (Crescente)</option>
            <option value="prezzo-desc">Prezzo (Decrescente)</option>
          </select>
        </div>
      </div>

      <div class="controls">
        <button *ngIf="isAdmin" (click)="mostraForm()" class="btn-nuovo">➕ Nuovo</button>
      </div>

      <div *ngIf="showForm" class="form">
        <h3>{{editMode ? 'Modifica' : 'Nuovo'}} automezzo</h3>
        <form (ngSubmit)="salvaProdotto()">
          <input [(ngModel)]="prodotto.nome" name="nome" placeholder="Nome" required />
          <input [(ngModel)]="prodotto.descrizione" name="descrizione" placeholder="Descrizione" />
          <input [(ngModel)]="prodotto.marca" name="marca" placeholder="Marca" required />
          <input [(ngModel)]="prodotto.modello" name="modello" placeholder="Modello" />
          <input type="number" [(ngModel)]="prodotto.prezzo" name="prezzo" placeholder="Prezzo" required step="0.01" />
          <input type="number" [(ngModel)]="prodotto.quantitaDisponibile" name="quantitaDisponibile" placeholder="Quantità disponibile" />
          <input type="number" [(ngModel)]="prodotto.stockMinimo" name="stockMinimo" placeholder="Stock minimo" />
          <button type="submit">Salva</button>
          <button type="button" (click)="annulla()">Annulla</button>
        </form>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Marca</th>
              <th>Modello</th>
              <th>Descrizione</th>
              <th>Prezzo (€)</th>
              <th>Disponibili</th>
              <th *ngIf="isAdmin">Stock min.</th>
              <th>Azioni</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let p of prodottiOrdinati">
              <td>{{p.nome}}</td>
              <td>{{p.marca}}</td>
              <td>{{p.modello}}</td>
              <td>{{p.descrizione}}</td>
              <td>{{p.prezzo | number:'1.2-2'}}</td>
              <td>{{p.quantitaDisponibile}}</td>
              <td *ngIf="isAdmin">{{p.stockMinimo}}</td>
              <td>
                <ng-container *ngIf="isAdmin; else clienteActions">
                  <button (click)="modifica(p)" class="btn-edit">✏️</button>
                  <button (click)="elimina(p.id)" class="btn-delete">🗑️</button>
                </ng-container>
                <ng-template #clienteActions>
                  <button (click)="aggiungiAlCarrello(p)" class="btn-carrello" [disabled]="p.quantitaDisponibile <= 0">
                    🛒 {{p.quantitaDisponibile > 0 ? 'Aggiungi' : 'Non disponibile'}}
                  </button>
                </ng-template>
              </td>
            </tr>
          </tbody>
        </table>
        <div *ngIf="prodottiOrdinati.length === 0" class="no-results">
          Nessun prodotto trovato
        </div>
      </div>
    </div>
  `,
  styles: [`
    .catalogo { padding: 2rem; max-width: 1400px; margin: 0 auto; }
    
    h2 { color: #0e3f25; margin-bottom: 1.5rem; }
    h3 { color: #1f6c2e; margin-bottom: 1rem; }

    .filtri-avanzati {
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
      border: 1px solid #e0e0e0;
    }

    .filtri-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      align-items: end;
    }

    .filtro-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .filtro-group label {
      font-weight: 600;
      color: #0e3f25;
      font-size: 0.9rem;
    }

    .filtro-group input {
      padding: 0.6rem;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 0.95rem;
    }

    .filtro-group input:focus {
      outline: none;
      border-color: #2e9d37;
      box-shadow: 0 0 0 3px rgba(46, 157, 55, 0.1);
    }

    .filtro-actions {
      display: flex;
      gap: 0.5rem;
    }

    .controlli-cliente {
      display: flex;
      gap: 1rem;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
      align-items: center;
    }

    .filtro-semplice {
      display: flex;
      gap: 0.5rem;
    }

    .filtro-semplice input {
      padding: 0.6rem;
      border: 1px solid #ddd;
      border-radius: 6px;
      min-width: 200px;
    }

    .ordinamento {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .ordinamento label {
      font-weight: 600;
      color: #0e3f25;
    }

    .ordinamento select {
      padding: 0.6rem;
      border: 1px solid #ddd;
      border-radius: 6px;
      background: white;
      cursor: pointer;
    }

    .controls {
      margin-bottom: 1rem;
      display: flex;
      gap: 0.5rem;
    }

    .table-container {
      overflow-x: auto;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    thead {
      background: linear-gradient(110deg, #0e3f25 0%, #1f6c2e 55%, #2e9d37 100%);
      color: white;
    }

    th, td {
      padding: 0.75rem;
      text-align: left;
      border-bottom: 1px solid #e0e0e0;
    }

    tbody tr:hover {
      background: #f8f9fa;
    }

    .form {
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
    }

    .form input {
      display: block;
      margin: 0.4rem 0;
      width: 100%;
      padding: 0.6rem;
      border: 1px solid #ddd;
      border-radius: 6px;
    }

    .no-results {
      text-align: center;
      padding: 2rem;
      color: #666;
      font-style: italic;
    }

    button {
      cursor: pointer;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-weight: 600;
      transition: all 0.2s;
    }

    .btn-nuovo, .btn-filtra {
      background: #2e9d37;
      color: white;
    }

    .btn-nuovo:hover, .btn-filtra:hover {
      background: #23812b;
      transform: translateY(-1px);
    }

    .btn-reset {
      background: #6c757d;
      color: white;
    }

    .btn-reset:hover {
      background: #5a6268;
    }

    .btn-edit {
      background: #f18f1c;
      color: white;
      margin-right: 0.5rem;
    }

    .btn-edit:hover {
      background: #d67d0f;
    }

    .btn-delete {
      background: #e74c3c;
      color: white;
    }

    .btn-delete:hover {
      background: #c0392b;
    }

    .btn-carrello {
      background: #2e9d37;
      color: white;
    }

    .btn-carrello:hover:not([disabled]) {
      background: #23812b;
    }

    .btn-carrello[disabled] {
      background: #95a5a6;
      cursor: not-allowed;
      opacity: 0.6;
    }

    button[type="submit"] {
      background: #2e9d37;
      color: white;
      margin-right: 0.5rem;
    }

    button[type="button"] {
      background: #6c757d;
      color: white;
    }

    @media (max-width: 768px) {
      .catalogo { padding: 1rem; }
      .filtri-grid { grid-template-columns: 1fr; }
      .controlli-cliente { flex-direction: column; align-items: stretch; }
      .filtro-semplice { width: 100%; }
      .filtro-semplice input { flex: 1; }
    }
  `]
})
export class CatalogoPage implements OnInit {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private carrelloService = inject(CarrelloService);

  prodotti: any[] = [];
  prodottiOrdinati: any[] = [];
  filtroMarca = '';
  ordinamento = '';
  showForm = false;
  editMode = false;
  prodotto: any = {};
  isAdmin = false;

  filtri = {
    marca: '',
    prezzoMin: null as number | null,
    prezzoMax: null as number | null,
    quantitaMin: null as number | null,
    quantitaMax: null as number | null
  };

  ngOnInit() {
    this.caricaProdotti();
    const ruolo = this.auth.getRole();
    this.isAdmin = ruolo === 'SOCIO' || ruolo === 'DIPENDENTE';
  }

  caricaProdotti() {
    this.http.get<any[]>('http://localhost:8080/api/prodotti').subscribe({
      next: (res) => {
        this.prodotti = res;
        this.prodottiOrdinati = [...this.prodotti];
        this.ordinaProdotti();
      }
    });
  }

  cercaMarca() {
    if (this.filtroMarca.trim()) {
      this.http.get<any[]>(`http://localhost:8080/api/prodotti/search?marca=${this.filtroMarca}`)
        .subscribe({
          next: (res) => {
            this.prodotti = res;
            this.prodottiOrdinati = [...this.prodotti];
            this.ordinaProdotti();
          }
        });
    } else {
      this.caricaProdotti();
    }
  }

  applicaFiltri() {
    let params = new HttpParams();
    
    if (this.filtri.marca) {
      params = params.set('marca', this.filtri.marca);
    }
    if (this.filtri.prezzoMin !== null && this.filtri.prezzoMin !== undefined) {
      params = params.set('prezzoMin', this.filtri.prezzoMin.toString());
    }
    if (this.filtri.prezzoMax !== null && this.filtri.prezzoMax !== undefined) {
      params = params.set('prezzoMax', this.filtri.prezzoMax.toString());
    }
    if (this.filtri.quantitaMin !== null && this.filtri.quantitaMin !== undefined) {
      params = params.set('quantitaMin', this.filtri.quantitaMin.toString());
    }
    if (this.filtri.quantitaMax !== null && this.filtri.quantitaMax !== undefined) {
      params = params.set('quantitaMax', this.filtri.quantitaMax.toString());
    }

    this.http.get<any[]>('http://localhost:8080/api/prodotti/filter', { params })
      .subscribe({
        next: (res) => {
          this.prodotti = res;
          this.prodottiOrdinati = [...this.prodotti];
        }
      });
  }

  resetFiltri() {
    this.filtri = {
      marca: '',
      prezzoMin: null,
      prezzoMax: null,
      quantitaMin: null,
      quantitaMax: null
    };
    this.caricaProdotti();
  }

  ordinaProdotti() {
    if (!this.ordinamento) {
      this.prodottiOrdinati = [...this.prodotti];
      return;
    }

    this.prodottiOrdinati = [...this.prodotti].sort((a, b) => {
      switch (this.ordinamento) {
        case 'marca-asc':
          return (a.marca || '').localeCompare(b.marca || '');
        case 'marca-desc':
          return (b.marca || '').localeCompare(a.marca || '');
        case 'prezzo-asc':
          return (a.prezzo || 0) - (b.prezzo || 0);
        case 'prezzo-desc':
          return (b.prezzo || 0) - (a.prezzo || 0);
        default:
          return 0;
      }
    });
  }

  mostraForm() {
    this.showForm = true;
    this.editMode = false;
    this.prodotto = {};
  }

  salvaProdotto() {
    const url = this.editMode
      ? `http://localhost:8080/api/prodotti/${this.prodotto.id}`
      : 'http://localhost:8080/api/prodotti';

    const method = this.editMode ? 'put' : 'post';
    (this.http as any)[method](url, this.prodotto).subscribe({
      next: () => {
        this.showForm = false;
        this.caricaProdotti();
      }
    });
  }

  modifica(p: any) {
    this.prodotto = { ...p };
    this.showForm = true;
    this.editMode = true;
  }

  elimina(id: number) {
    if (confirm('Sei sicuro di voler eliminare questo prodotto?')) {
      this.http.delete(`http://localhost:8080/api/prodotti/${id}`).subscribe({
        next: () => this.caricaProdotti()
      });
    }
  }

  annulla() {
    this.showForm = false;
    this.prodotto = {};
  }

  aggiungiAlCarrello(p: any) {
    if (p.quantitaDisponibile <= 0) {
      alert('Prodotto non disponibile');
      return;
    }
    this.carrelloService.aggiungiProdotto(p.id).subscribe({
      next: () => alert(`✅ ${p.nome} aggiunto al carrello!`),
      error: (err) => alert(err?.error?.message || '❌ Errore durante l\'aggiunta al carrello.')
    });
  }
}
