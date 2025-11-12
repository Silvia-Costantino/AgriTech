import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DipendentiService } from '../../services/dipendenti/dipendenti';
import { BustaPaga } from '../../models/dipendenti';
import { NavbarComponent } from '../../components/navbar/navbar';

@Component({
  standalone: true, selector: 'app-buste-paga', imports: [CommonModule, NavbarComponent],
  template: `
  <app-navbar></app-navbar>
  <div class="container">
    <h2>Buste paga</h2>
    <table class="table">
      <tr><th>ID</th><th>CF</th><th>Mese</th><th>Importo</th></tr>
      <tr *ngFor="let b of data"><td>{{b.id}}</td><td>{{b.dipendenteCf}}</td><td>{{b.mese}}</td><td>{{b.importo | currency:'EUR'}}</td></tr>
    </table>
  </div>`
})
export class BustePagaPage implements OnInit {
  private svc = inject(DipendentiService);
  data: BustaPaga[] = [];
  ngOnInit(){ this.svc.bustePaga().subscribe(d => this.data = d); }
}
