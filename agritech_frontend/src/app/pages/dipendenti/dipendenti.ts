import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DipendentiService } from '../../services/dipendenti/dipendenti';
import { Dipendente, Turno, FeriePermessi } from '../../models/dipendenti';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-dipendenti',
  imports: [CommonModule, FormsModule],
  template: `
  <div class="dipendenti-container">
    <h2>Gestione Dipendenti</h2>

    <h3>Anagrafica, Turni e Ferie (sempre visibile)</h3>
    <table class="table">
      <tr>
        <th>CF</th><th>Nome</th><th>Cognome</th><th>Mansione</th>
        <th>Giorni</th><th>Orario</th><th>Azioni</th><th>Ferie/Permessi</th>
      </tr>
      <tr *ngFor="let r of righe">
        <td>{{r.d.cf}}</td>
        <td>{{r.d.nome}}</td>
        <td>{{r.d.cognome}}</td>
        <td>{{r.d.mansione}}</td>
        <td>
          <ng-container *ngIf="!editing[r.d.cf]; else editTurni">
            {{r.t?.giorni?.join(', ') || '-'}}
          </ng-container>
          <ng-template #editTurni>
            <label *ngFor="let g of giorniSet" class="chk"><input type="checkbox" [(ngModel)]="editor[r.d.cf].giorniMap[g]"> {{g}}</label>
          </ng-template>
        </td>
        <td>
          <ng-container *ngIf="!editing[r.d.cf]; else editOrario">{{r.t?.orario || '-'}}</ng-container>
          <ng-template #editOrario>
            <input [(ngModel)]="editor[r.d.cf].orario" placeholder="HH:MM-HH:MM" />
          </ng-template>
        </td>
        <td>
          <button *ngIf="!editing[r.d.cf]" class="btn-secondary" (click)="startEdit(r)">Modifica turni</button>
          <ng-container *ngIf="editing[r.d.cf]">
            <button class="btn-primary" (click)="saveTurni(r)">Salva</button>
            <button class="btn-secondary" (click)="cancelEdit(r)">Annulla</button>
          </ng-container>
        </td>
        <td>
          <div *ngIf="r.f?.length; else noferie">
            <div *ngFor="let f of r.f">
              <span>{{f.durata}} gg ({{f.giorniLavorativi.join(', ')}})</span>
              <span class="badge" [class.approvato]="f.stato==='APPROVATO'" [class.rifiutato]="f.stato==='RIFIUTATO'">{{ f.stato || 'IN_ATTESA' }}</span>
              <button *ngIf="f.stato!=='APPROVATO'" class="btn-primary" (click)="setFerie(r.d.cf, f, 'APPROVATO')">Approva</button>
              <button *ngIf="f.stato!=='RIFIUTATO'" class="btn-secondary" (click)="setFerie(r.d.cf, f, 'RIFIUTATO')">Rifiuta</button>
            </div>
          </div>
          <ng-template #noferie>-</ng-template>
        </td>
      </tr>
    </table>

    <h3>Anagrafica Dipendenti</h3>
    <form class="row g-2 form-inline" (ngSubmit)="save()">
      <input class="col" [(ngModel)]="form.cf" name="cf" placeholder="CF" required>
      <input class="col" [(ngModel)]="form.nome" name="nome" placeholder="Nome" required>
      <input class="col" [(ngModel)]="form.cognome" name="cognome" placeholder="Cognome" required>
      <input class="col" [(ngModel)]="form.mansione" name="mansione" placeholder="Mansione" required>
      <button class="btn-primary col-auto" type="submit">Salva</button>
    </form>

    <table class="table mt-3">
      <tr><th>CF</th><th>Nome</th><th>Cognome</th><th>Mansione</th><th></th></tr>
      <tr *ngFor="let d of data">
        <td>{{d.cf}}</td><td>{{d.nome}}</td><td>{{d.cognome}}</td><td>{{d.mansione}}</td>
        <td><button class="btn-secondary danger" (click)="remove(d.cf)">Elimina</button></td>
      </tr>
    </table>
  </div>
  `,
  styles: [`
    .dipendenti-container { padding: 2rem; max-width: 1200px; margin: 0 auto; }
    h2 { margin:0 0 1rem 0; color:#0e3f25; font-size: 2rem; }
    .table { width:100%; border-collapse: collapse; background:#fff; border-radius:8px; overflow:hidden; box-shadow:0 2px 6px rgba(0,0,0,0.1); }
    .table tr:first-child th { background: linear-gradient(110deg, #0e3f25 0%, #1f6c2e 55%, #2e9d37 100%); color:#fff; }
    th, td { padding:.75rem; border-bottom:1px solid #e0e0e0; text-align:left; vertical-align: top; }
    .actions { display:flex; gap:.5rem; align-items:center; }
    .btn-primary { background:#2e9d37; color:#fff; border:none; padding:.45rem .9rem; border-radius:6px; cursor:pointer; }
    .btn-secondary { background:#fff; color:#1f6c2e; border:1px solid #1f6c2e; padding:.4rem .8rem; border-radius:6px; cursor:pointer; }
    .btn-secondary.danger { border-color:#b00020; color:#b00020; }
    .form-inline { display:flex; gap:.5rem; flex-wrap:wrap; align-items:center; margin:.75rem 0; }
    .form-inline input { padding:.5rem; border:1px solid #ddd; border-radius:6px; }
    .chk { margin-right: .5rem; display:inline-block; }
    .badge { margin-left: .4rem; font-size: .8rem; padding: .1rem .4rem; border-radius: .4rem; background:#eee; }
    .badge.approvato { background:#e8f5e9; color:#1b5e20; }
    .badge.rifiutato { background:#ffebee; color:#b71c1c; }
  `]
})
export class DipendentiPage implements OnInit {
  private svc = inject(DipendentiService);
  data: Dipendente[] = [];
  turni: Turno[] = [];
  ferie: FeriePermessi[] = [];
  righe: { d: Dipendente; t?: Turno; f?: FeriePermessi[] }[] = [];
  editing: Record<string, boolean> = {};
  editor: Record<string, { giorniMap: Record<string, boolean>; orario: string }> = {};
  giorniSet = ['Lun','Mar','Mer','Gio','Ven','Sab','Dom'];

