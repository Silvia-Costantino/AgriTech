import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profilo',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  template: `
  <app-navbar></app-navbar>
  <div class="container">
    <h2>Profilo Utente</h2>
    <p>Qui puoi modificare i tuoi dati personali e visualizzare lo storico ordini.</p>
  </div>
  `
})
export class ProfiloPage {}
