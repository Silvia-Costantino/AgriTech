import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
  <div class="auth-container">
    <h2>Registrazione Cliente</h2>
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <input type="text" placeholder="Nome" formControlName="nome">
      <input type="text" placeholder="Cognome" formControlName="cognome">
      <input type="email" placeholder="Email" formControlName="email">
      <input type="password" placeholder="Password" formControlName="password">
      <button [disabled]="form.invalid">Registrati</button>
    </form>
  </div>
  `
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
    nome: ['', Validators.required],
    cognome: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  onSubmit() {
    this.auth.register(this.form.value).subscribe(() => this.router.navigate(['/login']));
  }
}
