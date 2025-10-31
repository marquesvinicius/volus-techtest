import { useState, useEffect, useMemo } from 'react';
import productService from '../services/productService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProductForm from '../components/products/ProductForm'; // Importar o formulário
import { validateCodeChecksum } from '../utils/validation';


const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    code: '',
    price: '',
    category: '',
    subcategory: '',
    stock: '',
  });
  const [codeError, setCodeError] = useState('');


  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Ajustado para buscar todos os produtos
      const response = await productService.getProducts({ page_size: 500 });
      setProducts(response.results || []);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      toast.error('Falha ao buscar produtos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Memoized unique categories and subcategories
  const categories = useMemo(() => {
    return [...new Set(products.map(p => p.category))].sort();
  }, [products]);

  // Subcategorias para o FILTRO
  const subcategoriesForFilter = useMemo(() => {
    if (!selectedCategory) return [];
    return [...new Set(products.filter(p => p.category === selectedCategory).map(p => p.subcategory))].sort();
  }, [products, selectedCategory]);

  // Subcategorias para o MODAL de Adicionar Produto
  const subcategoriesForModal = useMemo(() => {
    if (!newProduct.category) return [];
    return [...new Set(products.filter(p => p.category === newProduct.category).map(p => p.subcategory))].sort();
  }, [products, newProduct.category]);


  // Apply filters and sorting
  useEffect(() => {
    let results = [...products];

    // Filter by category
    if (selectedCategory) {
      results = results.filter((p) => p.category === selectedCategory);
    }

    // Filter by subcategory
    if (selectedSubcategory) {
      results = results.filter((p) => p.subcategory === selectedSubcategory);
    }

    // Filter by search term (name or code)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.code.toLowerCase().includes(term)
      );
    }

    // Apply sorting
    results.sort((a, b) => {
      let aVal, bVal;
      
      switch (sortBy) {
        case 'name':
          aVal = a.name.toLowerCase();
          bVal = b.name.toLowerCase();
          break;
        case 'price':
          aVal = parseFloat(a.price);
          bVal = parseFloat(b.price);
          break;
        case 'stock':
          aVal = a.stock;
          bVal = b.stock;
          break;
        case 'code':
          aVal = a.code;
          bVal = b.code;
          break;
        default:
          aVal = a.name.toLowerCase();
          bVal = b.name.toLowerCase();
      }

      if (typeof aVal === 'string') {
        return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    });

    setFilteredProducts(results);
  }, [products, selectedCategory, selectedSubcategory, searchTerm, sortBy, sortOrder]);

  const handleReset = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedSubcategory('');
    setSortBy('name');
    setSortOrder('asc');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleCodeChange = (e) => {
    const { value } = e.target;
    setNewProduct(prev => ({ ...prev, code: value }));

    if (value && !validateCodeChecksum(value)) {
      setCodeError('Checksum inválido. A soma dos dígitos do código deve ser divisível por 3.');
    } else {
      setCodeError('');
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.code || !newProduct.price || !newProduct.category || !newProduct.stock) {
      toast.warn('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    if (codeError) {
      toast.error('Por favor, corrija os erros no formulário antes de salvar.');
      return;
    }
    
    try {
      const createdProduct = await productService.createProduct(newProduct);
      // Atualiza a lista de produtos no estado para refletir a adição
      setProducts(prev => [createdProduct, ...prev]);
      toast.success(`Produto "${createdProduct.name}" adicionado com sucesso!`);
      setIsModalOpen(false);
      setNewProduct({ name: '', code: '', price: '', category: '', subcategory: '', stock: '' });
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      toast.error('Erro ao criar produto. Verifique os dados e tente novamente.');
    }
  };

  const formatPrice = (price) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);

  const SortableHeader = ({ label, sortKey, currentSort, currentOrder, onSort }) => {
    const isActive = currentSort === sortKey;
    
    return (
      <th 
        className="px-6 py-4 text-left text-sm font-semibold text-volus-jet dark:text-volus-dark-500 cursor-pointer hover:bg-gray-100 dark:hover:bg-volus-dark-700 transition"
        onClick={() => {
          if (isActive) {
            // Cycle: asc -> desc -> none
            if (currentOrder === 'asc') {
              onSort(sortKey, 'desc');
            } else {
              onSort('name', 'asc'); // Reset to default
            }
          } else {
            onSort(sortKey, 'asc');
          }
        }}
      >
        <div className="flex items-center gap-2">
          {label}
          <svg 
            className={`w-4 h-4 transition ${
              isActive && currentOrder === 'desc' ? 'rotate-180' : ''
            } ${isActive ? 'text-volus-emerald opacity-100' : 'text-gray-300 opacity-50'}`}
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <path d="M12 5v14M5 8l7-3 7 3" />
          </svg>
        </div>
      </th>
    );
  };

  const handleSort = (key, order) => {
    setSortBy(key);
    setSortOrder(order);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-volus-davys-gray">Carregando produtos...</p>
      </div>
    );
  }

  return (
    <>
      <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-volus-jet dark:text-volus-dark-500">Catálogo de Produtos</h1>
            <p className="text-volus-davys-gray dark:text-volus-dark-600 mt-1">Gerenciamento completo de produtos com filtros avançados</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 bg-volus-emerald text-white font-semibold rounded-lg hover:bg-volus-emerald/90 transition shadow-sm"
          >
            Adicionar Produto
          </button>
        </div>
        <div className="bg-white dark:bg-volus-dark-800 rounded-2xl shadow-card border border-white/60 dark:border-volus-dark-700 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-volus-jet dark:text-volus-dark-500">Filtros</h2>
            <button
              onClick={handleReset}
              className="px-3 py-1 text-sm text-volus-emerald hover:bg-emerald-50 dark:hover:bg-volus-emerald/10 rounded-lg transition"
            >
              Limpar tudo
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-volus-jet dark:text-volus-dark-500 mb-2">
                Buscar (Nome ou Código)
              </label>
              <input
                type="text"
                placeholder="Digite para buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-volus-dark-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-volus-emerald/50 bg-transparent dark:text-volus-dark-500"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-volus-jet dark:text-volus-dark-500 mb-2">
                Categoria
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setSelectedSubcategory('');
                }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-volus-dark-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-volus-emerald/50 bg-transparent dark:text-volus-dark-500 dark:bg-volus-dark-800"
              >
                <option value="">Todas as categorias</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Subcategory Filter */}
            <div>
              <label className="block text-sm font-medium text-volus-jet dark:text-volus-dark-500 mb-2">
                Subcategoria
              </label>
              <select
                value={selectedSubcategory}
                onChange={(e) => setSelectedSubcategory(e.target.value)}
                disabled={!selectedCategory}
                className="w-full px-3 py-2 border border-gray-300 dark:border-volus-dark-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-volus-emerald/50 disabled:bg-gray-100 dark:disabled:bg-volus-dark-700 disabled:text-gray-400 bg-transparent dark:bg-volus-dark-800 dark:text-volus-dark-500"
              >
                <option value="">Todas as subcategorias</option>
                {subcategoriesForFilter.map((subcat) => (
                  <option key={subcat} value={subcat}>
                    {subcat}
                  </option>
                ))}
              </select>
            </div>

          </div>

          <div className="text-sm text-volus-davys-gray dark:text-volus-dark-600">
            Mostrando {filteredProducts.length} de {products.length} produtos
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white dark:bg-volus-dark-800 rounded-2xl shadow-card border border-white/60 dark:border-volus-dark-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-volus-dark-900 border-b border-gray-200 dark:border-volus-dark-700">
                <tr>
                  <SortableHeader 
                    label="Código" 
                    sortKey="code" 
                    currentSort={sortBy} 
                    currentOrder={sortOrder}
                    onSort={handleSort}
                  />
                  <SortableHeader 
                    label="Nome" 
                    sortKey="name" 
                    currentSort={sortBy} 
                    currentOrder={sortOrder}
                    onSort={handleSort}
                  />
                  <th className="px-6 py-4 text-left text-sm font-semibold text-volus-jet dark:text-volus-dark-500">Categoria</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-volus-jet dark:text-volus-dark-500">Subcategoria</th>
                  <SortableHeader 
                    label="Preço" 
                    sortKey="price" 
                    currentSort={sortBy} 
                    currentOrder={sortOrder}
                    onSort={handleSort}
                  />
                  <SortableHeader 
                    label="Estoque" 
                    sortKey="stock" 
                    currentSort={sortBy} 
                    currentOrder={sortOrder}
                    onSort={handleSort}
                  />
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="border-b border-gray-200 dark:border-volus-dark-700 hover:bg-gray-50 dark:hover:bg-volus-dark-700 transition">
                      <td className="px-6 py-4 text-sm font-mono text-volus-davys-gray dark:text-volus-dark-600">{product.code}</td>
                      <td className="px-6 py-4 text-sm text-volus-jet font-medium dark:text-volus-dark-500">{product.name}</td>
                      <td className="px-6 py-4 text-sm text-volus-davys-gray dark:text-volus-dark-600">{product.category_display || product.category}</td>
                      <td className="px-6 py-4 text-sm text-volus-davys-gray dark:text-volus-dark-600">{product.subcategory || '-'}</td>
                      <td className="px-6 py-4 text-sm text-right font-medium text-volus-emerald">
                        {formatPrice(product.price)}
                      </td>
                      <td className="px-6 py-4 text-center text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          product.stock > 0
                            ? 'bg-emerald-50 text-volus-emerald dark:bg-volus-emerald/10 dark:text-volus-emerald'
                            : 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400'
                        }`}>
                          {product.stock}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-volus-davys-gray dark:text-volus-dark-600">
                      Nenhum produto encontrado com os filtros aplicados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-volus-dark-800 rounded-lg shadow-xl p-8 w-full max-w-2xl">
              <h2 className="text-2xl font-bold text-volus-jet dark:text-volus-dark-500 mb-6">Adicionar Novo Produto</h2>
              <form onSubmit={handleAddProduct} className="space-y-4">
                
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-volus-jet dark:text-volus-dark-500 mb-1">Nome do Produto</label>
                  <input type="text" name="name" id="name" value={newProduct.name} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 dark:border-volus-dark-700 dark:bg-volus-dark-900 rounded-md focus:outline-none focus:ring-2 focus:ring-volus-emerald/50 dark:text-volus-dark-500" required />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="code" className="block text-sm font-medium text-volus-jet dark:text-volus-dark-500 mb-1">SKU (Código)</label>
                    <input type="text" name="code" id="code" value={newProduct.code} onChange={handleCodeChange} className="w-full px-3 py-2 border border-gray-300 dark:border-volus-dark-700 dark:bg-volus-dark-900 rounded-md focus:outline-none focus:ring-2 focus:ring-volus-emerald/50 dark:text-volus-dark-500" required />
                    {codeError && <p className="text-red-500 text-xs mt-1">{codeError}</p>}
                  </div>
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-volus-jet dark:text-volus-dark-500 mb-1">Preço (R$)</label>
                    <input type="number" name="price" id="price" step="0.01" value={newProduct.price} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 dark:border-volus-dark-700 dark:bg-volus-dark-900 rounded-md focus:outline-none focus:ring-2 focus:ring-volus-emerald/50 dark:text-volus-dark-500" required />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-volus-jet dark:text-volus-dark-500 mb-1">Categoria</label>
                    <select name="category" id="category" value={newProduct.category} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 dark:border-volus-dark-700 dark:bg-volus-dark-900 rounded-md focus:outline-none focus:ring-2 focus:ring-volus-emerald/50 dark:text-volus-dark-500" required>
                      <option value="">Selecione...</option>
                      {categories.map(cat => <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>)}
                    </select>
                  </div>
                   <div>
                    <label htmlFor="subcategory" className="block text-sm font-medium text-volus-jet dark:text-volus-dark-500 mb-1">Subcategoria</label>
                    <select name="subcategory" id="subcategory" value={newProduct.subcategory} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 dark:border-volus-dark-700 dark:bg-volus-dark-900 rounded-md focus:outline-none focus:ring-2 focus:ring-volus-emerald/50 dark:text-volus-dark-500" disabled={!newProduct.category}>
                      <option value="">Selecione...</option>
                      {subcategoriesForModal.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                    </select>
                  </div>
                </div>
                
                 <div>
                    <label htmlFor="stock" className="block text-sm font-medium text-volus-jet dark:text-volus-dark-500 mb-1">Estoque</label>
                    <input type="number" name="stock" id="stock" value={newProduct.stock} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 dark:border-volus-dark-700 dark:bg-volus-dark-900 rounded-md focus:outline-none focus:ring-2 focus:ring-volus-emerald/50 dark:text-volus-dark-500" required />
                  </div>

                <div className="flex justify-end gap-4 pt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-100 dark:bg-volus-dark-700 text-gray-700 dark:text-volus-dark-500 rounded-md hover:bg-gray-200 dark:hover:bg-volus-dark-600">Cancelar</button>
                  <button type="submit" className="px-6 py-2 bg-volus-emerald text-white rounded-md hover:bg-volus-emerald/90">Salvar Produto</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductList;

