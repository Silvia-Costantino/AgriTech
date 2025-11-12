import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {OfficinaService } from '../../services/officina/officina';
import { Ricambio } from '../../models/officina';
import { NavbarComponent } from '../../components/navbar/navbar';

@Component({
  standalone: true, selector: 'app-ricambi',
  imports: [CommonModule, FormsModule, NavbarComponent],
  template: `
  <app-navbar></app-navbar>
  <div class="container">
    <h2>Archivio Ricambi</h2>

    <form class="row g-2" (ngSubmit)="save()">
      <input class="col" [(ngModel)]="form.descrizione" name="descrizione" placeholder="Descrizione" required>
      <input class="col" type="number" [(ngModel)]="form.quantita" name="quantita" placeholder="Q.ta" required>
      <input class="col" type="number" [(ngModel)]="form.prezzo" name="prezzo" placeholder="Prezzo" required>
      <button class="col-auto">Aggiungi</button>
    </form>

    <table class="table mt-3">
      <tr><th>ID</th><th>Descrizione</th><th>Q.ta</th><th>Prezzo</th><th></th></tr>
      <tr *ngFor="let r of data">
        <td>{{r.id}}</td><td>{{r.descrizione}}</td><td>{{r.quantita}}</td><td>{{r.prezzo | currency:'EUR'}}</td>
        <td><button (click)="edit(r)">Modifica</button></td>
      </tr>
    </table>
  </div>
  `
})
export class RicambiPage implements OnInit {
  private svc = inject(OfficinaService);
  data: Ricambio[] = [];
  form: Partial<Ricambio> = { descrizione: '', quantita: 0, prezzo: 0 };

  ngOnInit(){ this.load(); }
  load(){ this.svc.ricambi().subscribe(d => this.data = d); }
  save(){ this.svc.saveRicambio(this.form).subscribe(()=>{ this.form = { descrizione:'', quantita:0, prezzo:0 }; this.load(); }); }
  edit(r: Ricambio){ this.svc.updateRicambio(r.id, r).subscribe(()=> this.load()); }
}
