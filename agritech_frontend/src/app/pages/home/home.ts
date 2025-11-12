import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterLink],
  template: `
  <app-navbar></app-navbar>
  <div class="container">
    <h1>Benvenuto in AgriTech</h1>
    <p>La tua concessionaria agricola di fiducia.</p>
    <a routerLink="/catalogo">Vai al Catalogo</a>
  </div>
  `,
  styles: [`.container{text-align:center;margin-top:30px}`]
})
export class HomePage {}
