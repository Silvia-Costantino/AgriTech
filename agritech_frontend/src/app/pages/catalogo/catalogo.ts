import { Component, inject, OnInit } from '@angular/core';
import { CatalogoService } from '../../services/catalogo/catalogo';
import { Prodotto } from '../../models/prodotto';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  template: `
  <app-navbar></app-navbar>
  <div class="catalogo">
    <h2>Catalogo Automezzi</h2>
    <div class="grid">
      <div class="card" *ngFor="let p of prodotti">
        <h3>{{p.marca}} {{p.modello}}</h3>
        <p>Prezzo: {{p.prezzo | currency:'EUR'}}</p>
        <p>Disponibili: {{p.quantita}}</p>
      </div>
    </div>
  </div>
  `,
  styles: [`.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:20px;}
  .card{border:1px solid #ccc;padding:10px;border-radius:8px;text-align:center;}`]
})
export class CatalogoPage implements OnInit {
  private service = inject(CatalogoService);
  prodotti: Prodotto[] = [];
  ngOnInit(){ this.service.list().subscribe(d => this.prodotti = d); }
}
