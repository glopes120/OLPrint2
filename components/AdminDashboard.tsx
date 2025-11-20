import React, { useState } from 'react';
import { Product, Category, ViewState } from '../types';
import { 
  LayoutDashboard, 
  Package, 
  LogOut, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  X, 
  Save, 
  Image as ImageIcon,
  DollarSign,
  TrendingUp,
  ShoppingCart,
  Filter
} from 'lucide-react';

interface AdminDashboardProps {
  products: Product[];
  onUpdateProduct: (product: Product) => void;
  onAddProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  onUpdateProduct,
  onAddProduct,
  onDeleteProduct,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'products'>('overview');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('Todos');

  // Form State
  const [formData, setFormData] = useState<Partial<Product>>({});

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData(product);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setFormData({
      id: `p${Date.now()}`,
      rating: 5,
      reviews: 0,
      image: 'https://picsum.photos/400/300?random=' + Date.now()
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.category) return;

    const productData = formData as Product;

    if (editingProduct) {
      onUpdateProduct(productData);
    } else {
      onAddProduct(productData);
    }
    setIsModalOpen(false);
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategoryFilter === 'Todos' || p.category === selectedCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Statistics
  const totalValue = products.reduce((acc, p) => acc + p.price, 0);
  const totalPromos = products.filter(p => p.originalPrice).length;

  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <Package className="h-6 w-6 text-blue-600" />
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase">Total Produtos</span>
        </div>
        <h3 className="text-3xl font-bold text-slate-900">{products.length}</h3>
        <p className="text-sm text-slate-500 mt-1">Items ativos no catálogo</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-red-50 p-3 rounded-lg">
            <TrendingUp className="h-6 w-6 text-red-600" />
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase">Promoções</span>
        </div>
        <h3 className="text-3xl font-bold text-slate-900">{totalPromos}</h3>
        <p className="text-sm text-slate-500 mt-1">Campanhas ativas</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-green-50 p-3 rounded-lg">
            <DollarSign className="h-6 w-6 text-green-600" />
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase">Valor Catálogo</span>
        </div>
        <h3 className="text-3xl font-bold text-slate-900">€{totalValue.toFixed(2)}</h3>
        <p className="text-sm text-slate-500 mt-1">Preço base acumulado</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col fixed h-full z-20">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-md">
              <LayoutDashboard className="h-5 w-5" />
            </div>
            OL Backoffice
          </h2>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'overview' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <LayoutDashboard className="h-5 w-5" />
            Visão Geral
          </button>
          <button 
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'products' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <Package className="h-5 w-5" />
            Produtos
          </button>
          <button disabled className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 cursor-not-allowed">
            <ShoppingCart className="h-5 w-5" />
            Encomendas (Demo)
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-slate-800 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <header className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {activeTab === 'overview' ? 'Painel de Controlo' : 'Gestão de Produtos'}
              </h1>
              <p className="text-slate-500">Bem-vindo de volta, Administrador.</p>
            </div>
            {activeTab === 'products' && (
              <button 
                onClick={handleAddNew}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 shadow-sm"
              >
                <Plus className="h-5 w-5" />
                Novo Produto
              </button>
            )}
          </header>

          {activeTab === 'overview' ? renderOverview() : (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              {/* Table Header / Filter */}
              <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center gap-4">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Procurar produtos..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="relative w-full sm:w-auto">
                   <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <Filter className="h-4 w-4 text-slate-400" />
                   </div>
                   <select
                      value={selectedCategoryFilter}
                      onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                      className="pl-9 pr-8 py-2 w-full sm:w-48 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none text-slate-700 text-sm"
                   >
                      <option value="Todos">Todas as Categorias</option>
                      {Object.values(Category).map(c => (
                         <option key={c} value={c}>{c}</option>
                      ))}
                   </select>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                    <tr>
                      <th className="px-6 py-4">Produto</th>
                      <th className="px-6 py-4">Categoria</th>
                      <th className="px-6 py-4">Preço</th>
                      <th className="px-6 py-4">Promoção</th>
                      <th className="px-6 py-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProducts.map(product => (
                      <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden">
                              <img src={product.image} alt="" className="h-full w-full object-cover" />
                            </div>
                            <div>
                              <div className="font-medium text-slate-900">{product.name}</div>
                              <div className="text-xs text-slate-400 truncate max-w-[200px]">{product.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          <span className="px-2 py-1 bg-slate-100 rounded-md text-xs font-medium">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-900">
                          €{product.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          {product.originalPrice ? (
                            <span className="text-xs text-red-600 font-bold px-2 py-1 bg-red-50 rounded-md">
                              Sim (€{product.originalPrice})
                            </span>
                          ) : (
                            <span className="text-slate-400 text-xs">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => handleEdit(product)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => {
                                if(confirm('Tem a certeza que deseja apagar este produto?')) {
                                  onDeleteProduct(product.id);
                                }
                              }}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredProducts.length === 0 && (
                   <div className="text-center py-12 text-slate-400">
                      <p>Nenhum produto encontrado com estes filtros.</p>
                   </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900">
                {editingProduct ? 'Editar Produto' : 'Novo Produto'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nome do Produto</label>
                  <input 
                    required
                    type="text" 
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.name || ''}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Descrição</label>
                  <textarea 
                    required
                    rows={3}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.description || ''}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Preço Atual (€)</label>
                  <input 
                    required
                    type="number" 
                    step="0.01"
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.price || ''}
                    onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Preço Original (se Promoção)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.originalPrice || ''}
                    placeholder="Opcional"
                    onChange={e => setFormData({...formData, originalPrice: e.target.value ? parseFloat(e.target.value) : undefined})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Categoria</label>
                  <select 
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.category || ''}
                    onChange={e => setFormData({...formData, category: e.target.value as Category})}
                  >
                    <option value="">Selecione...</option>
                    {Object.values(Category).map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">URL da Imagem</label>
                   <div className="flex gap-2">
                     <input 
                        type="text" 
                        className="flex-1 p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        value={formData.image || ''}
                        onChange={e => setFormData({...formData, image: e.target.value})}
                      />
                      <div className="w-10 h-10 bg-slate-100 rounded border overflow-hidden flex-shrink-0">
                         {formData.image && <img src={formData.image} className="w-full h-full object-cover" />}
                      </div>
                   </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium"
                >
                  <Save className="h-4 w-4" />
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};