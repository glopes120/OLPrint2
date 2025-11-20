import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ProductCard } from './components/ProductCard';
import { Cart } from './components/Cart';
import { ChatAssistant } from './components/ChatAssistant';
import { PRODUCTS } from './constants';
import { CartItem, Product, ViewState, Category } from './types';
import { Filter, Search, CheckCircle, TrendingUp, Shield, Truck } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState('');

  // Cart Logic
  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Filter Logic
  const categories = ['Todos', ...Object.values(Category)];
  const filteredProducts = PRODUCTS.filter(p => {
    const matchesCategory = selectedCategory === 'Todos' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Views
  const renderHome = () => (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
              Impressão Profissional <br/>
              <span className="text-blue-500">Simplificada.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-8">
              A OL Print traz para Portugal a melhor tecnologia de impressão. 
              Equipamentos, consumíveis e assistência técnica num só lugar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => setCurrentView('products')}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-blue-500/25"
              >
                Ver Catálogo
              </button>
              <button 
                onClick={() => setIsChatOpen(true)}
                className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg backdrop-blur-sm transition-all border border-white/10"
              >
                Falar com Especialista AI
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: <Truck className="h-8 w-8 text-blue-600" />, title: 'Envio Rápido', desc: 'Entregas em 24/48h para Portugal Continental.' },
            { icon: <Shield className="h-8 w-8 text-blue-600" />, title: 'Garantia Oficial', desc: '3 anos de garantia em todos os equipamentos.' },
            { icon: <TrendingUp className="h-8 w-8 text-blue-600" />, title: 'Preços Competitivos', desc: 'A melhor relação qualidade/preço do mercado.' },
          ].map((feature, idx) => (
            <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:border-blue-100 transition-colors">
              <div className="bg-blue-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
              <p className="text-slate-500">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Destaques da Semana</h2>
            <p className="text-slate-500 mt-2">Os produtos mais procurados pelos nossos clientes.</p>
          </div>
          <button 
            onClick={() => setCurrentView('products')}
            className="text-blue-600 font-semibold hover:text-blue-800 transition-colors hidden sm:block"
          >
            Ver todos &rarr;
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRODUCTS.slice(0, 4).map(product => (
            <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
          ))}
        </div>
        <div className="mt-8 text-center sm:hidden">
           <button 
            onClick={() => setCurrentView('products')}
            className="text-blue-600 font-semibold hover:text-blue-800"
          >
            Ver todos os produtos &rarr;
          </button>
        </div>
      </section>
    </div>
  );

  const renderProducts = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Loja Online</h1>
          <p className="text-slate-500">Encontre tudo o que precisa para impressão.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Pesquisar produto..." 
              className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64 shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2 mb-10">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
          <Filter className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900">Nenhum produto encontrado</h3>
          <p className="text-slate-500">Tente ajustar os filtros ou a sua pesquisa.</p>
        </div>
      )}
    </div>
  );

  const renderAbout = () => (
    <div className="bg-white">
      <div className="relative bg-slate-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Sobre a OL Print</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Somos apaixonados por tecnologia e dedicados a fornecer as melhores soluções de impressão em Portugal desde 2010.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <div className="prose prose-lg prose-slate mx-auto">
          <p>
            A <strong>OL Print</strong> nasceu com a missão de simplificar o processo de compra e manutenção de equipamentos de impressão para empresas e particulares em Portugal.
            Trabalhamos diretamente com as maiores marcas do mercado (HP, Brother, Epson, Canon) para garantir qualidade original a preços justos.
          </p>
          <p>
            O que nos distingue? O nosso compromisso com o suporte. Não vendemos apenas caixas; vendemos soluções que funcionam. E agora, com a nossa nova integração de Inteligência Artificial, estamos disponíveis 24/7 para responder às suas dúvidas técnicas.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
           <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
             <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
               <CheckCircle className="text-green-500" /> Nossa Missão
             </h3>
             <p className="text-slate-600">
               Democratizar o acesso a impressão de alta qualidade e reduzir o desperdício através de aconselhamento inteligente sobre consumíveis.
             </p>
           </div>
           <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
             <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
               <TrendingUp className="text-blue-500" /> Nosso Futuro
             </h3>
             <p className="text-slate-600">
               Continuar a inovar no e-commerce português, integrando tecnologia de ponta para servir melhor os nossos clientes.
             </p>
           </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Header 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        cartCount={cartCount} 
        toggleCart={() => setIsCartOpen(true)}
        toggleChat={() => setIsChatOpen(prev => !prev)}
      />

      <main className="flex-grow">
        {currentView === 'home' && renderHome()}
        {currentView === 'products' && renderProducts()}
        {currentView === 'about' && renderAbout()}
      </main>

      <footer className="bg-white border-t border-slate-200 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <span className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-4">
                <div className="bg-blue-600 w-8 h-8 rounded-lg flex items-center justify-center">
                   <span className="text-white font-bold">O</span>
                </div>
                OL Print
              </span>
              <p className="text-slate-500 text-sm leading-relaxed">
                A sua loja de confiança para impressoras e consumíveis em Portugal. Qualidade, rapidez e suporte especializado.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-slate-900 mb-4">Loja</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li className="hover:text-blue-600 cursor-pointer" onClick={() => setCurrentView('products')}>Impressoras</li>
                <li className="hover:text-blue-600 cursor-pointer" onClick={() => setCurrentView('products')}>Tinteiros</li>
                <li className="hover:text-blue-600 cursor-pointer" onClick={() => setCurrentView('products')}>Papel</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-4">Apoio ao Cliente</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li className="hover:text-blue-600 cursor-pointer">Estado da Encomenda</li>
                <li className="hover:text-blue-600 cursor-pointer">Devoluções</li>
                <li className="hover:text-blue-600 cursor-pointer">Contactos</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-4">Newsletter</h4>
              <p className="text-sm text-slate-500 mb-4">Receba novidades e promoções exclusivas.</p>
              <div className="flex gap-2">
                <input type="email" placeholder="seu@email.com" className="bg-slate-100 border-none rounded-md px-3 py-2 text-sm w-full focus:ring-2 focus:ring-blue-500 outline-none" />
                <button className="bg-blue-600 text-white rounded-md px-3 py-2 text-sm font-medium hover:bg-blue-700 transition-colors">OK</button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-400">© 2024 OL Print Portugal. Todos os direitos reservados.</p>
            <div className="flex gap-4">
               <div className="h-6 w-10 bg-slate-200 rounded"></div>
               <div className="h-6 w-10 bg-slate-200 rounded"></div>
               <div className="h-6 w-10 bg-slate-200 rounded"></div>
            </div>
          </div>
        </div>
      </footer>

      <Cart 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
      />

      <ChatAssistant 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)}
        onOpen={() => setIsChatOpen(true)}
      />
    </div>
  );
};

export default App;