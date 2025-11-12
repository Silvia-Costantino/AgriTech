import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContabilitaService } from '../../services/contabilita/contabilita';
import { NavbarComponent } from '../../components/navbar/navbar';
import {CreditoItem, DebitoItem, Disponibilita, Finanziamento} from '../../models/contabilita';

@Component({
  standalone: true, selector: 'app-contabilita', imports: [CommonModule, NavbarComponent],
  template: `
  <app-navbar></app-navbar>
  <div class="container">
    <h2>Contabilità</h2>

    <section class="card">
      <h3>Disponibilità</h3>
      <div *ngIf="disp">Cassa: {{disp.cassa | currency:'EUR'}} — Movimenti odierni: {{disp.movimentiOggi | currency:'EUR'}}</div>
    </section>

    <div class="grid">
      <section class="card">
        <h3>Crediti</h3>
        <ul><li *ngFor="let c of crediti">{{c.tipo}} — {{c.descrizione}} — {{c.importo | currency:'EUR'}}</li></ul>
      </section>

      <section class="card">
        <h3>Debiti</h3>
        <ul><li *ngFor="let d of debiti">{{d.tipo}} — {{d.descrizione}} — {{d.importo | currency:'EUR'}}</li></ul>
      </section>
    </div>

    <section class="card">
      <h3>Finanziamenti Clienti</h3>
      <table class="table">
        <tr><th>ID</th><th>Cliente</th><th>Totale</th><th>Rata</th><th>Rate</th><th>Stato</th><th></th></tr>
        <tr *ngFor="let f of finanziamenti">
          <td>{{f.id}}</td><td>{{f.clienteId}}</td><td>{{f.importoTotale | currency:'EUR'}}</td>
          <td>{{f.importoRata | currency:'EUR'}}</td><td>{{f.numeroRate}}</td><td>{{f.stato}}</td>
          <td><button (click)="conferma(f.id)" [disabled]="f.stato!=='ATTIVO'">Conferma</button></td>
        </tr>
      </table>
    </section>
  </div>
  `,
  styles: [`.grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}.card{border:1px solid #ddd;padding:12px;border-radius:8px;margin:10px 0}`]
})
export class ContabilitaPage implements OnInit {
  private svc = inject(ContabilitaService);
  disp?: Disponibilita;
  crediti: CreditoItem[] = [];
  debiti: DebitoItem[] = [];
  finanziamenti: Finanziamento[] = [];

  ngOnInit(){
    this.svc.disponibilita().subscribe(v => this.disp = v);
    this.svc.crediti().subscribe(v => this.crediti = v);
    this.svc.debiti().subscribe(v => this.debiti = v);
    this.svc.finanziamenti().subscribe(v => this.finanziamenti = v);
  }
  conferma(id: number){ this.svc.confermaFinanziamento(id).subscribe(()=> this.ngOnInit()); }
}
