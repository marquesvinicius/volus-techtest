import { useState, useEffect, useMemo } from 'react';
import productService from '../services/productService';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productService.getProducts({ page_size: 500 });
        setProducts(response.results || []);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Extract unique categories
  const categories = useMemo(() => {
    return [...new Set(products.map((p) => p.category_display || p.category))].sort();
  }, [products]);

  // Extract subcategories based on selected category
  const subcategories = useMemo(() => {
    if (!selectedCategory) return [];
    return [
      ...new Set(
        products
          .filter((p) => (p.category_display || p.category) === selectedCategory)
          .map((p) => p.subcategory)
          .filter(Boolean)
      ),
    ].sort();
  }, [products, selectedCategory]);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...products];

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter((p) => (p.category_display || p.category) === selectedCategory);
    }

    // Filter by subcategory
    if (selectedSubcategory) {
      filtered = filtered.filter((p) => p.subcategory === selectedSubcategory);
    }

    // Filter by search term (name or code)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.code.toLowerCase().includes(term)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
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

    setFilteredProducts(filtered);
  }, [products, selectedCategory, selectedSubcategory, searchTerm, sortBy, sortOrder]);

  const handleReset = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedSubcategory('');
    setSortBy('name');
    setSortOrder('asc');
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);

  const SortableHeader = ({ label, sortKey, currentSort, currentOrder, onSort }) => {
    const isActive = currentSort === sortKey;
    
    return (
      <th 
        className="px-6 py-4 text-left text-sm font-semibold text-volus-jet cursor-pointer hover:bg-gray-100 transition"
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-volus-jet">Catálogo de Produtos</h1>
        <p className="text-volus-davys-gray mt-1">Gerenciamento completo de produtos com filtros avançados</p>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-2xl shadow-card border border-white/60 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-volus-jet">Filtros</h2>
          <button
            onClick={handleReset}
            className="px-3 py-1 text-sm text-volus-emerald hover:bg-emerald-50 rounded-lg transition"
          >
            Limpar tudo
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-volus-jet mb-2">
              Buscar (Nome ou Código)
            </label>
            <input
              type="text"
              placeholder="Digite para buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-volus-emerald/50"
            />
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-volus-jet mb-2">
              Categoria
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedSubcategory('');
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-volus-emerald/50"
            >
              <option value="">Todas as categorias</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Subcategory Filter */}
          <div>
            <label className="block text-sm font-medium text-volus-jet mb-2">
              Subcategoria
            </label>
            <select
              value={selectedSubcategory}
              onChange={(e) => setSelectedSubcategory(e.target.value)}
              disabled={!selectedCategory}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-volus-emerald/50 disabled:bg-gray-100 disabled:text-gray-400"
            >
              <option value="">Todas as subcategorias</option>
              {subcategories.map((subcat) => (
                <option key={subcat} value={subcat}>
                  {subcat}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-sm font-medium text-volus-jet mb-2">
              Ordenar por
            </label>
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-volus-emerald/50"
              >
                <option value="name">Nome</option>
                <option value="price">Preço</option>
                <option value="stock">Estoque</option>
                <option value="code">Código</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition text-sm font-medium text-volus-jet"
                title={sortOrder === 'asc' ? 'Ascendente' : 'Descendente'}
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>
        </div>

        <div className="text-sm text-volus-davys-gray">
          Mostrando {filteredProducts.length} de {products.length} produtos
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl shadow-card border border-white/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
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
                <th className="px-6 py-4 text-left text-sm font-semibold text-volus-jet">Categoria</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-volus-jet">Subcategoria</th>
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
                  <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm font-mono text-volus-davys-gray">{product.code}</td>
                    <td className="px-6 py-4 text-sm text-volus-jet font-medium">{product.name}</td>
                    <td className="px-6 py-4 text-sm text-volus-davys-gray">{product.category_display || product.category}</td>
                    <td className="px-6 py-4 text-sm text-volus-davys-gray">{product.subcategory || '-'}</td>
                    <td className="px-6 py-4 text-sm text-right font-medium text-volus-emerald">
                      {formatPrice(product.price)}
                    </td>
                    <td className="px-6 py-4 text-center text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        product.stock > 0
                          ? 'bg-emerald-50 text-volus-emerald'
                          : 'bg-red-50 text-red-600'
                      }`}>
                        {product.stock}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-volus-davys-gray">
                    Nenhum produto encontrado com os filtros aplicados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductList;

