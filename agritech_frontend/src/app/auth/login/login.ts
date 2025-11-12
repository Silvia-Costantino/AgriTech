import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-header">
          <h1>Benvenuto in AgriTech</h1>
          <p>Accedi per consultare ordini, catalogo e servizi dedicati.</p>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="auth-form" novalidate>
          <label>
            Email
            <input
              type="email"
              placeholder="nome@azienda.it"
              formControlName="email"
              autocomplete="email"
              [class.invalid]="submitted && email.invalid"
              required
            >
            <small class="hint error" *ngIf="submitted && email.errors?.['required']">L'email è obbligatoria.</small>
            <small class="hint error" *ngIf="submitted && email.errors?.['email']">Inserisci un'email valida.</small>
          </label>

          <label>
            Password
            <input
              type="password"
              placeholder="Inserisci la password"
              formControlName="password"
              autocomplete="current-password"
              [class.invalid]="submitted && password.invalid"
              required
            >
            <small class="hint error" *ngIf="submitted && password.errors?.['required']">La password è obbligatoria.</small>
            <small class="hint error" *ngIf="submitted && password.errors?.['minlength']">Minimo 6 caratteri.</small>
          </label>

          <button class="submit" type="submit" [disabled]="form.invalid || loading">
            {{ loading ? 'Accesso…' : 'Accedi' }}
          </button>
        </form>

        <p *ngIf="error" class="error">{{ error }}</p>

        <p class="switch">
          Non hai ancora un account?
          <a routerLink="/register" class="link">Registrati</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    :host { display:block; }
    .auth-page {
      min-height: 100vh; display:flex; align-items:center; justify-content:center;
      padding: 3rem 1.5rem;
      background: linear-gradient(145deg, #0f5132 0%, #1f7a1f 50%, #f6f9f4 100%);
    }
    .auth-card {
      width: min(420px, 100%); background:#fff; border-radius:18px; padding:2.5rem 2.25rem;
      box-shadow: 0 20px 45px rgba(15, 81, 50, 0.18);
      display:flex; flex-direction:column; gap:1.25rem;
    }
    .auth-header h1 { font-size: clamp(1.6rem, 2.3vw, 2rem); color:#115c39; margin:0; }
    .auth-header p { margin:0.35rem 0 0; color:#466252; line-height:1.5; }
    .auth-form { display:flex; flex-direction:column; gap:0.85rem; }
    label { display:flex; flex-direction:column; gap:0.35rem; font-weight:600; color:#1d4a2e; font-size:0.95rem; }
    input {
      border:1px solid rgba(17, 92, 57, 0.25); border-radius:10px; padding:0.75rem 1rem; font-size:1rem;
      transition: border-color .2s, box-shadow .2s; background:#fdfdfc;
    }
    input:focus { outline:none; border-color:#f18f1c; box-shadow:0 0 0 4px rgba(241,143,28,.15); }
    input.invalid { border-color: #e74c3c; box-shadow: 0 0 0 3px rgba(231, 76, 60, .15); }

    .hint.error { color:#b12a1c; font-weight:600; font-size:0.82rem; }

    .submit {
      margin-top:0.5rem; border:none; border-radius:999px; padding:0.85rem; font-size:1rem; font-weight:700;
      letter-spacing:.03em; color:#fff; background:linear-gradient(120deg, #1f7a1f 0%, #2e9d37 70%);
      cursor:pointer; transition: transform .15s, box-shadow .15s, filter .15s;
    }
    .submit:hover:not([disabled]) { transform: translateY(-1px); box-shadow: 0 15px 30px rgba(47,154,47,.25); }
    .submit[disabled] { cursor:not-allowed; opacity:.65; filter:grayscale(.2); }

    .error {
      padding:0.85rem 1rem; border-radius:10px; background:rgba(231,76,60,.12);
      border:1px solid rgba(231,76,60,.35); color:#b12a1c; text-align:center; font-weight:600;
    }
    .switch { margin:0; text-align:center; color:#466252; font-weight:500; }
    .link { color:#f18f1c; text-decoration:none; font-weight:700; }
    .link:hover { text-decoration:underline; }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private auth = inject(AuthService);

  loading = false;
  error?: string;
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });
  submitted = false;

  get email() { return this.form.controls.email; }
  get password() { return this.form.controls.password; }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.auth.login(this.form.value).subscribe({
      next: () => { this.loading = false; this.router.navigate(['/home']); },
      error: err => { this.loading = false; this.error = err?.error?.message || 'Accesso non riuscito'; }
    });
  }
}
