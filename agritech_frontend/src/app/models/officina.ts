export interface Riparazione { id: number; targa: string; stato: 'ATTESA'|'LAVORAZIONE'|'COMPLETATA'; urgenza: 'BASSA'|'MEDIA'|'ALTA'; }
export interface Ricambio { id: number; descrizione: string; codice?: string; quantita: number; prezzo: number; scortaMinima?: number; ultimaApprovvigionamento?: string; }
