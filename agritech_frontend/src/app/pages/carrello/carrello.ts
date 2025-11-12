import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carrello',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  template: `
  <app-navbar></app-navbar>
  <div class="container">
    <h2>Il tuo carrello</h2>
    <p>Qui appariranno i prodotti selezionati per l'acquisto.</p>
  </div>
  `
})
export class CarrelloPage {}
