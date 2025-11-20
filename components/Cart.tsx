
import React from 'react';
import { X, Trash2, Plus, Minus, CreditCard } from 'lucide-react';
import { CartItem } from '../types';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
}

export const Cart: React.FC<CartProps> = ({ isOpen, onClose, items, onUpdateQuantity, onRemove }) => {
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true" aria-labelledby="cart-title">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose} aria-hidden="true" />
      
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md transform transition ease-in-out duration-500 sm:duration-700 bg-white shadow-2xl flex flex-col h-full">
          
          {/* Header */}
          <div className="px-4 py-6 bg-slate-50 border-b border-slate-200 sm:px-6 flex items-center justify-between">
            <h2 id="cart-title" className="text-lg font-medium text-slate-900">O seu carrinho</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-500" aria-label="Fechar carrinho">
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-500">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4" aria-hidden="true">
                  <CreditCard className="h-8 w-8 text-slate-400" />
                </div>
                <p className="text-lg font-medium">O carrinho está vazio</p>
                <p className="text-sm mt-2">Adicione impressoras ou componentes para começar.</p>
                <button 
                  onClick={onClose} 
                  className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                >
                  Ver Produtos
                </button>
              </div>
            ) : (
              <ul className="divide-y divide-slate-200">
                {items.map((item) => (
                  <li key={item.id} className="flex py-6">
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-slate-200">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>

                    <div className="ml-4 flex flex-1 flex-col">
                      <div>
                        <div className="flex justify-between text-base font-medium text-slate-900">
                          <h3 className="line-clamp-1" title={item.name}>{item.name}</h3>
                          <p className="ml-4">€{(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                        <p className="mt-1 text-sm text-slate-500">{item.category}</p>
                      </div>
                      <div className="flex flex-1 items-end justify-between text-sm">
                        <div className="flex items-center border rounded-md" role="group" aria-label="Quantidade do produto">
                          <button 
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            className="p-1 hover:bg-slate-100 text-slate-600"
                            disabled={item.quantity <= 1}
                            aria-label="Diminuir quantidade"
                          >
                            <Minus className="h-4 w-4" aria-hidden="true" />
                          </button>
                          <span className="px-2 font-medium" aria-label={`Quantidade: ${item.quantity}`}>{item.quantity}</span>
                          <button 
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            className="p-1 hover:bg-slate-100 text-slate-600"
                            aria-label="Aumentar quantidade"
                          >
                            <Plus className="h-4 w-4" aria-hidden="true" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => onRemove(item.id)}
                          className="font-medium text-red-500 hover:text-red-600 flex items-center gap-1"
                          aria-label={`Remover ${item.name} do carrinho`}
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                          <span className="hidden sm:inline">Remover</span>
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-slate-200 px-4 py-6 sm:px-6 bg-slate-50">
              <div className="flex justify-between text-base font-medium text-slate-900 mb-4">
                <p>Subtotal</p>
                <p>€{total.toFixed(2)}</p>
              </div>
              <p className="mt-0.5 text-sm text-slate-500 mb-6">
                Portes de envio calculados no checkout. Envio grátis para Portugal Continental acima de 50€.
              </p>
              <button
                className="w-full flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700 transition-colors"
                onClick={() => alert('Checkout não implementado nesta demo.')}
              >
                Finalizar Compra
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
