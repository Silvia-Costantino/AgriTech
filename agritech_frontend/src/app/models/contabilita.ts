export interface Disponibilita { cassa: number; movimentiOggi: number; }
export interface CreditoItem { tipo: 'RESO_FORN'|'FIN_CLIENTE'; descrizione: string; importo: number; }
export interface DebitoItem { tipo: 'ORD_FORN'|'SPESA'|'STIPENDIO'; descrizione: string; importo: number; }
export interface Finanziamento { id: number; clienteId: number; importoTotale: number; importoRata: number; numeroRate: number; stato: 'ATTIVO'|'COMPLETATO'; }
