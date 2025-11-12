import { Component, inject, OnInit } from '@angular/core';
import { OrdiniService } from '../../services/ordini/ordini';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar';
import { Ordine } from '../../models/ordine';

@Component({
  selector: 'app-ordini',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  template: `
  <app-navbar></app-navbar>
  <div class="container">
    <h2>Gestione Ordini</h2>
    <table>
      <tr><th>ID</th><th>Data</th><th>Stato</th><th>Importo</th></tr>
      <tr *ngFor="let o of ordini">
        <td>{{o.id}}</td><td>{{o.data}}</td><td>{{o.stato}}</td><td>{{o.importo | currency}}</td>
      </tr>
    </table>
  </div>
  `
})
export class OrdiniPage implements OnInit {
  private service = inject(OrdiniService);
  ordini: Ordine[] = [];
  ngOnInit(){ this.service.list().subscribe(o => this.ordini = o); }
}
