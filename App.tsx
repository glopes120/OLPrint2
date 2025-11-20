
import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ProductCard } from './components/ProductCard';
import { Cart } from './components/Cart';
import { ChatAssistant } from './components/ChatAssistant';
import { AdminDashboard } from './components/AdminDashboard';
import { DesignStudio } from './components/DesignStudio';
import { ProfileSettings } from './components/ProfileSettings';
import { Support } from './components/Support';
import { NotificationToast } from './components/NotificationToast';
import { PRODUCTS as INITIAL_PRODUCTS } from './constants';
import { CartItem, Product, ViewState, Category, Order, AppNotification } from './types';
import { updateAIContext } from './services/geminiService';
import { Filter, Search, CheckCircle, TrendingUp, Shield, Truck, Flame, Timer, Lock, User } from 'lucide-react';

const App: React.FC = () => {
  // Routing State
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [currentView, setCurrentView] = useState<ViewState>('home');
  
  // Data State
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState('');

  // Orders & Notifications State
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'OL-1002-Z',
      date: 'Hoje',
      total: 139.50,
      status: 'Em Processamento',
      items: ['Brother HL-L2350DW', 'Papel Navigator A4'],
      action: 'cancel'
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
      id: 'OL-8821-X',
      date: '12 Out 2023',
      total: 249.99,
      status: 'Entregue',
      items: ['HP LaserJet Pro M404dn'],
      action: 'invoice'
    },
    {
      id: 'OL-7520-A',
      date: '20 Set 2023',
      total: 15.50,
      status: 'Entregue',
      items: ['Papel Fotográfico Glossy'],
      action: 'invoice'
    },
    {
      id: 'OL-6201-B',
      date: '02 Ago 2023',
      total: 89.00,
      status: 'Entregue',
      items: ['Canon PIXMA TS5350i'],
      action: 'invoice'
    }
  ]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [currentToast, setCurrentToast] = useState<AppNotification | null>(null);

  // Dark Mode State
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved === 'true';
  });
  
  // 1. Handle Routing (Hash change)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#admin') {
        setIsAdminMode(true);
      } else {
        setIsAdminMode(false);
        // Preserve internal navigation if valid, else default to home
        if (!['home', 'products', 'promotions', 'about', 'design-studio', 'profile', 'support'].includes(currentView)) {
            setCurrentView('home');
        }
      }
    };

    // Check on mount
    handleHashChange();

    // Listen for changes
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [currentView]);

  // 2. Sync AI Context
  useEffect(() => {
    updateAIContext(products);
  }, [products]);

  // 3. Dark Mode Effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  // 4. Simulate Order Status Update & Notification
  useEffect(() => {
    const timer = setTimeout(() => {
      // Find the processing order and update it to 'Enviado'
      const targetOrderId = 'OL-1002-Z';
      
      setOrders(prevOrders => {
        // Check if already updated to avoid loops if component re-renders
        const needsUpdate = prevOrders.some(o => o.id === targetOrderId && o.status === 'Em Processamento');
        
        if (needsUpdate) {
          // Create Notification
          const newNotification: AppNotification = {
            id: Date.now().toString(),
            title: 'Encomenda Enviada!',
            message: `A sua encomenda #${targetOrderId} saiu do nosso armazém e está a caminho.`,
            type: 'info',
            timestamp: new Date(),
            read: false
          };

          setNotifications(prev => [newNotification, ...prev]);
          setCurrentToast(newNotification);

          // Return updated orders
          return prevOrders.map(o => 
            o.id === targetOrderId ? { ...o, status: 'Enviado', action: 'track' } : o
          );
        }
        return prevOrders;
      });

    }, 8000); // Trigger after 8 seconds

    return () => clearTimeout(timer);
  }, []);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

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

  // Helper for AI to add by ID
  const handleAddToCartById = (productId: string): boolean => {
    const product = products.find(p => p.id === productId);
    if (product) {
      addToCart(product);
      return true;
    }
    return false;
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

  const markNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Admin Actions
  const handleAddProduct = (newProduct: Product) => {
    setProducts(prev => [...prev, newProduct]);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const handleLogout = () => {
    window.location.hash = ''; // Return to main site
  };

  // Filter Logic
  const categories = ['Todos', ...Object.values(Category)];
  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'Todos' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // --- Render Views ---

  if (isAdminMode) {
    return (
      <AdminDashboard 
        products={products}
        onUpdateProduct={handleUpdateProduct}
        onAddProduct={handleAddProduct}
        onDeleteProduct={handleDeleteProduct}
        onLogout={handleLogout}
      />
    );
  }

  // Storefront Logic
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
            <div key={idx} className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:border-blue-100 dark:hover:border-blue-900 transition-colors">
              <div className="bg-blue-50 dark:bg-blue-900/30 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
              <p className="text-slate-500 dark:text-slate-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Destaques da Semana</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Os produtos mais procurados pelos nossos clientes.</p>
          </div>
          <button 
            onClick={() => setCurrentView('products')}
            className="text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-800 dark:hover:text-blue-300 transition-colors hidden sm:block"
          >
            Ver todos &rarr;
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 4).map(product => (
            <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
          ))}
        </div>
        <div className="mt-8 text-center sm:hidden">
           <button 
            onClick={() => setCurrentView('products')}
            className="text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-800"
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
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Loja Online</h1>
          <p className="text-slate-500 dark:text-slate-400">Encontre tudo o que precisa para impressão.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Pesquisar produto..." 
              className="pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64 shadow-sm text-slate-900 dark:text-white"
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
                ? 'bg-blue-600 text-white shadow-md shadow-blue-200 dark:shadow-blue-900/50'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
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
        <div className="text-center py-20 bg-slate-50 dark:bg-slate-800 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700">
          <Filter className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-white">Nenhum produto encontrado</h3>
          <p className="text-slate-500 dark:text-slate-400">Tente ajustar os filtros ou a sua pesquisa.</p>
        </div>
      )}
    </div>
  );

  const renderPromotions = () => {
    const promoProducts = products.filter(p => p.originalPrice && p.originalPrice > p.price);
    
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Promo Banner */}
        <div className="bg-gradient-to-r from-red-600 to-orange-500 rounded-3xl p-8 sm:p-12 mb-12 text-white relative overflow-hidden shadow-lg">
          <div className="relative z-10 max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                <Flame className="h-6 w-6 text-yellow-300" />
              </div>
              <span className="font-bold tracking-wider text-red-100 uppercase text-sm">Ofertas Limitadas</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold mb-4">Descontos Explosivos em Impressão</h1>
            <p className="text-lg text-red-100 mb-8">Aproveite os melhores preços em impressoras e consumíveis selecionados. Stock limitado!</p>
            <div className="flex items-center gap-2 text-sm font-semibold bg-white/10 w-fit px-4 py-2 rounded-full backdrop-blur-sm">
              <Timer className="h-4 w-4" />
              <span>Promoções válidas até fim de stock</span>
            </div>
          </div>
          <div className="absolute right-0 bottom-0 h-full w-1/2 bg-[url('https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')] bg-cover bg-center opacity-10 mix-blend-overlay mask-image-gradient"></div>
        </div>

        {/* Grid */}
        {promoProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {promoProducts.map(product => (
              <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-slate-500 dark:text-slate-400">Não existem promoções ativas de momento. Fique atento!</p>
          </div>
        )}
      </div>
    );
  };

  const renderAbout = () => (
    <div className="bg-white dark:bg-slate-900 transition-colors">
      <div className="relative bg-slate-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Sobre a OL Print</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Somos apaixonados por tecnologia e dedicados a fornecer as melhores soluções de impressão em Portugal desde 2010.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <div className="prose prose-lg prose-slate dark:prose-invert mx-auto">
          <p className="text-slate-600 dark:text-slate-300">
            A <strong>OL Print</strong> nasceu com a missão de simplificar o processo de compra e manutenção de equipamentos de impressão para empresas e particulares em Portugal.
            Trabalhamos diretamente com as maiores marcas do mercado (HP, Brother, Epson, Canon) para garantir qualidade original a preços justos.
          </p>
          <p className="text-slate-600 dark:text-slate-300">
            O que nos distingue? O nosso compromisso com o suporte. Não vendemos apenas caixas; vendemos soluções que funcionam. E agora, com a nossa nova integração de Inteligência Artificial, estamos disponíveis 24/7 para responder às suas dúvidas técnicas.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
           <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
             <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
               <CheckCircle className="text-green-500" /> Nossa Missão
             </h3>
             <p className="text-slate-600 dark:text-slate-400">
               Democratizar o acesso a impressão de alta qualidade e reduzir o desperdício através de aconselhamento inteligente sobre consumíveis.
             </p>
           </div>
           <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
             <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
               <TrendingUp className="text-blue-500" /> Nosso Futuro
             </h3>
             <p className="text-slate-600 dark:text-slate-400">
               Continuar a inovar no e-commerce português, integrando tecnologia de ponta para servir melhor os nossos clientes.
             </p>
           </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-300">
      <Header 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        cartCount={cartCount} 
        toggleCart={() => setIsCartOpen(true)}
        toggleChat={() => setIsChatOpen(prev => !prev)}
        notifications={notifications}
        onMarkNotificationsRead={markNotificationsAsRead}
      />

      <main className="flex-grow relative">
        <NotificationToast 
          notification={currentToast} 
          onClose={() => setCurrentToast(null)} 
        />

        {currentView === 'home' && renderHome()}
        {currentView === 'products' && renderProducts()}
        {currentView === 'promotions' && renderPromotions()}
        {currentView === 'about' && renderAbout()}
        {currentView === 'design-studio' && <DesignStudio />}
        {currentView === 'support' && <Support onOpenChat={() => setIsChatOpen(true)} orders={orders} />}
        {currentView === 'profile' && (
          <ProfileSettings 
            darkMode={darkMode}
            toggleDarkMode={toggleDarkMode}
          />
        )}
      </main>

      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pt-16 pb-8 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <span className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                <div className="bg-blue-600 w-8 h-8 rounded-lg flex items-center justify-center">
                   <span className="text-white font-bold">O</span>
                </div>
                OL Print
              </span>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                A sua loja de confiança para impressoras e consumíveis em Portugal. Qualidade, rapidez e suporte especializado.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-4">Loja</h4>
              <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                <li className="hover:text-blue-600 cursor-pointer" onClick={() => setCurrentView('products')}>Impressoras</li>
                <li className="hover:text-blue-600 cursor-pointer" onClick={() => setCurrentView('products')}>Tinteiros</li>
                <li className="hover:text-blue-600 cursor-pointer" onClick={() => setCurrentView('products')}>Papel</li>
                <li className="hover:text-red-600 cursor-pointer font-medium" onClick={() => setCurrentView('promotions')}>Promoções</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-4">Apoio ao Cliente</h4>
              <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                <li className="hover:text-blue-600 cursor-pointer" onClick={() => setCurrentView('support')}>Estado da Encomenda</li>
                <li className="hover:text-blue-600 cursor-pointer" onClick={() => setCurrentView('support')}>Devoluções</li>
                <li className="hover:text-blue-600 cursor-pointer" onClick={() => setCurrentView('support')}>Contactos</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-4">Newsletter</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Receba novidades e promoções exclusivas.</p>
              <div className="flex gap-2">
                <input type="email" placeholder="seu@email.com" className="bg-slate-100 dark:bg-slate-800 border-none rounded-md px-3 py-2 text-sm w-full focus:ring-2 focus:ring-blue-500 outline-none dark:text-white" />
                <button className="bg-blue-600 text-white rounded-md px-3 py-2 text-sm font-medium hover:bg-blue-700 transition-colors">OK</button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-100 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-400">© 2024 OL Print Portugal. Todos os direitos reservados.</p>
            <div className="flex items-center gap-4">
               {/* "Separate Site" Link */}
               <a 
                 href="#admin" 
                 className="text-xs text-slate-300 hover:text-blue-600 transition-colors flex items-center gap-1 group"
               >
                 <Lock className="h-3 w-3" />
                 <span className="hidden group-hover:inline">Portal Administrativo</span>
               </a>
               <div className="flex gap-4">
                 <div className="h-6 w-10 bg-slate-200 dark:bg-slate-800 rounded"></div>
                 <div className="h-6 w-10 bg-slate-200 dark:bg-slate-800 rounded"></div>
                 <div className="h-6 w-10 bg-slate-200 dark:bg-slate-800 rounded"></div>
               </div>
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
        onAddToCart={handleAddToCartById}
      />
    </div>
  );
};

export default App;
