import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountService, ProfiloDTO, FinanziamentoDTO, PreventivoDTO } from '../../services/account/account';

@Component({
  selector: 'app-profilo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <div class="account-container">
    <h2>Account Cliente</h2>

    <div class="table-container">
      <h3 class="section-title">Dati di contatto</h3>
      <form class="form-inline" (ngSubmit)="salvaContatti()">
        <input [(ngModel)]="profilo.nome" name="nome" placeholder="Nome" />
        <input [(ngModel)]="profilo.cognome" name="cognome" placeholder="Cognome" />
        <input [(ngModel)]="profilo.telefono" name="telefono" placeholder="Telefono" />
        <input [(ngModel)]="profilo.indirizzo" name="indirizzo" placeholder="Indirizzo" />
        <button class="btn-primary" type="submit">Salva</button>
      </form>
    </div>

    <div class="table-container mt">
      <h3 class="section-title">Modifica password</h3>
      <form class="form-inline" (ngSubmit)="cambiaPassword()">
        <input [(ngModel)]="oldPassword" type="password" name="old" placeholder="Password attuale" required />
        <input [(ngModel)]="newPassword" type="password" name="new" placeholder="Nuova password" required />
        <button class="btn-primary" type="submit">Aggiorna</button>
      </form>
    </div>

    <div class="table-container mt">
      <h3 class="section-title">Preventivi e Finanziamenti</h3>
      <div class="split">
        <div class="pane">
          <h4>Preventivi</h4>
          <table class="table">
            <thead>
              <tr><th>ID</th><th>Descrizione</th><th>Totale</th><th>Data</th><th>Stato</th></tr>
            </thead>
            <tbody>
              <tr *ngFor="let p of preventivi">
                <td>{{p.id}}</td><td>{{p.descrizione}}</td><td>{{p.totale | currency:'EUR'}}</td><td>{{p.data}}</td><td>{{p.stato}}</td>
              </tr>
              <tr *ngIf="preventivi.length===0"><td colspan="5">Nessun preventivo</td></tr>
            </tbody>
          </table>
        </div>
        <div class="pane">
          <h4>Finanziamenti</h4>
          <table class="table">
            <thead>
              <tr><th>ID</th><th>Totale</th><th>Rata</th><th>Rate</th><th>Stato</th></tr>
            </thead>
            <tbody>
              <tr *ngFor="let f of finanziamenti">
                <td>{{f.id}}</td><td>{{f.importoTotale | currency:'EUR'}}</td><td>{{f.importoRata | currency:'EUR'}}</td><td>{{f.numeroRate}}</td><td>{{f.stato}}</td>
              </tr>
              <tr *ngIf="finanziamenti.length===0"><td colspan="5">Nessun finanziamento</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="table-container mt danger-box">
      <h3 class="section-title">Elimina account</h3>
      <p>Questa azione rimuove i tuoi dati personali. Procedere?</p>
      <button class="btn-secondary danger" (click)="eliminaAccount()">Elimina account</button>
    </div>
  </div>
  `,
  styles: [`
    .account-container { padding: 2rem; max-width: 1000px; margin: 0 auto; }
    h2 { margin:0 0 1rem 0; color:#0e3f25; font-size: 2rem; }
    .table-container { background:#fff; border-radius:8px; box-shadow:0 2px 6px rgba(0,0,0,0.1); overflow:hidden; }
    .section-title { margin: .75rem 1rem; color:#1f6c2e; }
    .mt { margin-top:1rem; }
    .form-inline { display:flex; gap:.5rem; flex-wrap:wrap; align-items:center; padding: .75rem; }
    .form-inline input { padding:.5rem; border:1px solid #ddd; border-radius:6px; }
    .btn-primary { background:#2e9d37; color:#fff; border:none; padding:.45rem .9rem; border-radius:6px; cursor:pointer; }
    .btn-secondary { background:#fff; color:#1f6c2e; border:1px solid #1f6c2e; padding:.4rem .8rem; border-radius:6px; cursor:pointer; }
    .btn-secondary.danger { border-color:#b00020; color:#b00020; }
    table { width:100%; border-collapse: collapse; }
    thead { background: linear-gradient(110deg, #0e3f25 0%, #1f6c2e 55%, #2e9d37 100%); color:#fff; }
    th, td { padding:.75rem; border-bottom:1px solid #e0e0e0; text-align:left; }
    .split { display:flex; gap:1rem; padding: .75rem; }
    .pane { flex:1; min-width: 280px; }
    .danger-box { border:1px solid #f1c2c2; }
  `]
})
export class ProfiloPage implements OnInit {
  private account = inject(AccountService);
  profilo: ProfiloDTO = { email: '' };
  oldPassword = '';
  newPassword = '';
  finanziamenti: FinanziamentoDTO[] = [];
  preventivi: PreventivoDTO[] = [];

  ngOnInit(){
    this.account.me().subscribe(p => this.profilo = p);
    this.account.finanziamentiCliente().subscribe(f => this.finanziamenti = f);
    this.account.preventiviCliente().subscribe(p => this.preventivi = p);
  }
  salvaContatti(){
    const payload = { nome: this.profilo.nome, cognome: this.profilo.cognome, telefono: this.profilo.telefono, indirizzo: this.profilo.indirizzo };
    this.account.updateMe(payload).subscribe(p => this.profilo = p);
  }
  cambiaPassword(){
    if (!this.oldPassword || !this.newPassword) return;
    this.account.changePassword(this.oldPassword, this.newPassword).subscribe(() => { this.oldPassword=''; this.newPassword=''; alert('Password aggiornata'); });
  }
  eliminaAccount(){
    if (!confirm('Confermi l\'eliminazione del tuo account?')) return;
    this.account.deleteAccount().subscribe(() => { alert('Account rimosso'); location.href = '/login'; });
  }
}
