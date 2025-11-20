import React from 'react';
import { User, Moon, Sun, Bell, Shield, LogOut, Mail, Save } from 'lucide-react';

interface ProfileSettingsProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({ darkMode, toggleDarkMode }) => {
  const [name, setName] = React.useState('Utilizador OL Print');
  const [email, setEmail] = React.useState('cliente@exemplo.com');
  const [notifications, setNotifications] = React.useState(true);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">O Meu Perfil</h1>
        <p className="text-slate-500 dark:text-slate-400">Faça a gestão das suas preferências e dados de conta.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header Profile */}
        <div className="p-6 sm:p-8 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-6">
          <div className="w-24 h-24 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-3xl font-bold text-white">{name.charAt(0)}</span>
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{name}</h2>
            <p className="text-slate-500 dark:text-slate-400">{email}</p>
            <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
              Cliente Premium
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-8">
          {/* Personal Info */}
          <section>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" /> Dados Pessoais
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nome</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                  />
                </div>
              </div>
            </div>
          </section>

          <div className="h-px bg-slate-100 dark:bg-slate-800" />

          {/* Appearance */}
          <section>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Sun className="h-5 w-5 text-orange-500" /> Aparência
            </h3>
            
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${darkMode ? 'bg-slate-700 text-slate-300' : 'bg-orange-100 text-orange-600'}`}>
                  {darkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">Modo Escuro</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {darkMode ? 'Ativado - Bom para poupar energia' : 'Desativado - Aparência clara padrão'}
                  </p>
                </div>
              </div>
              
              <button 
                onClick={toggleDarkMode}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${darkMode ? 'bg-blue-600' : 'bg-slate-200'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${darkMode ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </section>

          <div className="h-px bg-slate-100 dark:bg-slate-800" />

          {/* Notifications (Dummy) */}
          <section>
             <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Bell className="h-5 w-5 text-purple-500" /> Notificações
            </h3>
             <div className="flex items-center justify-between">
                <p className="text-slate-700 dark:text-slate-300">Receber promoções e novidades por email</p>
                <button 
                  onClick={() => setNotifications(!notifications)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${notifications ? 'bg-green-500' : 'bg-slate-200'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${notifications ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
             </div>
          </section>

          <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-end">
             <button className="px-6 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition-colors flex items-center justify-center gap-2">
                <LogOut className="h-4 w-4" />
                Terminar Sessão
             </button>
             <button className="px-6 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-medium transition-colors shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2">
                <Save className="h-4 w-4" />
                Guardar Alterações
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};