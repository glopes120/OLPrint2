import React from 'react';
import { ShoppingCart, Printer, MessageSquare, Menu, X, Flame } from 'lucide-react';
import { ViewState } from '../types';

interface HeaderProps {
  currentView: ViewState;
  setCurrentView: (view: ViewState) => void;
  cartCount: number;
  toggleCart: () => void;
  toggleChat: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  currentView, 
  setCurrentView, 
  cartCount, 
  toggleCart,
  toggleChat
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navClasses = (view: ViewState) => 
    `cursor-pointer hover:text-blue-600 transition-colors ${currentView === view ? 'text-blue-600 font-semibold' : 'text-slate-600'}`;

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => setCurrentView('home')}
          >
            <div className="bg-blue-600 p-2 rounded-lg">
              <Printer className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
              OL Print
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-8 items-center">
            <button onClick={() => setCurrentView('home')} className={navClasses('home')}>Início</button>
            <button onClick={() => setCurrentView('products')} className={navClasses('products')}>Loja Online</button>
            <button 
              onClick={() => setCurrentView('promotions')} 
              className={`flex items-center gap-1 cursor-pointer hover:text-red-600 transition-colors ${currentView === 'promotions' ? 'text-red-600 font-bold' : 'text-slate-600'}`}
            >
              <Flame className="h-4 w-4" />
              Promoções
            </button>
            <button onClick={() => setCurrentView('about')} className={navClasses('about')}>Sobre Nós</button>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleChat}
              className="hidden md:flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors"
            >
              <MessageSquare className="h-5 w-5" />
              <span className="text-sm font-medium">Assistente</span>
            </button>

            <button 
              onClick={toggleCart}
              className="relative p-2 hover:bg-slate-100 rounded-full transition-colors group"
            >
              <ShoppingCart className="h-6 w-6 text-slate-600 group-hover:text-blue-600" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full animate-bounce-short">
                  {cartCount}
                </span>
              )}
            </button>

            <button 
              className="md:hidden p-2 text-slate-600"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <button 
              onClick={() => { setCurrentView('home'); setIsMobileMenuOpen(false); }}
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50 w-full text-left"
            >
              Início
            </button>
            <button 
              onClick={() => { setCurrentView('products'); setIsMobileMenuOpen(false); }}
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50 w-full text-left"
            >
              Loja Online
            </button>
            <button 
              onClick={() => { setCurrentView('promotions'); setIsMobileMenuOpen(false); }}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 w-full text-left"
            >
              <Flame className="h-4 w-4" />
              Promoções
            </button>
            <button 
              onClick={() => { setCurrentView('about'); setIsMobileMenuOpen(false); }}
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50 w-full text-left"
            >
              Sobre Nós
            </button>
            <button 
              onClick={() => { toggleChat(); setIsMobileMenuOpen(false); }}
              className="block px-3 py-2 rounded-md text-base font-medium text-blue-600 bg-blue-50 w-full text-left mt-2"
            >
              Falar com Assistente AI
            </button>
          </div>
        </div>
      )}
    </header>
  );
};