import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FornitoriService } from '../../services/fornitori/fornitori';
import { Fornitore } from '../../models/fornitore';
import { NavbarComponent } from '../../components/navbar/navbar';

@Component({
  standalone: true, selector: 'app-fornitori',
  imports: [CommonModule, FormsModule, NavbarComponent],
  template: `
  <app-navbar></app-navbar>
  <div class="container">
    <h2>Rubrica Fornitori</h2>

    <form class="row g-2" (ngSubmit)="save()">
      <input class="col" [(ngModel)]="form.piva" name="piva" placeholder="P.IVA" required>
      <input class="col" [(ngModel)]="form.nome" name="nome" placeholder="Nome" required>
      <input class="col" [(ngModel)]="form.casaProduttrice" name="casa" placeholder="Casa Produttrice">
      <label class="col-auto"><input type="checkbox" [(ngModel)]="form.preferenze" name="pref"> Preferito</label>
      <button class="col-auto">Salva</button>
    </form>

    <table class="table mt-3">
      <tr><th>P.IVA</th><th>Nome</th><th>Casa</th><th>Preferito</th><th></th></tr>
      <tr *ngFor="let f of data">
        <td>{{f.piva}}</td><td>{{f.nome}}</td><td>{{f.casaProduttrice || '-'}}</td>
        <td>{{f.preferenze ? 'Sì' : 'No'}}</td>
        <td><button (click)="remove(f.piva)">Elimina</button></td>
      </tr>
    </table>
  </div>
  `
})
export class FornitoriPage implements OnInit {
  private svc = inject(FornitoriService);
  data: Fornitore[] = [];
  form: Partial<Fornitore> = { piva: '', nome: '', preferenze: false };

  ngOnInit(){ this.load(); }
  load(){ this.svc.list().subscribe(d => this.data = d); }
  save(){ this.svc.save(this.form).subscribe(()=>{ this.form = { piva:'', nome:'', preferenze:false }; this.load(); }); }
  remove(piva: string){ this.svc.remove(piva).subscribe(()=> this.load()); }
}
