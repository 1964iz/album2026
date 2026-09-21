export type Category = 'todos' | 'casal' | 'ensaio' | 'modelo' | 'especial' | 'igor' | 'adriana';

export type FrameStyle = 'imperial-silver' | 'baroque-gold' | 'rococo-filigree' | 'minimal-brass';

export type ViewMode = 'carousel' | 'gallery' | 'favorites' | 'book' | 'reports';

export interface AlbumConfig {
  studioName: string;
  coupleName: string;
  modelName: string;
  subtitle: string;
}

export interface PhotoItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  date: string;
  location: string;
  src: string;
  description: string;
  isFavorite?: boolean;
  aspectRatio?: 'portrait' | 'landscape' | 'square';
  quote?: string;
  order?: number;
  isModel?: boolean;
}

export type PaymentMethod =
  | 'pix'
  | 'cartao_credito'
  | 'cartao_debito'
  | 'boleto'
  | 'transferencia'
  | 'dinheiro';

export type PaymentStatus = 'pago' | 'parcial' | 'pendente' | 'cancelado';

export interface ClientOrder {
  id: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  packageName: string;
  eventDate?: string;
  totalValue: number;
  paidValue: number;
  remainingValue: number;
  paymentMethod: PaymentMethod;
  installments?: number;
  paymentStatus: PaymentStatus;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}
