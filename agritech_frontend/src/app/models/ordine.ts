export interface Ordine {
  id: number;
  clienteId: number;
  data: string;
  stato: 'IN_ELABORAZIONE' | 'CONSEGNATO' | 'ANNULLATO';
  importo: number;
}
