
export enum Category {
  PRINTERS = 'Impressoras',
  INK_TONER = 'Tinteiros & Toners',
  PAPER = 'Papel',
  PARTS = 'Peças & Acessórios'
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: Category;
  image: string;
  rating: number;
  reviews: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
  groundingLinks?: { title: string; uri: string; source: 'maps' | 'web' }[];
}

export type ViewState = 'home' | 'products' | 'about' | 'promotions' | 'admin' | 'design-studio' | 'profile' | 'support';

export interface Order {
  id: string;
  date: string;
  total: number;
  status: 'Em Processamento' | 'Enviado' | 'Em Distribuição' | 'Entregue' | 'Cancelado';
  items: string[];
  action: 'cancel' | 'track' | 'invoice' | 'none';
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning';
  timestamp: Date;
  read: boolean;
}
