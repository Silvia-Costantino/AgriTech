import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OfficinaService } from '../../services/officina/officina';
import { Riparazione } from '../../models/officina';
import { NavbarComponent } from '../../components/navbar/navbar';
import {FormsModule} from '@angular/forms';

@Component({
  standalone: true, selector: 'app-officina', imports: [CommonModule, NavbarComponent, FormsModule],
  template: `
  <app-navbar></app-navbar>
  <div class="container">
    <h2>Officina — Riparazioni</h2>
    <table class="table">
      <tr><th>ID</th><th>Targa</th><th>Stato</th><th>Urgenza</th><th></th></tr>
      <tr *ngFor="let r of data">
        <td>{{r.id}}</td><td>{{r.targa}}</td>
        <td>
          <select [(ngModel)]="r.stato">
            <option>ATTESA</option><option>LAVORAZIONE</option><option>COMPLETATA</option>
          </select>
        </td>
        <td>
          <select [(ngModel)]="r.urgenza">
            <option>BASSA</option><option>MEDIA</option><option>ALTA</option>
          </select>
        </td>
        <td><button (click)="save(r)">Salva</button></td>
      </tr>
    </table>

    <a routerLink="/officina/ricambi">Vai a Ricambi</a>
  </div>
  `
})
export class OfficinaPage implements OnInit {
  private svc = inject(OfficinaService);
  data: Riparazione[] = [];
  ngOnInit(){ this.svc.riparazioni().subscribe(d => this.data = d); }
  save(r: Riparazione){ this.svc.updateRiparazione(r.id, r).subscribe(); }
}
