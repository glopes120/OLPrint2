import React from 'react';
import { Star, ShoppingCart, Check } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const [isAdded, setIsAdded] = React.useState(false);

  const handleAdd = () => {
    onAddToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-500 flex flex-col overflow-hidden">
      <div className="aspect-[4/3] bg-slate-100 dark:bg-slate-800 overflow-hidden relative">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-110 group-hover:rotate-1"
        />
        
        {/* Tags Container */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-slate-900 dark:text-white shadow-sm">
            {product.category}
          </div>
          {product.originalPrice && (
            <div className="bg-red-600 text-white px-2 py-1 rounded-md text-xs font-bold shadow-sm animate-pulse">
              -{discountPercentage}%
            </div>
          )}
        </div>

        {/* Overlay effect for hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500"></div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-1 mb-2">
          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{product.rating}</span>
          <span className="text-xs text-slate-400 dark:text-slate-500">({product.reviews})</span>
        </div>
        
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {product.name}
        </h3>
        
        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 flex-1">
          {product.description}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex flex-col">
            {product.originalPrice && (
              <span className="text-xs text-slate-400 dark:text-slate-500 line-through">
                €{product.originalPrice.toFixed(2)}
              </span>
            )}
            <span className={`text-xl font-bold ${product.originalPrice ? 'text-red-600 dark:text-red-500' : 'text-slate-900 dark:text-white'}`}>
              €{product.price.toFixed(2)}
            </span>
          </div>
          
          <button
            onClick={handleAdd}
            disabled={isAdded}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              isAdded 
                ? 'bg-green-500 text-white' 
                : 'bg-slate-900 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-700 hover:shadow-md hover:-translate-y-0.5'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="h-4 w-4" />
                <span className="hidden xs:inline">Adicionado</span>
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4" />
                <span>Adicionar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};