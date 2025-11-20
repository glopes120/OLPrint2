
import React, { useState, useRef, useEffect } from 'react';
import { ShoppingCart, Printer, MessageSquare, Menu, X, Flame, Palette, User, Bell, Check } from 'lucide-react';
import { ViewState, AppNotification } from '../types';

interface HeaderProps {
  currentView: ViewState;
  setCurrentView: (view: ViewState) => void;
  cartCount: number;
  toggleCart: () => void;
  toggleChat: () => void;
  notifications: AppNotification[];
  onMarkNotificationsRead: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  currentView, 
  setCurrentView, 
  cartCount, 
  toggleCart,
  toggleChat,
  notifications,
  onMarkNotificationsRead
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const navClasses = (view: ViewState) => 
    `cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${currentView === view ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-slate-600 dark:text-slate-300'}`;

  const unreadCount = notifications.filter(n => !n.read).length;

  // Close notifications on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleNotifications = () => {
    if (!isNotifOpen) {
      // Opening
      setIsNotifOpen(true);
    } else {
      // Closing
      setIsNotifOpen(false);
      onMarkNotificationsRead();
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
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
            <span className="text-xl font-bold bg-gradient-to-r from-blue-700 to-blue-500 dark:from-blue-500 dark:to-blue-400 bg-clip-text text-transparent">
              OL Print
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-8 items-center">
            <button onClick={() => setCurrentView('home')} className={navClasses('home')}>Início</button>
            <button onClick={() => setCurrentView('products')} className={navClasses('products')}>Loja Online</button>
            <button 
              onClick={() => setCurrentView('promotions')} 
              className={`flex items-center gap-1 cursor-pointer hover:text-red-600 dark:hover:text-red-400 transition-colors ${currentView === 'promotions' ? 'text-red-600 dark:text-red-400 font-bold' : 'text-slate-600 dark:text-slate-300'}`}
            >
              <Flame className="h-4 w-4" />
              Promoções
            </button>
            <button 
              onClick={() => setCurrentView('design-studio')} 
              className={`flex items-center gap-1 cursor-pointer hover:text-pink-600 dark:hover:text-pink-400 transition-colors ${currentView === 'design-studio' ? 'text-pink-600 dark:text-pink-400 font-bold' : 'text-slate-600 dark:text-slate-300'}`}
            >
              <Palette className="h-4 w-4" />
              Estúdio Criativo
            </button>
            <button onClick={() => setCurrentView('about')} className={navClasses('about')}>Sobre Nós</button>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button 
              onClick={toggleChat}
              className="hidden md:flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <MessageSquare className="h-5 w-5" />
              <span className="text-sm font-medium">Assistente</span>
            </button>

            {/* Notifications Bell */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={handleToggleNotifications}
                className="relative p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
              >
                <Bell className="h-6 w-6 text-slate-600 dark:text-slate-300" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden origin-top-right animate-in fade-in zoom-in-95 duration-200">
                  <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <h3 className="font-bold text-slate-900 dark:text-white">Notificações</h3>
                    {unreadCount > 0 && (
                      <button onClick={onMarkNotificationsRead} className="text-xs text-blue-600 hover:underline">
                        Marcar como lidas
                      </button>
                    )}
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-slate-500 text-sm">
                        Não tem notificações.
                      </div>
                    ) : (
                      <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                        {notifications.map((notif) => (
                          <li key={notif.id} className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${!notif.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
                            <div className="flex gap-3">
                              <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${!notif.read ? 'bg-blue-500' : 'bg-slate-300'}`} />
                              <div>
                                <p className="text-sm font-medium text-slate-900 dark:text-white">{notif.title}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{notif.message}</p>
                                <p className="text-[10px] text-slate-400 mt-2">
                                  {notif.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </p>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}
            </div>

            <button 
              onClick={toggleCart}
              className="relative p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors group"
            >
              <ShoppingCart className="h-6 w-6 text-slate-600 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full animate-bounce-short">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setCurrentView('profile')}
              className={`p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors ${currentView === 'profile' ? 'bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-300'}`}
              title="O Meu Perfil"
            >
               <User className="h-6 w-6" />
            </button>

            <button 
              className="md:hidden p-2 text-slate-600 dark:text-slate-300"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <button 
              onClick={() => { setCurrentView('home'); setIsMobileMenuOpen(false); }}
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 hover:bg-slate-50 dark:hover:bg-slate-800 w-full text-left"
            >
              Início
            </button>
            <button 
              onClick={() => { setCurrentView('products'); setIsMobileMenuOpen(false); }}
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 hover:bg-slate-50 dark:hover:bg-slate-800 w-full text-left"
            >
              Loja Online
            </button>
            <button 
              onClick={() => { setCurrentView('promotions'); setIsMobileMenuOpen(false); }}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-left"
            >
              <Flame className="h-4 w-4" />
              Promoções
            </button>
             <button 
              onClick={() => { setCurrentView('design-studio'); setIsMobileMenuOpen(false); }}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-pink-600 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-900/20 w-full text-left"
            >
              <Palette className="h-4 w-4" />
              Estúdio Criativo
            </button>
            <button 
              onClick={() => { setCurrentView('profile'); setIsMobileMenuOpen(false); }}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 w-full text-left"
            >
              <User className="h-4 w-4" />
              O Meu Perfil
            </button>
            <button 
              onClick={() => { setCurrentView('about'); setIsMobileMenuOpen(false); }}
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 hover:bg-slate-50 dark:hover:bg-slate-800 w-full text-left"
            >
              Sobre Nós
            </button>
            <button 
              onClick={() => { toggleChat(); setIsMobileMenuOpen(false); }}
              className="block px-3 py-2 rounded-md text-base font-medium text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 w-full text-left mt-2"
            >
              Falar com Assistente AI
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
