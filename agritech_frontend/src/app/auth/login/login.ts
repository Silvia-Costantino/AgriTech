import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
  <div class="auth-container">
    <h2>Accesso</h2>
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <input type="email" placeholder="Email" formControlName="email">
      <input type="password" placeholder="Password" formControlName="password">
      <button [disabled]="form.invalid">Accedi</button>
    </form>
    <p *ngIf="error" class="error">{{error}}</p>
    <a routerLink="/register">Registrati</a>
  </div>
  `,
  styles: [`.auth-container{max-width:400px;margin:auto;text-align:center}`]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private auth = inject(AuthService);

  error?: string;
  form = this.fb.group({ email: ['', [Validators.required, Validators.email]], password: ['', Validators.required] });

  onSubmit() {
    this.auth.login(this.form.value).subscribe({
      next: () => this.router.navigate(['/home']),
      error: err => this.error = err.error?.message || 'Accesso non riuscito'
    });
  }
}