  form: Partial<Dipendente> = { cf: '', nome: '', cognome: '', mansione: '' };

  ngOnInit(){ this.load(); }
  load(){
    this.svc.list().subscribe(d => {
      this.data = d;
      this.svc.turni().subscribe(t => {
        this.turni = t;
        this.svc.feriePermessi().subscribe(f => {
          this.ferie = f;
          this.righe = this.data.map(dip => ({
            d: dip,
            t: this.turni.find(tt => tt.dipendenteCf === dip.cf),
            f: this.ferie.filter(ff => ff.dipendenteCf === dip.cf)
          }));
        });
      });
    });
  }
  startEdit(r: { d: Dipendente; t?: Turno }){
    this.editing[r.d.cf] = true;
    const map: Record<string, boolean> = {};
    for (const g of this.giorniSet) map[g] = r.t?.giorni?.includes(g) || false;
    this.editor[r.d.cf] = { giorniMap: map, orario: r.t?.orario || '' };
  }
  cancelEdit(r: { d: Dipendente }){ this.editing[r.d.cf] = false; }
  saveTurni(r: { d: Dipendente; t?: Turno }){
    const selGiorni = this.giorniSet.filter(g => this.editor[r.d.cf].giorniMap[g]);
    const orario = this.editor[r.d.cf].orario || '';
    const payload: Turno = { dipendenteCf: r.d.cf, giorni: selGiorni, orario };
    this.svc.updateTurno(payload).subscribe(() => {
      r.t = payload;
      this.editing[r.d.cf] = false;
    });
  }
  setFerie(cf: string, f: FeriePermessi, stato: 'APPROVATO'|'RIFIUTATO'){
    this.svc.setFerieStato(cf, f.giorniLavorativi, stato).subscribe(() => { f.stato = stato; });
  }
  save(){ this.svc.save(this.form).subscribe(()=>{ this.form = { cf:'',nome:'',cognome:'',mansione:'' }; this.load(); }); }
  remove(cf: string){ this.svc.remove(cf).subscribe(()=> this.load()); }
}
