// src/app/pages/carrello/carrello.ts
import { Component, OnInit, inject } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarrelloService } from '../../services/carrello/carrello';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface CarrelloItem {
  id: number;
  prodotto: {
    id: number;
    nome: string;
    marca: string;
    modello: string;
    prezzo: number;
    quantitaDisponibile: number;
  };
  quantita: number;
}

interface Carrello {
  id: number;
  items: CarrelloItem[];
}

@Component({
  selector: 'app-carrello',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FormsModule],
  template: `
    <app-navbar></app-navbar>
    <div class="carrello-container">
      <div class="header">
        <h2>🛒 Il tuo carrello</h2>
        <button *ngIf="carrello?.items?.length"
                (click)="svuota()"
                class="btn-svuota">
          🗑️ Svuota carrello
        </button>
      </div>

      <div *ngIf="loading" class="loading">Caricamento...</div>
      <div *ngIf="error" class="error">{{ error }}</div>

      <div *ngIf="!loading && carrello && (!carrello.items || carrello.items.length === 0)" class="empty">
        <p>Il tuo carrello è vuoto</p>
        <button (click)="vaiAlCatalogo()" class="btn-primary">Vai al catalogo</button>
      </div>

      <div *ngIf="!loading && carrello?.items?.length" class="carrello-content">
        <table class="carrello-table">
          <thead>
          <tr>
            <th>Prodotto</th>
            <th>Prezzo unitario</th>
            <th>Quantità</th>
            <th>Totale</th>
            <th>Azioni</th>
          </tr>
          </thead>
          <tbody>
          <tr *ngFor="let item of (carrello?.items ?? [])" class="item-row">
            <td class="prodotto-info">
              <strong>{{ item.prodotto.nome }}</strong>
              <div class="prodotto-details">{{ item.prodotto.marca }} {{ item.prodotto.modello }}</div>
              <small class="disponibili">Disponibili: {{ item.prodotto.quantitaDisponibile }}</small>
            </td>
            <td class="prezzo">{{ item.prodotto.prezzo | currency:'EUR' }}</td>
            <td class="quantita">
              <div class="quantita-controls">
                <button (click)="decrementaQuantita(item)"
                        [disabled]="item.quantita <= 1 || updating"
                        class="btn-qty">-</button>
                <input type="number"
                       [value]="item.quantita"
                       (change)="aggiornaQuantitaInput(item, $event)"
                       [disabled]="updating"
                       min="1"
                       [max]="item.prodotto.quantitaDisponibile"
                       class="input-qty">
                <button (click)="incrementaQuantita(item)"
                        [disabled]="item.quantita >= item.prodotto.quantitaDisponibile || updating"
                        class="btn-qty">+</button>
              </div>
            </td>
            <td class="totale-item">{{ (item.prodotto.prezzo * item.quantita) | currency:'EUR' }}</td>
            <td class="azioni">
              <button (click)="rimuovi(item.prodotto.id)"
                      [disabled]="updating"
                      class="btn-rimuovi">🗑️</button>
            </td>
          </tr>
          </tbody>
        </table>

        <div class="totale-section">
          <div class="totale-row">
            <span class="totale-label">Totale:</span>
            <span class="totale-importo">{{ totaleCarrello | currency:'EUR' }}</span>
          </div>
          <button (click)="procediAllOrdine()" class="btn-ordine">Procedi all'ordine</button>
        </div>
      </div>
    </div>
  `
})
export class CarrelloPage implements OnInit {
  private carrelloService = inject(CarrelloService);
  private router = inject(Router);
  private http = inject(HttpClient);
  private currencyPipe = inject(CurrencyPipe);

  carrello: Carrello | null = null;
  loading = false;
  error: string | null = null;
  updating = false;

  ngOnInit() {
    this.caricaCarrello();
  }

  caricaCarrello() {
    this.loading = true;
    this.error = null;
    this.carrelloService.getCarrello().subscribe({
      next: (data) => {
        this.carrello = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Errore nel caricamento del carrello';
        this.loading = false;
      }
    });
  }

  get totaleCarrello(): number {
    if (!this.carrello?.items) return 0;
    return this.carrello.items.reduce((totale, item) => totale + (item.prodotto.prezzo * item.quantita), 0);
  }

  incrementaQuantita(item: CarrelloItem) {
    if (item.quantita >= item.prodotto.quantitaDisponibile) return;
    this.aggiornaQuantita(item.prodotto.id, item.quantita + 1);
  }

  decrementaQuantita(item: CarrelloItem) {
    if (item.quantita <= 1) return;
    this.aggiornaQuantita(item.prodotto.id, item.quantita - 1);
  }

  aggiornaQuantitaInput(item: CarrelloItem, event: Event) {
    const input = event.target as HTMLInputElement;
    const nuovaQuantita = parseInt(input.value, 10);
    if (isNaN(nuovaQuantita) || nuovaQuantita < 1) {
      input.value = item.quantita.toString();
      return;
    }
    if (nuovaQuantita > item.prodotto.quantitaDisponibile) {
      input.value = item.quantita.toString();
      alert(`Quantità massima disponibile: ${item.prodotto.quantitaDisponibile}`);
      return;
    }
    this.aggiornaQuantita(item.prodotto.id, nuovaQuantita);
  }

  aggiornaQuantita(prodottoId: number, quantita: number) {
    this.updating = true;
    this.carrelloService.aggiornaQuantita(prodottoId, quantita).subscribe({
      next: (data) => {
        this.carrello = data;
        this.updating = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Errore nell\'aggiornamento della quantità';
        this.updating = false;
        this.caricaCarrello();
      }
    });
  }

  rimuovi(prodottoId: number) {
    if (!confirm('Sei sicuro di voler rimuovere questo prodotto dal carrello?')) return;

    this.updating = true;
    this.carrelloService.rimuoviProdotto(prodottoId).subscribe({
      next: (data) => {
        this.carrello = data;
        this.updating = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Errore nella rimozione del prodotto';
        this.updating = false;
        this.caricaCarrello();
      }
    });
  }

  svuota() {
    if (!confirm('Sei sicuro di voler svuotare completamente il carrello?')) return;

    this.updating = true;
    this.carrelloService.svuotaCarrello().subscribe({
      next: (data) => {
        this.carrello = data;
        this.updating = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Errore nello svuotamento del carrello';
        this.updating = false;
        this.caricaCarrello();
      }
    });
  }

  vaiAlCatalogo() {
    this.router.navigate(['/catalogo']);
  }

  procediAllOrdine() {
    if (!this.carrello?.id) {
      alert('Errore: carrello non valido');
      return;
    }
    if (!this.carrello.items?.length) {
      alert('Il carrello è vuoto');
      return;
    }

    const totaleFormattato = this.currencyPipe.transform(this.totaleCarrello, 'EUR');
    if (!confirm(`Confermi l'ordine per un totale di ${totaleFormattato}?`)) return;

    this.updating = true;
    this.http.post(`http://localhost:8080/api/ordini/from-carrello/${this.carrello.id}`, {}).subscribe({
      next: () => {
        alert('✅ Ordine creato con successo!');
        this.router.navigate(['/ordini']);
      },
      error: (err) => {
        this.error = err?.error?.message || 'Errore nella creazione dell\'ordine';
        this.updating = false;
      }
    });
  }
}
