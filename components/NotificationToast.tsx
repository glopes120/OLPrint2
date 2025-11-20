
import React, { useEffect } from 'react';
import { Bell, X, CheckCircle, Truck, Info } from 'lucide-react';
import { AppNotification } from '../types';

interface NotificationToastProps {
  notification: AppNotification | null;
  onClose: () => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ notification, onClose }) => {
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        onClose();
      }, 6000); // Auto hide after 6 seconds
      return () => clearTimeout(timer);
    }
  }, [notification, onClose]);

  if (!notification) return null;

  const getIcon = () => {
    switch (notification.type) {
      case 'success': return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'info': return <Truck className="h-6 w-6 text-blue-500" />; // Using Truck as default for shipping updates
      default: return <Info className="h-6 w-6 text-slate-500" />;
    }
  };

  return (
    <div className="fixed top-24 right-4 z-50 animate-in slide-in-from-right-10 fade-in duration-300">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 p-4 max-w-sm w-full flex items-start gap-4">
        <div className="flex-shrink-0 bg-slate-50 dark:bg-slate-700 p-2 rounded-full">
          {getIcon()}
        </div>
        <div className="flex-1 pt-1">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">{notification.title}</h4>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{notification.message}</p>
          <p className="text-xs text-slate-400 mt-2">Agora mesmo</p>
        </div>
        <button 
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
