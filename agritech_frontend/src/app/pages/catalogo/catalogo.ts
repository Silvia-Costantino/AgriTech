import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth/auth';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <div class="catalogo">
    <h2>Catalogo Automezzi Agricoli</h2>

    <div class="controls">
      <input [(ngModel)]="filtro" placeholder="Filtra per marca..." />
      <button (click)="cerca()">Cerca</button>
      <button *ngIf="isAdmin" (click)="mostraForm()">Nuovo</button>
    </div>

    <div *ngIf="showForm" class="form">
      <h3>{{editMode ? 'Modifica' : 'Nuovo'}} automezzo</h3>
      <form (ngSubmit)="salvaProdotto()">
        <input [(ngModel)]="prodotto.nome" name="nome" placeholder="Nome" required />
        <input [(ngModel)]="prodotto.descrizione" name="descrizione" placeholder="Descrizione" />
        <input [(ngModel)]="prodotto.marca" name="marca" placeholder="Marca" required />
        <input [(ngModel)]="prodotto.modello" name="modello" placeholder="Modello" />
        <input type="number" [(ngModel)]="prodotto.prezzo" name="prezzo" placeholder="Prezzo" required />
        <input type="number" [(ngModel)]="prodotto.quantitaDisponibile" name="quantitaDisponibile" placeholder="Quantità disponibile" />
        <input type="number" [(ngModel)]="prodotto.stockMinimo" name="stockMinimo" placeholder="Stock minimo" />
        <button type="submit">Salva</button>
        <button type="button" (click)="annulla()">Annulla</button>
      </form>
    </div>

    <table>
      <tr>
        <th>Nome</th>
        <th>Marca</th>
        <th>Modello</th>
        <th>Descrizione</th>
        <th>Prezzo (€)</th>
        <th>Disponibili</th>
        <th>Stock min.</th>
        <th *ngIf="isAdmin">Azioni</th>
      </tr>
      <tr *ngFor="let p of prodotti">
        <td>{{p.nome}}</td>
        <td>{{p.marca}}</td>
        <td>{{p.modello}}</td>
        <td>{{p.descrizione}}</td>
        <td>{{p.prezzo | number:'1.2-2'}}</td>
        <td>{{p.quantitaDisponibile}}</td>
        <td>{{p.stockMinimo}}</td>
        <td *ngIf="isAdmin">
          <button (click)="modifica(p)">✏️</button>
          <button (click)="elimina(p.id)">🗑️</button>
        </td>
      </tr>
    </table>
  </div>
  `,
  styles: [`
    .catalogo { padding: 2rem; }
    .controls { margin-bottom: 1rem; display:flex; gap:.5rem; }
    table { width:100%; border-collapse: collapse; }
    th, td { border-bottom: 1px solid #ccc; padding: 0.75rem; text-align: left; }
    .form input { display:block; margin:0.4rem 0; width:100%; padding:0.4rem; }
  `]
})
export class CatalogoPage {
  private http = inject(HttpClient);
  private auth = inject(AuthService);

  prodotti: any[] = [];
  filtro = '';
  showForm = false;
  editMode = false;
  prodotto: any = {};
  isAdmin = false;

  ngOnInit() {
    this.caricaProdotti();
    const ruolo = this.auth.getRole();
    this.isAdmin = ruolo === 'SOCIO' || ruolo === 'DIPENDENTE';
  }

  caricaProdotti() {
    this.http.get<any[]>('http://localhost:8080/api/prodotti').subscribe(res => this.prodotti = res);
  }

  cerca() {
    if (this.filtro.trim()) {
      this.http.get<any[]>(`http://localhost:8080/api/prodotti/search?marca=${this.filtro}`)
        .subscribe(res => this.prodotti = res);
    } else {
      this.caricaProdotti();
    }
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
    (this.http as any)[method](url, this.prodotto).subscribe(() => {
      this.showForm = false;
      this.caricaProdotti();
    });
  }

  modifica(p: any) {
    this.prodotto = { ...p };
    this.showForm = true;
    this.editMode = true;
  }

  elimina(id: number) {
    if (confirm('Sei sicuro di voler eliminare questo prodotto?')) {
      this.http.delete(`http://localhost:8080/api/prodotti/${id}`).subscribe(() => this.caricaProdotti());
    }
  }

  annulla() {
    this.showForm = false;
    this.prodotto = {};
  }
}
