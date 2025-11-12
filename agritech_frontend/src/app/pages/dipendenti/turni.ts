import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DipendentiService } from '../../services/dipendenti/dipendenti';
import { Turno } from '../../models/dipendenti';
import { NavbarComponent } from '../../components/navbar/navbar';

@Component({
  standalone: true, selector: 'app-turni', imports: [CommonModule, NavbarComponent],
  template: `
  <app-navbar></app-navbar>
  <div class="container">
    <h2>Turni</h2>
    <table class="table">
      <tr><th>CF</th><th>Giorni</th><th>Orario</th></tr>
      <tr *ngFor="let t of data"><td>{{t.dipendenteCf}}</td><td>{{t.giorni.join(', ')}}</td><td>{{t.orario}}</td></tr>
    </table>
  </div>`
})
export class TurniPage implements OnInit {
  private svc = inject(DipendentiService);
  data: Turno[] = [];
  ngOnInit(){ this.svc.turni().subscribe(d => this.data = d); }
}
