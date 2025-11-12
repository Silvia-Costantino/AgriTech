export interface Dipendente { cf: string; nome: string; cognome: string; mansione: string; telefono?: string; iban?: string; }
export interface Turno { dipendenteCf: string; giorni: string[]; orario: string; }
export interface FeriePermessi { dipendenteCf: string; durata: number; giorniLavorativi: string[]; }
export interface BustaPaga { id: number; dipendenteCf: string; importo: number; mese: string; }
