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
}

export type ViewState = 'home' | 'products' | 'about';