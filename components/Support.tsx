import React, { useState } from 'react';
import { 
  Search, 
  Package, 
  RefreshCw, 
  ShieldCheck, 
  MessageSquare, 
  Mail, 
  Phone, 
  MapPin, 
  ChevronDown, 
  ChevronUp,
  Send,
  CheckCircle
} from 'lucide-react';

interface SupportProps {
  onOpenChat: () => void;
}

export const Support: React.FC<SupportProps> = ({ onOpenChat }) => {
  const [orderId, setOrderId] = useState('');
  const [trackingStatus, setTrackingStatus] = useState<string | null>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleTrackOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;
    
    // Simulação de rastreio
    setTrackingStatus('loading');
    setTimeout(() => {
      setTrackingStatus('found');
    }, 1500);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 5000); // Reset msg
  };

  const faqs = [
    {
      question: "Quanto tempo demora a entrega?",
      answer: "Para Portugal Continental, as entregas são feitas em 24 a 48 horas úteis após a expedição. Para as Ilhas, o prazo pode variar entre 3 a 5 dias úteis."
    },
    {
      question: "Como funciona a garantia dos equipamentos?",
      answer: "Todos os equipamentos novos têm garantia oficial de 3 anos, conforme a legislação em vigor. Para acionar a garantia, basta entrar em contacto connosco com a fatura de compra."
    },
    {
      question: "Posso devolver um produto?",
      answer: "Sim, aceitamos devoluções no prazo de 14 dias após a receção, desde que o produto esteja na embalagem original selada e sem sinais de uso. Tinteiros abertos não podem ser devolvidos."
    },
    {
      question: "Fazem reparações de impressoras?",
      answer: "Sim, somos centro autorizado de assistência técnica para HP e Brother. Pode entregar a sua máquina na nossa loja física ou solicitar recolha para orçamento."
    }
  ];

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-20 animate-in fade-in duration-500">
      {/* Hero Section */}
      <div className="bg-blue-600 py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-6">Como podemos ajudar?</h1>
          <div className="bg-white/10 backdrop-blur-md p-1 rounded-full max-w-xl mx-auto flex border border-white/20">
            <input 
              type="text" 
              placeholder="Pesquise a sua dúvida..." 
              className="w-full bg-transparent text-white placeholder-blue-100 px-6 py-3 outline-none rounded-full"
            />
            <button className="bg-white text-blue-600 rounded-full p-3 hover:bg-blue-50 transition-colors">
              <Search className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-10 relative z-20">
        {/* Quick Actions Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-lg border border-slate-100 dark:border-slate-800 text-center hover:-translate-y-1 transition-transform duration-300">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600 dark:text-blue-400">
              <Package className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Onde está a minha encomenda?</h3>
            <form onSubmit={handleTrackOrder} className="mt-4">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="#OL-12345" 
                  className="flex-1 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm bg-slate-50 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
                  Ver
                </button>
              </div>
              {trackingStatus === 'loading' && <p className="text-xs text-slate-400 mt-2 animate-pulse">A verificar...</p>}
              {trackingStatus === 'found' && (
                <div className="mt-3 text-left bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-100 dark:border-green-900/50">
                  <p className="text-xs font-bold text-green-700 dark:text-green-400 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" /> Em Distribuição
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-300 mt-1">Entrega prevista: Hoje até às 19h</p>
                </div>
              )}
            </form>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-lg border border-slate-100 dark:border-slate-800 text-center hover:-translate-y-1 transition-transform duration-300">
             <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-orange-600 dark:text-orange-400">
              <RefreshCw className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Devoluções e Trocas</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              Não ficou satisfeito? Inicie o processo de devolução de forma simples e rápida.
            </p>
            <button className="text-blue-600 dark:text-blue-400 text-sm font-bold hover:underline">
              Iniciar Devolução &rarr;
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-lg border border-slate-100 dark:border-slate-800 text-center hover:-translate-y-1 transition-transform duration-300">
             <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-purple-600 dark:text-purple-400">
              <MessageSquare className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Assistente Inteligente</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              O nosso bot AI responde a dúvidas técnicas e ajuda a escolher produtos 24/7.
            </p>
            <button 
              onClick={onOpenChat}
              className="text-blue-600 dark:text-blue-400 text-sm font-bold hover:underline"
            >
              Abrir Chat Agora &rarr;
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* FAQ Section */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <ShieldCheck className="text-blue-600" /> Perguntas Frequentes
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div 
                  key={index} 
                  className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden"
                >
                  <button 
                    onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left font-medium text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    {faq.question}
                    {activeFaq === index ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                  {activeFaq === index && (
                    <div className="px-6 pb-4 text-slate-600 dark:text-slate-400 text-sm leading-relaxed animate-in slide-in-from-top-2">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Mail className="text-blue-600" /> Envie-nos uma mensagem
            </h2>
            
            {formSubmitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-10 animate-in fade-in zoom-in">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Mensagem Enviada!</h3>
                <p className="text-slate-500 dark:text-slate-400 mt-2">
                  A nossa equipa entrará em contacto consigo nas próximas 24 horas.
                </p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nome</label>
                    <input required type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                    <input required type="email" className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Assunto</label>
                  <select className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none">
                    <option>Estado da Encomenda</option>
                    <option>Dúvida Técnica</option>
                    <option>Garantia / Devolução</option>
                    <option>Outro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Mensagem</label>
                  <textarea required rows={4} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"></textarea>
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                  <Send className="h-4 w-4" />
                  Enviar Mensagem
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Info Footer */}
        <div className="mt-16 grid md:grid-cols-3 gap-6 text-center">
          <div className="p-4">
            <Phone className="h-8 w-8 mx-auto text-slate-400 mb-3" />
            <h4 className="font-bold text-slate-900 dark:text-white">Apoio Telefónico</h4>
            <p className="text-slate-500 dark:text-slate-400 text-sm">+351 210 000 000</p>
            <p className="text-slate-400 text-xs mt-1">Seg-Sex: 9h - 18h</p>
          </div>
          <div className="p-4">
            <Mail className="h-8 w-8 mx-auto text-slate-400 mb-3" />
            <h4 className="font-bold text-slate-900 dark:text-white">Email</h4>
            <p className="text-slate-500 dark:text-slate-400 text-sm">apoio@olprint.pt</p>
            <p className="text-slate-400 text-xs mt-1">Resposta em 24h úteis</p>
          </div>
          <div className="p-4">
            <MapPin className="h-8 w-8 mx-auto text-slate-400 mb-3" />
            <h4 className="font-bold text-slate-900 dark:text-white">Loja Lisboa</h4>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Av. da Liberdade, 100</p>
            <p className="text-slate-400 text-xs mt-1">Seg-Sáb: 10h - 20h</p>
          </div>
        </div>
      </div>
    </div>
  );
};