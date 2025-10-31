import { useState, useEffect, useMemo } from 'react';
import { isCrazyModeEnabled } from '../../utils/validation';

/**
 * Componente de Filtro Cascata (3 níveis)
 * Categoria → Subcategoria → Item
 * 
 * Features:
 * - Integração com API /api/categories/
 * - Animações fadeIn/slideDown
 * - Modo MALUQUICE: coringa, regra oculta
 */
const FilterCascade = ({ categoriesData, onSelectionChange }) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [selectedItem, setSelectedItem] = useState('');
  const [availableSubcategories, setAvailableSubcategories] = useState([]);
  const [availableItems, setAvailableItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showLevel2, setShowLevel2] = useState(false);
  const [showLevel3, setShowLevel3] = useState(false);
  const [konamiSequence, setKonamiSequence] = useState([]);
  const [showKonamiEasterEgg, setShowKonamiEasterEgg] = useState(false);
  const [magicWordCount, setMagicWordCount] = useState(0);

  const crazyMode = isCrazyModeEnabled();

  // Sequência Konami: ↑↑↓↓←→←→BA
  const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];

  // Easter egg do código Konami
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!crazyMode) return;

      setKonamiSequence(prev => {
        const newSequence = [...prev, e.code].slice(-10);
        
        if (newSequence.length === 10 && newSequence.every((key, index) => key === konamiCode[index])) {
          setShowKonamiEasterEgg(true);
          setTimeout(() => setShowKonamiEasterEgg(false), 5000);
          return [];
        }
        
        return newSequence;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [crazyMode]);

  // Estrutura de dados local para facilitar acesso
  const [filterData, setFilterData] = useState({});

  // Processa dados da API quando recebidos
  useEffect(() => {
    if (!categoriesData?.categories) return;

    const data = {};
    categoriesData.categories.forEach((cat) => {
      data[cat.name] = {};
      cat.subcategories.forEach((sub) => {
        data[cat.name][sub.name] = sub.items || [];
      });
    });
    setFilterData(data);
  }, [categoriesData]);

  // Prepara lista de categorias para o select, garantindo unicidade
  const categoryOptions = useMemo(() => {
    if (!categoriesData?.categories) return [];
    const seen = new Set();
    return categoriesData.categories.filter(cat => {
      const duplicate = seen.has(cat.name);
      seen.add(cat.name);
      return !duplicate;
    });
  }, [categoriesData]);

  // Atualiza subcategorias quando categoria muda
  useEffect(() => {
    if (!selectedCategory) {
      setAvailableSubcategories([]);
      setShowLevel2(false);
      setShowLevel3(false);
      setSelectedSubcategory('');
      setSelectedItem('');
      return;
    }

    // Modo MALUQUICE: Coringa zera níveis seguintes
    if (selectedCategory === '*') {
      setAvailableSubcategories([]);
      setShowLevel2(false);
      setShowLevel3(false);
      setSelectedSubcategory('');
      setSelectedItem('');
      return;
    }

    const subcats = filterData[selectedCategory] || {};
    const subcatList = Object.keys(subcats).map((name) => ({
      name,
      items: subcats[name],
    }));

    setAvailableSubcategories(subcatList);
    setShowLevel2(true);
    setSelectedSubcategory('');
    setSelectedItem('');
    setShowLevel3(false);
  }, [selectedCategory, filterData]);

  // Atualiza itens quando subcategoria muda
  useEffect(() => {
    if (!selectedCategory || !selectedSubcategory || selectedCategory === '*') {
      setAvailableItems([]);
      setShowLevel3(false);
      setSelectedItem('');
      return;
    }

    const items = filterData[selectedCategory]?.[selectedSubcategory] || [];

    // Modo MALUQUICE: Regra oculta - Eletrônicos + Smartphones bloqueia Acessórios
    if (crazyMode && selectedCategory === 'eletronicos' && selectedSubcategory === 'Smartphones') {
      // Remove Acessórios se existir
      const filteredItems = items.filter((item) => !item.toLowerCase().includes('acessório'));
      setAvailableItems(filteredItems);
      console.log('🔒 Regra oculta ativada: Eletrônicos + Smartphones bloqueia Acessórios');
    } else {
      setAvailableItems(items);
    }

    setShowLevel3(true);
    setSelectedItem('');
  }, [selectedCategory, selectedSubcategory, filterData, crazyMode]);

  // Notifica mudanças para componente pai
  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange({
        category: selectedCategory,
        subcategory: selectedSubcategory,
        item: selectedItem,
      });
    }
  }, [selectedCategory, selectedSubcategory, selectedItem]);

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setSelectedCategory(value);

    // Easter egg: palavra mágica "volus"
    if (crazyMode && value.toLowerCase().includes('volus')) {
      setMagicWordCount(prev => {
        const newCount = prev + 1;
        if (newCount === 3) {
          setTimeout(() => {
            alert('🎭 PALAVRA MÁGICA DETECTADA! A magia de Vólus está em toda parte! ✨');
          }, 100);
          return 0;
        }
        return newCount;
      });
    }
  };

  const handleSubcategoryChange = (e) => {
    const value = e.target.value;
    setSelectedSubcategory(value);
  };

  const handleItemChange = (e) => {
    const value = e.target.value;
    setSelectedItem(value);
    
    // Após selecionar item, reseta o select mas mantém o valor para adicionar chip
    if (value && onSelectionChange) {
      setTimeout(() => {
        setSelectedItem('');
      }, 100);
    }
  };

  if (!categoriesData || !categoryOptions.length) {
    return (
      <div className="text-center py-8 text-volus-davys-gray">
        <p>Carregando categorias...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 relative">
      {/* Easter Egg Konami */}
      {showKonamiEasterEgg && (
        <div className="absolute -top-4 left-0 right-0 z-50 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 text-white p-4 rounded-lg shadow-2xl animate-bounce">
          <div className="text-center">
            <div className="text-2xl mb-2">KONAMI CODE ATIVADO!</div>
            <div className="text-sm">Você é um verdadeiro gamer! Todos os filtros secretos foram desbloqueados!</div>
            <div className="mt-2 text-lg animate-pulse">↑↑↓↓←→←→BA</div>
          </div>
        </div>
      )}

      {/* Nível 1: Categoria */}
      <div className="filter-level">
        <label htmlFor="categorySelect" className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
          crazyMode ? 'text-purple-600 dark:text-purple-300' : 'text-volus-jet dark:text-volus-dark-500'
        }`}>
          {crazyMode ? 'Categoria Mágica' : 'Categoria'}
        </label>
        <select
          id="categorySelect"
          value={selectedCategory}
          onChange={handleCategoryChange}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
            crazyMode 
              ? 'border-purple-300 focus:ring-purple-200 focus:border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50 dark:bg-gradient-to-r dark:from-purple-900 dark:to-pink-900 dark:border-purple-700 dark:text-gray-200' 
              : 'border-gray-300 focus:ring-volus-emerald/50 focus:border-volus-emerald bg-white dark:bg-volus-dark-800 dark:border-volus-dark-700 dark:text-volus-dark-500'
          }`}
          aria-label="Selecionar categoria"
        >
          <option value="">Selecione uma categoria...</option>
          {crazyMode && (
            <option value="*">Qualquer (Coringa Mágico)</option>
          )}
          {categoryOptions.map((cat, index) => (
            <option key={`${cat.name}-${index}`} value={cat.name}>
              {crazyMode ? `${cat.display_name || cat.name}` : (cat.display_name || cat.name)}
            </option>
          ))}
        </select>
      </div>

      {/* Nível 2: Subcategoria */}
      <div
        className={`filter-level transition-all duration-300 ${
          showLevel2
            ? 'opacity-100 max-h-96 translate-y-0'
            : 'opacity-0 max-h-0 overflow-hidden -translate-y-2'
        }`}
      >
        <label htmlFor="subcategorySelect" className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
          crazyMode ? 'text-purple-600 dark:text-purple-300' : 'text-volus-jet dark:text-volus-dark-500'
        }`}>
          {crazyMode ? 'Subcategoria Especial' : 'Subcategoria'}
        </label>
        <select
          id="subcategorySelect"
          value={selectedSubcategory}
          onChange={handleSubcategoryChange}
          disabled={!showLevel2}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
            !showLevel2 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-300 dark:bg-volus-dark-900 dark:border-volus-dark-700 dark:text-volus-dark-600' 
              : crazyMode
                ? 'border-purple-300 focus:ring-purple-200 focus:border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50 dark:bg-gradient-to-r dark:from-purple-900 dark:to-pink-900 dark:border-purple-700 dark:text-gray-200'
                : 'border-gray-300 focus:ring-volus-emerald/50 focus:border-volus-emerald bg-white dark:bg-volus-dark-800 dark:border-volus-dark-700 dark:text-volus-dark-500'
          }`}
          aria-label="Selecionar subcategoria"
        >
          <option value="">Selecione uma subcategoria...</option>
          {availableSubcategories.map((subcat, index) => (
            <option key={`${subcat.name}-${index}`} value={subcat.name}>
              {crazyMode ? `${subcat.name}` : subcat.name}
            </option>
          ))}
        </select>
        
        {/* Aviso da regra oculta */}
        {crazyMode && selectedCategory === 'eletronicos' && selectedSubcategory === 'Smartphones' && (
          <div className="mt-2 p-2 bg-yellow-100 border border-yellow-300 rounded text-yellow-800 text-xs animate-pulse">
            Regra Oculta Ativada: Alguns itens foram filtrados automaticamente!
          </div>
        )}
      </div>

      {/* Nível 3: Item */}
      <div
        className={`filter-level transition-all duration-300 ${
          showLevel3
            ? 'opacity-100 max-h-96 translate-y-0'
            : 'opacity-0 max-h-0 overflow-hidden -translate-y-2'
        }`}
      >
        <label htmlFor="itemSelect" className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
          crazyMode ? 'text-purple-600 dark:text-purple-300' : 'text-volus-jet dark:text-volus-dark-500'
        }`}>
          {crazyMode ? 'Item Mágico (opcional)' : 'Item (opcional)'}
        </label>
        <select
          id="itemSelect"
          value={selectedItem}
          onChange={handleItemChange}
          disabled={!showLevel3}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
            !showLevel3 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-300 dark:bg-volus-dark-900 dark:border-volus-dark-700 dark:text-volus-dark-600' 
              : crazyMode
                ? 'border-purple-300 focus:ring-purple-200 focus:border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50 dark:bg-gradient-to-r dark:from-purple-900 dark:to-pink-900 dark:border-purple-700 dark:text-gray-200'
                : 'border-gray-300 focus:ring-volus-emerald/50 focus:border-volus-emerald bg-white dark:bg-volus-dark-800 dark:border-volus-dark-700 dark:text-volus-dark-500'
          }`}
          aria-label="Selecionar item"
        >
          <option value="">Selecione um item...</option>
          {availableItems.map((item, index) => (
            <option key={`${item}-${index}`} value={item}>
              {crazyMode ? `${item}` : item}
            </option>
          ))}
        </select>
        
        {/* Dica sobre múltipla seleção */}
        {showLevel3 && (
          <div className={`mt-2 text-xs flex items-center gap-1 ${
            crazyMode ? 'text-purple-600 dark:text-purple-300' : 'text-volus-davys-gray dark:text-volus-dark-600'
          }`}>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {crazyMode 
              ? 'Você pode selecionar múltiplos itens mágicos! Cada seleção vira um chip especial' 
              : 'Você pode selecionar múltiplos itens! Cada seleção vira um chip removível'
            }
          </div>
        )}
      </div>

      {/* Contador de sequência Konami (debug) */}
      {crazyMode && konamiSequence.length > 0 && (
        <div className="text-xs text-gray-500 text-center">
          Sequência: {konamiSequence.slice(-5).join(' → ')} ({konamiSequence.length}/10)
        </div>
      )}
    </div>
  );
};

export default FilterCascade;

