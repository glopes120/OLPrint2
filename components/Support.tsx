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
  CheckCircle,
  Clock,
  FileText,
  Truck,
  AlertCircle,
  ChevronRight,
  LayoutList,
  HelpCircle
} from 'lucide-react';

interface SupportProps {
  onOpenChat: () => void;
}

type Tab = 'help' | 'orders';

export const Support: React.FC<SupportProps> = ({ onOpenChat }) => {
  const [activeTab, setActiveTab] = useState<Tab>('help');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [searchOrderInput, setSearchOrderInput] = useState('');

  // Mock Data for Orders
  const myOrders = [
    {
      id: 'OL-8821-X',
      date: '12 Out 2023',
      total: 249.99,
      status: 'Entregue',
      items: ['HP LaserJet Pro M404dn'],
      action: 'invoice'
    },
    {
      id: 'OL-9942-Y',
      date: '05 Nov 2023',
      total: 39.90,
      status: 'Em Distribuição',
      items: ['Pack Tinteiros HP 305XL'],
      action: 'track'
    },
    {
      id: 'OL-1002-Z',
      date: 'Hoje',
      total: 139.50,
      status: 'Em Processamento',
      items: ['Brother HL-L2350DW', 'Papel Navigator A4'],
      action: 'cancel'
    }
  ];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 5000);
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

  const renderStatusBadge = (status: string) => {
    switch(status) {
      case 'Entregue':
        return <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle className="h-3 w-3" /> {status}</span>;
      case 'Em Distribuição':
        return <span className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full text-xs font-bold flex items-center gap-1"><Truck className="h-3 w-3" /> {status}</span>;
      case 'Em Processamento':
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 rounded-full text-xs font-bold flex items-center gap-1"><Clock className="h-3 w-3" /> {status}</span>;
      default:
        return <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-bold">{status}</span>;
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-20 animate-in fade-in duration-500">
      {/* Hero Section */}
      <div className="bg-blue-600 pt-16 pb-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Área de Cliente & Suporte</h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            Gerencie as suas encomendas ou tire as suas dúvidas com a nossa equipa especializada.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-12 relative z-20">
        
        {/* Navigation Tabs */}
        <div className="bg-white dark:bg-slate-900 rounded-t-2xl border-b border-slate-200 dark:border-slate-800 shadow-sm flex overflow-hidden">
          <button 
            onClick={() => setActiveTab('help')}
            className={`flex-1 py-4 text-center font-bold text-sm md:text-base flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'help' 
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600' 
                : 'bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <HelpCircle className="h-5 w-5" />
            Central de Ajuda
          </button>
          <button 
             onClick={() => setActiveTab('orders')}
             className={`flex-1 py-4 text-center font-bold text-sm md:text-base flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'orders' 
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600' 
                : 'bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <LayoutList className="h-5 w-5" />
            Os Meus Pedidos
          </button>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-b-2xl shadow-lg border border-slate-200 dark:border-slate-800 border-t-0 p-6 md:p-8 min-h-[500px]">
          
          {/* --- TAB: HELP CENTER --- */}
          {activeTab === 'help' && (
            <div className="animate-in fade-in slide-in-from-left-4 duration-300">
              
              {/* Quick Cards */}
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                 <div className="p-6 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:border-blue-200 dark:hover:border-blue-800 transition-all group cursor-pointer" onClick={() => setActiveTab('orders')}>
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                      <Package className="h-5 w-5" />
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white">Rastrear Encomenda</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Veja onde está a sua encomenda.</p>
                 </div>

                 <div className="p-6 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:border-orange-200 dark:hover:border-orange-800 transition-all group cursor-pointer">
                    <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center text-orange-600 dark:text-orange-400 mb-4 group-hover:scale-110 transition-transform">
                      <RefreshCw className="h-5 w-5" />
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white">Devoluções</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Política de 14 dias para trocas.</p>
                 </div>

                 <div className="p-6 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:border-purple-200 dark:hover:border-purple-800 transition-all group cursor-pointer" onClick={onOpenChat}>
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4 group-hover:scale-110 transition-transform">
                      <MessageSquare className="h-5 w-5" />
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white">Chat AI 24/7</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Tire dúvidas técnicas agora.</p>
                 </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-12">
                {/* FAQ */}
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
                          <div className="px-6 pb-4 text-slate-600 dark:text-slate-400 text-sm leading-relaxed animate-in slide-in-from-top-2 border-t border-slate-50 dark:border-slate-800 pt-4">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact Form */}
                <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                    <Mail className="text-blue-600" /> Envie-nos uma mensagem
                  </h2>
                  
                  {formSubmitted ? (
                    <div className="h-full flex flex-col items-center justify-center text-center py-10 animate-in fade-in zoom-in">
                      <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
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
                          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase">Nome</label>
                          <input required type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase">Email</label>
                          <input required type="email" className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase">Assunto</label>
                        <select className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none">
                          <option>Dúvida Técnica</option>
                          <option>Faturação</option>
                          <option>Parcerias</option>
                          <option>Outro</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase">Mensagem</label>
                        <textarea required rows={4} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"></textarea>
                      </div>
                      <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25">
                        <Send className="h-4 w-4" />
                        Enviar Mensagem
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* --- TAB: MY ORDERS --- */}
          {activeTab === 'orders' && (
             <div className="animate-in fade-in slide-in-from-right-4 duration-300">
               <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                 <div>
                   <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Histórico de Pedidos</h2>
                   <p className="text-slate-500 dark:text-slate-400">Consulte o estado e detalhes das suas compras recentes.</p>
                 </div>
                 <div className="relative w-full md:w-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Procurar por ID ou produto..." 
                      value={searchOrderInput}
                      onChange={(e) => setSearchOrderInput(e.target.value)}
                      className="pl-10 pr-4 py-2 w-full md:w-64 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 dark:bg-slate-800 dark:text-white"
                    />
                 </div>
               </div>

               <div className="space-y-4">
                 {myOrders
                   .filter(o => o.id.toLowerCase().includes(searchOrderInput.toLowerCase()) || o.items.some(i => i.toLowerCase().includes(searchOrderInput.toLowerCase())))
                   .map((order, idx) => (
                   <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 hover:shadow-md transition-shadow">
                      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                         <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                               <Package className="h-6 w-6" />
                            </div>
                            <div>
                               <div className="flex items-center gap-2">
                                 <span className="font-bold text-lg text-slate-900 dark:text-white">{order.id}</span>
                                 {renderStatusBadge(order.status)}
                               </div>
                               <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-1">
                                 <Clock className="h-3 w-3" /> {order.date}
                               </p>
                            </div>
                         </div>
                         <div className="text-left md:text-right">
                            <p className="text-sm text-slate-500 dark:text-slate-400">Total</p>
                            <p className="text-xl font-bold text-slate-900 dark:text-white">€{order.total.toFixed(2)}</p>
                         </div>
                      </div>

                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                         <div className="flex-1">
                            <p className="text-xs font-bold text-slate-400 uppercase mb-2">Produtos</p>
                            <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-1">
                              {order.items.map((item, i) => (
                                <li key={i} className="flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full"></div>
                                  {item}
                                </li>
                              ))}
                            </ul>
                         </div>
                         
                         <div className="flex gap-3 w-full md:w-auto">
                            {order.action === 'invoice' ? (
                               <button className="flex-1 md:flex-none px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center gap-2 transition-colors">
                                 <FileText className="h-4 w-4" />
                                 Fatura
                               </button>
                            ) : (
                               <button className="flex-1 md:flex-none px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center gap-2 transition-colors">
                                 <AlertCircle className="h-4 w-4" />
                                 Ajuda
                               </button>
                            )}
                            
                            {order.status !== 'Entregue' && (
                               <button className="flex-1 md:flex-none px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center justify-center gap-2 shadow-sm transition-colors">
                                 <MapPin className="h-4 w-4" />
                                 Rastrear
                               </button>
                            )}
                            
                            <button className="md:hidden px-3 py-2 text-slate-400">
                               <ChevronRight className="h-5 w-5" />
                            </button>
                         </div>
                      </div>
                   </div>
                 ))}
                 
                 {myOrders.length === 0 && (
                    <div className="text-center py-12">
                       <Package className="h-12 w-12 mx-auto text-slate-300 mb-3" />
                       <p className="text-slate-500">Não foram encontradas encomendas.</p>
                    </div>
                 )}
               </div>
             </div>
          )}

        </div>

        {/* Footer Info */}
        <div className="mt-16 grid md:grid-cols-3 gap-6 text-center border-t border-slate-200 dark:border-slate-800 pt-12">
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
