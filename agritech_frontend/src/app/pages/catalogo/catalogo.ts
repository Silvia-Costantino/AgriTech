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

      <!-- ░░░░░ FILTRI AVANZATI: SOCIO / DIPENDENTE ░░░░░ -->
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
            <button (click)="applicaFiltri()" class="btn-filtra">Applica Filtri</button>
            <button (click)="resetFiltri()" class="btn-reset">Reset</button>
          </div>
        </div>
      </div>

      <!-- ░░░░░ FILTRI CLIENTE ░░░░░ -->
      <div *ngIf="!isAdmin" class="controlli-cliente">
        <div class="filtro-semplice">
          <input [(ngModel)]="filtroMarca" placeholder="Filtra per marca..." />
          <button (click)="cercaMarca()">Cerca</button>
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

      <!-- ░░░░░ BOTTONI AMMINISTRAZIONE ░░░░░ -->
      <div class="controls">
        <button *ngIf="isAdmin" (click)="mostraForm()" class="btn-nuovo">Nuovo</button>
      </div>

      <!-- ░░░░░ FORM NUOVO / MODIFICA PRODOTTO ░░░░░ -->
      <div *ngIf="showForm" class="form">
        <h3>{{ editMode ? 'Modifica' : 'Nuovo' }} Automezzo</h3>

        <form (ngSubmit)="salvaProdotto()">
          <input [(ngModel)]="prodotto.nome" name="nome" placeholder="Nome" required />
          <input [(ngModel)]="prodotto.descrizione" name="descrizione" placeholder="Descrizione" />
          <input [(ngModel)]="prodotto.marca" name="marca" placeholder="Marca" required />
          <input [(ngModel)]="prodotto.modello" name="modello" placeholder="Modello" />

          <input type="number" [(ngModel)]="prodotto.prezzo" name="prezzo" placeholder="Prezzo" step="0.01" required />
          <input type="number" [(ngModel)]="prodotto.quantitaDisponibile" name="quantitaDisponibile" placeholder="Disponibili" />
          <input type="number" [(ngModel)]="prodotto.stockMinimo" name="stockMinimo" placeholder="Stock minimo" />

          <button type="submit">Salva</button>
          <button type="button" (click)="annulla()">Annulla</button>
        </form>
      </div>

      <!-- ░░░░░ TABELLA PRODOTTI (visibile a tutti) ░░░░░ -->
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
            <th *ngIf="isAdmin">Stock Min.</th>
            <th>Azioni</th>
          </tr>
          </thead>

          <tbody>
          <tr *ngFor="let p of prodottiOrdinati">
            <td>{{ p.nome }}</td>
            <td>{{ p.marca }}</td>
            <td>{{ p.modello }}</td>
            <td>{{ p.descrizione }}</td>
            <td>{{ p.prezzo | number:'1.2-2' }}</td>
            <td>{{ p.quantitaDisponibile }}</td>
            <td *ngIf="isAdmin">{{ p.stockMinimo }}</td>

            <td>
              <ng-container *ngIf="isAdmin; else clienteActions">
                <button class="btn-edit" (click)="modifica(p)">Modifica</button>
                <button class="btn-delete" (click)="elimina(p.id)">Elimina</button>
              </ng-container>

              <ng-template #clienteActions>
                <button
                  class="btn-carrello"
                  (click)="aggiungiAlCarrello(p)"
                  [disabled]="p.quantitaDisponibile <= 0"
                >
                  {{ p.quantitaDisponibile > 0 ? 'Aggiungi' : 'Non disponibile' }}
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

    .filtri-avanzati, .form {
      background: #f8f9fa;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
      border-radius: 8px;
      border: 1px solid #e0e0e0;
    }

    .filtri-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .filtro-group { display: flex; flex-direction: column; gap: .3rem; }
    .filtro-group input {
      padding: .6rem;
      border: 1px solid #ccc;
      border-radius: 6px;
    }

    .controlli-cliente {
      margin-bottom: 1.5rem;
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .filtro-semplice {
      display: flex;
      gap: .5rem;
    }

    .ordinamento { display: flex; gap: .5rem; align-items: center; }

    table { width: 100%; border-collapse: collapse; }
    thead {
      background: linear-gradient(110deg, #0e3f25, #1f6c2e 55%, #2e9d37);
      color: white;
    }

    th, td { padding: .75rem; border-bottom: 1px solid #e0e0e0; }
    tbody tr:hover { background: #f8f9fa; }

    button {
      padding: .5rem 1rem;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
    }

    .btn-nuovo, .btn-filtra { background: #2e9d37; color:white; }
    .btn-edit { background:#f39c12; color:white; }
    .btn-delete { background:#e74c3c; color:white; }
    .btn-carrello { background:#2e9d37; color:white; }

    .btn-carrello[disabled] {
      background:#aaa; cursor:not-allowed; opacity:.6;
    }

    .no-results { padding: 2rem; text-align: center; color: #666; }
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
    this.isAdmin = ['SOCIO', 'DIPENDENTE'].includes(this.auth.getRole() ?? '');
  }

  caricaProdotti() {
    this.http.get<any[]>('http://localhost:8080/api/prodotti').subscribe(res => {
      this.prodotti = res;
      this.prodottiOrdinati = [...this.prodotti];
      this.ordinaProdotti();
    });
  }

  cercaMarca() {
    if (!this.filtroMarca.trim()) return this.caricaProdotti();

    this.http.get<any[]>(`http://localhost:8080/api/prodotti/search?marca=${this.filtroMarca}`)
      .subscribe(res => {
        this.prodotti = res;
        this.prodottiOrdinati = [...res];
        this.ordinaProdotti();
      });
  }

  applicaFiltri() {
    let params = new HttpParams();

    Object.entries(this.filtri).forEach(([key, val]) => {
      if (val !== null && val !== '') params = params.set(key, val as any);
    });

    this.http.get<any[]>('http://localhost:8080/api/prodotti/filter', { params })
      .subscribe(res => {
        this.prodotti = res;
        this.prodottiOrdinati = [...res];
      });
  }

  resetFiltri() {
    this.filtri = { marca: '', prezzoMin: null, prezzoMax: null, quantitaMin: null, quantitaMax: null };
    this.caricaProdotti();
  }

  ordinaProdotti() {
    const ord = this.ordinamento;

    this.prodottiOrdinati = [...this.prodotti].sort((a, b) => {
      switch (ord) {
        case 'marca-asc': return a.marca.localeCompare(b.marca);
        case 'marca-desc': return b.marca.localeCompare(a.marca);
        case 'prezzo-asc': return a.prezzo - b.prezzo;
        case 'prezzo-desc': return b.prezzo - a.prezzo;
        default: return 0;
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
      : `http://localhost:8080/api/prodotti`;

    const metodo = this.editMode ? 'put' : 'post';

    (this.http as any)[metodo](url, this.prodotto).subscribe(() => {
      this.showForm = false;
      this.caricaProdotti();
    });
  }

  modifica(p: any) {
    this.showForm = true;
    this.editMode = true;
    this.prodotto = { ...p };
  }

  elimina(id: number) {
    if (!confirm('Sei sicuro di voler eliminare questo prodotto?')) return;

    this.http.delete(`http://localhost:8080/api/prodotti/${id}`)
      .subscribe(() => this.caricaProdotti());
  }

  annulla() {
    this.showForm = false;
    this.prodotto = {};
  }

  aggiungiAlCarrello(p: any) {
    if (p.quantitaDisponibile <= 0) return alert('Prodotto non disponibile');

    this.carrelloService.aggiungiProdotto(p.id).subscribe({
      next: () => alert(`✔ ${p.nome} aggiunto al carrello!`),
      error: err => alert(err?.error?.message || 'Errore aggiunta al carrello')
    });
  }
}
