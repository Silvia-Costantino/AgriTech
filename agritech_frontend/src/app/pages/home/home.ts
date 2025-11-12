import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
  <main class="page">
    <section class="hero">
      <div class="hero-content">
        <span class="eyebrow">Innovazione agricola dal 1998</span>
        <h1>Macchinari e servizi per coltivare il tuo futuro</h1>
        <p>
          AgriTech ti accompagna nella scelta di trattori e attrezzature professionali,
          con soluzioni finanziarie e assistenza tecnica su tutto il territorio.
        </p>
        <div class="hero-actions">
          <a routerLink="/catalogo" class="btn primary">Vai al catalogo</a>
          <a routerLink="/register" class="btn secondary">Diventa cliente</a>
        </div>
      </div>
      <div class="hero-card">
        <strong>+150</strong>
        <span>Modelli di trattori disponibili</span>
        <div class="divider"></div>
        <strong>24h</strong>
        <span>Assistenza officina garantita</span>
      </div>
    </section>

    <section class="highlights">
      <article>
        <h3>Catalogo trattori</h3>
        <p>Scopri marchi leader e configurazioni personalizzate per ogni tipo di coltura.</p>
        <a routerLink="/catalogo" class="link">Sfoglia ora</a>
      </article>
      <article>
        <h3>Gestione ordini</h3>
        <p>Monitora forniture, consegne e magazzino con un’unica piattaforma intuitiva.</p>
        <a routerLink="/ordini" class="link">Gestisci ordini</a>
      </article>
      <article>
        <h3>Assistenza officina</h3>
        <p>Programma manutenzioni e richieste ricambi con il supporto dei nostri tecnici.</p>
        <a routerLink="/officina" class="link">Prenota intervento</a>
      </article>
    </section>
  </main>
  `,
  styles: [`
    :host { display:block; background:#f7fbf7; min-height:100vh; }
    .page {
      padding: 0 1.5rem 4rem;
      background: linear-gradient(180deg, rgba(31, 122, 31, 0.1) 0%, rgba(255, 255, 255, 0) 40%),
                  #f7fbf7;
    }
    .hero {
      max-width: 1100px;
      margin: 3rem auto 4rem;
      display: grid;
      gap: 2.5rem;
      align-items: center;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    }
    .hero-content {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    .eyebrow {
      text-transform: uppercase;
      letter-spacing: 0.22em;
      font-size: 0.75rem;
      font-weight: 700;
      color: #f18f1c;
    }
    h1 {
      margin: 0;
      font-size: clamp(2.2rem, 4vw, 3rem);
      line-height: 1.1;
      color: #115c39;
    }
    .hero-content p {
      margin: 0;
      color: #4b6a55;
      font-size: 1.05rem;
      line-height: 1.6;
      max-width: 520px;
    }
    .hero-actions {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      margin-top: 0.5rem;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.95rem 1.8rem;
      border-radius: 999px;
      font-weight: 700;
      letter-spacing: 0.03em;
      text-decoration: none;
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }
    .btn.primary {
      background: linear-gradient(115deg, #1f7a1f 0%, #2e9d37 75%);
      color: #fff;
      box-shadow: 0 15px 30px rgba(47, 154, 47, 0.25);
    }
    .btn.primary:hover { transform: translateY(-2px); }
    .btn.secondary {
      background: #fff;
      color: #1f7a1f;
      border: 2px solid rgba(31, 122, 31, 0.25);
    }
    .btn.secondary:hover {
      transform: translateY(-2px);
      box-shadow: 0 15px 30px rgba(17, 92, 57, 0.12);
    }
    .hero-card {
      justify-self: center;
      background: #ffffff;
      border-radius: 22px;
      padding: 2.2rem 2rem;
      box-shadow: 0 30px 55px rgba(17, 92, 57, 0.18);
      display: grid;
      justify-items: center;
      gap: 0.6rem;
      text-align: center;
      border: 1px solid rgba(17, 92, 57, 0.08);
    }
    .hero-card strong {
      font-size: 2.4rem;
      color: #2e9d37;
      line-height: 1;
    }
    .hero-card span {
      font-weight: 600;
      color: #466252;
    }
    .hero-card .divider {
      width: 60%;
      height: 1px;
      background: linear-gradient(90deg, rgba(241, 143, 28, 0), rgba(241, 143, 28, 0.8), rgba(241, 143, 28, 0));
      margin: 0.4rem 0;
    }
    .highlights {
      max-width: 1100px;
      margin: 0 auto;
      display: grid;
      gap: 1.6rem;
      grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
    }
    .highlights article {
      background: #ffffff;
      padding: 1.75rem;
      border-radius: 18px;
      box-shadow: 0 18px 35px rgba(17, 92, 57, 0.12);
      border: 1px solid rgba(17, 92, 57, 0.08);
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .highlights h3 {
      margin: 0;
      color: #115c39;
      font-size: 1.25rem;
    }
    .highlights p {
      margin: 0;
      color: #4b6a55;
      line-height: 1.5;
      flex-grow: 1;
    }
    .link {
      align-self: flex-start;
      font-weight: 700;
      color: #f18f1c;
      text-decoration: none;
    }
    .link:hover { text-decoration: underline; }
  `]
})
export class HomePage {}
