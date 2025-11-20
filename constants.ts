import { Product, Category } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'HP LaserJet Pro M404dn',
    description: 'Impressora laser monocromática ideal para escritórios médios. Rápida e eficiente.',
    price: 249.99,
    category: Category.PRINTERS,
    image: 'https://picsum.photos/400/300?random=1',
    rating: 4.8,
    reviews: 124
  },
  {
    id: 'p2',
    name: 'Epson EcoTank ET-2850',
    description: 'Impressora multifunções a cores com tanques de tinta recarregáveis. Poupe até 90% em tinta.',
    price: 299.00,
    category: Category.PRINTERS,
    image: 'https://picsum.photos/400/300?random=2',
    rating: 4.6,
    reviews: 89
  },
  {
    id: 'p3',
    name: 'Brother HL-L2350DW',
    description: 'Impressora laser mono compacta com Wi-Fi e impressão duplex automática.',
    price: 139.50,
    category: Category.PRINTERS,
    image: 'https://picsum.photos/400/300?random=3',
    rating: 4.7,
    reviews: 210
  },
  {
    id: 'p4',
    name: 'Pack Tinteiros HP 305XL Preto/Tricolor',
    description: 'Pack de tinteiros originais de alto rendimento para DeskJet e Envy.',
    price: 44.90,
    category: Category.INK_TONER,
    image: 'https://picsum.photos/400/300?random=4',
    rating: 4.5,
    reviews: 340
  },
  {
    id: 'p5',
    name: 'Toner Brother TN-2420 Preto',
    description: 'Toner de alta capacidade (3000 páginas) para série HL-L2300.',
    price: 78.20,
    category: Category.INK_TONER,
    image: 'https://picsum.photos/400/300?random=5',
    rating: 4.9,
    reviews: 56
  },
  {
    id: 'p6',
    name: 'Papel Navigator Universal A4 80g',
    description: 'Caixa com 5 resmas (2500 folhas). O papel mais vendido em Portugal.',
    price: 32.50,
    category: Category.PAPER,
    image: 'https://picsum.photos/400/300?random=6',
    rating: 5.0,
    reviews: 500
  },
  {
    id: 'p7',
    name: 'Kit de Manutenção Kyocera MK-1150',
    description: 'Kit completo para manutenção preventiva de impressoras ECOSYS.',
    price: 112.00,
    category: Category.PARTS,
    image: 'https://picsum.photos/400/300?random=7',
    rating: 4.2,
    reviews: 12
  },
  {
    id: 'p8',
    name: 'Canon PIXMA TS5350i',
    description: 'Multifunções 3-em-1 elegante e conectada, ideal para uso doméstico criativo.',
    price: 89.99,
    category: Category.PRINTERS,
    image: 'https://picsum.photos/400/300?random=8',
    rating: 4.4,
    reviews: 45
  }
];