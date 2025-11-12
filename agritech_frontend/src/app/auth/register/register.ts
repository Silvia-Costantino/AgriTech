import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-header">
          <h1>Crea il tuo account</h1>
          <p>Registrati per acquistare macchinari agricoli e gestire i servizi AgriTech.</p>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="auth-form" novalidate>
          <div class="grid">
            <label>
              Nome
              <input type="text" placeholder="Es. Luca" formControlName="nome" required [class.invalid]="submitted && nome.invalid">
              <small class="hint error" *ngIf="submitted && nome.errors?.['required']">Il nome è obbligatorio.</small>
            </label>
            <label>
              Cognome
              <input type="text" placeholder="Es. Bianchi" formControlName="cognome" required [class.invalid]="submitted && cognome.invalid">
              <small class="hint error" *ngIf="submitted && cognome.errors?.['required']">Il cognome è obbligatorio.</small>
            </label>
          </div>

          <label>
            Email
            <input type="email" placeholder="nome@azienda.it" formControlName="email" autocomplete="email" required [class.invalid]="submitted && email.invalid">
            <small class="hint error" *ngIf="submitted && email.errors?.['required']">L'email è obbligatoria.</small>
            <small class="hint error" *ngIf="submitted && email.errors?.['email']">Inserisci un'email valida.</small>
          </label>

          <label>
            Password
            <input type="password" placeholder="Scegli una password sicura" formControlName="password" autocomplete="new-password" required [class.invalid]="submitted && password.invalid">
            <small class="hint error" *ngIf="submitted && password.errors?.['required']">La password è obbligatoria.</small>
            <small class="hint error" *ngIf="submitted && password.errors?.['minlength']">Minimo 6 caratteri.</small>
          </label>

          <label>
            Indirizzo
            <input type="text" placeholder="Via Roma 123, Milano" formControlName="indirizzo" required [class.invalid]="submitted && indirizzo.invalid">
            <small class="hint error" *ngIf="submitted && indirizzo.errors?.['required']">L'indirizzo è obbligatorio.</small>
          </label>

          <label>
            Dati di fatturazione
            <input type="text" placeholder="Codice fiscale o P.IVA" formControlName="datiFatturazione" required [class.invalid]="submitted && datiFatturazione.invalid">
            <small class="hint error" *ngIf="submitted && datiFatturazione.errors?.['required']">I dati di fatturazione sono obbligatori.</small>
          </label>

          <label>
            Numero di telefono
            <input type="tel" placeholder="Es. +39 333 1234567" formControlName="telefono" required [class.invalid]="submitted && telefono.invalid">
            <small class="hint error" *ngIf="submitted && telefono.errors?.['required']">Il numero di telefono è obbligatorio.</small>
            <small class="hint error" *ngIf="submitted && telefono.errors?.['pattern']">Inserisci un numero valido.</small>
          </label>

          <button class="submit" type="submit" [disabled]="form.invalid || loading">
            {{ loading ? 'Creazione…' : 'Crea account' }}
          </button>
        </form>

        <p class="switch">
          Hai già un profilo?
          <a routerLink="/login" class="link">Accedi</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    :host { display:block; }
    .auth-page {
      min-height: 100vh; display:flex; align-items:center; justify-content:center;
      padding: 3rem 1.5rem;
      background: linear-gradient(160deg, #f6f9f4 0%, #1f7a1f 55%, #0f5132 100%);
    }
    .auth-card {
      width: min(460px, 100%); background:#fff; border-radius:20px; padding:2.5rem 2.25rem;
      box-shadow: 0 24px 50px rgba(17, 92, 57, 0.2);
      display:flex; flex-direction:column; gap:1.25rem;
    }
    .auth-header h1 { margin:0; font-size: clamp(1.7rem, 2.5vw, 2.1rem); color:#115c39; }
    .auth-header p { margin:.4rem 0 0; color:#4a6654; line-height:1.55; }
    .auth-form { display:flex; flex-direction:column; gap:0.85rem; }
    .grid { display:grid; gap:1rem; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); }
    label { display:flex; flex-direction:column; gap:0.35rem; font-weight:600; color:#1d4a2e; font-size:0.95rem; }
    input {
      border:1px solid rgba(17, 92, 57, .25); border-radius:10px; padding:.75rem 1rem; font-size:1rem;
      transition: border-color .2s, box-shadow .2s; background:#fdfdfc;
    }
    input:focus { outline:none; border-color:#f18f1c; box-shadow:0 0 0 4px rgba(241,143,28,.16); }
    input.invalid { border-color:#e74c3c; box-shadow:0 0 0 3px rgba(231,76,60,.15); }
    .hint.error { color:#b12a1c; font-weight:600; font-size:0.82rem; }

    .submit {
      margin-top:.5rem; border:none; border-radius:999px; padding:.9rem; font-size:1rem; font-weight:700;
      letter-spacing:.03em; color:#fff; background:linear-gradient(120deg, #f18f1c 0%, #ffb347 60%, #ffa500 100%);
      cursor:pointer; transition: transform .15s, box-shadow .15s, filter .15s;
    }
    .submit:hover:not([disabled]) { transform: translateY(-1px); box-shadow: 0 15px 30px rgba(241,143,28,.25); }
    .submit[disabled] { cursor:not-allowed; opacity:.7; filter: grayscale(.2); }

    .switch { margin:0; text-align:center; color:#466252; font-weight:500; }
    .link { color:#2e9d37; text-decoration:none; font-weight:700; }
    .link:hover { text-decoration: underline; }
  `]
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  loading = false;
  submitted = false;

  form = this.fb.group({
    nome: ['', Validators.required],
    cognome: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    indirizzo: ['', Validators.required],
    datiFatturazione: ['', Validators.required],
    telefono: ['', [Validators.required, Validators.pattern(/^[0-9+ ]{8,15}$/)]],
  });

  get nome() { return this.form.controls.nome; }
  get cognome() { return this.form.controls.cognome; }
  get email() { return this.form.controls.email; }
  get password() { return this.form.controls.password; }
  get indirizzo() { return this.form.controls.indirizzo; }
  get datiFatturazione() { return this.form.controls.datiFatturazione; }
  get telefono() { return this.form.controls.telefono; }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.auth.register(this.form.value).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/login']);
      },
      error: () => {
        this.loading = false;
        // qui puoi mostrare un messaggio di errore
      }
    });
  }
}
