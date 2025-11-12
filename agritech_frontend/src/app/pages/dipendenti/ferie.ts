import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DipendentiService } from '../../services/dipendenti/dipendenti';
import { FeriePermessi } from '../../models/dipendenti';
import { NavbarComponent } from '../../components/navbar/navbar';

@Component({
  standalone: true, selector: 'app-ferie', imports: [CommonModule, NavbarComponent],
  template: `
  <app-navbar></app-navbar>
  <div class="container">
    <h2>Ferie & Permessi</h2>
    <table class="table">
      <tr><th>CF</th><th>Durata</th><th>Giorni</th></tr>
      <tr *ngFor="let f of data"><td>{{f.dipendenteCf}}</td><td>{{f.durata}}</td><td>{{f.giorniLavorativi.join(', ')}}</td></tr>
    </table>
  </div>`
})
export class FeriePage implements OnInit {
  private svc = inject(DipendentiService);
  data: FeriePermessi[] = [];
  ngOnInit(){ this.svc.feriePermessi().subscribe(d => this.data = d); }
}
