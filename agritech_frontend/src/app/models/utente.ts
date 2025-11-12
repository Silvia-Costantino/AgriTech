export type Ruolo = 'SOCIO' | 'DIPENDENTE' | 'CLIENTE';

export interface Utente {
  id?: number;
  email: string;
  nome?: string;
  cognome?: string;
  ruolo: Ruolo;
}
