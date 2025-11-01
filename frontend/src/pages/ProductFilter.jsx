import { useState, useEffect, useCallback, useRef } from 'react';
import FilterCascade from '../components/products/FilterCascade';
import FilterChips from '../components/products/FilterChips';
import productService from '../services/productService';
import { isCrazyModeEnabled } from '../utils/validation';
import useDebounce from '../hooks/useDebounce';

/**
 * Página de Filtro de Produtos com Cascata 3 Níveis
 * 
 * Features:
 * - Filtro cascata: Categoria → Subcategoria → Item
 * - Multi-seleção com chips removíveis
 * - Busca em tempo real com debounce
 * - Integração com API /api/products/ e /api/categories/
 * - Modo MALUQUICE: easter egg e comportamentos especiais
 */
const ProductFilter = () => {
  const [categoriesData, setCategoriesData] = useState(null);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [chips, setChips] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selection, setSelection] = useState({
    category: '',
    subcategory: '',
    item: '',
  });
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [easterEggCount, setEasterEggCount] = useState(0);

  const [crazyMode, setCrazyMode] = useState(false);
  useEffect(() => {
    setCrazyMode(isCrazyModeEnabled());
  }, []);

  // Debounce para busca em tempo real
  const searchTimeout = useRef(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const fetchProducts = useCallback(async (currentChips, search) => {
    setSearchLoading(true);
    try {
      const params = {
        q: search,
        page_size: 100,
      };
      
      const category = currentChips.find(c => c.type === 'category')?.value;
      const subcategory = currentChips.find(c => c.type === 'subcategory')?.value;

      if (category) params.category = category;
      if (subcategory) params.subcategory = subcategory;

      const response = await productService.getProducts(params);
      setProducts(response.results || []);
      setFilteredProducts(response.results || []);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  // Carrega estrutura de categorias da API
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const data = await productService.getCategories();
        setCategoriesData(data);
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
        // Em caso de erro, usa dados vazios
        setCategoriesData({ categories: [] });
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  // Carrega produtos da API
  useEffect(() => {
    fetchProducts(chips, debouncedSearchTerm);
  }, [chips, debouncedSearchTerm, fetchProducts]);

  // Filtra produtos baseado nos filtros selecionados (chips)
  const filterProducts = useCallback(() => {
    let filtered = [...products];

    // Obtém valores dos chips
    const categoryChip = chips.find((c) => c.type === 'category');
    const subcategoryChip = chips.find((c) => c.type === 'subcategory');
    const itemChips = chips.filter((c) => c.type === 'item');

    // Filtro por categoria (ignora coringa)
    if (categoryChip && categoryChip.value !== '*') {
      filtered = filtered.filter(
        (p) => p.category === categoryChip.value
      );
    }

    // Filtro por subcategoria
    if (subcategoryChip) {
      filtered = filtered.filter(
        (p) => p.subcategory === subcategoryChip.value
      );
    }

    // Filtro por itens (multi-seleção)
    if (itemChips.length > 0) {
      const itemNames = itemChips.map((c) => c.value);
      filtered = filtered.filter((p) => itemNames.includes(p.name));
    }

    // Busca por texto (nome ou código)
    if (searchTerm && searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.code.toLowerCase().includes(term)
      );
    }

    setFilteredProducts(filtered);
  }, [products, chips, searchTerm]);

  // Efeito para busca com debounce
  useEffect(() => {
    setSearchLoading(true);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    
    searchTimeout.current = setTimeout(() => {
      filterProducts(); 
      setSearchLoading(false);
    }, 300);

    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, [searchTerm, filterProducts]);


  // Manipula mudanças na seleção do cascata
  const handleSelectionChange = useCallback((newSelection) => {
    setSelection(newSelection);

    setChips(prevChips => {
        let nextChips = [...prevChips];

        // Replace category chip if it's different
        const currentCategoryChip = prevChips.find(c => c.type === 'category');
        if (currentCategoryChip?.value !== newSelection.category) {
            nextChips = nextChips.filter(c => c.type !== 'category' && c.type !== 'subcategory');
            if (newSelection.category && newSelection.category !== '*') {
                 const categoryName = categoriesData?.categories?.find(c => c.name === newSelection.category)?.display_name || newSelection.category;
                 nextChips.push({ id: `chip-category-${newSelection.category}`, type: 'category', value: newSelection.category, text: categoryName });
            }
        }
        
        // Replace subcategory chip if it's different
        const currentSubcategoryChip = prevChips.find(c => c.type === 'subcategory');
        if (currentSubcategoryChip?.value !== newSelection.subcategory) {
            nextChips = nextChips.filter(c => c.type !== 'subcategory');
            if (newSelection.subcategory) {
                nextChips.push({ id: `chip-subcategory-${newSelection.subcategory}`, type: 'subcategory', value: newSelection.subcategory, text: newSelection.subcategory });
            }
        }

        // Add item chip if it's new
        if (newSelection.item) {
            const itemExists = nextChips.some(c => c.type === 'item' && c.value === newSelection.item);
            if (!itemExists) {
                nextChips.push({ id: `chip-item-${newSelection.item}`, type: 'item', value: newSelection.item, text: newSelection.item });
            }
        }
        
        return nextChips;
    });

    if (crazyMode && newSelection.category === 'livros' && newSelection.subcategory === 'Clássicos') {
      setEasterEggCount(prev => {
        const newCount = prev + 1;
        if (newCount === 3) {
          setTimeout(() => alert('🎉 EASTER EGG ATIVADO! 🌈'), 100);
          return 0;
        }
        return newCount;
      });
    } else {
      setEasterEggCount(0);
    }
  }, [categoriesData, crazyMode]);

  // Remove chip e atualiza filtros
  const handleRemoveChip = useCallback((chipId, type) => {
    setChips(prevChips => prevChips.filter((c) => c.id !== chipId));

    if (type === 'category') {
      setSelection(prev => ({ ...prev, category: '', subcategory: '', item: '' }));
    } else if (type === 'subcategory') {
      setSelection(prev => ({ ...prev, subcategory: '', item: '' }));
    }
  }, []);

  // Reseta todos os filtros
  const handleReset = () => {
    // Animação especial antes de resetar
    const resetButton = document.querySelector('.reset-button');
    if (resetButton) {
      resetButton.classList.add('animate-reset-pulse');
      setTimeout(() => {
        resetButton.classList.remove('animate-reset-pulse');
      }, 600);
    }

    setSelection({
      category: '',
      subcategory: '',
      item: '',
    });
    setChips([]);
    setSearchTerm('');
    setFilteredProducts(products);
  };

  // Formata preço
  const formatPrice = (price) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-volus-davys-gray">Carregando filtros...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-3xl font-bold text-volus-jet dark:text-volus-dark-500 ${crazyMode ? 'crazy-text-shadow' : ''}`}>Busca Avançada de Produtos</h1>
        <p className="text-volus-davys-gray dark:text-volus-dark-600 mt-1">
          {crazyMode ? "Onde a caça ao tesouro digital começa!" : "Filtre produtos por categoria, subcategoria e item com busca em tempo real"}
        </p>
      </div>

      {/* Busca em Tempo Real */}
      <div className={`bg-white dark:bg-volus-dark-800 rounded-2xl shadow-card border border-white/60 dark:border-volus-dark-700 p-6 ${crazyMode ? 'pulsating-card' : ''}`}>
        <label htmlFor="searchInput" className="block text-sm font-medium text-volus-jet dark:text-volus-dark-500 mb-2">
          Buscar produtos
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-volus-davys-gray dark:text-volus-dark-600">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </span>
          <input
            type="text"
            id="searchInput"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar em tempo real (nome ou código)..."
            className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-volus-dark-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-volus-emerald/50 transition-all duration-200 bg-transparent dark:text-volus-dark-500"
            aria-label="Campo de busca"
          />
          {searchLoading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="w-5 h-5 border-2 border-volus-emerald border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      </div>

      {/* Filtros em Cascata */}
      <div className={`bg-white dark:bg-volus-dark-800 rounded-2xl shadow-card border border-white/60 dark:border-volus-dark-700 p-6 ${crazyMode ? 'pulsating-card' : ''}`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-volus-jet dark:text-volus-dark-500">Filtros em Cascata</h2>
          <button
            onClick={handleReset}
            className="reset-button group relative px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg overflow-hidden"
            aria-label="Limpar todos os filtros"
          >
            {/* Efeito de ondas */}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
            
            {/* Ícone e texto */}
            <span className="relative flex items-center gap-2">
              <svg className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Resetar Filtros
            </span>
            
            {/* Partículas animadas */}
            <span className="absolute top-1/2 left-1/2 w-2 h-2 bg-white/30 rounded-full transform -translate-x-1/2 -translate-y-1/2 group-hover:animate-ping"></span>
          </button>
        </div>
        <FilterCascade
          categoriesData={categoriesData}
          onSelectionChange={handleSelectionChange}
        />
      </div>

      {/* Chips de Seleção */}
      {chips.length > 0 && (
        <FilterChips chips={chips} onRemoveChip={handleRemoveChip} />
      )}

      {/* Resultados */}
      <div className={`bg-white dark:bg-volus-dark-800 rounded-2xl shadow-card border border-white/60 dark:border-volus-dark-700 p-6 ${crazyMode ? 'pulsating-card' : ''}`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-volus-jet dark:text-volus-dark-500">Resultados da Busca</h2>
          <span className="text-sm text-volus-davys-gray dark:text-volus-dark-600">
            {filteredProducts.length} produto(s) encontrado(s)
          </span>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-volus-dark-900 border-b border-gray-200 dark:border-volus-dark-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-volus-jet dark:text-volus-dark-500">Código</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-volus-jet dark:text-volus-dark-500">Nome</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-volus-jet dark:text-volus-dark-500">Categoria</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-volus-jet dark:text-volus-dark-500">Subcategoria</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-volus-jet dark:text-volus-dark-500">Preço</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-volus-jet dark:text-volus-dark-500">Estoque</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-gray-200 dark:border-volus-dark-700 hover:bg-gray-50 dark:hover:bg-volus-dark-700 transition"
                  >
                    <td className="px-6 py-4 text-sm font-mono text-volus-davys-gray dark:text-volus-dark-600">
                      {product.code}
                    </td>
                    <td className="px-6 py-4 text-sm text-volus-jet font-medium dark:text-volus-dark-500">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-volus-davys-gray dark:text-volus-dark-600">
                      {product.category_display || product.category}
                    </td>
                    <td className="px-6 py-4 text-sm text-volus-davys-gray dark:text-volus-dark-600">
                      {product.subcategory || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-right font-medium text-volus-emerald">
                      {formatPrice(product.price)}
                    </td>
                    <td className="px-6 py-4 text-center text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          product.stock > 0
                            ? 'bg-emerald-50 text-volus-emerald dark:bg-volus-emerald/10 dark:text-volus-emerald'
                            : 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400'
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-volus-davys-gray dark:text-volus-dark-600">
            <p>Nenhum produto encontrado com os filtros aplicados.</p>
            <p className="text-sm mt-2">
              Tente ajustar os filtros ou limpar a busca.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductFilter;
