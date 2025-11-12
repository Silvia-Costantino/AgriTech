import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DipendentiService } from '../../services/dipendenti/dipendenti';
import { Dipendente } from '../../models/dipendenti';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../components/navbar/navbar';

@Component({
  standalone: true,
  selector: 'app-dipendenti',
  imports: [CommonModule, FormsModule, NavbarComponent],
  template: `
  <app-navbar></app-navbar>
  <div class="container">
    <h2>Dipendenti</h2>

    <form class="row g-2" (ngSubmit)="save()">
      <input class="col" [(ngModel)]="form.cf" name="cf" placeholder="CF" required>
      <input class="col" [(ngModel)]="form.nome" name="nome" placeholder="Nome" required>
      <input class="col" [(ngModel)]="form.cognome" name="cognome" placeholder="Cognome" required>
      <input class="col" [(ngModel)]="form.mansione" name="mansione" placeholder="Mansione" required>
      <button class="col-auto">Salva</button>
    </form>

    <table class="table mt-3">
      <tr><th>CF</th><th>Nome</th><th>Cognome</th><th>Mansione</th><th></th></tr>
      <tr *ngFor="let d of data">
        <td>{{d.cf}}</td><td>{{d.nome}}</td><td>{{d.cognome}}</td><td>{{d.mansione}}</td>
        <td><button (click)="remove(d.cf)">Elimina</button></td>
      </tr>
    </table>

    <div class="mt-2">
      <a routerLink="/dipendenti/turni">Gestione Turni</a> ·
      <a routerLink="/dipendenti/ferie">Ferie & Permessi</a> ·
      <a routerLink="/dipendenti/buste-paga">Buste paga</a>
    </div>
  </div>
  `
})
export class DipendentiPage implements OnInit {
  private svc = inject(DipendentiService);
  data: Dipendente[] = [];
  form: Partial<Dipendente> = { cf: '', nome: '', cognome: '', mansione: '' };

  ngOnInit(){ this.load(); }
  load(){ this.svc.list().subscribe(d => this.data = d); }
  save(){ this.svc.save(this.form).subscribe(()=>{ this.form = { cf:'',nome:'',cognome:'',mansione:'' }; this.load(); }); }
  remove(cf: string){ this.svc.remove(cf).subscribe(()=> this.load()); }
}
