import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {OfficinaService } from '../../services/officina/officina';
import { Ricambio } from '../../models/officina';

@Component({
  standalone: true, selector: 'app-ricambi',
  imports: [CommonModule, FormsModule],
  template: `
  <div class="container">
    <h2>Archivio Ricambi</h2>

    <form class="row g-2" (ngSubmit)="save()">
      <input class="col" [(ngModel)]="form.descrizione" name="descrizione" placeholder="Descrizione" required>
      <input class="col" [(ngModel)]="form.codice" name="codice" placeholder="Codice ricambio" required>
      <input class="col" type="number" [(ngModel)]="form.quantita" name="quantita" placeholder="Q.tà" required>
      <input class="col" type="number" step="0.01" [(ngModel)]="form.prezzo" name="prezzo" placeholder="Prezzo unitario" required>
      <input class="col" type="number" [(ngModel)]="form.scortaMinima" name="scortaMinima" placeholder="Scorta minima" required>
      <input class="col" type="date" [(ngModel)]="form.ultimaApprovvigionamento" name="ultimaApprovvigionamento" placeholder="Ultimo approvv." >
      <button class="col-auto">Salva</button>
    </form>

    <table class="table mt-3">
      <tr><th>Codice</th><th>Descrizione</th><th>Disponibili</th><th>Prezzo unitario</th><th>Ultimo approvv.</th><th>Stato</th><th></th></tr>
      <tr *ngFor="let r of data" [class.low-stock]="r.scortaMinima && r.quantita < r.scortaMinima">
        <td>{{r.codice || ('R-' + r.id)}}</td>
        <td>{{r.descrizione}}</td>
        <td>{{r.quantita}}</td>
        <td>{{r.prezzo | currency:'EUR'}}</td>
        <td>{{r.ultimaApprovvigionamento || '-'}}</td>
        <td>
          <span *ngIf="r.scortaMinima && r.quantita < r.scortaMinima" class="alert">Riordino</span>
          <span *ngIf="!r.scortaMinima || r.quantita >= r.scortaMinima">OK</span>
        </td>
        <td><button (click)="edit(r)">Modifica</button></td>
      </tr>
    </table>
  </div>
  `
})
export class RicambiPage implements OnInit {
  private svc = inject(OfficinaService);
  data: Ricambio[] = [];
  form: Partial<Ricambio> = { descrizione: '', codice: '', quantita: 0, prezzo: 0, scortaMinima: 0 };

  ngOnInit(){ this.load(); }
  load(){ this.svc.ricambi().subscribe(d => this.data = d); }
  save(){
    if (this.form.id){
      this.svc.updateRicambio(this.form.id, this.form).subscribe(()=>{ this.form = { descrizione:'', codice:'', quantita:0, prezzo:0, scortaMinima:0 }; this.load(); });
    } else {
      this.svc.saveRicambio(this.form).subscribe(()=>{ this.form = { descrizione:'', codice:'', quantita:0, prezzo:0, scortaMinima:0 }; this.load(); });
    }
  }
  edit(r: Ricambio){ this.form = { ...r }; }
}
